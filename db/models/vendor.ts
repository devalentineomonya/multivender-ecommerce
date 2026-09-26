import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userTable } from "./user";

export const vendorTable = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id")
    .references(() => userTable.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  storeName: varchar("store_name", { length: 255 }).notNull(),
  storeSlug: varchar("store_slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  bannerUrl: text("banner_url"),
  phoneNumber: varchar("phone_number", { length: 50 }),
  isVerified: boolean("is_verified").default(false).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const vendorInsertSchema = createInsertSchema(vendorTable);
export const vendorSelectSchema = createSelectSchema(vendorTable);

export type VendorInsert = z.infer<typeof vendorInsertSchema>;
export type VendorSelect = z.infer<typeof vendorSelectSchema>;
