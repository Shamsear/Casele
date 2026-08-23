import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Phone Models ──────────────────────────────────────────────
export const phoneModels = pgTable("phone_models", {
  id: uuid("id").defaultRandom().primaryKey(),
  brand: text("brand").notNull(), // "iPhone", "Samsung", "Google"
  modelName: text("model_name").notNull(), // "iPhone 15 Pro Max"
  slug: text("slug").unique().notNull(), // "iphone-15-pro-max"
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Categories ────────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // "Classic Collection"
  slug: text("slug").unique().notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  salePercent: integer("sale_percent"), // Category-level sale
  sortOrder: integer("sort_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Products ──────────────────────────────────────────────────
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // "Midnight Black Premium Case"
  slug: text("slug").unique().notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: decimal("compare_price", { precision: 10, scale: 2 }),
  images: text("images").array().default([]),
  categoryId: uuid("category_id").references(() => categories.id),
  badge: text("badge"), // 'new' | 'bestseller' | 'sale'
  isFeatured: boolean("is_featured").default(false),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
  viewCount: integer("view_count").default(0),
  orderCount: integer("order_count").default(0),
  lastSoldAt: timestamp("last_sold_at"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Product ↔ Phone Model (many-to-many) ─────────────────────
export const productModels = pgTable(
  "product_models",
  {
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    modelId: uuid("model_id")
      .references(() => phoneModels.id, { onDelete: "cascade" })
      .notNull(),
    stock: integer("stock").default(0),
  },
  (t) => ({
    pk: uniqueIndex("product_models_pk").on(t.productId, t.modelId),
  })
);

// ─── Product Bundles (cross-sell) ─────────────────────────────
export const productBundles = pgTable("product_bundles", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  bundledProductId: uuid("bundled_product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  bundleDiscount: integer("bundle_discount"), // Percentage off
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Promo Codes ──────────────────────────────────────────────
export const promoCodes = pgTable("promo_codes", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").unique().notNull(),
  discountType: text("discount_type").notNull(), // 'percentage' | 'flat'
  discountValue: decimal("discount_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  minOrder: decimal("min_order", { precision: 10, scale: 2 }).default("0"),
  maxUses: integer("max_uses"), // NULL = unlimited
  perUserLimit: integer("per_user_limit").default(1),
  appliesTo: text("applies_to").default("all"), // 'all' | 'category' | 'products'
  appliesToIds: text("applies_to_ids").array().default([]),
  stackable: boolean("stackable").default(false),
  autoApply: boolean("auto_apply").default(false),
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  isActive: boolean("is_active").default(true),
  usedCount: integer("used_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Promo Code Usage ─────────────────────────────────────────
export const promoCodeUses = pgTable("promo_code_uses", {
  id: uuid("id").defaultRandom().primaryKey(),
  promoCodeId: uuid("promo_code_id")
    .references(() => promoCodes.id)
    .notNull(),
  orderId: uuid("order_id")
    .references(() => orders.id)
    .notNull(),
  customerPhone: text("customer_phone"),
  discountAmount: decimal("discount_amount", {
    precision: 10,
    scale: 2,
  }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Flash Sales ──────────────────────────────────────────────
export const flashSales = pgTable("flash_sales", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // "Independence Day Sale"
  discountType: text("discount_type").notNull(), // 'percentage' | 'flat'
  discountValue: decimal("discount_value", {
    precision: 10,
    scale: 2,
  }).notNull(),
  appliesTo: text("applies_to").default("all"),
  appliesToIds: text("applies_to_ids").array().default([]),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Tiered Discounts ─────────────────────────────────────────
export const tierDiscounts = pgTable("tier_discounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  minAmount: decimal("min_amount", { precision: 10, scale: 2 }).notNull(),
  discountPercent: integer("discount_percent").notNull(),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
});

// ─── Orders ───────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  address: text("address"), // Optional
  items: jsonb("items").notNull(), // [{productId, name, model, qty, price}]
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  tierDiscount: decimal("tier_discount", { precision: 10, scale: 2 }).default(
    "0"
  ),
  flashDiscount: decimal("flash_discount", {
    precision: 10,
    scale: 2,
  }).default("0"),
  promoDiscount: decimal("promo_discount", {
    precision: 10,
    scale: 2,
  }).default("0"),
  bundleDiscount: decimal("bundle_discount", {
    precision: 10,
    scale: 2,
  }).default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  promoCodeId: uuid("promo_code_id").references(() => promoCodes.id),
  status: text("status").default("pending"), // pending/confirmed/dispatched/delivered/cancelled
  priority: text("priority").default("normal"), // 'normal' | 'urgent'
  notes: text("notes"),
  whatsappSent: boolean("whatsapp_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Admin Users ──────────────────────────────────────────────
export const adminUsers = pgTable("admin_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Admin Activity Log ───────────────────────────────────────
export const adminActivityLog = pgTable("admin_activity_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  adminId: uuid("admin_id")
    .references(() => adminUsers.id)
    .notNull(),
  action: text("action").notNull(), // 'create_product', 'update_order', etc.
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Settings (key-value) ─────────────────────────────────────
export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
