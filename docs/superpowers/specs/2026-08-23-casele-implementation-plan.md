# CASELÉ — Implementation Plan

**Date:** 2026-08-23
**Spec:** docs/superpowers/specs/2026-08-23-casele-ecommerce-design.md
**Stack:** Next.js (App Router) + Drizzle ORM + Neon PostgreSQL + Tailwind CSS + Zustand

---

## Phase 1: Core Storefront (MVP)

> Goal: A working storefront where customers can browse products, add to cart, and checkout via WhatsApp.

### 1.1 Project Setup

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.1.1 | Initialize Next.js project with TypeScript, Tailwind, App Router, src directory | `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css` | — |
| 1.1.2 | Install dependencies: drizzle-orm, @neondatabase/serverless, zustand, zod, clsx, tailwind-merge, sharp | `package.json` | 1.1.1 |
| 1.1.3 | Configure Tailwind with brand tokens (colors, fonts, type scale) | `tailwind.config.ts`, `src/app/globals.css` | 1.1.1 |
| 1.1.4 | Set up Google Fonts: Cormorant Garamond (display) + Inter (body) | `src/app/layout.tsx` | 1.1.1 |
| 1.1.5 | Create environment variables template | `.env.example` | 1.1.2 |
| 1.1.6 | Set up Drizzle ORM with Neon PostgreSQL connection | `src/lib/db/index.ts`, `drizzle.config.ts` | 1.1.2 |

### 1.2 Database Schema

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.2.1 | Define Drizzle schema: phone_models, categories, products, product_models | `src/lib/db/schema.ts` | 1.1.6 |
| 1.2.2 | Define Drizzle schema: orders, admin_users, settings | `src/lib/db/schema.ts` | 1.2.1 |
| 1.2.3 | Define Drizzle schema: promo_codes, promo_code_uses, flash_sales, tier_discounts, product_bundles, admin_activity_log | `src/lib/db/schema.ts` | 1.2.2 |
| 1.2.4 | Run initial migration | `drizzle/` | 1.2.3 |
| 1.2.5 | Seed default settings (WhatsApp number, shop name, currency, etc.) | `src/lib/db/seed.ts` | 1.2.4 |

### 1.3 Utility Layer

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.3.1 | Create cn() utility (clsx + tailwind-merge) | `src/lib/utils.ts` | 1.1.1 |
| 1.3.2 | Create formatPrice() utility | `src/lib/utils.ts` | 1.3.1 |
| 1.3.3 | Create slugify() utility | `src/lib/utils.ts` | 1.3.1 |
| 1.3.4 | Create WhatsApp message builder utility | `src/lib/whatsapp.ts` | 1.3.2 |
| 1.3.5 | Create recently viewed localStorage utility | `src/lib/recently-viewed.ts` | — |
| 1.3.6 | Create settings fetcher utility | `src/lib/settings.ts` | 1.1.6 |

### 1.4 UI Component Library

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.4.1 | Button component (primary, secondary, ghost, CTA variants) | `src/components/ui/button.tsx` | 1.3.1 |
| 1.4.2 | Input component (with label, error, icon support) | `src/components/ui/input.tsx` | 1.3.1 |
| 1.4.3 | Badge component (status, product badges) | `src/components/ui/badge.tsx` | 1.3.1 |
| 1.4.4 | Skeleton component (loading placeholders) | `src/components/ui/skeleton.tsx` | 1.3.1 |
| 1.4.5 | Sheet component (bottom sheet for mobile) | `src/components/ui/sheet.tsx` | 1.3.1 |
| 1.4.6 | Modal component (dialog) | `src/components/ui/modal.tsx` | 1.3.1 |
| 1.4.7 | Toast component (notifications) | `src/components/ui/toast.tsx` | 1.3.1 |
| 1.4.8 | Select component (dropdown) | `src/components/ui/select.tsx` | 1.3.1 |
| 1.4.9 | Separator component (divider) | `src/components/ui/separator.tsx` | 1.3.1 |
| 1.4.10 | Progress component (progress bar) | `src/components/ui/progress.tsx` | 1.3.1 |
| 1.4.11 | Tabs component | `src/components/ui/tabs.tsx` | 1.3.1 |
| 1.4.12 | Switch component (toggle) | `src/components/ui/switch.tsx` | 1.3.1 |
| 1.4.13 | DropdownMenu component | `src/components/ui/dropdown-menu.tsx` | 1.3.1 |

### 1.5 Brand Components

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.5.1 | CASELÉ logo component (SVG) | `src/components/brand/logo.tsx` | — |
| 1.5.2 | Crown icon component (SVG) | `src/components/brand/crown-icon.tsx` | — |

### 1.6 Layout Components

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.6.1 | Root layout: fonts, metadata, dark mode provider, toast provider | `src/app/layout.tsx` | 1.1.4, 1.4.7 |
| 1.6.2 | Site header: logo, nav links (Home, Shop), cart icon, dark/light toggle | `src/components/layout/header.tsx` | 1.5.1, 1.4.1 |
| 1.6.3 | Mobile header: hide on scroll down, show on scroll up | `src/components/layout/header-mobile.tsx` | 1.6.2 |
| 1.6.4 | Site footer: brand info, social links, copyright | `src/components/layout/footer.tsx` | 1.5.1 |
| 1.6.5 | Mobile bottom navigation: Home, Shop, Cart, Track (4 icons) | `src/components/layout/mobile-nav.tsx` | 1.5.1 |
| 1.6.6 | Scroll progress bar (thin gold line at top) | `src/components/layout/scroll-progress.tsx` | 1.3.1 |
| 1.6.7 | Storefront layout wrapper (header + main + footer + mobile nav) | `src/app/(storefront)/layout.tsx` | 1.6.1, 1.6.2, 1.6.4, 1.6.5, 1.6.6 |

