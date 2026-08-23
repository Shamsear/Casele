"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-4xl">⚠️</div>
      <h1 className="mt-4 font-display text-h1 font-bold text-white">
        Something went wrong
      </h1>
      <p className="mt-2 text-warm-gray">
        An unexpected error occurred. Please try again.
      </p>
      <Button variant="cta" className="mt-6" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
