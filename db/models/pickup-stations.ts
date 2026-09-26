import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const pickupStationTable = pgTable("pickup_stations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  country: varchar("country", { length: 100 }).default("Kenya").notNull(),
  phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
  operatingHours: varchar("operating_hours", { length: 255 }).default(
    "Mon-Sat: 8:00 AM - 7:00 PM"
  ).notNull(),
  fee: integer("fee").default(0).notNull(), // Fee in smallest currency unit or 0 for free
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pickupStationInsertSchema = createInsertSchema(pickupStationTable);
export const pickupStationSelectSchema = createSelectSchema(pickupStationTable);

export type PickupStationInsert = z.infer<typeof pickupStationInsertSchema>;
export type PickupStationSelect = z.infer<typeof pickupStationSelectSchema>;

export interface PickupStationOption {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phoneNumber: string;
  operatingHours: string;
  fee: number;
}

export const DEFAULT_PICKUP_STATIONS: PickupStationOption[] = [
  {
    id: "hub-cbd-01",
    name: "Nairobi CBD Central Hub",
    address: "Kimathi Street, Eagle House Ground Floor, Shop 4",
    city: "Nairobi",
    state: "Nairobi County",
    phoneNumber: "+254 700 123 456",
    operatingHours: "Mon-Sat: 8:00 AM - 8:00 PM | Sun: 10:00 AM - 4:00 PM",
    fee: 0,
  },
  {
    id: "hub-westlands-02",
    name: "Westlands Station Hub",
    address: "Mpaka Road, The Mall Westlands, 1st Floor Counter B",
    city: "Nairobi",
    state: "Nairobi County",
    phoneNumber: "+254 711 234 567",
    operatingHours: "Mon-Sat: 8:30 AM - 7:30 PM",
    fee: 0,
  },
  {
    id: "hub-mombasa-03",
    name: "Mombasa Town Pickup Center",
    address: "Digo Road, Coastal Plaza Suite 12",
    city: "Mombasa",
    state: "Mombasa County",
    phoneNumber: "+254 722 345 678",
    operatingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    fee: 0,
  },
  {
    id: "hub-kisumu-04",
    name: "Kisumu City Mall Hub",
    address: "Jomo Kenyatta Highway, Mega Plaza Ground Floor",
    city: "Kisumu",
    state: "Kisumu County",
    phoneNumber: "+254 733 456 789",
    operatingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    fee: 0,
  },
];
