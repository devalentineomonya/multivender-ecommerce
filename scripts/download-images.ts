import { db } from "../db/drizzle";
import { productTable } from "../db/models/product";
import { brandTable } from "../db/models/brand";
import { mediaTable } from "../db/models/media";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

const PRODUCTS_DIR = path.resolve(process.cwd(), "public/uploads/products");
const BRANDS_DIR = path.resolve(process.cwd(), "public/uploads/brands");

fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
fs.mkdirSync(BRANDS_DIR, { recursive: true });

async function downloadToFile(url: string, destPath: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    return false;
  }
}

async function main() {
  console.log("Starting image download and local storage processing...");

  // 1. Process Brand Logos
  console.log("Processing Brand Logos...");
  const brands = await db.select().from(brandTable);
  for (const brand of brands) {
    if (brand.logoUrl && brand.logoUrl.startsWith("http")) {
      const fileName = `brand-${brand.id}.jpg`;
      const destPath = path.join(BRANDS_DIR, fileName);
      const localUrl = `/uploads/brands/${fileName}`;

      if (!fs.existsSync(destPath)) {
        const ok = await downloadToFile(brand.logoUrl, destPath);
        if (ok) {
          const stats = fs.statSync(destPath);
          await db
            .insert(mediaTable)
            .values({
              originalUrl: brand.logoUrl,
              localPath: localUrl,
              fileName,
              mimeType: "image/jpeg",
              fileSize: stats.size,
            })
            .catch(() => {});

          await db
            .update(brandTable)
            .set({ logoUrl: localUrl })
            .where(eq(brandTable.id, brand.id));
          console.log(`+ Saved brand logo for "${brand.name}" -> ${localUrl}`);
        }
      } else {
        await db
          .update(brandTable)
          .set({ logoUrl: localUrl })
          .where(eq(brandTable.id, brand.id));
      }
    }
  }

  // 2. Process Products Images (Primary image for each product first)
  console.log("Processing Product Images...");
  const products = await db.select().from(productTable);
  console.log(`Total products to check: ${products.length}`);

  let updatedProductsCount = 0;
  const BATCH_SIZE = 10;

  for (let i = 0; i < products.length; i += BATCH_SIZE) {
    const batch = products.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (prod) => {
        const rawImages = Array.isArray(prod.images) ? (prod.images as string[]) : [];
        if (rawImages.length === 0) return;

        const updatedImages: string[] = [];
        let modified = false;

        for (let imgIdx = 0; imgIdx < Math.min(rawImages.length, 3); imgIdx++) {
          const rawUrl = rawImages[imgIdx];
          if (!rawUrl || typeof rawUrl !== "string") continue;

          if (rawUrl.startsWith("http")) {
            const fileName = `prod-${prod.id}-${imgIdx}.jpg`;
            const destPath = path.join(PRODUCTS_DIR, fileName);
            const localUrl = `/uploads/products/${fileName}`;

            let exists = fs.existsSync(destPath);
            if (!exists) {
              const ok = await downloadToFile(rawUrl, destPath);
              if (ok) {
                exists = true;
                const stats = fs.statSync(destPath);
                await db
                  .insert(mediaTable)
                  .values({
                    originalUrl: rawUrl,
                    localPath: localUrl,
                    fileName,
                    mimeType: "image/jpeg",
                    fileSize: stats.size,
                    productId: prod.id,
                  })
                  .catch(() => {});
              }
            }

            if (exists) {
              updatedImages.push(localUrl);
              modified = true;
            } else {
              updatedImages.push(rawUrl);
            }
          } else {
            updatedImages.push(rawUrl);
          }
        }

        if (modified && updatedImages.length > 0) {
          await db
            .update(productTable)
            .set({ images: updatedImages })
            .where(eq(productTable.id, prod.id));
          updatedProductsCount++;
        }
      })
    );

    if ((i + BATCH_SIZE) % 50 === 0 || i + BATCH_SIZE >= products.length) {
      console.log(`Progress: ${Math.min(i + BATCH_SIZE, products.length)} / ${products.length} products processed (${updatedProductsCount} updated).`);
    }
  }

  console.log(`\nCompleted! Successfully localized images for ${updatedProductsCount} products.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