### 1.7 Zustand Stores

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.7.1 | Cart store (items, addItem, removeItem, updateQuantity, total, localStorage persistence) | `src/lib/store/cart.ts` | 1.1.2 |
| 1.7.2 | Wishlist store (toggleItem, hasItem, count, localStorage persistence) | `src/lib/store/wishlist.ts` | 1.1.2 |
| 1.7.3 | UI store (cart open/close, theme) | `src/lib/store/ui.ts` | 1.1.2 |

### 1.8 Hooks

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.8.1 | useMobile hook (responsive detection) | `src/hooks/use-mobile.ts` | — |
| 1.8.2 | useScrollPosition hook | `src/hooks/use-scroll-position.ts` | — |
| 1.8.3 | useHaptic hook (vibration on mobile) | `src/hooks/use-haptic.ts` | 1.8.1 |
| 1.8.4 | useRecentlyViewed hook | `src/hooks/use-recently-viewed.ts` | 1.3.5 |

### 1.9 Product Components

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.9.1 | Product card (image, name, price, badges, quick-add button) | `src/components/products/product-card.tsx` | 1.4.1, 1.4.3, 1.7.1 |
| 1.9.2 | Product card on dark background (featured products) | `src/components/products/product-card-dark.tsx` | 1.9.1 |
| 1.9.3 | Phone model selector grid | `src/components/products/model-selector.tsx` | 1.4.1 |
| 1.9.4 | Model brand filter (tabs: iPhone, Samsung, Google, etc.) | `src/components/products/model-brand-filter.tsx` | 1.4.11 |
| 1.9.5 | Product image gallery (with swipe on mobile) | `src/components/products/product-gallery.tsx` | 1.8.1 |
| 1.9.6 | Product quick view bottom sheet | `src/components/products/product-quick-view.tsx` | 1.4.5, 1.9.1 |
| 1.9.7 | Product detail view | `src/components/products/product-detail.tsx` | 1.9.5, 1.7.1 |
| 1.9.8 | Recently viewed products row | `src/components/products/recently-viewed.tsx` | 1.8.4, 1.9.1 |
| 1.9.9 | Product card skeleton loader | `src/components/products/product-skeleton.tsx` | 1.4.4 |
| 1.9.10 | Social proof component ("X ordered today", "Last sold Y ago") | `src/components/products/social-proof.tsx` | — |

### 1.10 Cart & Checkout Components

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.10.1 | Cart bubble (floating indicator with count + total) | `src/components/cart/cart-bubble.tsx` | 1.7.1 |
| 1.10.2 | Cart item (product image, name, quantity controls, remove) | `src/components/cart/cart-item.tsx` | 1.7.1, 1.8.1 |
| 1.10.3 | Cart sidebar (desktop: slide-in from right) | `src/components/cart/cart-sidebar.tsx` | 1.10.2, 1.7.1 |
| 1.10.4 | Cart sheet (mobile: bottom sheet) | `src/components/cart/cart-sheet.tsx` | 1.10.2, 1.7.1, 1.4.5 |
| 1.10.5 | Checkout form (name, phone, optional address) | `src/components/cart/checkout-form.tsx` | 1.4.2, 1.4.1 |
| 1.10.6 | Order summary (items, subtotal, total, review before WhatsApp) | `src/components/cart/order-summary.tsx` | 1.10.2 |
| 1.10.7 | Cart provider (renders sidebar on desktop, sheet on mobile) | `src/components/cart/cart-provider.tsx` | 1.10.3, 1.10.4, 1.10.1, 1.8.1 |

### 1.11 API Routes

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.11.1 | GET /api/products — list with filters (model, category, sort, featured) | `src/app/api/products/route.ts` | 1.2.1 |
| 1.11.2 | GET /api/products/[id] — single product (increments view_count) | `src/app/api/products/[id]/route.ts` | 1.2.1 |
| 1.11.3 | GET /api/models — list active phone models | `src/app/api/models/route.ts` | 1.2.1 |
| 1.11.4 | GET /api/categories — list active categories | `src/app/api/categories/route.ts` | 1.2.1 |
| 1.11.5 | POST /api/orders — create order from checkout | `src/app/api/orders/route.ts` | 1.2.2 |
| 1.11.6 | GET /api/social-proof — view/order counts for products | `src/app/api/social-proof/route.ts` | 1.2.1 |

### 1.12 Storefront Pages

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.12.1 | Homepage: dark hero with product shot, model selector, featured products grid, categories | `src/app/(storefront)/page.tsx` | 1.6.7, 1.9.2, 1.9.3, 1.11.1, 1.11.3 |
| 1.12.2 | Shop page: product grid with search bar, model/category filters, sort options | `src/app/(storefront)/shop/page.tsx` | 1.6.7, 1.9.1, 1.9.4, 1.9.8, 1.9.9, 1.11.1 |
| 1.12.3 | Model page: products filtered by phone model | `src/app/(storefront)/shop/[model]/page.tsx` | 1.6.7, 1.9.1, 1.11.1 |
| 1.12.4 | Product detail page: gallery, description, model selector, add to cart, related products | `src/app/(storefront)/shop/[model]/[product]/page.tsx` | 1.6.7, 1.9.7, 1.9.10, 1.11.2 |
| 1.12.5 | Category page: products filtered by category | `src/app/(storefront)/category/[slug]/page.tsx` | 1.6.7, 1.9.1, 1.11.4 |
| 1.12.6 | Track page: phone number input → order status timeline | `src/app/(storefront)/track/page.tsx` | 1.6.7, 1.4.2 |
| 1.12.7 | 404 page with "Back to Shop" CTA and featured products | `src/app/not-found.tsx` | 1.6.7, 1.9.1 |

### 1.13 WhatsApp Integration

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.13.1 | Build pre-filled WhatsApp message with items, totals, address | `src/lib/whatsapp.ts` | 1.3.4 |
| 1.13.2 | Open WhatsApp link after order creation | `src/components/cart/checkout-form.tsx` | 1.13.1, 1.11.5 |
| 1.13.3 | Track order API (lookup by phone number) | `src/app/api/track/route.ts` | 1.2.2 |

