import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
  showLocation?: boolean;
}

export function Logo({ className, size = "md", href = "/", showLocation = false }: LogoProps) {
  const heightClass = size === "sm" ? "h-7" : size === "lg" ? "h-12" : "h-9";

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 transition-opacity hover:opacity-90 select-none",
        className
      )}
    >
      <div className={cn("relative flex items-center justify-center", heightClass)}>
        <Image
          src="/logo.png"
          alt="CASELÉ"
          width={160}
          height={48}
          priority
          className={cn("w-auto object-contain transition-transform duration-200 group-hover:scale-102", heightClass)}
        />
      </div>
      {showLocation && (
        <span className="hidden sm:inline-block text-[9px] font-bold tracking-[0.25em] text-[#A88B4D] uppercase font-sans border-l border-neutral-200 pl-2.5 ml-1">
          Doha • Qatar
        </span>
      )}
    </Link>
  );
}
