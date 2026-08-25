"use client";

import { create } from "zustand";

interface SearchStore {
  isOpen: boolean;
  query: string;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  setQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  isOpen: false,
  query: "",
  setOpen: (open) => set({ isOpen: open }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  setQuery: (query) => set({ query }),
}));
