export const PRODUCTS = [
  {
    id: "1",
    name: "Midnight Black Premium Case",
    slug: "midnight-black-premium-case",
    description: "Crafted from premium materials, this case offers exceptional protection without compromising on style. The midnight black finish adds a touch of sophistication to your device.",
    price: "799",
    comparePrice: "999",
    images: ["/images/products/midnight-black.svg"],
    badge: "bestseller",
    isFeatured: true,
    categoryId: "cat-2",
    categoryName: "Premium",
    modelSlug: "iphone-15-pro",
    modelName: "iPhone 15 Pro",
    viewCount: 234,
    orderCount: 89,
    lastSoldAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    models: [
      { id: "m1", name: "iPhone 15 Pro", slug: "iphone-15-pro" },
      { id: "m2", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max" },
      { id: "m3", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24" },
    ],
  },
  {
    id: "2",
    name: "Gold Edge Luxe Case",
    slug: "gold-edge-luxe-case",
    description: "A statement piece for those who appreciate the finer things. Gold accents frame this premium case, making your device stand out from the crowd.",
    price: "1299",
    comparePrice: null,
    images: ["/images/products/gold-edge.svg"],
    badge: "new",
    isFeatured: true,
    categoryId: "cat-2",
    categoryName: "Premium",
    modelSlug: "iphone-15-pro-max",
    modelName: "iPhone 15 Pro Max",
    viewCount: 156,
    orderCount: 34,
    lastSoldAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    models: [
      { id: "m1", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max" },
      { id: "m2", name: "iPhone 15 Pro", slug: "iphone-15-pro" },
    ],
  },
  {
    id: "3",
    name: "Royal Blue Classic Case",
    slug: "royal-blue-classic-case",
    description: "Classic design meets modern protection. The deep royal blue color gives your phone a regal look while keeping it safe from daily wear.",
    price: "599",
    comparePrice: "799",
    images: ["/images/products/royal-blue.svg"],
    badge: "sale",
    isFeatured: false,
    categoryId: "cat-1",
    categoryName: "Classic",
    modelSlug: "samsung-galaxy-s24",
    modelName: "Samsung Galaxy S24",
    viewCount: 189,
    orderCount: 67,
    lastSoldAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    models: [
      { id: "m1", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24" },
      { id: "m2", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra" },
      { id: "m3", name: "iPhone 15", slug: "iphone-15" },
    ],
  },
  {
    id: "4",
    name: "Matte Carbon Fiber Case",
    slug: "matte-carbon-fiber-case",
    description: "Lightweight yet incredibly strong. The carbon fiber texture adds a sporty, tech-forward aesthetic to your device.",
    price: "899",
    comparePrice: null,
    images: ["/images/products/carbon-fiber.svg"],
    badge: null,
    isFeatured: true,
    categoryId: "cat-3",
    categoryName: "Sport",
    modelSlug: "google-pixel-8-pro",
    modelName: "Google Pixel 8 Pro",
    viewCount: 145,
    orderCount: 45,
    lastSoldAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    models: [
      { id: "m1", name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro" },
      { id: "m2", name: "iPhone 15 Pro", slug: "iphone-15-pro" },
    ],
  },
  {
    id: "5",
    name: "Clear Crystal Case",
    slug: "clear-crystal-case",
    description: "Show off your phone's original design while keeping it protected. Crystal clear, anti-yellowing material.",
    price: "499",
    comparePrice: null,
    images: ["/images/products/clear-crystal.svg"],
    badge: null,
    isFeatured: false,
    categoryId: "cat-1",
    categoryName: "Classic",
    modelSlug: "iphone-15-pro",
    modelName: "iPhone 15 Pro",
    viewCount: 210,
    orderCount: 112,
    lastSoldAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    models: [
      { id: "m1", name: "iPhone 15 Pro", slug: "iphone-15-pro" },
      { id: "m2", name: "iPhone 15", slug: "iphone-15" },
      { id: "m3", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24" },
    ],
  },
  {
    id: "6",
    name: "Rose Gold Slim Case",
    slug: "rose-gold-slim-case",
    description: "Ultra-slim profile with a stunning rose gold finish. Elegant protection that slips easily into your pocket.",
    price: "699",
    comparePrice: "899",
    images: ["/images/products/rose-gold.svg"],
    badge: "sale",
    isFeatured: false,
    categoryId: "cat-4",
    categoryName: "Designer",
    modelSlug: "samsung-galaxy-s24-ultra",
    modelName: "Samsung Galaxy S24 Ultra",
    viewCount: 167,
    orderCount: 52,
    lastSoldAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    models: [
      { id: "m1", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra" },
      { id: "m2", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max" },
    ],
  },
  {
    id: "7",
    name: "Forest Green Leather Case",
    slug: "forest-green-leather-case",
    description: "Premium leather with a rich forest green hue. Ages beautifully over time, developing a unique patina.",
    price: "1199",
    comparePrice: null,
    images: ["/images/products/forest-green.svg"],
    badge: "new",
    isFeatured: true,
    categoryId: "cat-2",
    categoryName: "Premium",
    modelSlug: "iphone-15-pro-max",
    modelName: "iPhone 15 Pro Max",
    viewCount: 98,
    orderCount: 23,
    lastSoldAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    models: [
      { id: "m1", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max" },
      { id: "m2", name: "iPhone 15 Pro", slug: "iphone-15-pro" },
    ],
  },
  {
    id: "8",
    name: "Matte Black Armor Case",
    slug: "matte-black-armor-case",
    description: "Maximum protection with a tactical look. Reinforced corners and raised edges for ultimate device safety.",
    price: "999",
    comparePrice: null,
    images: ["/images/products/matte-black.svg"],
    badge: "bestseller",
    isFeatured: true,
    categoryId: "cat-3",
    categoryName: "Sport",
    modelSlug: "google-pixel-8-pro",
    modelName: "Google Pixel 8 Pro",
    viewCount: 178,
    orderCount: 61,
    lastSoldAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    models: [
      { id: "m1", name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro" },
      { id: "m2", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra" },
      { id: "m3", name: "iPhone 15 Pro", slug: "iphone-15-pro" },
    ],
  },
];

export const MODELS = [
  { id: "1", brand: "iPhone", name: "iPhone 15 Pro Max", slug: "iphone-15-pro-max", count: 4 },
  { id: "2", brand: "iPhone", name: "iPhone 15 Pro", slug: "iphone-15-pro", count: 6 },
  { id: "3", brand: "iPhone", name: "iPhone 15", slug: "iphone-15", count: 2 },
  { id: "4", brand: "Samsung", name: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra", count: 3 },
  { id: "5", brand: "Samsung", name: "Samsung Galaxy S24", slug: "samsung-galaxy-s24", count: 4 },
  { id: "6", brand: "Google", name: "Google Pixel 8 Pro", slug: "google-pixel-8-pro", count: 3 },
];

export const CATEGORIES = [
  { id: "cat-1", name: "Classic", slug: "classic", description: "Timeless elegance", count: 2 },
  { id: "cat-2", name: "Premium", slug: "premium", description: "Luxury materials", count: 3 },
  { id: "cat-3", name: "Sport", slug: "sport", description: "Active lifestyle", count: 2 },
  { id: "cat-4", name: "Designer", slug: "designer", description: "Limited editions", count: 1 },
];

export const ORDERS = [
  { id: "ORD-248", customer: "John D.", phone: "9876543210", items: [{ name: "Midnight Black Case", model: "iPhone 15 Pro", qty: 1, price: 799 }], total: 1299, status: "pending", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), address: "Mumbai, Maharashtra" },
  { id: "ORD-247", customer: "Sarah M.", phone: "9876543211", items: [{ name: "Gold Edge Luxe", model: "iPhone 15 Pro Max", qty: 1, price: 1299 }], total: 499, status: "confirmed", createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), address: "Delhi" },
  { id: "ORD-246", customer: "Alex K.", phone: "9876543212", items: [{ name: "Royal Blue Classic", model: "Samsung S24", qty: 1, price: 599 }], total: 899, status: "dispatched", createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), address: "Bangalore" },
  { id: "ORD-245", customer: "Priya S.", phone: "9876543213", items: [{ name: "Clear Crystal", model: "iPhone 15 Pro", qty: 1, price: 499 }], total: 799, status: "delivered", createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), address: "Chennai" },
  { id: "ORD-244", customer: "Rahul V.", phone: "9876543214", items: [{ name: "Matte Black Armor", model: "Pixel 8 Pro", qty: 1, price: 999 }], total: 2199, status: "confirmed", createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), address: "Pune" },
  { id: "ORD-243", customer: "Neha G.", phone: "9876543215", items: [{ name: "Forest Green Leather", model: "iPhone 15 Pro Max", qty: 1, price: 1199 }], total: 1098, status: "pending", createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), address: "Hyderabad" },
];

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getProductsByModel(modelSlug: string) {
  return PRODUCTS.filter((p) => p.modelSlug === modelSlug || p.models.some((m) => m.slug === modelSlug));
}

export function getProductsByCategory(categorySlug: string) {
  return PRODUCTS.filter((p) => p.categoryName.toLowerCase() === categorySlug);
}

export function getFeaturedProducts() {
  return PRODUCTS.filter((p) => p.isFeatured);
}

export function getOrdersByPhone(phone: string) {
  return ORDERS.filter((o) => o.phone === phone);
}
