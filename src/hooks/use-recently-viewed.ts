"use client";

import { useState, useEffect, useCallback } from "react";
import {
  addRecentlyViewed as add,
  getRecentlyViewed as get,
  clearRecentlyViewed as clear,
} from "@/lib/recently-viewed";

export function useRecentlyViewed() {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(get());
  }, []);

  const addItem = useCallback((productId: string) => {
    add(productId);
    setItems(get());
  }, []);

  const clearItems = useCallback(() => {
    clear();
    setItems([]);
  }, []);

  return { items, addItem, clearItems };
}
