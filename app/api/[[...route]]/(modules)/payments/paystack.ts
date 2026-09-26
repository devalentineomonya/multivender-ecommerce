import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { orderTable } from "@/db/models/order";
import { productTable } from "@/db/models/product";
import { vendorTable } from "@/db/models/vendor";
import { userTable } from "@/db/models/user";
import { addressTable } from "@/db/models/addresses";
import { getCurrentUserWithRole } from "@/lib/auth/roles-server";
import {
  initializePaystackTransaction,
  verifyPaystackTransaction,
} from "@/lib/paystack/paystack";
import {
  sendCustomerOrderReceipt,
  sendVendorOrderAlert,
  sendAdminOrderAlert,
} from "@/lib/email/service";
import { OrderEmailData, OrderItemEmailData } from "@/lib/email/types";

const initializeSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().optional(),
      productId: z.string().optional(),
      name: z.string(),
      price: z.number().nonnegative(),
      quantity: z.number().int().positive(),
      size: z.string().optional(),
      color: z.string().optional(),
      image: z.string().optional(),
      vendorId: z.string().optional(),
      storeName: z.string().optional(),
    })
  ).min(1, "Order must contain at least one item"),
  totalAmount: z.number().positive(),
  shippingFee: z.number().default(0),
  discountAmount: z.number().default(0),
  currency: z.string().default("KES"),
  customerEmail: z.string().email(),
  customerName: z.string().min(2),
  customerPhone: z.string().optional(),
  fulfillmentType: z.enum(["delivery", "pickup"]).default("delivery"),
  deliveryAddress: z
    .object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string().optional(),
      country: z.string().default("Kenya"),
    })
    .optional(),
  pickupStation: z
    .object({
      id: z.string(),
      name: z.string(),
      address: z.string(),
      city: z.string(),
      state: z.string().optional(),
      phoneNumber: z.string(),
      operatingHours: z.string(),
      fee: z.number().optional(),
    })
    .optional(),
  customerNotes: z.string().optional(),
});

const verifySchema = z.object({
  reference: z.string().min(1),
});

