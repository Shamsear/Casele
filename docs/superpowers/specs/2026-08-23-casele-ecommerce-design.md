# CASELÉ — Premium Phone Case E-Commerce

**Date:** 2026-08-23
**Status:** Approved (v2 — full feature set)
**Author:** Buffy (Codebuff)

---

## 1. Overview

CASELÉ is a premium mobile phone case brand with the tagline "PROTECT. EXPRESS. ELEVATE." We are building a feature-packed, non-cliche e-commerce website that prioritizes speed — customers should go from browsing to confirmed order in 2-4 clicks with zero account creation friction.

Payment is handled via WhatsApp: the customer clicks "Order on WhatsApp," a pre-filled message with their order details is sent to the admin's WhatsApp number, and the admin fulfills the order manually.

The website is not a generic e-commerce template. It is a dark-first, product-first experience designed to make phone cases feel like objects of desire. Every design choice serves one goal: make the product look its best.

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Product catalog structure | Organized by phone model | Customers know their device first; every result is compatible |
| Checkout flow | Pre-filled WhatsApp message | Zero cost, zero friction, personal touch |
| Tech stack | Next.js (App Router) + Drizzle ORM + Neon PostgreSQL | Serverless, fast, cost-effective |
| Hosting | Vercel | Zero-config Next.js deployment |
| Admin auth | NextAuth.js with email/password | Simple, secure, no over-engineering |
| Customer auth | None | No sign-up friction — anonymous checkout |
| Design mode | Dark-first | Product photography is on dark backgrounds; site matches |
| Address | Optional at checkout | Speed > completeness; admin follows up via WhatsApp |
| Discounts | Advanced (tiered + flash + promo + bundles) | Business needs, revenue optimization |

---

## 2. Brand & Design System

### 2.1 Color Palette

| Token | Hex | Role |
|-------|-----|------|
| `--black` | #0D0D0D | Primary background, header, footer, hero |
| `--gold` | #D4AF37 | CTA buttons, prices, accents, active states |
| `--cream` | #F5EBDD | Product card backgrounds (browsing mode) |
| `--white` | #FAFAF8 | Elevated surfaces: modals, sheets, forms |
| `--warm-gray` | #A89B8C | Secondary text, dividers, muted UI |
| `--gold-light` | #E8D5A3 | Gold hover state, subtle highlights |
| `--dark-surface` | #1A1A1A | Elevated dark surfaces (cards on dark bg) |
| `--dark-border` | #2A2A2A | Borders in dark mode |

### 2.2 Typography

| Role | Typeface | Weight | Use |
|------|----------|--------|-----|
| Display | Cormorant Garamond | 600, 700 | Brand name, hero headlines, prices, section titles |
| Body | Inter | 400, 500, 600 | Descriptions, buttons, UI text, navigation |
| Caption | Inter | 400 | Labels, metadata, timestamps, badges |

**Type scale (base 16px):**
- Hero: 3rem / 48px
- H1: 2.25rem / 36px
- H2: 1.5rem / 24px
- H3: 1.125rem / 18px
- Body: 1rem / 16px
- Small: 0.875rem / 14px
- Caption: 0.75rem / 12px
- Price display: 1.75rem / 28px (Cormorant Garamond, gold)

### 2.3 Design Philosophy: "Dark Luxury, Product-First"

The product photography already tells the story — black cases, gold accents, premium packaging on dark surfaces. The website is an extension of that world.

**Core principles:**
1. **The product is the hero.** Every screen should make the case look its best. No chrome, no decoration, no design for design's sake.
2. **Dark by default.** Product photos are on dark backgrounds — the site matches. Cream is reserved for product browsing cards only.
3. **Gold is surgical.** Used only for: CTA buttons, price display, thin accent lines, active states. Maximum 5% of any screen. Never backgrounds, never fills.
4. **Typography carries personality.** Cormorant Garamond for luxury, Inter for function. The type treatment is memorable, not neutral.
5. **Speed is the UX.** Every interaction should feel instant. No loading spinners, no page transitions, no unnecessary steps.

### 2.4 Signature Design Elements

1. **Dark hero → cream grid transition.** Homepage starts full-viewport dark with a hero product shot. As you scroll, product cards emerge on cream backgrounds — like opening a jewelry box.
2. **Gold border trace.** On hover (desktop), a thin gold line traces the edge of the product card clockwise. Subtle, tactile, memorable.
3. **Magnetic CTA button.** The "Order on WhatsApp" button subtly follows your cursor on hover (desktop). Feels alive, draws attention.
4. **Scroll progress indicator.** A thin gold line at the top of the page showing how far you've scrolled. Functional and elegant.
5. **Staggered product reveal.** Products fade in one by one as you scroll down. Visual rhythm, not a wall of cards.

### 2.5 Design Anti-Patterns to Avoid

- Full gold backgrounds (cheap luxury look)
- Hamburger menus on mobile (use bottom nav instead)
- Carousel/slider hero sections (indecision, not confidence)
- Cookie-cutter "Shop Now" CTAs without personality
- Heavy drop shadows or 3D effects
- Auto-playing video backgrounds
- Newsletter popups
- Review sections requiring accounts
- Sticky headers that cover content on mobile
- Generic stock photography

---

## 3. User Flows

### 3.1 Customer Purchase Flow

```
Homepage → Select Phone Model → Browse Cases → Tap Product → Add to Cart → Order on WhatsApp
  (1 click)    (1 click)           (1 click)      (1 click)      (1 click)     (1 click)
```

Maximum 4 clicks from landing to WhatsApp message sent. No account required.

