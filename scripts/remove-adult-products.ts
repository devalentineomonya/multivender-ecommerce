import { db } from "../db/drizzle";
import { productTable } from "../db/models/product";
import { mediaTable } from "../db/models/media";
import { eq, inArray } from "drizzle-orm";
import fs from "fs";
import path from "path";

async function purgeAdultProducts() {
  console.log("🔍 Scanning for adult products to purge...");

  const all = await db.select().from(productTable);
  const regex = /\b(sex|dildo|vibrat\w*|penis|vagina\w*|clitor\w*|anal|butt\s*plug|masturbat\w*|fetish|erotic|condom|lubricant)\b/i;

  const toDelete = all.filter((p) => {
    // Specifically target adult wellness toys/items, preserving normal products (e.g. unisex)
    const isExplicitId = [
      "3d698951-3f94-4d97-a5a8-2af0db7c0e7f",
      "6af1fdb1-95e9-487b-b821-bad0bafb1f76",
      "e9fdbf90-f9da-4228-8c6b-822a87788314",
      "4ae83d9a-97d0-46fd-b4f3-06e59bf5e35c",
    ].includes(p.id);

    const matchesAdultRegex = regex.test(p.name);
    return isExplicitId || matchesAdultRegex;
  });

  console.log(`Found ${toDelete.length} adult products to remove:`);
  for (const p of toDelete) {
    console.log(`  - [${p.id}] ${p.name}`);
  }

  if (toDelete.length === 0) {
    console.log("No adult products found to remove.");
    process.exit(0);
  }

  const ids = toDelete.map((p) => p.id);

  // 1. Clean up local media files
  for (const id of ids) {
    const medias = await db.select().from(mediaTable).where(eq(mediaTable.productId, id));
    for (const m of medias) {
      if (m.localPath) {
        const fullPath = path.join(process.cwd(), "public", m.localPath);
        if (fs.existsSync(fullPath)) {
          try {
            fs.unlinkSync(fullPath);
            console.log(`  Deleted local image file: ${m.localPath}`);
          } catch (e: any) {
            console.warn(`  Could not delete ${m.localPath}: ${e.message}`);
          }
        }
      }
    }
    // Delete media records
    await db.delete(mediaTable).where(eq(mediaTable.productId, id));
  }

  // 2. Delete products from productTable
  const res = await db.delete(productTable).where(inArray(productTable.id, ids)).returning({ id: productTable.id });
  console.log(`✓ Successfully deleted ${res.length} adult products from database.`);

  // 3. Double-check DB
  const remaining = await db.select({ id: productTable.id, name: productTable.name }).from(productTable);
  const recheck = remaining.filter((p) => regex.test(p.name));
  console.log(`Double check: remaining adult products in DB = ${recheck.length}`);
  console.log(`Total clean products remaining in DB: ${remaining.length}`);

  process.exit(0);
}

purgeAdultProducts().catch((e) => {
  console.error("Purge error:", e);
  process.exit(1);
});
