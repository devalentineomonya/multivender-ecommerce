import { db } from "../db/drizzle";
import { categoryTable } from "../db/models/category";
import { eq, ilike } from "drizzle-orm";

async function setup() {
  console.log("Checking and seeding categories...");

  // Check Food, Drinks & Groceries
  const [existingFood] = await db
    .select()
    .from(categoryTable)
    .where(ilike(categoryTable.name, "%food%"))
    .limit(1);

  let foodId = existingFood?.id;
  if (!existingFood) {
    const [newFood] = await db
      .insert(categoryTable)
      .values({
        name: "Food, Drinks & Groceries",
        description: "Fresh pantry supplies, beverages, cooking essentials, snacks, and grocery staples.",
      })
      .returning();
    foodId = newFood.id;
    console.log(`Created new category: "Food, Drinks & Groceries" [ID: ${foodId}]`);
  } else {
    console.log(`Food category already exists: "${existingFood.name}" [ID: ${foodId}]`);
  }

  // Check Books & Stationery
  const [existingBooks] = await db
    .select()
    .from(categoryTable)
    .where(ilike(categoryTable.name, "%book%"))
    .limit(1);

  let booksId = existingBooks?.id;
  if (!existingBooks) {
    const [newBooks] = await db
      .insert(categoryTable)
      .values({
        name: "Books & Literature",
        description: "Bestselling novels, educational textbooks, business literature, and stationery.",
      })
      .returning();
    booksId = newBooks.id;
    console.log(`Created new category: "Books & Literature" [ID: ${booksId}]`);
  } else {
    console.log(`Books category exists: "${existingBooks.name}" [ID: ${booksId}]`);
  }

  const allCats = await db.select().from(categoryTable);
  console.log(`Total categories in DB: ${allCats.length}`);
  for (const c of allCats) {
    console.log(`- ${c.name} (ID: ${c.id})`);
  }

  process.exit(0);
}

setup().catch((e) => {
  console.error(e);
  process.exit(1);
});