**Detailed steps:**

1. **Landing:** Customer arrives at homepage. Full-viewport dark hero with a stunning product shot. Below: phone model selector (iPhone, Samsung, etc.), featured products, categories.
2. **Model selection:** Customer taps their phone model. Taken to a filtered product grid showing only compatible cases on cream backgrounds.
3. **Browsing:** Customer scrolls through cases. Each card shows: product image, name, price (gold), badges (NEW/BESTSELLER/SALE), and a quick "Add" button. "X people ordered today" shown below each card.
4. **Quick-add:** Tapping "Add" opens a bottom sheet (not a new page) with product details, model selector (if multiple), and a large "Add to Cart" button.
5. **Bundle suggestion:** After adding, a bottom sheet suggests complementary items: "Complete Your Protection — Add a screen protector? ₹299 [Add]"
6. **Cart:** A floating cart bubble at bottom-right shows item count and total. Tapping it expands a compact cart summary sidebar (desktop) or bottom sheet (mobile).
7. **Checkout:** Tapping "Order on WhatsApp" opens a checkout form: name, phone, optional address, promo code input, order summary with all discounts applied. User reviews, then taps "Confirm & Send."
8. **WhatsApp:** WhatsApp opens with a pre-filled message containing all order details.

### 3.2 Order Tracking Flow

```
/track → Enter phone number → See all orders → Tap to expand → View status timeline
```

- No login, no account — just phone number
- Shows all orders for that phone number
- Status timeline: Confirmed → Dispatched → Delivered
- "Re-order these items" button on delivered orders
- Reduces WhatsApp support messages significantly

### 3.3 Search Flow

```
Search bar → Type "iPhone 15 Pro" → Autocomplete suggestions → Tap result → Filtered grid
```

- Real-time autocomplete as user types
- Searches: product names, model names, categories
- Results page with model/category filters
- "Did you mean..." for typos

### 3.4 Wishlist Flow

```
Tap ♡ on product → Saved to wishlist → View wishlist in cart sidebar → Move to Cart → Checkout
```

- Heart icon on every product card/detail
- Stored in localStorage (no account needed)
- Accessible via "Wishlist" section in cart sidebar
- Shows count in bottom nav: "♡ 3"

---

## 4. Feature Catalog

### 4.1 Storefront Features

| Feature | Description | Effort |
|---------|-------------|--------|
| **Dark-first homepage** | Full-viewport hero with product shot, dark background, gold accents | Low |
| **Phone model selector** | Grid of phone brands/models, leads to filtered product page | Low |
| **Product grid** | Cream background, staggered reveal, badges (NEW/BESTSELLER/SALE), prices in gold | Low |
| **Product detail page** | Large images, description, model selector, add to cart, related products | Low |
| **Quick-add bottom sheet** | Tap product → bottom sheet with details + add button (no page navigation) | Low |
| **Sticky add-to-cart bar** | Mobile: sticky bar at bottom with price, model selector, add button | Low |
| **Cart sidebar/sheet** | Desktop: slide-in sidebar. Mobile: bottom sheet. Shows items, totals, promo input, checkout CTA | Medium |
| **Search with autocomplete** | Real-time search bar on /shop, searches products/models/categories | Medium |
| **Wishlist** | Heart icon on cards, localStorage, accessible from cart sidebar | Low |
| **Recently viewed** | Shows last 10 viewed products on homepage and /shop | Low |
| **Share product** | Web Share API (mobile) / copy link (desktop) with OG meta tags | Low |
| **Social proof** | "X people ordered today", "Last sold Y ago", live activity toasts | Low |
| **Bundle recommendations** | After adding to cart: "Complete Your Protection" with complementary items | Medium |
| **Order tracking** | /track page, enter phone number, see order status timeline | Low |
| **Dark/light mode** | Toggle in header, respects system preference, saved in localStorage | Low |
| **Scroll progress bar** | Thin gold line at top showing scroll position | Low |
| **Skeleton loaders** | Animated placeholders while content loads | Low |
| **Responsive layout** | Mobile-first, optimized for 320px to 1920px+ | Medium |

### 4.2 Discount & Pricing Features

| Feature | Description |
|---------|-------------|
| **Per-product sale price** | compare_price field: shows strikethrough + discount badge |
| **Category-level sales** | Admin sets sale % on category, all products inherit it |
| **Tiered discounts** | Auto-apply: spend ₹500+ get 5% off, ₹1000+ get 10%, ₹2000+ get 15% |
| **Flash sales** | Time-limited sales: name, discount type, scope, start/end dates, countdown banner |
| **Bundle discounts** | "Buy 2, get 10% off" — configured per product or globally |
| **Promo codes** | Percentage or flat discount, min order, usage limits, per-user limit, validity dates |
| **Discount stacking rules** | Admin controls whether promo codes stack with tier/flash discounts |
| **Auto-applying promos** | Promo codes that apply automatically without user entering them |
| **Discount breakdown** | Checkout shows each discount separately: tier, flash, promo |
| **"You saved ₹X"** | Checkout shows total savings prominently |

### 4.3 Checkout Features

| Feature | Description |
|---------|-------------|
| **Optional address** | Address field is optional; WhatsApp message notes "please confirm with customer" if missing |
| **Promo code input** | Collapsible "Have a promo code?" section in checkout |
| **Order summary review** | Full review before WhatsApp: items, discounts, totals |
| **"Edit order" option** | Goes back to cart from review screen |
| **Haptic feedback** | On mobile, brief vibration on successful add-to-cart |
| **Add-to-cart animation** | Product image shrinks and flies to cart icon |
| **Price counter animation** | When discount applies, price counts down (₹999 → ₹799) |
| **Cart persistence** | localStorage — survives page refreshes, no account needed |
| **Cart quantity limits** | Max 10 per item, min 1 |

