import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, desc, asc, ilike, and, or, gt, gte, lte, sql } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { productTable } from "@/db/models/product";
import { categoryTable } from "@/db/models/category";
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
        budgetTier,
        hasDiscount,
        page = 1,
        limit = 20,
        sort = "newest",
      } = query;

      const offset = (page - 1) * limit;

      const conditions = [];

      // "Hot" and "Sponsored" are stored as booleans, not label enum values (see POST below)
      let { isHot, isSponsored } = query;
      if (label === "Hot") isHot = true;
      else if (label === "Sponsored") isSponsored = true;
      else if (label) {
        conditions.push(sql`${productTable.label}::text = ${label}`);
      }

      if (hasDiscount) {
        conditions.push(gt(productTable.discount, 0));
      }

      if (budgetTier) {
        conditions.push(eq(productTable.budgetTier, budgetTier));
      }

      if (isHot !== undefined) {
        conditions.push(eq(productTable.isHot, isHot));
      }

      if (isSponsored !== undefined) {
        conditions.push(eq(productTable.isSponsored, isSponsored));
      }

      if (search && search.trim() !== "") {
        // Escape LIKE wildcards so "%" and "_" typed by users match literally
        const searchTerm = `%${search.trim().replace(/[\\%_]/g, (ch) => `\\${ch}`)}%`;
        conditions.push(
          or(
            ilike(productTable.name, searchTerm),
            ilike(productTable.shortDescription, searchTerm)
          )
        );
      }

      if (minPrice !== undefined) {
        conditions.push(gte(productTable.price, minPrice));
      }

      if (maxPrice !== undefined) {
        conditions.push(lte(productTable.price, maxPrice));
      }

      if (category && category.trim() !== "") {
        const catVal = category.trim();
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(catVal);
        if (isUuid) {
          conditions.push(
            sql`${productTable.categoryIds}::jsonb ? ${catVal}`
          );
        } else {
          // If a category name/slug was passed, look up category by name in categoryTable
          const matchedCats = await db
            .select({ id: categoryTable.id })
            .from(categoryTable)
            .where(ilike(categoryTable.name, `%${catVal}%`));

          if (matchedCats.length > 0) {
            const orConditions = matchedCats.map(
              (c) => sql`${productTable.categoryIds}::jsonb ? ${c.id}`
            );
            conditions.push(or(...orConditions)!);
          } else {
            conditions.push(
              sql`${productTable.categoryIds}::jsonb ? ${catVal}`
            );
          }
        }
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
        case "discount_desc":
          orderByClause = desc(productTable.discount);
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
      const isHot = body.isHot || body.label === "Hot";
      const isSponsored = body.isSponsored || body.label === "Sponsored";
      const dbLabel: "BestSelling" | "Popular" | "Featured" | "Trending" | "New" | "MostSelling" =
        body.label === "Hot" || body.label === "Sponsored"
          ? "Featured"
          : (body.label as "BestSelling" | "Popular" | "Featured" | "Trending" | "New" | "MostSelling") || "New";

      const [newProduct] = await db
        .insert(productTable)
        .values({
          name: body.name,
          price: body.price,
          shortDescription: body.shortDescription || "",
          longDescription: body.longDescription || "",
          label: dbLabel,
          type: body.type || "Physical",
          stock: body.stock,
          discount: body.discount || 0,
          sizes: body.sizes,
          images: body.images,
          colorVariants: body.colorVariants,
          brandIds: body.brandIds,
          categoryIds: body.categoryIds,
          isHot,
          isSponsored,
          budgetTier: body.budgetTier || "mid",
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
