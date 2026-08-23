import { formatPrice } from "@/lib/utils";

interface SavingsBadgeProps {
  savings: number;
}

export function SavingsBadge({ savings }: SavingsBadgeProps) {
  if (savings <= 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
      <span className="text-sm text-emerald-400">
        🎉 You save <span className="font-bold">{formatPrice(savings)}</span> on this order!
      </span>
    </div>
  );
}
