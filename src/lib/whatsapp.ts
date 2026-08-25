import { formatPrice } from "./utils";

interface WhatsAppItem {
  name: string;
  model: string;
  finish?: string;
  caseType?: string;
  qty: number;
  price: number;
}

interface WhatsAppOrder {
  customerName: string;
  customerPhone: string;
  address?: string;
  items: WhatsAppItem[];
  subtotal: number;
  tierDiscount: number;
  flashDiscount: number;
  bundleDiscount: number;
  promoDiscount: number;
  promoCode?: string;
  total: number;
}

export function buildWhatsAppMessage(order: WhatsAppOrder): string {
  const lines: string[] = [];

  lines.push("👑 *CASELÉ ATELIER DOHA — ORDER REQUEST*");
  lines.push("");
  lines.push(`👤 *Client:* ${order.customerName}`);
  lines.push(`📱 *Contact:* ${order.customerPhone}`);
  lines.push(
    `📍 *Delivery Location:* ${order.address || "Doha, Qatar (Please confirm area/zone)"}`
  );
  lines.push("");
  lines.push("📦 *Selected Enclosures:*");

  for (const item of order.items) {
    const specs = [
      item.model,
      item.finish ? `${item.finish} Finish` : null,
      item.caseType || null,
    ].filter(Boolean).join(" • ");

    lines.push(
      `• *${item.name}* [${specs}] × ${item.qty} — ${formatPrice(item.price)}`
    );
  }

  lines.push("");
  lines.push(`💵 *Subtotal:* ${formatPrice(order.subtotal)}`);

  if (order.tierDiscount > 0) {
    lines.push(`✨ *Tier Bundle Savings:* -${formatPrice(order.tierDiscount)}`);
  }
  if (order.flashDiscount > 0) {
    lines.push(`⚡ *Flash Promotion:* -${formatPrice(order.flashDiscount)}`);
  }
  if (order.bundleDiscount > 0) {
    lines.push(`🎁 *Bundle Discount:* -${formatPrice(order.bundleDiscount)}`);
  }
  if (order.promoDiscount > 0) {
    lines.push(
      `🏷️ *Promo Code (${order.promoCode}):* -${formatPrice(order.promoDiscount)}`
    );
  }

  lines.push("─────────────");
  lines.push(`💎 *Total Due:* ${formatPrice(order.total)}`);
  lines.push("");
  lines.push("🚀 *Delivery Guarantee:* Doha Express (Same-Day / 24H Dispatch)");
  lines.push("💳 *Payment:* Cash on Delivery / Direct Transfer");
  lines.push("");
  lines.push("Thank you for choosing CASELÉ Luxury Enclosures.");

  return lines.join("\n");
}

export function openWhatsApp(
  phoneNumber: string,
  message: string
): void {
  const encoded = encodeURIComponent(message);
  const url = `https://wa.me/${phoneNumber}?text=${encoded}`;

  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

export function getWhatsAppUrl(
  phoneNumber: string,
  message: string
): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}
