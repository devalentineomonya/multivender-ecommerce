import { z } from "zod";

export const userRoleSchema = z.enum(["user", "vendor", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const confirmOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const newPasswordSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const signUpSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "vendor", "admin"]).default("user").optional(),
  storeName: z.string().optional(),
});

export const productLabelSchema = z.enum([
  "BestSelling",
  "Popular",
  "Featured",
  "Trending",
  "New",
  "MostSelling",
  "Hot",
  "Sponsored",
]);

export const productQuerySchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional(),
  label: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  budgetTier: z.enum(["budget", "mid", "premium"]).optional(),
  isHot: z.coerce.boolean().optional(),
  isSponsored: z.coerce.boolean().optional(),
  page: z.coerce.number().min(1).default(1).optional(),
  limit: z.coerce.number().min(1).max(100).default(20).optional(),
  sort: z.enum(["newest", "price_asc", "price_desc", "popular"]).default("newest").optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  price: z.number().nonnegative("Price must be a positive number"),
  shortDescription: z.string().max(500).optional(),
  longDescription: z.string().optional(),
  label: productLabelSchema.default("New"),
  type: z.string().optional(),
  stock: z.number().int().nonnegative().default(1),
  discount: z.number().int().min(0).max(100).default(0),
  sizes: z.array(z.string()).default([]),
  images: z.array(z.string()).min(1, "At least one product image is required"),
  colorVariants: z.array(z.any()).default([]),
  brandIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  isSponsored: z.boolean().default(false).optional(),
  isHot: z.boolean().default(false).optional(),
  budgetTier: z.enum(["budget", "mid", "premium"]).default("mid").optional(),
  additionalInfo: z.record(z.any()).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional(),
  imageUrl: z.string().url("Must be a valid image URL").optional(),
});