### 1.14 Dark/Light Mode

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.14.1 | Theme provider with localStorage persistence + system preference detection | `src/components/providers/theme-provider.tsx` | 1.7.3 |
| 1.14.2 | Theme toggle button (sun/moon icon) | `src/components/layout/theme-toggle.tsx` | 1.14.1 |
| 1.14.3 | CSS variables for dark/light mode in globals.css | `src/app/globals.css` | 1.14.1 |

### 1.15 Seed Data

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 1.15.1 | Seed phone models (iPhone 14/15 series, Samsung S23/S24, Google Pixel) | `src/lib/db/seed.ts` | 1.2.5 |
| 1.15.2 | Seed categories (Classic, Premium, Sport, Designer) | `src/lib/db/seed.ts` | 1.15.1 |
| 1.15.3 | Seed sample products (8-10 cases with images, prices, model associations) | `src/lib/db/seed.ts` | 1.15.2 |
| 1.15.4 | Seed admin user (email/password) | `src/lib/db/seed.ts` | 1.2.5 |

**Phase 1 Completion Criteria:**
- [ ] Homepage loads with dark hero, model selector, featured products
- [ ] Product grid filters by model and category
- [ ] Product detail page shows images, price, add to cart
- [ ] Cart persists in localStorage across page refreshes
- [ ] Checkout sends pre-filled WhatsApp message
- [ ] Order tracking works with phone number
- [ ] Responsive from 320px to 1920px
- [ ] Dark/light mode toggle works
- [ ] Recently viewed products display correctly

---

## Phase 2: Discount & Promo System

> Goal: Full discount engine — tiered discounts, flash sales, promo codes, bundle pricing.

### 2.1 Discount Engine (Server-Side)

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 2.1.1 | Tiered discount calculator (apply highest qualifying tier) | `src/lib/discounts/tiered.ts` | 1.2.3 |
| 2.1.2 | Flash sale calculator (check active sales, apply to applicable products) | `src/lib/discounts/flash.ts` | 1.2.3 |
| 2.1.3 | Bundle discount calculator | `src/lib/discounts/bundle.ts` | 1.2.3 |
| 2.1.4 | Promo code validator + calculator (check validity, usage limits, per-user limit) | `src/lib/discounts/promo.ts` | 1.2.3 |
| 2.1.5 | Category sale calculator (inherit category discount to products) | `src/lib/discounts/category.ts` | 1.2.3 |
| 2.1.6 | Master discount orchestrator (combines all discounts, respects stacking rules) | `src/lib/discounts/index.ts` | 2.1.1-2.1.5 |

### 2.2 Discount UI Components

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 2.2.1 | Price display component (shows sale price with strikethrough + discount badge) | `src/components/products/price-display.tsx` | 1.4.3 |
| 2.2.2 | Promo code input (collapsible, validate on apply, show discount) | `src/components/cart/promo-code-input.tsx` | 1.4.2, 1.4.1, 2.1.4 |
| 2.2.3 | Discount breakdown (shows tier, flash, promo discounts separately) | `src/components/cart/discount-breakdown.tsx` | 2.1.6 |
| 2.2.4 | Flash sale banner with countdown timer | `src/components/products/flash-sale-banner.tsx` | 2.1.2 |
| 2.2.5 | Bundle suggestion sheet ("Complete Your Protection") | `src/components/products/bundle-suggestion.tsx` | 1.4.5, 2.1.3 |
| 2.2.6 | "You saved ₹X" badge on checkout | `src/components/cart/savings-badge.tsx` | 2.1.6 |

### 2.3 Discount API Routes

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 2.3.1 | POST /api/promo/validate — validate promo code, return discount amount | `src/app/api/promo/validate/route.ts` | 2.1.4 |
| 2.3.2 | GET /api/products/[id]/bundles — get bundle recommendations for a product | `src/app/api/products/[id]/bundles/route.ts` | 2.1.3 |
| 2.3.3 | GET /api/flash-sales — get active flash sale for banner | `src/app/api/flash-sales/route.ts` | 2.1.2 |

### 2.4 Cart Updates

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 2.4.1 | Update cart store to calculate tier discount based on subtotal | `src/lib/store/cart.ts` | 2.1.1, 1.7.1 |
| 2.4.2 | Update cart store to apply promo code discount | `src/lib/store/cart.ts` | 2.1.4, 2.2.2 |
| 2.4.3 | Update checkout form to show discount breakdown + total savings | `src/components/cart/checkout-form.tsx` | 2.2.3, 2.2.6 |
| 2.4.4 | Update WhatsApp message to include discount breakdown | `src/lib/whatsapp.ts` | 2.1.6 |
| 2.4.5 | Update order creation to store discount breakdown in orders table | `src/app/api/orders/route.ts` | 2.1.6, 1.11.5 |

### 2.5 Product Updates

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 2.5.1 | Update product card to show sale price with strikethrough + badge | `src/components/products/product-card.tsx` | 2.2.1 |
| 2.5.2 | Update product detail to show sale price + flash sale badge | `src/components/products/product-detail.tsx` | 2.2.1, 2.2.4 |
| 2.5.3 | Add flash sale banner to homepage and shop page | `src/app/(storefront)/page.tsx`, `src/app/(storefront)/shop/page.tsx` | 2.2.4, 2.3.3 |

**Phase 2 Completion Criteria:**
- [ ] Tiered discounts apply automatically based on cart total
- [ ] Flash sales show countdown banner and apply to products
- [ ] Promo codes validate with usage limits and per-user limits
- [ ] Bundle suggestions appear after adding to cart
- [ ] Checkout shows full discount breakdown and total savings
- [ ] WhatsApp message includes discount details
- [ ] Admin can create/configure all discount types (UI in Phase 4)

---

## Phase 3: Enhanced Storefront

> Goal: Search, wishlist, social proof, and additional UX features.

