import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = {
  sm: { height: 32, maxWidth: 120 },
  md: { height: 40, maxWidth: 160 },
  lg: { height: 56, maxWidth: 240 },
};

export function Logo({ className, size = "md", href = "/" }: LogoProps) {
  const { height, maxWidth } = sizes[size];

  return (
    <Link href={href} className={cn("flex items-center shrink-0", className)}>
      <Image
        src="/logo.png"
        alt="CASELÉ"
        width={maxWidth}
        height={height * 2}
        className="w-auto object-contain"
        style={{ height, maxWidth }}
        priority
      />
    </Link>
  );
}
