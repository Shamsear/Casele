"use client";

import { useEffect, useState } from "react";
import { useSearchStore } from "@/lib/store/search";
import { Search } from "lucide-react";

export function SearchBar() {
  const { setOpen } = useSearchStore();
  const [shortcutKey, setShortcutKey] = useState("Ctrl K");

  // Detect platform for shortcut key (⌘K on Mac, Ctrl K on Windows/Linux)
  useEffect(() => {
    if (typeof window !== "undefined" && /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent)) {
      setShortcutKey("⌘K");
    } else {
      setShortcutKey("Ctrl K");
    }
  }, []);

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open Search Dialog"
      className="flex items-center gap-2 rounded-full border border-neutral-200/80 bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs text-neutral-500 transition-all duration-200 hover:border-neutral-900 hover:text-neutral-900 hover:bg-white shadow-2xs cursor-pointer group"
    >
      <Search className="h-3.5 w-3.5 shrink-0 text-neutral-400 group-hover:text-neutral-900 transition-colors" />
      <span className="w-28 sm:w-36 text-left text-neutral-400 group-hover:text-neutral-600 transition-colors font-medium">
        Search cases...
      </span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-400 font-mono shadow-2xs">
        {shortcutKey}
      </kbd>
    </button>
  );
}