### 3.1 Search

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 3.1.1 | Search bar component with real-time autocomplete | `src/components/search/search-bar.tsx` | 1.4.2 |
| 3.1.2 | Search suggestions dropdown (products, models, categories) | `src/components/search/search-suggestions.tsx` | 3.1.1 |
| 3.1.3 | Search results grid component | `src/components/search/search-results.tsx` | 1.9.1 |
| 3.1.4 | GET /api/search — search products/models/categories | `src/app/api/search/route.ts` | 1.2.1 |
| 3.1.5 | Search results page with filters | `src/app/(storefront)/search/page.tsx` | 1.6.7, 3.1.3, 3.1.4 |
| 3.1.6 | Add search bar to shop page header | `src/app/(storefront)/shop/page.tsx` | 3.1.1 |

### 3.2 Wishlist

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 3.2.1 | Wishlist heart toggle component (♡/♥) | `src/components/wishlist/wishlist-heart.tsx` | 1.7.2 |
| 3.2.2 | Wishlist panel (section in cart sidebar showing saved items) | `src/components/wishlist/wishlist-panel.tsx` | 1.7.2, 3.2.1, 1.9.1 |
| 3.2.3 | Add heart icon to product cards | `src/components/products/product-card.tsx` | 3.2.1 |
| 3.2.4 | Add heart icon to product detail page | `src/components/products/product-detail.tsx` | 3.2.1 |
| 3.2.5 | Add wishlist count to mobile bottom nav | `src/components/layout/mobile-nav.tsx` | 1.7.2 |

### 3.3 Social Proof

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 3.3.1 | Social proof API endpoint (view counts, order counts, last sold) | `src/app/api/social-proof/route.ts` | 1.11.6 |
| 3.3.2 | "X people ordered today" on product cards | `src/components/products/social-proof.tsx` | 3.3.1, 1.9.10 |
| 3.3.3 | "Last sold Y ago" on product detail | `src/components/products/product-detail.tsx` | 3.3.1 |
| 3.3.4 | Live activity toast ("Rahul from Mumbai just ordered...") | `src/components/ui/toast.tsx` | 3.3.1, 1.4.7 |

### 3.4 Share Product

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 3.4.1 | Share button component (Web Share API on mobile, copy link on desktop) | `src/components/products/share-button.tsx` | 1.8.1 |
| 3.4.2 | Add share button to product cards and detail page | `src/components/products/product-card.tsx`, `src/components/products/product-detail.tsx` | 3.4.1 |
| 3.4.3 | Open Graph meta tags for product pages | `src/app/(storefront)/shop/[model]/[product]/page.tsx` | 1.12.4 |

### 3.5 Order Tracking Enhancements

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 3.5.1 | Order status timeline component (Confirmed → Dispatched → Delivered) | `src/components/tracking/tracking-result.tsx` | 1.4.10 |
| 3.5.2 | Re-order button (pre-fills cart from previous order) | `src/components/tracking/re-order-button.tsx` | 1.7.1 |
| 3.5.3 | Update track page with timeline + re-order | `src/app/(storefront)/track/page.tsx` | 3.5.1, 3.5.2, 1.12.6 |

### 3.6 Sticky Add-to-Cart Bar (Mobile)

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 3.6.1 | Sticky add-to-cart bar component (price, model selector, add button) | `src/components/products/sticky-add-bar.tsx` | 1.4.1, 1.4.8 |
| 3.6.2 | Show/hide on scroll (hide when product images are in view) | `src/components/products/sticky-add-bar.tsx` | 1.8.2, 1.8.1 |
| 3.6.3 | Add sticky bar to product detail page | `src/app/(storefront)/shop/[model]/[product]/page.tsx` | 3.6.1 |

### 3.7 Bundle Recommendations

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 3.7.1 | Bundle suggestion logic (after add-to-cart, show complementary items) | `src/components/products/bundle-suggestion.tsx` | 2.2.5, 1.7.1 |
| 3.7.2 | Add bundle suggestion to cart flow | `src/components/cart/cart-provider.tsx` | 3.7.1 |

**Phase 3 Completion Criteria:**
- [ ] Search with autocomplete works on shop page
- [ ] Wishlist persists in localStorage, shows in cart sidebar
- [ ] Social proof data displays on product cards
- [ ] Share button works (Web Share API on mobile, copy on desktop)
- [ ] Order tracking shows status timeline with re-order
- [ ] Sticky add-to-cart bar appears on mobile product pages
- [ ] Bundle suggestions appear after adding to cart

---

## Phase 4: Admin Panel

> Goal: Full admin dashboard for managing products, orders, discounts, promo codes, and settings.

### 4.1 Admin Auth

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.1.1 | Set up NextAuth.js with credentials provider (email/password) | `src/lib/auth.ts` | 1.1.2 |
| 4.1.2 | Admin login page | `src/app/admin/login/page.tsx` | 4.1.1, 1.4.2, 1.4.1 |
| 4.1.3 | Admin layout with auth check + sidebar | `src/app/admin/layout.tsx` | 4.1.1 |
| 4.1.4 | Admin sidebar navigation component | `src/components/layout/admin-sidebar.tsx` | 1.5.1 |
| 4.1.5 | Admin header (top bar with user info, logout) | `src/components/layout/admin-header.tsx` | 4.1.1 |
| 4.1.6 | Auth API routes (login, logout, session) | `src/app/api/admin/auth/[...nextauth]/route.ts` | 4.1.1 |

### 4.2 Admin Shared Components

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.2.1 | Data table component (sortable, filterable, paginated) | `src/components/admin/shared/data-table.tsx` | 1.3.1 |
| 4.2.2 | Stats card component (value, label, trend) | `src/components/admin/shared/stats-card.tsx` | 1.3.1 |
| 4.2.3 | Export button (CSV download) | `src/components/admin/shared/export-button.tsx` | 1.4.1 |
| 4.2.4 | Activity log component | `src/components/admin/shared/activity-log.tsx` | 4.2.1 |

