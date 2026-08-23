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
