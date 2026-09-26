import {
  pgTable,
  uuid,
  integer,
  varchar,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { userTable } from "./user";
import { addressTable } from "./addresses";

export const orderTable = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.id),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 50 }),
  items: jsonb("items").notNull(),
  totalAmount: integer("total_amount").notNull(),
  status: varchar("status", { length: 50 }).default("Pending").notNull(),
  fulfillmentType: varchar("fulfillment_type", { length: 50 }).default("delivery").notNull(),
  deliveryAddressId: uuid("delivery_address_id").references(() => addressTable.id),
  pickupStation: jsonb("pickup_station"),
  pickupCode: varchar("pickup_code", { length: 50 }),
  paymentMethod: varchar("payment_method", { length: 50 }).default("paystack").notNull(),
  paymentStatus: varchar("payment_status", { length: 50 }).default("unpaid").notNull(),
  paystackReference: varchar("paystack_reference", { length: 255 }),
  paystackAccessCode: varchar("paystack_access_code", { length: 255 }),
  shippingFee: integer("shipping_fee").default(0).notNull(),
  discountAmount: integer("discount_amount").default(0).notNull(),
  customerNotes: varchar("customer_notes", { length: 1000 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderInsertSchema = createInsertSchema(orderTable);
export const orderSelectSchema = createSelectSchema(orderTable);

export type OrderInsert = z.infer<typeof orderInsertSchema>;
export type OrderSelect = z.infer<typeof orderSelectSchema>;