### 4.4 Admin Panel Features

**Dashboard:**
- Revenue (this month, with % change from last month)
- Total orders (with trend)
- Average order value (with trend)
- Promo codes used (with trend)
- Revenue trend chart (last 30 days)
- Top products (by revenue)
- Popular models (by order count)
- Flash sale performance
- Recent orders list (with quick actions)

**Product Management:**
- CRUD with image upload (drag-and-drop, max 5 images per product)
- Model association (which phone models this case fits)
- Per-product pricing with sale price
- Product badges: NEW, BESTSELLER, SALE, OUT OF STOCK
- Featured product toggle
- Bulk operations: activate/deactivate/delete multiple products
- Duplicate product (for similar cases)
- Sort order control
- SEO fields: meta title, description per product
- CSV import/export for bulk product management

**Discount Management:**
- Flash sale creation (name, type, dates, scope)
- Tiered discount configuration (thresholds + percentages)
- Category sale percentages
- Active/upcoming/expired sale views
- Bundle discount rules

**Promo Code Management:**
- Create/edit/delete promo codes
- Toggle active/inactive
- Usage stats per code (times used, revenue generated)
- Bulk generate codes (e.g., SUMMER20-001 through SUMMER20-100)
- Auto-applying promo configuration

**Order Management:**
- Status pipeline: Pending → Confirmed → Dispatched → Delivered
- Order detail with customer info, items, pricing breakdown, discount breakdown
- Internal notes (admin-only comments on orders)
- "Reply on WhatsApp" button
- Filter by status, date range, phone model
- Search by customer name or phone number
- Export orders to CSV
- Order priority flags (urgent, VIP)
- Print order (packing slip format)
- Quick actions from dashboard (confirm, mark dispatched, reply)

**Phone Model Management:**
- CRUD for phone models (brand, name, image)
- Sort order, active/inactive toggle
- Product count per model

**Category Management:**
- CRUD for categories
- Sale percentage per category
- Sort order, active/inactive

**Customer Database:**
- All unique phone numbers → their orders, total spend, last order date
- Search by phone or name
- No accounts — just phone-based identity

**Settings:**
- WhatsApp number (with country code)
- Shop name, currency, currency code
- Tax rate configuration
- Free shipping threshold
- Tiered discount rules (thresholds + percentages)
- Homepage content: hero image, tagline
- SEO: meta title, description, favicon
- Social links: Instagram, website
- WhatsApp message templates
- Auto-restock alerts (notify when stock hits 0)

**Admin Activity Log:**
- All admin actions logged: create product, update order, change settings
- Timestamped, filterable by admin and action type

### 4.5 Micro-Interactions & Polish

| Interaction | What It Does | Where |
|---|---|---|
| **Magnetic CTA button** | Button subtly follows cursor on hover | Desktop, "Order on WhatsApp" |
| **Product card tilt** | Subtle 3D tilt following mouse position | Desktop, product cards |
| **Gold border trace** | Gold line traces card edge clockwise on hover | Desktop, product cards |
| **Scroll progress** | Thin gold line at top showing scroll position | All pages |
| **Add to cart animation** | Product image shrinks and flies to cart icon | Product quick-add |
| **Staggered reveal** | Products fade in one by one as you scroll | Product grids |
| **Price counter** | Price counts down when discount applies | Checkout |
| **Haptic feedback** | Brief vibration on add-to-cart | Mobile |
| **Pull to refresh** | Pull down on product grid to reload | Mobile |
| **Swipe to remove** | Swipe left on cart item to remove | Mobile, cart |
| **Long-press quick add** | Long-press on product card adds to cart | Mobile |
| **Skeleton loaders** | Animated placeholders while content loads | All data-dependent views |
| **Toast notifications** | Slide-in notifications for actions (added to cart, copied link, etc.) | All |

---

## 5. Database Schema

### 5.1 Tables

