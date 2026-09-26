import {
  pgTable,
  uuid,
  varchar,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { productTable } from "./product";

export const mediaTable = pgTable("media", {
  id: uuid("id").primaryKey().defaultRandom(),
  originalUrl: varchar("original_url", { length: 1000 }).notNull(),
  localPath: varchar("local_path", { length: 500 }).notNull(),
  fileName: varchar("file_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  fileSize: integer("file_size"),
  width: integer("width"),
  height: integer("height"),
  productId: uuid("product_id").references(() => productTable.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mediaInsertSchema = createInsertSchema(mediaTable);
export const mediaSelectSchema = createSelectSchema(mediaTable);

export type MediaInsert = z.infer<typeof mediaInsertSchema>;
export type MediaSelect = z.infer<typeof mediaSelectSchema>;
