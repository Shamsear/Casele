# CASELÉ Full Audit — vs. the Global E-Commerce Landscape

**Date:** August 24, 2026
**Scope:** Every page, component, API route, store, hook, and data layer
**Comparison targets:** Casetify, dbrand, Spigen, OtterBox, Amazon, Shopify phone case stores

---

## What's Genuinely Good

### Visual Identity (⭐⭐⭐⭐)
The black + gold + Cormorant Garamond palette is cohesive, premium, and distinctive. It reads as luxury on par with Casetify or dbrand. The `font-display` / `font-body` separation, gold gradient accents, and dark theme all work.

### SEO Infrastructure (⭐⭐⭐⭐)
LocalBusiness, Organization, Website, FAQ, Breadcrumb, and Product structured data — more than most Shopify stores ship with. The geo-targeting metadata for Qatar is a nice touch.

### Admin Panel Scope (⭐⭐⭐)
Dashboard, Products, Orders, Customers, Discounts (flash sales + tiers), Promo Codes, Models, Categories, Settings, Activity Log — covers the operational surface area of a real store. Settings page with live WhatsApp number and feature toggles (social proof, flash sale banner, bundle suggestions) is smart.

### Smart Micro-interactions
- Cmd+K search modal
- Scroll progress bar
- Announcement bar with rotating messages
- Haptic feedback on add-to-cart
- Cart drawer with escape-to-close and body scroll lock
- Skeleton loading states

### WhatsApp Checkout Flow
Building a structured order message and deep-linking to wa.me is a pragmatic solution for the Qatar market where WhatsApp is the primary communication channel.

### Discount Engine
Four levers: tiered discounts, promo codes, flash sales, and product bundles — more than many Shopify stores configure.

---

## Critical Issues

### 1. The Entire Storefront Uses Hardcoded Fake Data

`src/lib/data.ts` contains 8 hardcoded products, 6 hardcoded models, 4 hardcoded categories, and 6 hardcoded orders. Every storefront page — homepage, shop, model pages, category pages, search, track orders — reads from this static JSON. The Prisma schema and database exist but are completely unused on the storefront.

The admin panel can create products, but the storefront will never show them.

### 2. Product Detail Page Defaults to Wrong Product

```typescript
const [product, setProduct] = useState(PRODUCTS[0]); // Always starts with Midnight Black
```

If someone navigates to `/shop/iphone-15-pro/gold-edge-luxe-case`, they briefly see Midnight Black before the effect runs and swaps it. The wrong product, wrong price, wrong images flash on screen.

### 3. ProductCard Renders Phone SVG, Not Actual Image

The `ProductCard` used on the shop page, model pages, and category pages never renders the product image. It shows a generic phone outline. The homepage's `ProductCardHome` does render images, but the main shopping flow doesn't.

### 4. Search Page Is Fake

The search page (`/search`) has a hardcoded `SAMPLE_PRODUCTS` array with a single entry. The `SearchBar` component filters `PRODUCTS` from `data.ts` client-side, but the dedicated `/search?q=` page ignores the query entirely.

### 5. Order Tracking Uses setTimeout — It's a Demo

```typescript
setTimeout(() => {
  setOrders(getOrdersByPhone(phone.trim()));
  setLoading(false);
}, 800);
```

Real tracking hits an API. This reads from an in-memory array.

### 6. API Doesn't Save Orders

```typescript
const orderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
return NextResponse.json({ success: true, orderId, order: validated });
```

Orders are validated with Zod but never persisted. The `orderId` is generated but never stored.

### 7. Currency Inconsistency

- `formatPrice` formats as QAR (Qatar Riyal)
- Flash sale banner displays `₹${discountValue} OFF` (Indian Rupee)
- Homepage hero shows "QR 79" (looks like QR code, not Qatar Riyal)
- Data has Indian city names (Mumbai, Delhi, Bangalore) mixed with Qatar branding

### 8. Admin Dashboard Is Entirely Fake Data

Hardcoded revenue (QR 8,942), hardcoded orders, a chart made of `Math.random()` bars, and hardcoded top products. Only the Settings page actually talks to the database.

---

## Missing Features (vs. Competitors)

### Feature Comparison Table

| Feature | Casetify | dbrand | Spigen | CASELÉ |
|---------|----------|--------|--------|--------|
| Product reviews/ratings | ✅ | ✅ | ✅ | ❌ |
| Product image gallery (multiple angles) | ✅ | ✅ | ✅ | ❌ |
| Real checkout (not WhatsApp redirect) | ✅ | ✅ | ✅ | ❌ |
| Account/login for customers | ✅ | ✅ | ✅ | ❌ |
| Email order confirmations | ✅ | ✅ | ✅ | ❌ |
| About Us page | ✅ | ✅ | ✅ | ❌ |
| Contact page | ✅ | ✅ | ✅ | ❌ |
| FAQ page (visible, not just schema) | ✅ | ✅ | ✅ | ❌ |
| Privacy Policy / Terms | ✅ | ✅ | ✅ | ❌ |
| Related products / "You may also like" | ✅ | ✅ | ✅ | ❌ |
| Size guide / compatibility checker | ✅ | ✅ | ❌ | ❌ |
| Blog/content marketing | ✅ | ✅ | ✅ | ❌ |
| Social media feed integration | ✅ | ❌ | ❌ | ❌ |
| Newsletter signup | ✅ | ✅ | ✅ | ❌ |
| Back-in-stock notifications | ✅ | ❌ | ❌ | ❌ |
| Quantity selector on product cards | ❌ | ❌ | ❌ | ✅ |
| Cart persistence across sessions | ✅ | ✅ | ✅ | ✅ |