```sql
-- Phone models (e.g., iPhone 15 Pro, Samsung Galaxy S24)
phone_models (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand         TEXT NOT NULL,          -- "iPhone", "Samsung", "Google"
  model_name    TEXT NOT NULL,          -- "iPhone 15 Pro Max"
  slug          TEXT UNIQUE NOT NULL,   -- "iphone-15-pro-max"
  image_url     TEXT,                   -- Phone model image for display
  sort_order    INTEGER DEFAULT 0,      -- Display ordering
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
)

-- Product categories (e.g., Classic, Premium, Sport)
categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,          -- "Classic Collection"
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  image_url     TEXT,
  sale_percent  INTEGER,                -- Category-level sale (e.g., 15 = 15% off)
  sort_order    INTEGER DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now()
)

-- Products (phone cases)
products (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,          -- "Midnight Black Premium Case"
  slug          TEXT UNIQUE NOT NULL,
  description   TEXT,
  price         DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),         -- Original price for "sale" display
  images        TEXT[] DEFAULT '{}',    -- Array of image URLs
  category_id   UUID REFERENCES categories(id),
  badge         TEXT,                   -- 'new' | 'bestseller' | 'sale' | null
  is_featured   BOOLEAN DEFAULT false,
  is_active     BOOLEAN DEFAULT true,
  sort_order    INTEGER DEFAULT 0,
  view_count    INTEGER DEFAULT 0,     -- For social proof
  order_count   INTEGER DEFAULT 0,     -- For "X ordered today"
  last_sold_at  TIMESTAMPTZ,           -- For "Last sold Y ago"
  meta_title    TEXT,                   -- SEO
  meta_description TEXT,                -- SEO
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
)

-- Many-to-many: products ↔ phone_models
product_models (
  product_id    UUID REFERENCES products(id) ON DELETE CASCADE,
  model_id      UUID REFERENCES phone_models(id) ON DELETE CASCADE,
  stock         INTEGER DEFAULT 0,     -- Stock tracking per model
  PRIMARY KEY (product_id, model_id)
)

-- Product bundles (cross-sell recommendations)
product_bundles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id      UUID REFERENCES products(id) ON DELETE CASCADE,
  bundled_product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  bundle_discount INTEGER,             -- Percentage off when bundled (e.g., 15 = 15%)
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
)

-- Orders
orders (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name     TEXT NOT NULL,
  customer_phone    TEXT NOT NULL,
  address           TEXT,              -- Delivery address (optional)
  items             JSONB NOT NULL,    -- [{product_id, name, model, qty, price}]
  subtotal          DECIMAL(10,2) NOT NULL,
  tier_discount     DECIMAL(10,2) DEFAULT 0,
  flash_discount    DECIMAL(10,2) DEFAULT 0,
  promo_discount    DECIMAL(10,2) DEFAULT 0,
  bundle_discount   DECIMAL(10,2) DEFAULT 0,
  total             DECIMAL(10,2) NOT NULL,
  promo_code_id     UUID REFERENCES promo_codes(id),
  status            TEXT DEFAULT 'pending', -- pending/confirmed/dispatched/delivered/cancelled
  priority          TEXT DEFAULT 'normal',  -- 'normal' | 'urgent'
  notes             TEXT,              -- Admin notes
  whatsapp_sent     BOOLEAN DEFAULT false,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
)

-- Promo codes
promo_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  discount_type   TEXT NOT NULL,       -- 'percentage' | 'flat'
  discount_value  DECIMAL(10,2) NOT NULL,
  min_order       DECIMAL(10,2) DEFAULT 0,
  max_uses        INTEGER,             -- NULL = unlimited
  per_user_limit  INTEGER DEFAULT 1,
  applies_to      TEXT DEFAULT 'all',  -- 'all' | 'category' | 'products'
  applies_to_ids  UUID[] DEFAULT '{}', -- Category or product IDs
  stackable       BOOLEAN DEFAULT false,
  auto_apply      BOOLEAN DEFAULT false, -- Apply automatically without user entering code
  valid_from      TIMESTAMPTZ,
  valid_until     TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT true,
  used_count      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now()
)

-- Promo code usage tracking
promo_code_uses (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id   UUID REFERENCES promo_codes(id),
  order_id        UUID REFERENCES orders(id),
  customer_phone  TEXT,
  discount_amount DECIMAL(10,2) NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
)

-- Flash sales
flash_sales (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,       -- "Independence Day Sale"
  discount_type   TEXT NOT NULL,       -- 'percentage' | 'flat'
  discount_value  DECIMAL(10,2) NOT NULL,
  applies_to      TEXT DEFAULT 'all',  -- 'all' | 'category' | 'products'
  applies_to_ids  UUID[] DEFAULT '{}',
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ NOT NULL,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
)

-- Tiered discount rules
tier_discounts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  min_amount        DECIMAL(10,2) NOT NULL, -- e.g., 500, 1000, 2000
  discount_percent  INTEGER NOT NULL,        -- e.g., 5, 10, 15
  is_active         BOOLEAN DEFAULT true,
  sort_order        INTEGER DEFAULT 0
)

-- Admin users
admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT now()
)

-- Admin activity log
admin_activity_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id      UUID REFERENCES admin_users(id),
  action        TEXT NOT NULL,         -- 'create_product', 'update_order', etc.
  details       JSONB,
  created_at    TIMESTAMPTZ DEFAULT now()
)

-- Site settings (key-value store)
settings (
  key           TEXT PRIMARY KEY,
  value         TEXT NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT now()
)
```

### 5.2 Default Settings

| Key | Value | Description |
|-----|-------|-------------|
| `whatsapp_number` | `919999999999` | Admin WhatsApp number (with country code, no +) |
| `shop_name` | `CASELÉ` | Shop name for receipts |
| `currency` | `₹` | Currency symbol |
| `currency_code` | `INR` | ISO currency code |
| `tax_rate` | `0` | Tax percentage |
| `free_shipping_above` | `0` | Free shipping threshold (0 = disabled) |
| `hero_image` | (URL) | Homepage hero image |
| `hero_tagline` | `PROTECT. EXPRESS. ELEVATE.` | Homepage tagline |
| `meta_title` | `CASELÉ — Premium Phone Cases` | SEO title |
| `meta_description` | (description) | SEO meta description |
| `social_proof_enabled` | `true` | Show "X ordered today" on cards |
| `flash_sale_banner_enabled` | `true` | Show active flash sale banner |
| `bundle_suggestions_enabled` | `true` | Show bundle suggestions after add-to-cart |
| `auto_restock_alert_stock` | `0` | Stock level to trigger restock alert |
| `whatsapp_message_template` | (template) | Customizable order message template |

---

## 6. Route Architecture

