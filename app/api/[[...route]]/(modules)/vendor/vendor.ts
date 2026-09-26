import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { vendorTable } from "@/db/models/vendor";
import { productTable } from "@/db/models/product";
import { orderTable } from "@/db/models/order";
import { getCurrentUserWithRole } from "@/lib/auth/roles-server";
import { createProductSchema } from "@/lib/validation/schemas";

const updateStoreSchema = z.object({
  storeName: z.string().min(2).optional(),
  description: z.string().optional(),
  phoneNumber: z.string().optional(),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
});

const updateProductSchema = z.object({
  name: z.string().min(2).optional(),
  price: z.number().nonnegative().optional(),
  stock: z.number().int().nonnegative().optional(),
  discount: z.number().int().min(0).max(100).optional(),
  shortDescription: z.string().optional(),
  longDescription: z.string().optional(),
  label: z.enum([
    "BestSelling",
    "Popular",
    "Featured",
    "Trending",
    "New",
    "MostSelling",
    "Hot",
    "Sponsored",
  ]).optional(),
  budgetTier: z.enum(["budget", "mid", "premium"]).optional(),
  isHot: z.boolean().optional(),
  isSponsored: z.boolean().optional(),
  categoryIds: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  colorVariants: z.array(z.any()).optional(),
  isActive: z.boolean().optional(),
});

