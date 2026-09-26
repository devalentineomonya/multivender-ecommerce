import { pgTable, uuid, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { genderEnum } from "./user";

export const adminTable = pgTable("admins", {
  id: uuid("id").primaryKey().defaultRandom(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  gender: genderEnum("gender").notNull(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const adminInsertSchema = createInsertSchema(adminTable);
export const adminSelectSchema = createSelectSchema(adminTable);

export type AdminInsert = z.infer<typeof adminInsertSchema>;
export type AdminSelect = z.infer<typeof adminSelectSchema>;