### 6.1 Storefront Routes (Public)

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Dark hero, model selector, featured products, categories, recently viewed |
| `/shop` | Product Grid | All products, search, filterable by model/category, sort options |
| `/shop/[model-slug]` | Model Page | All cases for a specific phone model |
| `/shop/[model-slug]/[product-slug]` | Product Detail | Full product page with images, description, add to cart, bundles |
| `/category/[category-slug]` | Category Page | Products in a specific collection with sale banner |
| `/track` | Order Tracking | Enter phone number, see order status timeline |
| `/search` | Search Results | Full search results page with filters |

### 6.2 Admin Routes (Protected)

| Route | Page | Description |
|-------|------|-------------|
| `/admin/login` | Login | Email/password login form |
| `/admin` | Dashboard | Full analytics: revenue, orders, charts, recent activity |
| `/admin/products` | Products | List with grid/list toggle, bulk actions, search |
| `/admin/products/new` | New Product | Create form with image upload |
| `/admin/products/[id]` | Edit Product | Edit form |
| `/admin/discounts` | Discounts | Flash sales, tiered discounts, bundle rules |
| `/admin/promo-codes` | Promo Codes | Create/manage promo codes with analytics |
| `/admin/models` | Phone Models | Manage models |
| `/admin/categories` | Categories | Manage categories |
| `/admin/orders` | Orders | Order list with status filters, search, export |
| `/admin/orders/[id]` | Order Detail | Full order view, status management, notes, WhatsApp reply |
| `/admin/customers` | Customers | Customer database by phone number |
| `/admin/settings` | Settings | All site settings |
| `/admin/activity` | Activity Log | Admin action history |

### 6.3 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/products` | GET | List products (with filters, search, sort) |
| `/api/products/[id]` | GET | Single product (increments view_count) |
| `/api/products/[id]/bundles` | GET | Get bundle recommendations for a product |
| `/api/models` | GET | List phone models |
| `/api/categories` | GET | List categories |
| `/api/search` | GET | Search products/models/categories |
| `/api/orders` | POST | Create order (from storefront checkout) |
| `/api/track` | GET | Track order by phone number |
| `/api/promo/validate` | POST | Validate promo code and return discount amount |
| `/api/social-proof` | GET | Get social proof data (view counts, order counts) |
| `/api/admin/auth` | POST | Login/logout |
| `/api/admin/dashboard` | GET | Dashboard analytics data |
| `/api/admin/products` | GET/POST | Admin: list/create products |
| `/api/admin/products/[id]` | GET/PUT/DELETE | Admin: manage single product |
| `/api/admin/products/import` | POST | Admin: CSV import products |
| `/api/admin/products/export` | GET | Admin: CSV export products |
| `/api/admin/models` | GET/POST/PUT/DELETE | Admin: CRUD phone models |
| `/api/admin/categories` | GET/POST/PUT/DELETE | Admin: CRUD categories |
| `/api/admin/orders` | GET | Admin: list orders with filters |
| `/api/admin/orders/[id]` | GET/PUT | Admin: update order status/notes |
| `/api/admin/orders/export` | GET | Admin: CSV export orders |
| `/api/admin/discounts` | GET/POST/PUT/DELETE | Admin: flash sales + tiered discounts |
| `/api/admin/promo-codes` | GET/POST/PUT/DELETE | Admin: promo code management |
| `/api/admin/promo-codes/[id]/stats` | GET | Admin: promo code usage stats |
| `/api/admin/promo-codes/bulk-generate` | POST | Admin: bulk generate promo codes |
| `/api/admin/customers` | GET | Admin: customer database |
| `/api/admin/settings` | GET/PUT | Admin: manage settings |
| `/api/admin/activity` | GET | Admin: activity log |
| `/api/admin/upload` | POST | Admin: file upload (product images) |

---

## 7. Component Architecture

### 7.1 Route Components

```
app/
├── layout.tsx                      # Root layout (fonts, providers, analytics)
├── page.tsx                        # Homepage
├── shop/
│   ├── page.tsx                    # All products grid + search + filters
│   └── [model]/
│       └── page.tsx                # Products for specific model
├── category/
│   └── [slug]/
│       └── page.tsx                # Products in category
├── track/
│   └── page.tsx                    # Order tracking
├── search/
│   └── page.tsx                    # Search results
├── admin/
│   ├── layout.tsx                  # Admin layout (sidebar, auth check)
│   ├── login/
│   │   └── page.tsx                # Login form
│   ├── page.tsx                    # Dashboard with analytics
│   ├── products/
│   │   ├── page.tsx                # Product list
│   │   ├── new/
│   │   │   └── page.tsx            # Create product
│   │   └── [id]/
│   │       └── page.tsx            # Edit product
│   ├── discounts/
│   │   └── page.tsx                # Flash sales + tiered discounts
│   ├── promo-codes/
│   │   ├── page.tsx                # Promo code list
│   │   └── [id]/
│   │       └── page.tsx            # Promo code detail/stats
│   ├── models/
│   │   └── page.tsx                # Manage models
│   ├── categories/
│   │   └── page.tsx                # Manage categories
│   ├── orders/
│   │   ├── page.tsx                # Order list
│   │   └── [id]/
│   │       └── page.tsx            # Order detail
│   ├── customers/
│   │   └── page.tsx                # Customer database
│   ├── settings/
│   │   └── page.tsx                # Site settings
│   └── activity/
│       └── page.tsx                # Activity log
```

### 7.2 Shared Components

