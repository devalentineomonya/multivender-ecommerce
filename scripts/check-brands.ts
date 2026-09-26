import { db } from "../db/drizzle";
import { brandTable } from "../db/models/brand";
import { productTable } from "../db/models/product";

async function checkBrands() {
  const brands = await db.select().from(brandTable);
  const products = await db.select({ id: productTable.id, name: productTable.name, brandIds: productTable.brandIds }).from(productTable);
  console.log(`Total brands in DB: ${brands.length}`);
  console.log(`Total products in DB: ${products.length}`);

  const topNames = ["Samsung", "Apple", "Nike", "Adidas", "HP", "Sony", "Oraimo", "Hisense", "Vitron", "Amaze"];
  console.log("\n--- Top Brands Status ---");
  for (const name of topNames) {
    const brand = brands.find((b) => b.name.toLowerCase() === name.toLowerCase());
    const byTitle = products.filter((p) => p.name.toLowerCase().includes(name.toLowerCase()));
    let linked = 0;
    if (brand) {
      linked = products.filter((p) => (p.brandIds as string[])?.includes(brand.id)).length;
    }
    console.log(`${name}: BrandExists=${!!brand} [ID: ${brand?.id}], Linked=${linked}, ByTitle=${byTitle.length}`);
  }

  process.exit(0);
}

checkBrands().catch((e) => {
  console.error(e);
  process.exit(1);
});
