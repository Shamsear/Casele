"use client";

import { useSearchStore } from "@/lib/store/search";
import { Search } from "lucide-react";

export function SearchBar() {
  const setOpen = useSearchStore((s) => s.setOpen);

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label="Open search dialog"
      className="flex items-center gap-2.5 rounded-full border border-neutral-200/80 bg-neutral-100/70 px-3.5 py-1.5 text-xs text-neutral-500 transition-all duration-200 hover:border-neutral-400 hover:bg-white hover:text-neutral-950 shadow-xs cursor-pointer select-none"
    >
      <Search className="h-3.5 w-3.5 text-neutral-400" />
      <span className="hidden sm:inline-block font-medium">Search cases & models...</span>
      <span className="sm:hidden font-medium">Search...</span>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-neutral-200 bg-white px-1.5 py-0.5 text-[9px] font-semibold text-neutral-400 font-mono shadow-2xs">
        ⌘K
      </kbd>
    </button>
  );
}
