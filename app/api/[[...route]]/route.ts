import { Hono } from "hono";
import { logger } from "hono/logger";
import { ContentfulStatusCode } from "hono/utils/http-status";
import { handle } from "hono/vercel";

import users from "./(modules)/users/users";
import auth from "./(modules)/auth/auth";
import callback from "./(modules)/auth/callback";
import products from "./(modules)/products/products";
import categories from "./(modules)/categories/categories";
import countries from "./(modules)/countries/countries";
import payments from "./(modules)/payments/paystack";
import orders from "./(modules)/orders/orders";
import admin from "./(modules)/admin/admin";
import vendor from "./(modules)/vendor/vendor";

const app = new Hono().basePath("/api");
app.use("*", logger());
const routes = app
  .route("/users", users)
  .route("/auth", auth)
  .route("/callback", callback)
  .route("/products", products)
  .route("/categories", categories)
  .route("/countries", countries)
  .route("/payments", payments)
  .route("/orders", orders)
  .route("/admin", admin)
  .route("/vendor", vendor);

routes.onError((err, c) => {
  console.error(err);
  if (
    err &&
    typeof err === "object" &&
    "status" in err &&
    "errors" in err &&
    Array.isArray(err.errors)
  ) {
    return c.json(
      { success: false, message: err.errors[0].message },
      err.status as unknown as ContentfulStatusCode
    );
  }
  return c.json(
    { success: false, message: "Internal server error", error: err.message },
    500
  );
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
