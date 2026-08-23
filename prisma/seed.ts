import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || "admin@casele.co";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: "Admin",
    },
  });

  console.log(`✅ Admin user created: ${admin.email}`);

  // Create default categories
  const categories = [
    { name: "Classic Collection", slug: "classic", sortOrder: 1 },
    { name: "Premium Collection", slug: "premium", sortOrder: 2 },
    { name: "Sport Collection", slug: "sport", sortOrder: 3 },
    { name: "Designer Collection", slug: "designer", sortOrder: 4 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("✅ Categories created");

  // Create default phone models (Qatar popular devices)
  const phoneModels = [
    // iPhone (very popular in Qatar)
    { brand: "iPhone", modelName: "iPhone 15 Pro Max", slug: "iphone-15-pro-max" },
    { brand: "iPhone", modelName: "iPhone 15 Pro", slug: "iphone-15-pro" },
    { brand: "iPhone", modelName: "iPhone 15", slug: "iphone-15" },
    { brand: "iPhone", modelName: "iPhone 14 Pro Max", slug: "iphone-14-pro-max" },
    { brand: "iPhone", modelName: "iPhone 14 Pro", slug: "iphone-14-pro" },
    // Samsung (most popular Android in Qatar)
    { brand: "Samsung", modelName: "Samsung Galaxy S24 Ultra", slug: "samsung-galaxy-s24-ultra" },
    { brand: "Samsung", modelName: "Samsung Galaxy S24+", slug: "samsung-galaxy-s24-plus" },
    { brand: "Samsung", modelName: "Samsung Galaxy S24", slug: "samsung-galaxy-s24" },
    { brand: "Samsung", modelName: "Samsung Galaxy S23 Ultra", slug: "samsung-galaxy-s23-ultra" },
    { brand: "Samsung", modelName: "Samsung Galaxy Z Fold5", slug: "samsung-galaxy-z-fold5" },
    { brand: "Samsung", modelName: "Samsung Galaxy Z Flip5", slug: "samsung-galaxy-z-flip5" },
    // Huawei (very popular in Qatar/Middle East)
    { brand: "Huawei", modelName: "Huawei P60 Pro", slug: "huawei-p60-pro" },
    { brand: "Huawei", modelName: "Huawei Mate 60 Pro", slug: "huawei-mate-60-pro" },
    // OnePlus (growing in Qatar)
    { brand: "OnePlus", modelName: "OnePlus 12", slug: "oneplus-12" },
    { brand: "OnePlus", modelName: "OnePlus 11", slug: "oneplus-11" },
  ];

  for (const model of phoneModels) {
    await prisma.phoneModel.upsert({
      where: { slug: model.slug },
      update: {},
      create: model,
    });
  }

  console.log("✅ Phone models created");

  // Create default products
  const classicCat = await prisma.category.findUnique({ where: { slug: "classic" } });
  const premiumCat = await prisma.category.findUnique({ where: { slug: "premium" } });
  const sportCat = await prisma.category.findUnique({ where: { slug: "sport" } });
  const designerCat = await prisma.category.findUnique({ where: { slug: "designer" } });

  const iphone15Pro = await prisma.phoneModel.findUnique({ where: { slug: "iphone-15-pro" } });
  const iphone15ProMax = await prisma.phoneModel.findUnique({ where: { slug: "iphone-15-pro-max" } });
  const samsungS24 = await prisma.phoneModel.findUnique({ where: { slug: "samsung-galaxy-s24" } });
  const samsungS24Ultra = await prisma.phoneModel.findUnique({ where: { slug: "samsung-galaxy-s24-ultra" } });
  const pixel8Pro = await prisma.phoneModel.findUnique({ where: { slug: "google-pixel-8-pro" } });
  const iphone15 = await prisma.phoneModel.findUnique({ where: { slug: "iphone-15" } });

  const products = [
    {
      name: "Midnight Black Premium Case", slug: "midnight-black-premium-case",
      description: "Crafted from premium materials, this case offers exceptional protection without compromising on style. The midnight black finish adds a touch of sophistication to your device.",
      price: 79, comparePrice: 99, images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1603313011110-adc0e1b40ee3?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&auto=format"],
      badge: "bestseller", isFeatured: true, categoryId: premiumCat?.id,
    },
    {
      name: "Gold Edge Luxe Case", slug: "gold-edge-luxe-case",
      description: "A statement piece for those who appreciate the finer things. Gold accents frame this premium case, making your device stand out from the crowd.",
      price: 129, comparePrice: null, images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1603313011110-adc0e1b40ee3?w=800&q=80&auto=format"],
      badge: "new", isFeatured: true, categoryId: premiumCat?.id,
    },
    {
      name: "Royal Blue Classic Case", slug: "royal-blue-classic-case",
      description: "Classic design meets modern protection. The deep royal blue color gives your phone a regal look while keeping it safe from daily wear.",
      price: 59, comparePrice: 79, images: ["https://images.unsplash.com/photo-1616400619175-5beda3a17896?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80&auto=format"],
      badge: "sale", isFeatured: false, categoryId: classicCat?.id,
    },
    {
      name: "Matte Carbon Fiber Case", slug: "matte-carbon-fiber-case",
      description: "Lightweight yet incredibly strong. The carbon fiber texture adds a sporty, tech-forward aesthetic to your device.",
      price: 89, comparePrice: null, images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&auto=format"],
      badge: null, isFeatured: true, categoryId: sportCat?.id,
    },
    {
      name: "Clear Crystal Case", slug: "clear-crystal-case",
      description: "Show off your phone's original design while keeping it protected. Crystal clear, anti-yellowing material.",
      price: 49, comparePrice: null, images: ["https://images.unsplash.com/photo-1603313011110-adc0e1b40ee3?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&auto=format"],
      badge: null, isFeatured: false, categoryId: classicCat?.id,
    },
    {
      name: "Rose Gold Slim Case", slug: "rose-gold-slim-case",
      description: "Ultra-slim profile with a stunning rose gold finish. Elegant protection that slips easily into your pocket.",
      price: 69, comparePrice: 89, images: ["https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&auto=format"],
      badge: "sale", isFeatured: false, categoryId: designerCat?.id,
    },
    {
      name: "Forest Green Leather Case", slug: "forest-green-leather-case",
      description: "Premium leather with a rich forest green hue. Ages beautifully over time, developing a unique patina.",
      price: 119, comparePrice: null, images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80&auto=format"],
      badge: "new", isFeatured: true, categoryId: premiumCat?.id,
    },
    {
      name: "Matte Black Armor Case", slug: "matte-black-armor-case",
      description: "Maximum protection with a tactical look. Reinforced corners and raised edges for ultimate device safety.",
      price: 99, comparePrice: null, images: ["https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1603313011110-adc0e1b40ee3?w=800&q=80&auto=format", "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80&auto=format"],
      badge: "bestseller", isFeatured: true, categoryId: sportCat?.id,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        comparePrice: product.comparePrice,
        images: product.images,
        badge: product.badge,
        isFeatured: product.isFeatured,
        categoryId: product.categoryId,
      },
    });

    // Link to phone models
    const modelLinks: { productId: string; modelId: string; stock: number }[] = [];
    if (product.slug === "midnight-black-premium-case" && iphone15Pro && iphone15ProMax && samsungS24) {
      modelLinks.push(
        { productId: created.id, modelId: iphone15Pro.id, stock: 50 },
        { productId: created.id, modelId: iphone15ProMax.id, stock: 30 },
        { productId: created.id, modelId: samsungS24.id, stock: 20 },
      );
    } else if (product.slug === "gold-edge-luxe-case" && iphone15ProMax && iphone15Pro) {
      modelLinks.push(
        { productId: created.id, modelId: iphone15ProMax.id, stock: 25 },
        { productId: created.id, modelId: iphone15Pro.id, stock: 25 },
      );
    } else if (product.slug === "royal-blue-classic-case" && samsungS24 && samsungS24Ultra && iphone15) {
      modelLinks.push(
        { productId: created.id, modelId: samsungS24.id, stock: 40 },
        { productId: created.id, modelId: samsungS24Ultra.id, stock: 20 },
        { productId: created.id, modelId: iphone15.id, stock: 15 },
      );
    } else if (product.slug === "matte-carbon-fiber-case" && pixel8Pro && iphone15Pro) {
      modelLinks.push(
        { productId: created.id, modelId: pixel8Pro.id, stock: 30 },
        { productId: created.id, modelId: iphone15Pro.id, stock: 20 },
      );
    } else if (product.slug === "clear-crystal-case" && iphone15Pro && iphone15 && samsungS24) {
      modelLinks.push(
        { productId: created.id, modelId: iphone15Pro.id, stock: 60 },
        { productId: created.id, modelId: iphone15.id, stock: 40 },
        { productId: created.id, modelId: samsungS24.id, stock: 30 },
      );
    } else if (product.slug === "rose-gold-slim-case" && samsungS24Ultra && iphone15ProMax) {
      modelLinks.push(
        { productId: created.id, modelId: samsungS24Ultra.id, stock: 35 },
        { productId: created.id, modelId: iphone15ProMax.id, stock: 20 },
      );
    } else if (product.slug === "forest-green-leather-case" && iphone15ProMax && iphone15Pro) {
      modelLinks.push(
        { productId: created.id, modelId: iphone15ProMax.id, stock: 15 },
        { productId: created.id, modelId: iphone15Pro.id, stock: 15 },
      );
    } else if (product.slug === "matte-black-armor-case" && pixel8Pro && samsungS24Ultra && iphone15Pro) {
      modelLinks.push(
        { productId: created.id, modelId: pixel8Pro.id, stock: 25 },
        { productId: created.id, modelId: samsungS24Ultra.id, stock: 20 },
        { productId: created.id, modelId: iphone15Pro.id, stock: 30 },
      );
    }

    for (const link of modelLinks) {
      await prisma.productModel.upsert({
        where: { productId_modelId: { productId: link.productId, modelId: link.modelId } },
        update: {},
        create: link,
      });
    }
  }

  console.log("✅ Products created and linked to models");

  // Create default settings (Qatar)
  const defaultSettings = [
    { key: "store_name", value: "CASELÉ" },
    { key: "store_email", value: "info@casele.qa" },
    { key: "store_phone", value: "+974XXXXXXXX" },
    { key: "whatsapp_number", value: "+97455364455" },
    { key: "currency", value: "QAR" },
    { key: "currency_symbol", value: "QR" },
    { key: "tax_rate", value: "0" }, // Qatar has no sales tax
    { key: "country", value: "Qatar" },
    { key: "city", value: "Doha" },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Settings created");

  console.log("\n🎉 Seed complete!");
  console.log(`\n📧 Admin login: ${adminEmail}`);
  console.log(`🔑 Admin password: ${adminPassword}`);
  console.log("\n⚠️  Change the admin password in production!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