### Specific UX Gaps

- **No related products section** on the product detail page — competitors show 4-6 "You may also like" products, which drives 10-30% of revenue.
- **No "Recently Viewed" section** — `recently-viewed.ts` utility exists but is never displayed anywhere.
- **No customer accounts** — wishlist is localStorage-only and lost across devices.
- **No product reviews** — social proof is faked with "👀 234 people viewed this" from static data.
- **No size/compatibility guide** — "Will this fit my phone?" is the #1 question for phone cases.
- **No real images** — product images are SVGs. No lifestyle photos, no on-device mockups, no 360° views.
- **No "add to cart" animation** — competitors have a flying product animation.
- **No sticky "Add to Cart" on mobile** — on a long product page, the CTA scrolls away.

---

## Architectural Concerns

### Everything Is Client-Side Rendered
Every page is `"use client"`. No server components on the storefront. This means:
- No SSR/SEO for product pages (Google sees an empty div initially)
- No ISR for product pages
- Larger JavaScript bundle sent to the client
- Slower initial page load

Next.js 16 with App Router is designed for server components. The project uses none of them on the storefront.

### Middleware Is Deprecated
Next.js 16 has deprecated `middleware.ts` in favor of the `proxy` convention. The build warning says this explicitly.

### Prisma + Drizzle Coexistence
Both `prisma` and `drizzle-kit` / `drizzle-orm` in dependencies. The schema is Prisma, but Drizzle config exists. This is confusion waiting to happen.

### No Image Optimization Strategy
Products use `next/image` but with hardcoded SVG paths. No responsive image sets, no blur placeholders, no WebP/AVIF generation.

---

## Comparison with Best-in-Class

### vs. Casetify (Phone Case Market Leader)
Casetify has product customization, real reviews with photos, a design-your-own flow, influencer collaborations, and a blog. CASELÉ has none of these but has a cleaner, more minimalist design. Casetify's visual clutter vs. CASELÉ's restraint is actually a strength — but only if the products were real.

### vs. dbrand (Design-Forward Competitor)
dbrand is known for witty copy and ultra-clean product pages. CASELÉ's brand voice ("Protect. Express. Elevate.") is solid but generic. dbrand's product pages are fast, server-rendered, and have real images. CASELÉ's product pages flash the wrong content.

### vs. Shopify Phone Case Stores (Typical Competitor)
Most Shopify stores using themes like Prestige or Dawn have: real products, real checkout, real reviews, real images, and work out of the box. CASELÉ has better code quality and a more custom design, but less functionality.

---

## Summary Ratings

| Dimension | Rating | Notes |
|-----------|--------|-------|
| Visual Design | ⭐⭐⭐⭐ | Premium, cohesive, distinctive. Top 10% of indie e-commerce. |
| Brand Identity | ⭐⭐⭐ | Name, colors, typography work. Copy could be sharper. |
| SEO Foundation | ⭐⭐⭐⭐ | Structured data is excellent. But no SSR means Google sees empty pages. |
| Admin Panel | ⭐⭐⭐ | Comprehensive UI, but all fake data. Only Settings connects to DB. |
| Product Discovery | ⭐⭐ | Search, filters, and categories exist but rely on hardcoded data. |
| Product Detail Page | ⭐⭐ | Good layout, but wrong default product, no reviews, no related items. |
| Cart & Checkout | ⭐⭐⭐ | Tiered discounts + WhatsApp flow is clever. But no real checkout. |
| Mobile UX | ⭐⭐⭐ | Bottom nav, cart drawer, haptic feedback. Missing sticky CTA. |
| Data Layer | ⭐ | Everything is hardcoded. Database exists but isn't used. |
| Production Readiness | ⭐ | No real data, no real orders, no real tracking, no emails. |

---

## Recommended Priority Roadmap

### Phase 1: Data Layer (Highest Impact)
- [ ] Connect storefront to Prisma database (replace hardcoded data.ts)
- [ ] Make product pages server-rendered for SEO
- [ ] Wire up the orders API to actually persist to database
- [ ] Make order tracking hit the real database

### Phase 2: Missing Pages
- [ ] About Us page
- [ ] Contact page
- [ ] FAQ page (visible content, not just schema)
- [ ] Privacy Policy
- [ ] Terms of Service

### Phase 3: Product Experience
- [ ] Real product images (replace SVGs)
- [ ] Product image gallery with multiple angles
- [ ] Related products / "You may also like"
- [ ] Recently Viewed products section
- [ ] Sticky mobile add-to-cart bar
- [ ] Product reviews and ratings system

### Phase 4: Conversion Optimization
- [ ] Real flash sale countdown (connected to DB)
- [ ] Low stock warnings
- [ ] Newsletter signup
- [ ] Customer accounts (persistent wishlist, order history)
- [ ] Email order confirmations

### Phase 5: Architecture Cleanup
- [ ] Migrate storefront to server components
- [ ] Remove deprecated middleware, use proxy convention
- [ ] Remove Drizzle (unused, Prisma is the ORM)
- [ ] Fix currency consistency (QAR everywhere)
- [ ] Add proper error boundaries and loading states
