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
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  promoDiscount: number;

  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, modelId: string) => void;
  updateQuantity: (
    productId: string,
    modelId: string,
    qty: number
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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      promoCode: null,
      promoDiscount: 0,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === item.productId &&
              i.modelId === item.modelId
          );

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId &&
                i.modelId === item.modelId
                  ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
                  : i
              ),
            };
          }

          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        }),

      removeItem: (productId, modelId) =>
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(i.productId === productId && i.modelId === modelId)
          ),
        })),

      updateQuantity: (productId, modelId, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter(
                  (i) =>
                    !(
                      i.productId === productId &&
                      i.modelId === modelId
                    )
                )
              : state.items.map((i) =>
                  i.productId === productId && i.modelId === modelId
                    ? { ...i, quantity: Math.min(qty, 10) }
                    : i
                ),
        })),

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