```
components/
├── ui/
│   ├── button.tsx                  # Primary/secondary/ghost/CTA variants
│   ├── input.tsx                   # Form input with label/error
│   ├── select.tsx                  # Dropdown select
│   ├── checkbox.tsx                # Checkbox with label
│   ├── badge.tsx                   # Status/product badges
│   ├── modal.tsx                   # Modal dialog
│   ├── sheet.tsx                   # Bottom sheet (mobile)
│   ├── skeleton.tsx                # Loading skeleton
│   ├── toast.tsx                   # Toast notifications
│   ├── confirmation-dialog.tsx     # Confirm/deny dialog
│   ├── tooltip.tsx                 # Hover tooltip
│   ├── progress.tsx                # Progress bar (order status, scroll)
│   ├── separator.tsx               # Divider line
│   ├── avatar.tsx                  # User/admin avatar
│   ├── switch.tsx                  # Toggle switch
│   ├── tabs.tsx                    # Tab navigation
│   ├── dropdown-menu.tsx           # Dropdown menu
│   └── command-palette.tsx         # Search command palette (Cmd+K)
├── layout/
│   ├── header.tsx                  # Site header (logo, nav, search, cart)
│   ├── header-mobile.tsx           # Mobile header (hide on scroll down)
│   ├── footer.tsx                  # Site footer
│   ├── mobile-nav.tsx              # Bottom navigation (Home, Shop, Cart, Track)
│   ├── cart-sidebar.tsx            # Cart sidebar (desktop)
│   ├── cart-sheet.tsx              # Cart bottom sheet (mobile)
│   ├── admin-sidebar.tsx           # Admin sidebar navigation
│   ├── admin-header.tsx            # Admin top bar
│   └── scroll-progress.tsx         # Gold scroll progress bar
├── products/
│   ├── product-card.tsx            # Product card with tilt, badges, social proof
│   ├── product-card-dark.tsx       # Product card on dark background (featured)
│   ├── product-quick-view.tsx      # Quick view bottom sheet
│   ├── product-gallery.tsx         # Image gallery with swipe
│   ├── product-detail.tsx          # Full product detail view
│   ├── model-selector.tsx          # Phone model selection grid
│   ├── model-brand-filter.tsx      # Brand tabs (iPhone, Samsung, etc.)
│   ├── bundle-suggestion.tsx       # "Complete Your Protection" bundle sheet
│   ├── recently-viewed.tsx         # Recently viewed products row
│   ├── social-proof.tsx            # "X ordered today" / "Last sold Y ago"
│   └── product-skeleton.tsx        # Product card skeleton loader
├── cart/
│   ├── cart-bubble.tsx             # Floating cart indicator
│   ├── cart-sheet.tsx              # Expanded cart view
│   ├── cart-item.tsx               # Single cart item with swipe-to-remove
│   ├── checkout-form.tsx           # Name/phone/address form
│   ├── promo-code-input.tsx        # Promo code apply section
│   ├── order-summary.tsx           # Order review before WhatsApp
│   └── discount-breakdown.tsx      # Shows all applied discounts
├── search/
│   ├── search-bar.tsx              # Search input with autocomplete
│   ├── search-results.tsx          # Search results grid
│   └── search-suggestions.tsx      # Autocomplete dropdown
├── tracking/
│   ├── tracking-form.tsx           # Phone number input
│   ├── tracking-result.tsx         # Order status timeline
│   └── re-order-button.tsx         # Re-order from previous order
├── wishlist/
│   ├── wishlist-heart.tsx          # Heart toggle icon
│   └── wishlist-panel.tsx          # Wishlist section in cart sidebar
├── admin/
│   ├── dashboard/
│   │   ├── stats-cards.tsx         # Revenue, orders, avg value, promo usage
│   │   ├── revenue-chart.tsx       # Revenue trend line chart
│   │   ├── top-products.tsx        # Top products by revenue
│   │   ├── popular-models.tsx      # Popular models by order count
│   │   └── recent-orders.tsx       # Recent orders with quick actions
│   ├── products/
│   │   ├── product-form.tsx        # Product create/edit form
│   │   ├── product-table.tsx       # Product list table
│   │   ├── product-grid.tsx        # Product list grid view
│   │   ├── bulk-actions.tsx        # Bulk operations toolbar
│   │   ├── image-upload.tsx        # Drag-and-drop image upload
│   │   └── csv-import.tsx          # CSV import modal
│   ├── orders/
│   │   ├── order-table.tsx         # Order list table
│   │   ├── order-detail.tsx        # Full order view
│   │   ├── order-status-badge.tsx  # Status badge with color
│   │   ├── order-notes.tsx         # Internal notes
│   │   └── order-print.tsx         # Print-friendly packing slip
│   ├── discounts/
│   │   ├── flash-sale-form.tsx     # Flash sale create/edit
│   │   ├── tiered-discount-form.tsx # Tiered discount config
│   │   └── sale-list.tsx           # Active/upcoming/expired sales
│   ├── promo-codes/
│   │   ├── promo-code-form.tsx     # Create/edit promo code
│   │   ├── promo-code-table.tsx    # Promo code list
│   │   ├── promo-code-stats.tsx    # Usage analytics
│   │   └── bulk-generate.tsx       # Bulk code generator
│   ├── customers/
│   │   ├── customer-table.tsx      # Customer list
│   │   └── customer-detail.tsx     # Customer order history
│   ├── settings/
│   │   ├── settings-form.tsx       # Settings form
│   │   └── whatsapp-template.tsx   # WhatsApp message template editor
│   └── shared/
│       ├── data-table.tsx          # Reusable data table
│       ├── stats-card.tsx          # Dashboard stat card
│       ├── activity-log.tsx        # Activity log list
│       └── export-button.tsx       # CSV export button
├── brand/
│   ├── logo.tsx                    # CASELÉ logo component
│   ├── crown-icon.tsx              # Crown monogram icon
│   └── brand-footer.tsx            # Brand footer with social links
└── hooks/
    ├── use-cart.ts                  # Cart state hook
    ├── use-wishlist.ts              # Wishlist state hook
    ├── use-recently-viewed.ts       # Recently viewed hook
    ├── use-search.ts                # Search hook
    ├── use-social-proof.ts          # Social proof data hook
    ├── use-mobile.ts                # Mobile detection hook
    ├── use-scroll-position.ts       # Scroll position hook
    ├── use-magnetic.ts              # Magnetic button effect hook
    ├── use-tilt.ts                  # Card tilt effect hook
    └── use-haptic.ts                # Haptic feedback hook
```

