"use client";

import { Loader2 } from "lucide-react";

/**
 * Shimmer KPI cards for dashboard metrics
 */
export function AdminKPISkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-2xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 rounded-md bg-neutral-200" />
            <div className="h-8 w-8 rounded-xl bg-neutral-100" />
          </div>
          <div className="h-7 w-28 rounded-md bg-neutral-200" />
          <div className="h-3 w-24 rounded-md bg-neutral-100" />
        </div>
      ))}
    </div>
  );
}

/**
 * Shimmer Table for Orders, Products, Promo Codes, Customers, Activity
 */
export function AdminTableSkeleton({ rows = 5, cols = 6 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-2xl border border-neutral-200/80 bg-white overflow-hidden shadow-2xs animate-pulse">
      {/* Table Header */}
      <div className="border-b border-neutral-100 bg-neutral-50/80 px-5 py-3.5 flex items-center justify-between">
        <div className="flex gap-8 w-full">
          {Array.from({ length: cols }).map((_, idx) => (
            <div
              key={idx}
              className={`h-3.5 rounded-md bg-neutral-200 ${
                idx === 0 ? "w-28" : idx === 1 ? "w-24" : "w-16"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-neutral-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8 w-full">
              {Array.from({ length: cols }).map((_, cIdx) => (
                <div
                  key={cIdx}
                  className={`h-4 rounded-md ${
                    cIdx === 0
                      ? "w-36 bg-neutral-200"
                      : cIdx === 1
                      ? "w-28 bg-neutral-150 bg-neutral-200/70"
                      : "w-20 bg-neutral-100"
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Shimmer Grid for Categories / Collections
 */
export function AdminGridSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
      {Array.from({ length: cards }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl border border-neutral-200/80 bg-white p-5 space-y-4 shadow-2xs"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-32 rounded-md bg-neutral-200" />
            <div className="h-3 w-16 rounded-md bg-neutral-100" />
          </div>
          <div className="h-3.5 w-full rounded-md bg-neutral-100" />
          <div className="h-3.5 w-2/3 rounded-md bg-neutral-100" />
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <div className="h-6 w-20 rounded-md bg-neutral-100" />
            <div className="h-6 w-6 rounded-md bg-neutral-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Full Page Loading Screen Overlay / Spinner for Admin
 */
export function AdminPageLoadingScreen({ message = "Loading Atelier Data..." }: { message?: string }) {
  return (
    <div className="min-h-[400px] w-full flex flex-col items-center justify-center space-y-4 animate-fade-in">
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-2 border-neutral-200 border-t-[#C5A869] animate-spin" />
        <span className="absolute h-2 w-2 rounded-full bg-[#C5A869]" />
      </div>
      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest font-mono">
        {message}
      </p>
    </div>
  );
}
