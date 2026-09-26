import { db } from "../db/drizzle";
import { categoryTable } from "../db/models/category";
import { productTable } from "../db/models/product";

async function listCats() {
  const cats = await db.select().from(categoryTable);
  const products = await db.select().from(productTable);
  console.log("Categories (" + cats.length + "):");
  for (const c of cats) {
    const count = products.filter((p) => (p.categoryIds as string[])?.includes(c.id)).length;
    console.log("- " + c.name + " (" + count + " products) [ID: " + c.id + "]");
  }
  console.log("Total products in DB:", products.length);
  process.exit(0);
}

listCats().catch((e) => {
  console.error(e);
  process.exit(1);
});