### 4.3 Product Management

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.3.1 | Product form (name, description, price, compare_price, category, models, images, badge, featured, SEO fields) | `src/components/admin/products/product-form.tsx` | 1.4.2, 1.4.8, 1.4.12 |
| 4.3.2 | Image upload component (drag-and-drop, preview, max 5) | `src/components/admin/products/image-upload.tsx` | 1.4.1 |
| 4.3.3 | Product list table (sortable columns, search, status toggle) | `src/components/admin/products/product-table.tsx` | 4.2.1 |
| 4.3.4 | Product list grid view (visual cards) | `src/components/admin/products/product-grid.tsx` | 1.9.1 |
| 4.3.5 | Bulk actions toolbar (select, activate/deactivate/delete) | `src/components/admin/products/bulk-actions.tsx` | 1.4.1 |
| 4.3.6 | CSV import modal | `src/components/admin/products/csv-import.tsx` | 1.4.5 |
| 4.3.7 | Image upload API (Vercel Blob Storage) | `src/app/api/admin/upload/route.ts` | 4.3.2 |
| 4.3.8 | Product CRUD API routes | `src/app/api/admin/products/route.ts`, `src/app/api/admin/products/[id]/route.ts` | 1.2.1 |
| 4.3.9 | Product CSV import API | `src/app/api/admin/products/import/route.ts` | 4.3.8 |
| 4.3.10 | Product CSV export API | `src/app/api/admin/products/export/route.ts` | 4.3.8 |
| 4.3.11 | Product list page (grid/list toggle, bulk actions, search) | `src/app/admin/products/page.tsx` | 4.3.3, 4.3.4, 4.3.5, 4.3.8 |
| 4.3.12 | Create product page | `src/app/admin/products/new/page.tsx` | 4.3.1, 4.3.2, 4.3.8 |
| 4.3.13 | Edit product page | `src/app/admin/products/[id]/page.tsx` | 4.3.1, 4.3.2, 4.3.8 |

### 4.4 Phone Model Management

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.4.1 | Model CRUD API routes | `src/app/api/admin/models/route.ts` | 1.2.1 |
| 4.4.2 | Model management page (list, create, edit, toggle active) | `src/app/admin/models/page.tsx` | 4.4.1, 4.2.1 |

### 4.5 Category Management

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.5.1 | Category CRUD API routes | `src/app/api/admin/categories/route.ts` | 1.2.1 |
| 4.5.2 | Category management page (list, create, edit, sale %, toggle active) | `src/app/admin/categories/page.tsx` | 4.5.1, 4.2.1 |

### 4.6 Order Management

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.6.1 | Order status badge component (color-coded by status) | `src/components/admin/orders/order-status-badge.tsx` | 1.4.3 |
| 4.6.2 | Order table (sortable, filterable by status/date/model) | `src/components/admin/orders/order-table.tsx` | 4.2.1, 4.6.1 |
| 4.6.3 | Order detail view (customer info, items, discount breakdown, notes) | `src/components/admin/orders/order-detail.tsx` | 4.6.1, 2.2.3 |
| 4.6.4 | Order notes component (internal admin comments) | `src/components/admin/orders/order-notes.tsx` | 1.4.2 |
| 4.6.5 | Order print component (packing slip) | `src/components/admin/orders/order-print.tsx` | 4.6.3 |
| 4.6.6 | Admin orders API (list with filters, update status) | `src/app/api/admin/orders/route.ts`, `src/app/api/admin/orders/[id]/route.ts` | 1.2.2 |
| 4.6.7 | Orders CSV export API | `src/app/api/admin/orders/export/route.ts` | 4.6.6 |
| 4.6.8 | Orders list page (filters, search, export) | `src/app/admin/orders/page.tsx` | 4.6.2, 4.6.7 |
| 4.6.9 | Order detail page (status management, notes, WhatsApp reply, print) | `src/app/admin/orders/[id]/page.tsx` | 4.6.3, 4.6.4, 4.6.5 |

### 4.7 Discount Management

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.7.1 | Flash sale form (name, type, value, scope, dates) | `src/components/admin/discounts/flash-sale-form.tsx` | 1.4.2, 1.4.8 |
| 4.7.2 | Tiered discount form (thresholds + percentages) | `src/components/admin/discounts/tiered-discount-form.tsx` | 1.4.2 |
| 4.7.3 | Sale list (active/upcoming/expired tabs) | `src/components/admin/discounts/sale-list.tsx` | 4.2.1 |
| 4.7.4 | Discount CRUD API routes (flash sales + tiered discounts) | `src/app/api/admin/discounts/route.ts` | 1.2.3 |
| 4.7.5 | Discounts management page | `src/app/admin/discounts/page.tsx` | 4.7.1, 4.7.2, 4.7.3, 4.7.4 |

### 4.8 Promo Code Management

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.8.1 | Promo code form (code, type, value, min order, limits, scope, validity) | `src/components/admin/promo-codes/promo-code-form.tsx` | 1.4.2, 1.4.8, 1.4.12 |
| 4.8.2 | Promo code table (list with status, usage count) | `src/components/admin/promo-codes/promo-code-table.tsx` | 4.2.1 |
| 4.8.3 | Promo code stats (usage analytics, revenue) | `src/components/admin/promo-codes/promo-code-stats.tsx` | 4.2.2 |
| 4.8.4 | Bulk code generator (prefix + sequential numbers) | `src/components/admin/promo-codes/bulk-generate.tsx` | 1.4.2 |
| 4.8.5 | Promo code CRUD API routes | `src/app/api/admin/promo-codes/route.ts`, `src/app/api/admin/promo-codes/[id]/route.ts` | 1.2.3 |
| 4.8.6 | Promo code stats API | `src/app/api/admin/promo-codes/[id]/stats/route.ts` | 4.8.5 |
| 4.8.7 | Bulk generate API | `src/app/api/admin/promo-codes/bulk-generate/route.ts` | 4.8.5 |
| 4.8.8 | Promo codes list page | `src/app/admin/promo-codes/page.tsx` | 4.8.2, 4.8.5 |
| 4.8.9 | Promo code detail/stats page | `src/app/admin/promo-codes/[id]/page.tsx` | 4.8.3, 4.8.6 |

