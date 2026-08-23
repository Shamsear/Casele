import { formatPrice } from "./utils";

interface WhatsAppItem {
  name: string;
  model: string;
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

  lines.push("CASELÉ Order");
  lines.push("");
  lines.push(`Name: ${order.customerName}`);
  lines.push(`Phone: ${order.customerPhone}`);
  lines.push(
    `Address: ${order.address || "Not provided — please confirm with customer"}`
  );
  lines.push("");
  lines.push("Items:");

  for (const item of order.items) {
    lines.push(
      `• ${item.name} (${item.model}) × ${item.qty} — ${formatPrice(item.price)}`
    );
  }

  lines.push("");
  lines.push(`Subtotal: ${formatPrice(order.subtotal)}`);

  if (order.tierDiscount > 0) {
    lines.push(`Tier discount: -${formatPrice(order.tierDiscount)}`);
  }
  if (order.flashDiscount > 0) {
    lines.push(`Flash sale: -${formatPrice(order.flashDiscount)}`);
  }
  if (order.bundleDiscount > 0) {
    lines.push(`Bundle discount: -${formatPrice(order.bundleDiscount)}`);
  }
  if (order.promoDiscount > 0) {
    lines.push(
      `Promo (${order.promoCode}): -${formatPrice(order.promoDiscount)}`
    );
  }

  lines.push("─────────────");
  lines.push(`Total: ${formatPrice(order.total)}`);
  lines.push("");
  lines.push("Thank you for choosing CASELÉ!");

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