const paymentsRouter = new Hono()
  .post("/paystack/initialize", zValidator("json", initializeSchema), async (c) => {
    try {
      const body = c.req.valid("json");
      const { user } = await getCurrentUserWithRole();

      // Resolve user id - if logged in use user.id, else find or create customer record
      let userId = user?.id;
      if (!userId) {
        const [existingUser] = await db
          .select({ id: userTable.id })
          .from(userTable)
          .where(eq(userTable.email, body.customerEmail))
          .limit(1);

        if (existingUser) {
          userId = existingUser.id;
        } else {
          const names = body.customerName.split(" ");
          const [newUser] = await db
            .insert(userTable)
            .values({
              email: body.customerEmail,
              firstName: names[0] || "Customer",
              lastName: names.slice(1).join(" ") || "",
              role: "user",
            })
            .returning({ id: userTable.id });
          userId = newUser.id;
        }
      }

      // Generate pickup code if fulfillment is pickup
      let pickupCode: string | undefined = undefined;
      if (body.fulfillmentType === "pickup") {
        const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
        pickupCode = `PK-${randomChars}`;
      }

      // Handle delivery address if home delivery
      let deliveryAddressId: string | undefined = undefined;
      if (body.fulfillmentType === "delivery" && body.deliveryAddress) {
        const [insertedAddress] = await db
          .insert(addressTable)
          .values({
            userId,
            street: body.deliveryAddress.street,
            city: body.deliveryAddress.city,
            state: body.deliveryAddress.state,
            postalCode: body.deliveryAddress.postalCode || "00100",
            country: body.deliveryAddress.country || "Kenya",
          })
          .returning({ id: addressTable.id });
        deliveryAddressId = insertedAddress.id;
      }

      // Generate unique transaction reference
      const reference = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      // Insert pending order in database
      const [order] = await db
        .insert(orderTable)
        .values({
          userId,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone || "",
          items: body.items,
          totalAmount: Math.round(body.totalAmount),
          status: "Pending",
          fulfillmentType: body.fulfillmentType,
          deliveryAddressId,
          pickupStation: body.pickupStation || null,
          pickupCode: pickupCode || null,
          paymentMethod: "paystack",
          paymentStatus: "unpaid",
          paystackReference: reference,
          shippingFee: Math.round(body.shippingFee),
          discountAmount: Math.round(body.discountAmount),
          customerNotes: body.customerNotes || "",
        })
        .returning();

      // Initialize transaction on Paystack
      const paystackRes = await initializePaystackTransaction({
        email: body.customerEmail,
        amount: body.totalAmount,
        currency: body.currency,
        reference,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/cart/verify?reference=${reference}`,
        metadata: {
          orderId: order.id,
          fulfillmentType: body.fulfillmentType,
          pickupCode: pickupCode || null,
          custom_fields: [
            {
              display_name: "Order Reference",
              variable_name: "order_reference",
              value: reference,
            },
            {
              display_name: "Fulfillment Type",
              variable_name: "fulfillment_type",
              value: body.fulfillmentType === "pickup" ? "Pickup Station" : "Home Delivery",
            },
          ],
        },
      });

      if (!paystackRes.success) {
        return c.json(
          {
            success: false,
            message: paystackRes.error || "Failed to initialize Paystack transaction",
          },
          400
        );
      }

      // Update order with access code
      if (paystackRes.accessCode) {
        await db
          .update(orderTable)
          .set({ paystackAccessCode: paystackRes.accessCode })
          .where(eq(orderTable.id, order.id));
      }

      return c.json({
        success: true,
        orderId: order.id,
        reference,
        accessCode: paystackRes.accessCode,
        authorizationUrl: paystackRes.authorizationUrl,
        pickupCode,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "pk_test_placeholder",
      });
    } catch (error: any) {
      console.error("[Paystack Init Error]", error);
      return c.json(
        { success: false, message: error.message || "Failed to process order checkout" },
        500
      );
    }
  })
  .post("/paystack/verify", zValidator("json", verifySchema), async (c) => {
    try {
      const { reference } = c.req.valid("json");

      // Verify transaction with Paystack
      const verifyRes = await verifyPaystackTransaction(reference);

      if (!verifyRes.success || verifyRes.status !== "success") {
        return c.json(
          {
            success: false,
            message: verifyRes.error || "Payment was not verified by Paystack",
            status: verifyRes.status,
          },
          400
        );
      }

      // Find corresponding order
      const [order] = await db
        .select()
        .from(orderTable)
        .where(eq(orderTable.paystackReference, reference))
        .limit(1);

      if (!order) {
        return c.json(
          { success: false, message: `Order with reference ${reference} not found` },
          404
        );
      }

      // If order already paid, return early (idempotent)
      if (order.paymentStatus === "paid" && order.status !== "Pending") {
        return c.json({
          success: true,
          message: "Order already verified and processed",
          data: order,
        });
      }

      // Update order to Paid and Processing
      const nextStatus = order.fulfillmentType === "pickup" ? "Processing" : "Paid";
      const [updatedOrder] = await db
        .update(orderTable)
        .set({
          paymentStatus: "paid",
          status: nextStatus,
          updatedAt: new Date(),
        })
        .where(eq(orderTable.id, order.id))
        .returning();

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
            console.error(`Failed to decrement stock for product ${prodId}:`, e);
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

      // Prepare email payload
      const orderEmailData: OrderEmailData = {
        orderId: order.id,
        reference: order.paystackReference || reference,
        totalAmount: order.totalAmount,
        subtotalAmount: order.totalAmount - (order.shippingFee || 0),
        shippingFee: order.shippingFee || 0,
        discountAmount: order.discountAmount || 0,
        currency: verifyRes.currency || "KES",
        fulfillmentType: order.fulfillmentType as "delivery" | "pickup",
        customerEmail: order.customerEmail || verifyRes.customer?.email || "",
        customerName:
          `${verifyRes.customer?.firstName || ""} ${verifyRes.customer?.lastName || ""}`.trim() ||
          "Customer",
        customerPhone: order.customerPhone || verifyRes.customer?.phone,
        deliveryAddress,
        pickupStation: order.pickupStation as any,
        pickupCode: order.pickupCode || undefined,
        items,
        createdAt: order.createdAt || new Date(),
      };

      // 1. Send Customer Receipt
      if (orderEmailData.customerEmail) {
        sendCustomerOrderReceipt(orderEmailData).catch((err) =>
          console.error("Failed to send customer order receipt email:", err)
        );
      }

      // 2. Send Admin Notification
      sendAdminOrderAlert(orderEmailData).catch((err) =>
        console.error("Failed to send admin order alert email:", err)
      );

      // 3. Send Vendor Order Alerts (group items by vendorId)
      const vendorItemsMap: Record<string, OrderItemEmailData[]> = {};
      for (const item of items) {
        if (item.vendorId) {
          if (!vendorItemsMap[item.vendorId]) {
            vendorItemsMap[item.vendorId] = [];
          }
          vendorItemsMap[item.vendorId].push(item);
        }
      }

      for (const [vendorId, vItems] of Object.entries(vendorItemsMap)) {
        try {
          const [vendorRecord] = await db
            .select({
              storeName: vendorTable.storeName,
              userId: vendorTable.userId,
            })
            .from(vendorTable)
            .where(eq(vendorTable.id, vendorId))
            .limit(1);

          if (vendorRecord) {
            const [vendorUser] = await db
              .select({ email: userTable.email })
              .from(userTable)
              .where(eq(userTable.id, vendorRecord.userId))
              .limit(1);

            if (vendorUser?.email) {
              sendVendorOrderAlert(
                orderEmailData,
                vendorUser.email,
                vendorRecord.storeName,
                vItems
              ).catch((err) =>
                console.error(`Failed to send vendor alert for ${vendorRecord.storeName}:`, err)
              );
            }
          }
        } catch (vErr) {
          console.error(`Failed resolving vendor ${vendorId}:`, vErr);
        }
      }

      return c.json({
        success: true,
        message: "Order successfully verified and confirmed",
        data: updatedOrder,
      });
    } catch (error: any) {
      console.error("[Paystack Verify Error]", error);
      return c.json(
        { success: false, message: error.message || "Failed to verify transaction" },
        500
      );
    }
  });

export default paymentsRouter;