### 4.9 Customer Database

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.9.1 | Customer list component (phone, name, total orders, total spend, last order) | `src/components/admin/customers/customer-table.tsx` | 4.2.1 |
| 4.9.2 | Customer detail component (order history) | `src/components/admin/customers/customer-detail.tsx` | 4.9.1 |
| 4.9.3 | Customer API routes | `src/app/api/admin/customers/route.ts` | 1.2.2 |
| 4.9.4 | Customer database page | `src/app/admin/customers/page.tsx` | 4.9.1, 4.9.3 |

### 4.10 Dashboard

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.10.1 | Dashboard stats cards (revenue, orders, avg value, promo usage with trends) | `src/components/admin/dashboard/stats-cards.tsx` | 4.2.2 |
| 4.10.2 | Revenue trend chart (line chart, last 30 days) | `src/components/admin/dashboard/revenue-chart.tsx` | — |
| 4.10.3 | Top products list | `src/components/admin/dashboard/top-products.tsx` | 4.2.1 |
| 4.10.4 | Popular models list | `src/components/admin/dashboard/popular-models.tsx` | 4.2.1 |
| 4.10.5 | Recent orders with quick actions | `src/components/admin/dashboard/recent-orders.tsx` | 4.6.1 |
| 4.10.6 | Flash sale performance widget | `src/components/admin/dashboard/flash-sale-widget.tsx` | 4.10.2 |
| 4.10.7 | Dashboard analytics API | `src/app/api/admin/dashboard/route.ts` | 1.2.1, 1.2.2 |
| 4.10.8 | Dashboard page | `src/app/admin/page.tsx` | 4.10.1-4.10.7 |

### 4.11 Settings

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.11.1 | Settings form (WhatsApp number, shop name, currency, tax, hero image, SEO, social links) | `src/components/admin/settings/settings-form.tsx` | 1.4.2, 1.4.12 |
| 4.11.2 | WhatsApp message template editor | `src/components/admin/settings/whatsapp-template.tsx` | 1.4.2 |
| 4.11.3 | Settings API routes | `src/app/api/admin/settings/route.ts` | 1.2.5 |
| 4.11.4 | Settings page | `src/app/admin/settings/page.tsx` | 4.11.1, 4.11.2, 4.11.3 |

### 4.12 Activity Log

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.12.1 | Activity log API route | `src/app/api/admin/activity/route.ts` | 1.2.3 |
| 4.12.2 | Activity log page | `src/app/admin/activity/page.tsx` | 4.12.1, 4.2.4 |

### 4.13 Admin Activity Logging

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 4.13.1 | Activity logger utility (log admin actions to database) | `src/lib/admin-logger.ts` | 1.2.3, 4.1.1 |
| 4.13.2 | Wire activity logging into all admin CRUD operations | All admin API routes | 4.13.1 |

**Phase 4 Completion Criteria:**
- [ ] Admin can log in with email/password
- [ ] Dashboard shows revenue, orders, charts, trends
- [ ] Admin can create/edit/delete products with image upload
- [ ] Admin can manage phone models and categories
- [ ] Admin can view/filter/search orders and change status
- [ ] Admin can create/manage flash sales, tiered discounts, promo codes
- [ ] Admin can view customer database
- [ ] CSV import/export works for products and orders
- [ ] All admin actions are logged
- [ ] Admin can configure site settings

---

## Phase 5: Micro-Interactions & Polish

> Goal: Make the site feel premium and alive through deliberate animation and interaction.

### 5.1 Desktop Interactions

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 5.1.1 | Magnetic CTA hook + component (button follows cursor) | `src/hooks/use-magnetic.ts`, `src/components/ui/button.tsx` | — |
| 5.1.2 | Card tilt hook + component (3D tilt following mouse) | `src/hooks/use-tilt.ts`, `src/components/products/product-card.tsx` | — |
| 5.1.3 | Gold border trace animation on product cards (CSS) | `src/components/products/product-card.tsx` | — |
| 5.1.4 | Keyboard shortcuts (arrows navigate, Enter adds, / searches, Esc closes) | `src/hooks/use-keyboard.ts` | — |

### 5.2 Animations

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 5.2.1 | Staggered product reveal (IntersectionObserver + CSS animation) | `src/components/products/product-card.tsx` | — |
| 5.2.2 | Add-to-cart fly animation (image shrinks to cart icon) | `src/components/cart/cart-fly.tsx` | 1.7.1 |
| 5.2.3 | Price counter animation (counts down when discount applies) | `src/components/cart/discount-breakdown.tsx` | 2.2.3 |
| 5.2.4 | Scroll-triggered section reveals | `src/components/ui/reveal.tsx` | — |

### 5.3 Mobile Interactions

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 5.3.1 | Swipe to remove (cart items) | `src/components/cart/cart-item.tsx` | 1.8.1 |
| 5.3.2 | Pull to refresh (product grid) | `src/components/ui/pull-to-refresh.tsx` | 1.8.1 |
| 5.3.3 | Long-press quick add (product card) | `src/components/products/product-card.tsx` | 1.7.1, 1.8.3 |

### 5.4 Loading States

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 5.4.1 | Product grid skeleton (animated placeholders) | `src/components/products/product-skeleton.tsx` | 1.4.4 |
| 5.4.2 | Product detail skeleton | `src/components/products/product-detail-skeleton.tsx` | 1.4.4 |
| 5.4.3 | Cart skeleton | `src/components/cart/cart-skeleton.tsx` | 1.4.4 |
| 5.4.4 | Admin table skeleton | `src/components/admin/shared/table-skeleton.tsx` | 1.4.4 |

### 5.5 Toast System

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 5.5.1 | Toast context provider (global toast state) | `src/components/providers/toast-provider.tsx` | 1.4.7 |
| 5.5.2 | Toast triggers (added to cart, copied link, promo applied, etc.) | Various components | 5.5.1 |

**Phase 5 Completion Criteria:**
- [ ] Magnetic CTA button works on desktop
- [ ] Product cards tilt on hover (desktop)
- [ ] Gold border trace animation on product cards
- [ ] Products fade in with staggered reveal on scroll
- [ ] Add-to-cart fly animation works
- [ ] Swipe to remove works on mobile cart
- [ ] Pull to refresh works on mobile product grid
- [ ] Skeleton loaders show during data loading
- [ ] Toast notifications appear for key actions
- [ ] Keyboard shortcuts work on desktop

