"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  comparePrice?: number;
  modelId: string;
  modelName: string;
  finish?: string; // "Matte" | "Glossy"
  caseType?: string; // "Slim Precision" | "MagSafe Dual-Layer"
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  promoDiscount: number;

  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, modelId: string, finish?: string, caseType?: string) => void;
  updateQuantity: (
    productId: string,
    modelId: string,
    qty: number,
    finish?: string,
    caseType?: string
  ) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setOpen: (open: boolean) => void;
  applyPromo: (code: string, discount: number) => void;
  removePromo: () => void;

  total: () => number;
  subtotal: () => number;
  itemCount: () => number;
  tierDiscount: () => number;
}

// Default tier thresholds (Qatar pricing)
const DEFAULT_TIERS = [
  { min: 50, percent: 5 },
  { min: 100, percent: 10 },
  { min: 200, percent: 15 },
];

function calculateTierDiscount(subtotal: number): number {
  let applicablePercent = 0;
  for (const tier of DEFAULT_TIERS) {
    if (subtotal >= tier.min) {
      applicablePercent = tier.percent;
    }
  }
  return Math.round((subtotal * applicablePercent) / 100);
}

function getItemKey(item: { productId: string; modelId: string; finish?: string; caseType?: string }) {
  return `${item.productId}-${item.modelId}-${item.finish || "Matte"}-${item.caseType || "Slim"}`;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      promoDiscount: 0,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const itemKey = getItemKey(item);
          const existingIndex = state.items.findIndex(
            (i) => getItemKey(i) === itemKey
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: Math.min(updated[existingIndex].quantity + quantity, 10),
            };
            return { items: updated, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                finish: item.finish || "Matte",
                caseType: item.caseType || "Slim Precision",
                quantity: Math.min(quantity, 10),
              },
            ],
            isOpen: true,
          };
        }),

      removeItem: (productId, modelId, finish, caseType) =>
        set((state) => {
          const targetKey = getItemKey({ productId, modelId, finish, caseType });
          return {
            items: state.items.filter((i) => getItemKey(i) !== targetKey),
          };
        }),

      updateQuantity: (productId, modelId, qty, finish, caseType) =>
        set((state) => {
          const targetKey = getItemKey({ productId, modelId, finish, caseType });
          return {
            items:
              qty <= 0
                ? state.items.filter((i) => getItemKey(i) !== targetKey)
                : state.items.map((i) =>
                    getItemKey(i) === targetKey
                      ? { ...i, quantity: Math.min(qty, 10) }
                      : i
                  ),
          };
        }),

      clearCart: () =>
        set({ items: [], promoCode: null, promoDiscount: 0 }),

      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      setOpen: (open) => set({ isOpen: open }),

      applyPromo: (code, discount) =>
        set({ promoCode: code, promoDiscount: discount }),

      removePromo: () =>
        set({ promoCode: null, promoDiscount: 0 }),

      subtotal: () => {
        const { items } = get();
        return items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      tierDiscount: () => {
        const subtotal = get().subtotal();
        return calculateTierDiscount(subtotal);
      },

      total: () => {
        const subtotal = get().subtotal();
        const tier = get().tierDiscount();
        const promo = get().promoDiscount;
        return Math.max(0, subtotal - tier - promo);
      },

      itemCount: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "casele-cart",
    }
  )
);
