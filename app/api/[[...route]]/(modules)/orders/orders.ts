import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { orderTable } from "@/db/models/order";
import { DEFAULT_PICKUP_STATIONS } from "@/db/models/pickup-stations";
import { getCurrentUserWithRole } from "@/lib/auth/roles-server";
import { sendOrderStatusUpdate } from "@/lib/email/service";

const updateStatusSchema = z.object({
  status: z.enum([
    "Pending",
    "Paid",
    "Processing",
    "Dispatched",
    "Ready for Pickup",
    "Delivered",
    "Cancelled",
  ]),
});

const ordersRouter = new Hono()
  .get("/pickup-stations", async (c) => {
    return c.json({
      success: true,
      data: DEFAULT_PICKUP_STATIONS,
    });
  })
  .get("/my-orders", async (c) => {
    const { user } = await getCurrentUserWithRole();
    if (!user) {
      return c.json({ success: false, message: "Unauthorized" }, 401);
    }

    try {
      const orders = await db
        .select()
        .from(orderTable)
        .where(eq(orderTable.userId, user.id))
        .orderBy(desc(orderTable.createdAt));

      return c.json({
        success: true,
        data: orders,
      });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    try {
      const [order] = await db
        .select()
        .from(orderTable)
        .where(eq(orderTable.id, id))
        .limit(1);

      if (!order) {
        return c.json({ success: false, message: "Order not found" }, 404);
      }

      return c.json({ success: true, data: order });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  .patch("/:id/status", zValidator("json", updateStatusSchema), async (c) => {
    const { user, role } = await getCurrentUserWithRole();
    if (!user || (role !== "admin" && role !== "vendor")) {
      return c.json({ success: false, message: "Unauthorized. Admin or Vendor required." }, 403);
    }

    const id = c.req.param("id");
    const { status } = c.req.valid("json");

    try {
      const [order] = await db
        .select()
        .from(orderTable)
        .where(eq(orderTable.id, id))
        .limit(1);

      if (!order) {
        return c.json({ success: false, message: "Order not found" }, 404);
      }

      const [updatedOrder] = await db
        .update(orderTable)
        .set({ status, updatedAt: new Date() })
        .where(eq(orderTable.id, id))
        .returning();

      // Dispatch status update email to customer
      if (order.customerEmail) {
        const pickupStationObj = order.pickupStation as any;
        sendOrderStatusUpdate(
          order.paystackReference || order.id,
          order.customerEmail,
          "Customer",
          status,
          order.fulfillmentType,
          order.pickupCode || undefined,
          pickupStationObj?.name
        ).catch((err) => console.error("Failed sending status update email:", err));
      }

      return c.json({
        success: true,
        message: `Order status updated to ${status}`,
        data: updatedOrder,
      });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  });

export default ordersRouter;