---

## Phase 6: Launch Prep

> Goal: SEO, performance, error handling, and final polish.

### 6.1 SEO

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 6.1.1 | Dynamic meta tags for all pages (title, description, OG) | All page files | All pages |
| 6.1.2 | JSON-LD structured data for product pages | `src/app/(storefront)/shop/[model]/[product]/page.tsx` | 1.12.4 |
| 6.1.3 | Sitemap generation (dynamic from products/models/categories) | `src/app/sitemap.ts` | 1.2.1 |
| 6.1.4 | Robots.txt | `public/robots.txt` | — |
| 6.1.5 | Canonical URLs on all pages | `src/app/layout.tsx` | — |

### 6.2 Performance

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 6.2.1 | Image optimization pass (blur placeholders, lazy loading) | All product components | All pages |
| 6.2.2 | Lighthouse audit and fix any issues | — | All pages |
| 6.2.3 | Bundle size analysis and code splitting | — | All pages |
| 6.2.4 | ISR configuration for product pages | `src/app/(storefront)/shop/[model]/[product]/page.tsx` | 1.12.4 |

### 6.3 Error Handling

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 6.3.1 | Global error boundary | `src/app/error.tsx` | — |
| 6.3.2 | Not found page (404) with featured products | `src/app/not-found.tsx` | 1.12.7 |
| 6.3.3 | Loading states for all pages | `src/app/loading.tsx`, `src/app/(storefront)/shop/loading.tsx`, etc. | — |
| 6.3.4 | API error handling middleware | `src/lib/api-errors.ts` | — |
| 6.3.5 | Offline banner | `src/components/ui/offline-banner.tsx` | — |

### 6.4 Final Polish

| # | Task | Files | Depends On |
|---|------|-------|------------|
| 6.4.1 | Cross-browser testing (Chrome, Firefox, Safari, Edge) | — | All pages |
| 6.4.2 | Mobile touch interaction testing (iOS Safari, Android Chrome) | — | All pages |
| 6.4.3 | Admin WhatsApp message templates (configurable in settings) | `src/components/admin/settings/whatsapp-template.tsx` | 4.11.2 |
| 6.4.4 | Auto-restock alerts (notification when stock hits threshold) | `src/lib/restock-alert.ts` | 1.2.1 |
| 6.4.5 | Accessibility audit (keyboard nav, ARIA labels, focus management) | — | All pages |
| 6.4.6 | Final visual review and polish | — | All pages |

**Phase 6 Completion Criteria:**
- [ ] All pages have proper meta tags and OG images
- [ ] Sitemap.xml generates correctly
- [ ] Lighthouse scores 90+ on all metrics
- [ ] Error boundaries catch and display errors gracefully
- [ ] 404 page shows featured products
- [ ] All loading states work
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Works on iOS Safari and Android Chrome
- [ ] Accessibility audit passes
- [ ] No console errors in production

---

## File Structure Summary

