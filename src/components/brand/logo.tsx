import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

const sizes = {
  sm: { width: 120, height: 40 },
  md: { width: 160, height: 53 },
  lg: { width: 240, height: 80 },
};

export function Logo({ className, size = "md", href = "/" }: LogoProps) {
  const { width, height } = sizes[size];

  return (
    <Link href={href} className={cn("flex items-center shrink-0", className)}>
      <Image
        src="/logo.png"
        alt="CASELÉ"
        width={width}
        height={height}
        className="h-auto w-auto max-h-full"
        style={{ maxWidth: width }}
        priority
      />
    </Link>
  );
}
