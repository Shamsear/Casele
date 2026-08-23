import { SITE } from "@/lib/seo";

interface ProductStructuredDataProps {
  name: string;
  description: string;
  price: string;
  currency?: string;
  images: string[];
  availability?: "InStock" | "OutOfStock";
  url?: string;
}

/**
 * Sanitize string for safe insertion into JSON-LD
 */
function sanitize(str: string): string {
  return str
    .replace(/[<>]/g, "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

/**
 * Product JSON-LD structured data
 * Shows product info, price, and availability in Google search results
 */
export function ProductStructuredData({
  name,
  description,
  price,
  currency = "QAR",
  images,
  availability = "InStock",
  url,
}: ProductStructuredDataProps) {
  const sanitizedData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: sanitize(name),
    image: images.map(sanitize),
    description: sanitize(description),
    brand: {
      "@type": "Brand",
      name: "CASELÉ",
    },
    offers: {
      "@type": "Offer",
      url: url || SITE.url,
      priceCurrency: currency,
      price: sanitize(price),
      availability: `https://schema.org/${availability}`,
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: SITE.name,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "QA",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(sanitizedData) }}
    />
  );
}
