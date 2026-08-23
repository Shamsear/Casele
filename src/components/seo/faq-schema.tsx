interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

/**
 * FAQ JSON-LD structured data
 * Shows FAQ rich results in Google search
 */
export function FAQSchema({ faqs }: FAQSchemaProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Default FAQ content for CASELÉ
 */
export const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "Do you deliver phone cases in Qatar?",
    answer:
      "Yes! We deliver premium phone cases all across Qatar, including Doha, Al Wakrah, Al Khor, and all other cities. Fast delivery within 1-2 days.",
  },
  {
    question: "How do I order a phone case from CASELÉ?",
    answer:
      "Simply browse our collection, pick your case and phone model, then place your order via WhatsApp. We'll confirm and deliver to your doorstep.",
  },
  {
    question: "What phone models do you support?",
    answer:
      "We offer cases for iPhone 15 Pro Max, iPhone 15 Pro, iPhone 15, iPhone 14 Pro Max, Samsung Galaxy S24 Ultra, S24+, S24, S23 Ultra, Z Fold5, Huawei P60 Pro, Mate 60 Pro, OnePlus 12, and more.",
  },
  {
    question: "Are CASELÉ phone cases protective?",
    answer:
      "Absolutely. All our cases use military-grade materials engineered for maximum protection while maintaining a premium, stylish design.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We offer cash on delivery and WhatsApp-based payment. Simply order on WhatsApp and choose your preferred payment method.",
  },
  {
    question: "Can I return or exchange my phone case?",
    answer:
      "Yes, we offer a 7-day return policy. If you're not satisfied with your case, contact us on WhatsApp and we'll arrange an exchange or refund.",
  },
];
