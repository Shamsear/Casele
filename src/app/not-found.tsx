import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <Logo size="md" className="mb-8" />

      <h1 className="font-display text-hero font-bold text-gold">404</h1>
      <p className="mt-2 text-lg text-warm-gray">Page not found</p>
      <p className="mt-1 text-sm text-warm-gray/60">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/shop"
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-gold-light"
      >
        Back to Shop
      </Link>

      <Link
        href="/"
        className="mt-4 text-sm text-warm-gray hover:text-gold transition-colors"
      >
        ← Go to homepage
      </Link>
    </div>
  );
}
