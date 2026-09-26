import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  jsonb,
  pgEnum,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const genderEnum = pgEnum("gender", ["Male", "Female", "Others"]);
export const userRoleEnum = pgEnum("user_role", ["user", "vendor", "admin"]);

export const userTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  firstName: varchar("first_name", { length: 255 }).default(""),
  middleName: varchar("middle_name", { length: 255 }).default(""),
  lastName: varchar("last_name", { length: 255 }).default(""),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: userRoleEnum("role").default("user").notNull(),
  gender: genderEnum("gender"),
  isNew: boolean("is_new").default(true),
  dateOfBirth: date("date_of_birth"),
  primaryPhoneNumber: varchar("primary_phone_number", { length: 20 }),
  secondaryPhoneNumber: varchar("secondary_phone_number", { length: 20 }),
  addresses: jsonb("addresses"),
  recentItems: jsonb("recent_items"),
  likedItems: jsonb("liked_items"),
  orders: jsonb("orders"),
  deliveries: jsonb("deliveries"),
  vouchers: jsonb("vouchers"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userInsertSchema = createInsertSchema(userTable);
export const userSelectSchema = createSelectSchema(userTable);

export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserSelect = z.infer<typeof userSelectSchema>;