### 7.3 Cart State (Zustand)

```typescript
interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  comparePrice?: number;
  modelId: string;
  modelName: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  promoDiscount: number;

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string, modelId: string) => void;
  updateQuantity: (productId: string, modelId: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setOpen: (open: boolean) => void;
  applyPromo: (code: string, discount: number) => void;
  removePromo: () => void;

  // Computed
  total: () => number;
  subtotal: () => number;
  itemCount: () => number;
  tierDiscount: () => number;
  applicableTier: () => { min: number; percent: number } | null;
}
```

### 7.4 Wishlist State (Zustand + localStorage)

```typescript
interface WishlistStore {
  items: string[]; // product IDs
  toggleItem: (productId: string) => void;
  hasItem: (productId: string) => boolean;
  clearWishlist: () => void;
  count: () => number;
}
```

### 7.5 Recently Viewed (localStorage)

```typescript
// lib/recently-viewed.ts
const MAX_ITEMS = 10;
const STORAGE_KEY = 'casele_recently_viewed';

export function addRecentlyViewed(productId: string): void;
export function getRecentlyViewed(): string[]; // Returns last 10 product IDs
export function clearRecentlyViewed(): void;
```

---

## 8. Responsive Design

### 8.1 Mobile (< 640px) — "Thumb Zone First"

- **Bottom navigation:** Home, Shop, Cart, Track (4 icons, thumb-reachable)
- **Product cards:** Full-width, large image, name + price below
- **Cart:** Bottom sheet, slides up from bottom
- **Checkout:** Full-screen form, large inputs, big CTA button
- **No sticky header** — hides on scroll down, shows on scroll up
- **Swipe gestures:** Swipe left/right on product images in gallery, swipe left on cart item to remove
- **Pull to refresh** on product grid
- **Long-press** on product card = quick add to cart
- **Sticky add-to-cart bar** appears when scrolling past product info

### 8.2 Tablet (640px - 1024px) — "Two-Column Comfort"

- **Top navigation:** Logo left, nav center, cart right
- **Product grid:** 2 columns
- **Cart:** Slide-in sidebar from right
- **Admin:** Collapsible sidebar

### 8.3 Desktop (> 1024px) — "Full Experience"

- **Product grid:** 3-4 columns with generous whitespace
- **Cart:** Persistent sidebar
- **Product hover:** Parallax tilt + gold border glow + magnetic CTA
- **Admin:** Full sidebar navigation
- **Keyboard shortcuts:** Arrow keys to navigate products, Enter to quick-add, / to search, Esc to close modals

### 8.4 Touch Optimization

- All tap targets minimum 44px × 44px (Apple HIG)
- No hover-only interactions — everything works with touch
- Haptic feedback on key actions (add to cart, checkout)
- Smooth momentum scrolling
- No 300ms tap delay (touch-action: manipulation)

---

## 9. Performance Requirements

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 95+ |
| Lighthouse Best Practices | 95+ |
| Lighthouse SEO | 95+ |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Cumulative Layout Shift | < 0.1 |
| First Input Delay | < 100ms |
| Time to Interactive | < 3s on 3G |

### 9.1 Image Strategy

- Product images served via Next.js `<Image>` with automatic optimization
- Admin uploads stored in Vercel Blob Storage
- Responsive `srcSet`: 400px, 800px, 1200px widths
- Blur placeholder for loading states (`blurDataURL` with tiny placeholder)
- Lazy load below-the-fold images
- WebP/AVIF format when supported

### 9.2 Caching Strategy

- Static pages (homepage, shop) cached at CDN level
- Product data cached with ISR (Incremental Static Regeneration) — 60s revalidation
- API responses cached for 30s (product listings)
- Cart state in localStorage (no server dependency)
- Search results cached for 10s

---

## 10. Security Considerations

1. **Admin auth:** NextAuth.js with secure session cookies, CSRF protection
2. **Input validation:** Zod schemas on all API routes — never trust client input
3. **SQL injection:** Drizzle ORM parameterizes all queries by default
4. **Image uploads:** Validate file type (jpg, png, webp only), max size 5MB, sanitize filenames
5. **Rate limiting:** Rate limiting on order creation (prevent spam), login attempts (brute force protection)
6. **No sensitive data in client:** Admin password hashes never exposed
7. **HTTPS only:** Vercel provides this by default
8. **Promo code abuse prevention:** Per-user limit, max uses, one-time-use codes
9. **XSS prevention:** React escapes by default; sanitize any user-generated content
10. **Order data:** Customer phone numbers hashed at rest (optional, admin can still search)

---

## 11. Error Handling

