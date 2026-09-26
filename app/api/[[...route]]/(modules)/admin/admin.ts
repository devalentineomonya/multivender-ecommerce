import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { userTable } from "@/db/models/user";
import { vendorTable } from "@/db/models/vendor";
import { productTable } from "@/db/models/product";
import { orderTable } from "@/db/models/order";
import { getCurrentUserWithRole } from "@/lib/auth/roles-server";

const roleUpdateSchema = z.object({
  role: z.enum(["user", "vendor", "admin"]),
});

const verifyVendorSchema = z.object({
  isVerified: z.boolean(),
});

const toggleVendorStatusSchema = z.object({
  isActive: z.boolean(),
});

const adminRouter = new Hono()
  // Admin middleware guard
  .use("*", async (c, next) => {
    const { user, role } = await getCurrentUserWithRole();
    if (!user || role !== "admin") {
      return c.json({ success: false, message: "Forbidden: Superuser Admin required" }, 403);
    }
    await next();
  })
  // Metrics summary
  .get("/metrics", async (c) => {
    try {
      const [usersCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(userTable);

      const [vendorsCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(vendorTable);

      const [ordersCount] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(orderTable);

      const [gmvResult] = await db
        .select({
          gmv: sql<number>`COALESCE(SUM(total_amount), 0)::int`,
        })
        .from(orderTable)
        .where(eq(orderTable.paymentStatus, "paid"));

      return c.json({
        success: true,
        data: {
          totalUsers: usersCount?.count || 0,
          totalVendors: vendorsCount?.count || 0,
          totalOrders: ordersCount?.count || 0,
          platformGMV: gmvResult?.gmv || 0,
        },
      });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  // User Management
  .get("/users", async (c) => {
    try {
      const users = await db
        .select({
          id: userTable.id,
          email: userTable.email,
          firstName: userTable.firstName,
          lastName: userTable.lastName,
          role: userTable.role,
          createdAt: userTable.createdAt,
        })
        .from(userTable)
        .orderBy(desc(userTable.createdAt))
        .limit(100);

      return c.json({ success: true, data: users });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  .patch("/users/:id/role", zValidator("json", roleUpdateSchema), async (c) => {
    const id = c.req.param("id");
    const { role } = c.req.valid("json");

    try {
      const [updated] = await db
        .update(userTable)
        .set({ role, updatedAt: new Date() })
        .where(eq(userTable.id, id))
        .returning();

      if (!updated) {
        return c.json({ success: false, message: "User not found" }, 404);
      }

      // If promoted to vendor, ensure vendor record exists
      if (role === "vendor") {
        const [existingVendor] = await db
          .select()
          .from(vendorTable)
          .where(eq(vendorTable.userId, id))
          .limit(1);

        if (!existingVendor) {
          const storeName = `${updated.firstName || "Merchant"}'s Store`;
          const storeSlug = `store-${id.substring(0, 8)}`;
          await db.insert(vendorTable).values({
            userId: id,
            storeName,
            storeSlug,
            isVerified: true,
          });
        }
      }

      return c.json({
        success: true,
        message: `User role updated to ${role}`,
        data: updated,
      });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  // Vendor Management
  .get("/vendors", async (c) => {
    try {
      const vendors = await db
        .select()
        .from(vendorTable)
        .orderBy(desc(vendorTable.createdAt));

      return c.json({ success: true, data: vendors });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  .patch("/vendors/:id/verify", zValidator("json", verifyVendorSchema), async (c) => {
    const id = c.req.param("id");
    const { isVerified } = c.req.valid("json");

    try {
      const [updated] = await db
        .update(vendorTable)
        .set({ isVerified, updatedAt: new Date() })
        .where(eq(vendorTable.id, id))
        .returning();

      return c.json({
        success: true,
        message: `Vendor verified status set to ${isVerified}`,
        data: updated,
      });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  .patch("/vendors/:id/status", zValidator("json", toggleVendorStatusSchema), async (c) => {
    const id = c.req.param("id");
    const { isActive } = c.req.valid("json");

    try {
      const [updated] = await db
        .update(vendorTable)
        .set({ isActive, updatedAt: new Date() })
        .where(eq(vendorTable.id, id))
        .returning();

      return c.json({
        success: true,
        message: `Vendor active status set to ${isActive}`,
        data: updated,
      });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  // Orders Oversight
  .get("/orders", async (c) => {
    try {
      const orders = await db
        .select()
        .from(orderTable)
        .orderBy(desc(orderTable.createdAt))
        .limit(100);

      return c.json({ success: true, data: orders });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  // Products Management
  .get("/products", async (c) => {
    try {
      const products = await db
        .select()
        .from(productTable)
        .orderBy(desc(productTable.createdAt))
        .limit(100);

      return c.json({ success: true, data: products });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  .delete("/products/:id", async (c) => {
    const id = c.req.param("id");
    try {
      await db.delete(productTable).where(eq(productTable.id, id));
      return c.json({ success: true, message: "Product deleted by admin" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  });

export default adminRouter;