const vendorRouter = new Hono()
  // Vendor middleware guard
  .use("*", async (c, next) => {
    const { user, role } = await getCurrentUserWithRole();
    if (!user || (role !== "vendor" && role !== "admin")) {
      return c.json({ success: false, message: "Forbidden: Vendor access required" }, 403);
    }
    await next();
  })
  // Vendor Profile
  .get("/profile", async (c) => {
    const { user } = await getCurrentUserWithRole();
    try {
      let [vendor] = await db
        .select()
        .from(vendorTable)
        .where(eq(vendorTable.userId, user!.id))
        .limit(1);

      if (!vendor) {
        // Auto-initialize vendor profile if not yet created
        const storeName = `${user?.user_metadata?.firstName || "Merchant"}'s Store`;
        const storeSlug = `store-${user!.id.substring(0, 8)}`;
        [vendor] = await db
          .insert(vendorTable)
          .values({
            userId: user!.id,
            storeName,
            storeSlug,
            isVerified: true,
          })
          .returning();
      }

      return c.json({ success: true, data: vendor });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  .patch("/profile", zValidator("json", updateStoreSchema), async (c) => {
    const { user } = await getCurrentUserWithRole();
    const body = c.req.valid("json");

    try {
      const [updated] = await db
        .update(vendorTable)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(vendorTable.userId, user!.id))
        .returning();

      return c.json({ success: true, message: "Store profile updated", data: updated });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  // Vendor Products List
  .get("/products", async (c) => {
    const { user } = await getCurrentUserWithRole();
    try {
      const [vendor] = await db
        .select({ id: vendorTable.id })
        .from(vendorTable)
        .where(eq(vendorTable.userId, user!.id))
        .limit(1);

      if (!vendor) {
        return c.json({ success: true, data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } });
      }

      const page = Math.max(1, Number(c.req.query("page")) || 1);
      const limit = Math.max(1, Math.min(100, Number(c.req.query("limit")) || 10));
      const offset = (page - 1) * limit;

      const [products, totalCount] = await Promise.all([
        db
          .select()
          .from(productTable)
          .where(eq(productTable.vendorId, vendor.id))
          .orderBy(desc(productTable.createdAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(productTable)
          .where(eq(productTable.vendorId, vendor.id)),
      ]);

      const total = totalCount[0]?.count || 0;

      return c.json({
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit) || 1,
        },
      });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  // Create Vendor Product
  .post("/products", zValidator("json", createProductSchema), async (c) => {
    const { user } = await getCurrentUserWithRole();
    const body = c.req.valid("json");

    try {
      let [vendor] = await db
        .select({ id: vendorTable.id })
        .from(vendorTable)
        .where(eq(vendorTable.userId, user!.id))
        .limit(1);

      if (!vendor) {
        const storeName = `${user?.user_metadata?.firstName || "Merchant"}'s Store`;
        const storeSlug = `store-${user!.id.substring(0, 8)}`;
        [vendor] = await db
          .insert(vendorTable)
          .values({
            userId: user!.id,
            storeName,
            storeSlug,
            isVerified: true,
          })
          .returning();
      }

      const isHot = body.isHot || body.label === "Hot";
      const isSponsored = body.isSponsored || body.label === "Sponsored";
      const dbLabel: "BestSelling" | "Popular" | "Featured" | "Trending" | "New" | "MostSelling" =
        body.label === "Hot" || body.label === "Sponsored"
          ? "Featured"
          : (body.label as "BestSelling" | "Popular" | "Featured" | "Trending" | "New" | "MostSelling") || "New";

      const [newProduct] = await db
        .insert(productTable)
        .values({
          vendorId: vendor.id,
          name: body.name,
          price: Math.round(body.price),
          shortDescription: body.shortDescription || "",
          longDescription: body.longDescription || "",
          label: dbLabel,
          type: body.type || "Physical",
          stock: body.stock,
          discount: body.discount || 0,
          sizes: body.sizes || [],
          images: body.images,
          colorVariants: body.colorVariants || [],
          brandIds: body.brandIds || [],
          categoryIds: body.categoryIds || [],
          isSponsored: isSponsored ?? false,
          isHot: isHot ?? false,
          budgetTier: body.budgetTier ?? "mid",
          additionalInfo: body.additionalInfo || {},
          isActive: true,
        })
        .returning();

      return c.json(
        { success: true, message: "Product created successfully", data: newProduct },
        201
      );
    } catch (error: any) {
      console.error("[Create Product Error]", error);
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  // Update Vendor Product
  .patch("/products/:id", zValidator("json", updateProductSchema), async (c) => {
    const { user, role } = await getCurrentUserWithRole();
    const id = c.req.param("id");
    const body = c.req.valid("json");

    try {
      const [vendor] = await db
        .select({ id: vendorTable.id })
        .from(vendorTable)
        .where(eq(vendorTable.userId, user!.id))
        .limit(1);

      // Verify product belongs to this vendor (unless super admin)
      if (role !== "admin") {
        const [existing] = await db
          .select({ vendorId: productTable.vendorId })
          .from(productTable)
          .where(eq(productTable.id, id))
          .limit(1);

        if (!existing || existing.vendorId !== vendor?.id) {
          return c.json({ success: false, message: "Product not found or unauthorized" }, 403);
        }
      }

      const updateData: Record<string, any> = { ...body, updatedAt: new Date() };
      if (body.label === "Hot") {
        updateData.isHot = true;
        updateData.label = "Featured";
      } else if (body.label === "Sponsored") {
        updateData.isSponsored = true;
        updateData.label = "Featured";
      }

      const [updated] = await db
        .update(productTable)
        .set(updateData)
        .where(eq(productTable.id, id))
        .returning();

      return c.json({ success: true, message: "Product updated", data: updated });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  // Delete Vendor Product
  .delete("/products/:id", async (c) => {
    const { user, role } = await getCurrentUserWithRole();
    const id = c.req.param("id");

    try {
      const [vendor] = await db
        .select({ id: vendorTable.id })
        .from(vendorTable)
        .where(eq(vendorTable.userId, user!.id))
        .limit(1);

      if (role !== "admin") {
        const [existing] = await db
          .select({ vendorId: productTable.vendorId })
          .from(productTable)
          .where(eq(productTable.id, id))
          .limit(1);

        if (!existing || existing.vendorId !== vendor?.id) {
          return c.json({ success: false, message: "Product not found or unauthorized" }, 403);
        }
      }

      await db.delete(productTable).where(eq(productTable.id, id));
      return c.json({ success: true, message: "Product deleted" });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  // Vendor Orders
  .get("/orders", async (c) => {
    const { user } = await getCurrentUserWithRole();
    try {
      const [vendor] = await db
        .select({ id: vendorTable.id })
        .from(vendorTable)
        .where(eq(vendorTable.userId, user!.id))
        .limit(1);

      if (!vendor) {
        return c.json({ success: true, data: [] });
      }

      // Fetch all recent orders
      const allOrders = await db
        .select()
        .from(orderTable)
        .orderBy(desc(orderTable.createdAt))
        .limit(100);

      // Filter to orders containing this vendor's items
      const vendorOrders = allOrders
        .map((order) => {
          const items = Array.isArray(order.items) ? order.items : [];
          const myItems = items.filter(
            (i: any) => i.vendorId === vendor.id || !i.vendorId
          );
          if (myItems.length > 0) {
            return {
              ...order,
              vendorItems: myItems,
            };
          }
          return null;
        })
        .filter(Boolean);

      return c.json({ success: true, data: vendorOrders });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  });

export default vendorRouter;
