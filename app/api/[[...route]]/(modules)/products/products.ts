import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, asc, ilike, and, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { productTable } from "@/db/models/product";
import { productQuerySchema, createProductSchema } from "@/lib/validation/schemas";
import { getCurrentUserWithRole } from "@/lib/auth/roles-server";

const productsRouter = new Hono()
  .get("/", zValidator("query", productQuerySchema), async (c) => {
    try {
      const query = c.req.valid("query");
      const {
        category,
        brand,
        label,
        search,
        minPrice,
        maxPrice,
        page = 1,
        limit = 20,
        sort = "newest",
      } = query;

      const offset = (page - 1) * limit;

      const conditions = [];

      if (label) {
        conditions.push(eq(productTable.label, label));
      }

      if (search && search.trim() !== "") {
        conditions.push(ilike(productTable.name, `%${search.trim()}%`));
      }

      if (minPrice !== undefined) {
        conditions.push(gte(productTable.price, minPrice));
      }

      if (maxPrice !== undefined) {
        conditions.push(lte(productTable.price, maxPrice));
      }

      if (category && category.trim() !== "") {
        conditions.push(
          sql`${productTable.categoryIds}::jsonb ? ${category.trim()}`
        );
      }

      if (brand && brand.trim() !== "") {
        conditions.push(
          sql`${productTable.brandIds}::jsonb ? ${brand.trim()}`
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      // Determine sorting
      let orderByClause;
      switch (sort) {
        case "price_asc":
          orderByClause = asc(productTable.price);
          break;
        case "price_desc":
          orderByClause = desc(productTable.price);
          break;
        case "popular":
          orderByClause = desc(productTable.stock);
          break;
        case "newest":
        default:
          orderByClause = desc(productTable.createdAt);
          break;
      }

      const [products, totalCountResult] = await Promise.all([
        db
          .select()
          .from(productTable)
          .where(whereClause)
          .orderBy(orderByClause)
          .limit(limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(productTable)
          .where(whereClause),
      ]);

      const total = totalCountResult[0]?.count || 0;

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
      console.error("Error fetching products:", error);
      return c.json(
        { success: false, message: error.message || "Failed to fetch products" },
        500
      );
    }
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    try {
      const [product] = await db
        .select()
        .from(productTable)
        .where(eq(productTable.id, id))
        .limit(1);

      if (!product) {
        return c.json({ success: false, message: "Product not found" }, 404);
      }

      return c.json({ success: true, data: product });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  .post("/", zValidator("json", createProductSchema), async (c) => {
    const { user, role } = await getCurrentUserWithRole();
    if (!user || (role !== "admin" && role !== "vendor")) {
      return c.json({ success: false, message: "Unauthorized. Vendor or Admin required." }, 403);
    }

    const body = c.req.valid("json");
    try {
      const [newProduct] = await db
        .insert(productTable)
        .values({
          name: body.name,
          price: body.price,
          shortDescription: body.shortDescription || "",
          longDescription: body.longDescription || "",
          label: body.label,
          type: body.type || "Physical",
          stock: body.stock,
          discount: body.discount || 0,
          sizes: body.sizes,
          images: body.images,
          colorVariants: body.colorVariants,
          brandIds: body.brandIds,
          categoryIds: body.categoryIds,
          additionalInfo: body.additionalInfo || {},
        })
        .returning();

      return c.json(
        { success: true, message: "Product created successfully", data: newProduct },
        201
      );
    } catch (error: any) {
      console.error("Error creating product:", error);
      return c.json({ success: false, message: error.message }, 500);
    }
  });

export default productsRouter;
