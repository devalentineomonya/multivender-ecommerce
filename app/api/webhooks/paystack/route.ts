import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { orderTable } from "@/db/models/order";
import { productTable } from "@/db/models/product";
import { vendorTable } from "@/db/models/vendor";
import { userTable } from "@/db/models/user";
import { addressTable } from "@/db/models/addresses";
import { verifyPaystackWebhookSignature } from "@/lib/paystack/paystack";
import {
  sendCustomerOrderReceipt,
  sendVendorOrderAlert,
  sendAdminOrderAlert,
} from "@/lib/email/service";
import { OrderEmailData, OrderItemEmailData } from "@/lib/email/types";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (process.env.PAYSTACK_SECRET_KEY) {
      const isValid = verifyPaystackWebhookSignature(rawBody, signature);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: "Invalid webhook signature" },
          { status: 401 }
        );
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const data = payload.data;

    if (event === "charge.success") {
      const reference = data.reference;

      const [order] = await db
        .select()
        .from(orderTable)
        .where(eq(orderTable.paystackReference, reference))
        .limit(1);

      if (order && order.paymentStatus !== "paid") {
        const nextStatus = order.fulfillmentType === "pickup" ? "Processing" : "Paid";
        await db
          .update(orderTable)
          .set({
            paymentStatus: "paid",
            status: nextStatus,
            updatedAt: new Date(),
          })
          .where(eq(orderTable.id, order.id));

        // Decrement product inventory
        const items = (order.items as OrderItemEmailData[]) || [];
        for (const item of items) {
          const prodId = item.id || item.productId;
          if (prodId) {
            try {
              await db
                .update(productTable)
                .set({
                  stock: sql`GREATEST(0, ${productTable.stock} - ${item.quantity})`,
                })
                .where(eq(productTable.id, prodId));
            } catch (e) {
              console.error(`Webhook failed decrementing stock for ${prodId}:`, e);
            }
          }
        }

        // Fetch delivery address if available
        let deliveryAddress = undefined;
        if (order.deliveryAddressId) {
          const [addr] = await db
            .select()
            .from(addressTable)
            .where(eq(addressTable.id, order.deliveryAddressId))
            .limit(1);
          if (addr) {
            deliveryAddress = {
              street: addr.street,
              city: addr.city,
              state: addr.state,
              postalCode: addr.postalCode,
              country: addr.country,
            };
          }
        }

        const orderEmailData: OrderEmailData = {
          orderId: order.id,
          reference: order.paystackReference || reference,
          totalAmount: order.totalAmount,
          subtotalAmount: order.totalAmount - (order.shippingFee || 0),
          shippingFee: order.shippingFee || 0,
          discountAmount: order.discountAmount || 0,
          currency: data.currency || "KES",
          fulfillmentType: order.fulfillmentType as "delivery" | "pickup",
          customerEmail: order.customerEmail || data.customer?.email || "",
          customerName:
            `${data.customer?.first_name || ""} ${data.customer?.last_name || ""}`.trim() ||
            "Customer",
          customerPhone: order.customerPhone || data.customer?.phone,
          deliveryAddress,
          pickupStation: order.pickupStation as any,
          pickupCode: order.pickupCode || undefined,
          items,
          createdAt: order.createdAt || new Date(),
        };

        if (orderEmailData.customerEmail) {
          sendCustomerOrderReceipt(orderEmailData).catch(console.error);
        }
        sendAdminOrderAlert(orderEmailData).catch(console.error);

        // Group vendor items
        const vendorItemsMap: Record<string, OrderItemEmailData[]> = {};
        for (const item of items) {
          if (item.vendorId) {
            if (!vendorItemsMap[item.vendorId]) vendorItemsMap[item.vendorId] = [];
            vendorItemsMap[item.vendorId].push(item);
          }
        }

        for (const [vendorId, vItems] of Object.entries(vendorItemsMap)) {
          const [vRecord] = await db
            .select({ storeName: vendorTable.storeName, userId: vendorTable.userId })
            .from(vendorTable)
            .where(eq(vendorTable.id, vendorId))
            .limit(1);

          if (vRecord) {
            const [vUser] = await db
              .select({ email: userTable.email })
              .from(userTable)
              .where(eq(userTable.id, vRecord.userId))
              .limit(1);

            if (vUser?.email) {
              sendVendorOrderAlert(orderEmailData, vUser.email, vRecord.storeName, vItems).catch(
                console.error
              );
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error("[Paystack Webhook Exception]", error);
    return NextResponse.json(
      { error: error.message || "Webhook processing error" },
      { status: 500 }
    );
  }
}
