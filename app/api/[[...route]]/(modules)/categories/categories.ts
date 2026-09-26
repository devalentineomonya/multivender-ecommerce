import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categoryTable } from "@/db/models/category";
import { productTable } from "@/db/models/product";
import { createCategorySchema } from "@/lib/validation/schemas";
import { getCurrentUserWithRole } from "@/lib/auth/roles-server";

const categoriesRouter = new Hono()
  .get("/", async (c) => {
    try {
      const categories = await db
        .select()
        .from(categoryTable)
        .orderBy(desc(categoryTable.createdAt));

      // Fetch all products to calculate count per category
      const products = await db
        .select({ id: productTable.id, categoryIds: productTable.categoryIds })
        .from(productTable);

      const categoriesWithCount = categories.map((cat) => {
        const count = products.filter((p) => {
          if (Array.isArray(p.categoryIds)) {
            return (p.categoryIds as string[]).includes(cat.id);
          }
          return false;
        }).length;

        return {
          ...cat,
          productCount: count,
        };
      });

      return c.json({
        success: true,
        data: categoriesWithCount,
      });
    } catch (error: any) {
      console.error("Error fetching categories:", error);
      return c.json(
        { success: false, message: error.message || "Failed to fetch categories" },
        500
      );
    }
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    try {
      const [category] = await db
        .select()
        .from(categoryTable)
        .where(eq(categoryTable.id, id))
        .limit(1);

      if (!category) {
        return c.json({ success: false, message: "Category not found" }, 404);
      }

      return c.json({ success: true, data: category });
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  })
  .post("/", zValidator("json", createCategorySchema), async (c) => {
    const { user, role } = await getCurrentUserWithRole();
    if (!user || (role !== "admin" && role !== "vendor")) {
      return c.json({ success: false, message: "Unauthorized" }, 403);
    }

    const body = c.req.valid("json");
    try {
      const [inserted] = await db
        .insert(categoryTable)
        .values({
          name: body.name,
          description: body.description || "",
          imageUrl: body.imageUrl || "",
        })
        .returning();

      return c.json(
        { success: true, message: "Category created", data: inserted },
        201
      );
    } catch (error: any) {
      return c.json({ success: false, message: error.message }, 500);
    }
  });

export default categoriesRouter;