```
casele/
├── src/
│   ├── app/
│   │   ├── layout.tsx                           # Root layout
│   │   ├── page.tsx                             # Homepage
│   │   ├── error.tsx                            # Global error boundary
│   │   ├── not-found.tsx                        # 404 page
│   │   ├── loading.tsx                          # Global loading
│   │   ├── globals.css                          # Global styles
│   │   ├── sitemap.ts                           # Dynamic sitemap
│   │   ├── (storefront)/
│   │   │   ├── layout.tsx                       # Storefront layout
│   │   │   ├── page.tsx                         # Homepage
│   │   │   ├── shop/
│   │   │   │   ├── page.tsx                     # Product grid
│   │   │   │   ├── loading.tsx                  # Shop loading
│   │   │   │   └── [model]/
│   │   │   │       ├── page.tsx                 # Model page
│   │   │   │       └── [product]/
│   │   │   │           └── page.tsx             # Product detail
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx                 # Category page
│   │   │   ├── track/
│   │   │   │   └── page.tsx                     # Order tracking
│   │   │   └── search/
│   │   │       └── page.tsx                     # Search results
│   │   ├── admin/
│   │   │   ├── layout.tsx                       # Admin layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx                     # Login
│   │   │   ├── page.tsx                         # Dashboard
│   │   │   ├── products/
│   │   │   │   ├── page.tsx                     # Product list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx                 # Create product
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx                 # Edit product
│   │   │   ├── discounts/
│   │   │   │   └── page.tsx                     # Discounts
│   │   │   ├── promo-codes/
│   │   │   │   ├── page.tsx                     # Promo code list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx                 # Promo code detail
│   │   │   ├── models/
│   │   │   │   └── page.tsx                     # Models
│   │   │   ├── categories/
│   │   │   │   └── page.tsx                     # Categories
│   │   │   ├── orders/
│   │   │   │   ├── page.tsx                     # Order list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx                 # Order detail
│   │   │   ├── customers/
│   │   │   │   └── page.tsx                     # Customers
│   │   │   ├── settings/
│   │   │   │   └── page.tsx                     # Settings
│   │   │   └── activity/
│   │   │       └── page.tsx                     # Activity log
│   │   └── api/
│   │       ├── products/
│   │       │   ├── route.ts                     # GET products
│   │       │   ├── [id]/
│   │       │   │   ├── route.ts                 # GET product
│   │       │   │   └── bundles/
│   │       │   │       └── route.ts             # GET bundles
│   │       ├── models/
│   │       │   └── route.ts                     # GET models
│   │       ├── categories/
│   │       │   └── route.ts                     # GET categories
│   │       ├── search/
│   │       │   └── route.ts                     # GET search
│   │       ├── orders/
│   │       │   └── route.ts                     # POST order
│   │       ├── track/
│   │       │   └── route.ts                     # GET track
│   │       ├── promo/
│   │       │   └── validate/
│   │       │       └── route.ts                 # POST validate
│   │       ├── flash-sales/
│   │       │   └── route.ts                     # GET flash sales
│   │       ├── social-proof/
│   │       │   └── route.ts                     # GET social proof
│   │       └── admin/
│   │           ├── auth/
│   │           │   └── [...nextauth]/
│   │           │       └── route.ts             # NextAuth
│   │           ├── dashboard/
│   │           │   └── route.ts                 # GET analytics
│   │           ├── products/
│   │           │   ├── route.ts                 # GET/POST products
│   │           │   ├── [id]/
│   │           │   │   └── route.ts             # GET/PUT/DELETE product
│   │           │   ├── import/
│   │           │   │   └── route.ts             # POST CSV import
│   │           │   └── export/
│   │           │       └── route.ts             # GET CSV export
│   │           ├── models/
│   │           │   └── route.ts                 # CRUD models
│   │           ├── categories/
│   │           │   └── route.ts                 # CRUD categories
│   │           ├── orders/
│   │           │   ├── route.ts                 # GET orders
│   │           │   ├── [id]/
│   │           │   │   └── route.ts             # GET/PUT order
│   │           │   └── export/
│   │           │       └── route.ts             # GET CSV export
│   │           ├── discounts/
│   │           │   └── route.ts                 # CRUD discounts
│   │           ├── promo-codes/
│   │           │   ├── route.ts                 # CRUD promo codes
│   │           │   ├── [id]/
│   │           │   │   ├── route.ts             # GET/PUT/DELETE
│   │           │   │   └── stats/
│   │           │   │       └── route.ts         # GET stats
│   │           │   └── bulk-generate/
│   │           │       └── route.ts             # POST bulk generate
│   │           ├── customers/
│   │           │   └── route.ts                 # GET customers
│   │           ├── settings/
│   │           │   └── route.ts                 # GET/PUT settings
│   │           ├── activity/
│   │           │   └── route.ts                 # GET activity
│   │           └── upload/
│   │               └── route.ts                 # POST upload
│   ├── components/
│   │   ├── ui/                                  # 13 components (see spec)
│   │   ├── layout/                              # 9 components
│   │   ├── brand/                               # 2 components
│   │   ├── products/                            # 12 components
│   │   ├── cart/                                # 8 components
│   │   ├── search/                              # 3 components
│   │   ├── tracking/                            # 3 components
│   │   ├── wishlist/                            # 2 components
│   │   ├── admin/                               # 25+ components
│   │   └── providers/                           # 2 components
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts                         # DB connection
│   │   │   ├── schema.ts                        # Drizzle schema
│   │   │   └── seed.ts                          # Seed data
│   │   ├── store/
│   │   │   ├── cart.ts                          # Cart Zustand store
│   │   │   ├── wishlist.ts                      # Wishlist store
│   │   │   └── ui.ts                            # UI store
│   │   ├── discounts/
│   │   │   ├── index.ts                         # Master orchestrator
│   │   │   ├── tiered.ts                        # Tiered calculator
│   │   │   ├── flash.ts                         # Flash sale calculator
│   │   │   ├── bundle.ts                        # Bundle calculator
│   │   │   ├── promo.ts                         # Promo code calculator
│   │   │   └── category.ts                      # Category sale calculator
│   │   ├── auth.ts                              # NextAuth config
│   │   ├── utils.ts                             # cn(), formatPrice(), slugify()
│   │   ├── whatsapp.ts                          # WhatsApp message builder
│   │   ├── recently-viewed.ts                   # localStorage utility
│   │   ├── settings.ts                          # Settings fetcher
│   │   ├── admin-logger.ts                      # Activity logger
│   │   ├── api-errors.ts                        # API error handling
│   │   └── restock-alert.ts                     # Restock alert logic
│   └── hooks/
│       ├── use-mobile.ts
│       ├── use-scroll-position.ts
│       ├── use-haptic.ts
│       ├── use-recently-viewed.ts
│       ├── use-magnetic.ts
│       ├── use-tilt.ts
│       └── use-keyboard.ts
├── public/
│   ├── robots.txt
│   └── (static assets)
├── drizzle/
│   └── (migrations)
├── docs/
│   └── superpowers/specs/
│       └── 2026-08-23-casele-ecommerce-design.md
├── drizzle.config.ts
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── package.json
└── .env.example
```

---

## Estimated Task Count

| Phase | Tasks | Est. Time |
|-------|-------|-----------|
| Phase 1: Core Storefront | 65 tasks | 3-4 sessions |
| Phase 2: Discount & Promo | 23 tasks | 1-2 sessions |
| Phase 3: Enhanced Storefront | 25 tasks | 1-2 sessions |
| Phase 4: Admin Panel | 55 tasks | 3-4 sessions |
| Phase 5: Micro-Interactions | 16 tasks | 1 session |
| Phase 6: Launch Prep | 15 tasks | 1 session |
| **Total** | **~199 tasks** | **10-14 sessions** |

---

## Dependencies Graph (Critical Path)

```
Phase 1.1 (Setup) → 1.2 (Schema) → 1.3 (Utils) → 1.4 (UI Library)
                                                            ↓
                                                    1.5 (Brand) → 1.6 (Layout)
                                                            ↓
                                                    1.7 (Stores) → 1.8 (Hooks)
                                                            ↓
                                                    1.9 (Products) → 1.10 (Cart)
                                                            ↓
                                                    1.11 (API) → 1.12 (Pages)
                                                            ↓
                                                    1.13 (WhatsApp) → 1.14 (Theme)
                                                            ↓
                                                    1.15 (Seed) → Phase 1 Complete

Phase 2 depends on: Phase 1 complete (schema, stores, cart, API)
Phase 3 depends on: Phase 1 complete (components, pages, API)
Phase 4 depends on: Phase 1 complete (schema, auth, API)
Phase 5 depends on: Phase 1-3 complete (components exist)
Phase 6 depends on: Phase 1-5 complete (final polish)
```

**Phases 2, 3, and 4 can run in parallel** after Phase 1 is complete, as they touch different parts of the codebase.
