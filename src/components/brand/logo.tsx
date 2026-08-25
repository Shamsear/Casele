import Link from "next/link";
import { cn } from "@/lib/utils";
import { CrownIcon } from "@/components/brand/crown-icon";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  showLocation?: boolean;
}

export function Logo({ className, size = "md", href = "/", showLocation = false }: LogoProps) {
  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 select-none",
        className
      )}
    >
      <div className={cn(
        "flex items-center justify-center rounded-xl bg-neutral-950 text-[#C5A869] shadow-sm transition-transform duration-200 group-hover:scale-105",
        isSm ? "h-8 w-8" : isLg ? "h-11 w-11" : "h-9 w-9"
      )}>
        <CrownIcon size={isSm ? 15 : isLg ? 22 : 18} />
      </div>

      <div className="flex flex-col">
        <span className={cn(
          "font-display tracking-[0.2em] font-bold text-neutral-950 uppercase leading-none",
          isSm ? "text-base tracking-[0.18em]" : isLg ? "text-2xl tracking-[0.22em]" : "text-lg tracking-[0.2em]"
        )}>
          CASELÉ
        </span>
        {showLocation && (
          <span className="text-[9px] font-semibold tracking-[0.25em] text-[#A88B4D] uppercase mt-0.5 font-sans">
            Doha • Qatar
          </span>
        )}
      </div>
    </Link>
  );
}