| Scenario | UX Treatment |
|----------|-------------|
| Product not found | Custom 404 with "Back to Shop" CTA and featured products |
| Image fails to load | Gold placeholder with CASELÉ crown icon |
| WhatsApp unavailable | Toast: "WhatsApp is unavailable. Save this number: [number]" |
| Cart localStorage unavailable | Degrade gracefully — cart works in session only |
| Admin login fails | Inline error: "Invalid email or password" |
| API error | Toast notification with retry option |
| Network offline | Banner: "You're offline. Some features may be limited." |
| Promo code invalid | Inline error in checkout: "This code is invalid or expired" |
| Promo code max used | Inline error: "This code has been used maximum times" |
| Search no results | "No cases found for '[query]' — try browsing by model instead" |
| Order tracking not found | "No orders found for this phone number" |
| Stock unavailable | Badge: "OUT OF STOCK" — Add button disabled |

---

## 12. SEO Strategy

### 12.1 Meta Tags

- Homepage: "CASELÉ — Premium Phone Cases | Protect. Express. Elevate."
- Product pages: "[Product Name] — CASELÉ | [Price]"
- Model pages: "Cases for [Model Name] — CASELÉ"
- Category pages: "[Category Name] Cases — CASELÉ"

### 12.2 Open Graph

Every product page includes OG tags:
- `og:title`: Product name + "— CASELÉ"
- `og:description`: Product description (first 160 chars)
- `og:image`: Primary product image
- `og:type`: "product"
- `og:price:amount`: Price
- `og:price:currency`: "INR"

### 12.3 Structured Data

Product pages include JSON-LD schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Midnight Black Premium Case",
  "image": ["url1", "url2"],
  "description": "...",
  "brand": { "@type": "Brand", "name": "CASELÉ" },
  "offers": {
    "@type": "Offer",
    "price": "799",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock"
  }
}
```

### 12.4 Technical SEO

- Sitemap.xml generated automatically
- Robots.txt allows all crawlers
- Canonical URLs on all pages
- Clean URL structure (/shop/iphone-15-pro-max/midnight-black-case)
- Image alt tags on all product images
- Next.js `<Head>` for meta tags

---

## 13. Phased Implementation

### Phase 1 — Core Storefront (MVP)
- Project setup: Next.js, Drizzle, Neon, Tailwind
- Database schema (all tables)
- Homepage: dark hero, model selector, featured products
- Product grid: filtering by model/category, search
- Product detail page with image gallery
- Cart: Zustand + localStorage, bottom sheet (mobile), sidebar (desktop)
- WhatsApp checkout: pre-filled message with order details
- Responsive layout (mobile-first)
- Dark/light mode toggle
- Recently viewed products
- Share product (Web Share API)

### Phase 2 — Discount & Promo System
- Per-product sale price display
- Tiered discount configuration + auto-apply
- Flash sale creation and countdown banner
- Promo code CRUD + validation
- Bundle discount rules
- Checkout: promo code input, discount breakdown, order summary
- Order summary review before WhatsApp

### Phase 3 — Enhanced Storefront
- Search with autocomplete
- Wishlist (localStorage)
- Bundle recommendations ("Complete Your Protection")
- Social proof ("X ordered today", "Last sold Y ago")
- Order tracking by phone number
- Sticky add-to-cart bar (mobile)
- Quick re-order from tracking page

### Phase 4 — Admin Panel
- Admin auth (NextAuth.js)
- Dashboard with full analytics (charts, stats, trends)
- Product CRUD with image upload, bulk actions, CSV import/export
- Phone model management
- Category management
- Order list with status pipeline, filters, search, export
- Order detail with notes, WhatsApp reply, print
- Customer database
- Activity log

### Phase 5 — Micro-Interactions & Polish
- Magnetic CTA button (desktop)
- Product card tilt effect (desktop)
- Gold border trace on hover
- Scroll progress bar
- Add-to-cart fly animation
- Price counter animation
- Staggered product reveal
- Haptic feedback (mobile)
- Pull to refresh (mobile)
- Swipe gestures (mobile)
- Skeleton loaders
- Toast notifications
- Keyboard shortcuts (desktop)

### Phase 6 — Launch Prep
- SEO: meta tags, Open Graph, structured data, sitemap
- Performance audit (Lighthouse 90+)
- Error boundaries
- Image optimization pass
- Admin: WhatsApp message templates
- Admin: auto-restock alerts
- Admin: bulk promo code generation
- Mobile touch interaction testing
- Cross-browser testing

---

## 14. Success Criteria

- [ ] Customer can go from homepage to WhatsApp order in ≤ 4 clicks
- [ ] No account creation required for purchasing
- [ ] Site scores 90+ on Lighthouse (all categories)
- [ ] Admin can add/edit/delete products without code changes
- [ ] Admin can manage discounts, promo codes, and flash sales
- [ ] Admin can manage order status pipeline
- [ ] Admin sees full analytics dashboard with charts
- [ ] WhatsApp message is correctly pre-filled with all order details + discount breakdown
- [ ] Responsive from 320px mobile to 1920px desktop
- [ ] No console errors in production
- [ ] Cart persists across page refreshes
- [ ] Wishlist persists across page refreshes
- [ ] Order tracking works without login
- [ ] Search returns relevant results
- [ ] Social proof displays accurate data
- [ ] Bundle suggestions appear after add-to-cart
- [ ] Promo codes validate correctly with usage limits
- [ ] Flash sales show countdown and apply automatically
- [ ] Tiered discounts apply based on cart total
- [ ] Dark/light mode works and preference is saved
- [ ] Micro-interactions feel smooth (60fps)
- [ ] All tap targets ≥ 44px on mobile
- [ ] Admin panel is password-protected
- [ ] CSV import/export works for products and orders
