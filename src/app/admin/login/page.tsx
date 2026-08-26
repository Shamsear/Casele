"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, Sparkles, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please verify email and password.");
        setLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@casele.co");
    setPassword("admin123");
    setError("");
  };

  return (
    <div className="relative h-screen max-h-[100svh] w-full flex items-center justify-center bg-[#F9F9F8] text-neutral-950 px-3 sm:px-4 overflow-hidden select-none selection:bg-[#C5A869]/30 selection:text-neutral-950 font-sans">
      {/* Ambient Warm Glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-amber-200/40 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#C5A869]/20 blur-[100px]" />

      {/* Subtle Grid Background Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: "radial-gradient(#000000 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="relative w-full max-w-[390px] my-auto">
        {/* Main Card */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-neutral-200/90 bg-white/95 p-5 sm:p-7 shadow-xl shadow-neutral-950/5 backdrop-blur-xl">
          {/* Header Branding */}
          <div className="text-center space-y-1.5">
            <div className="flex justify-center">
              <Logo size="md" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 shadow-2xs">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A869] animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-neutral-700">
                Storefront Portal
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-neutral-950 font-display">
              Admin Access
            </h1>
            <p className="text-[11px] text-neutral-500 max-w-xs mx-auto">
              Sign in to manage catalog, spend discounts, and orders
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2 text-xs text-rose-700 animate-scale-in">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
              <span className="text-[11px] leading-tight font-medium">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@casele.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-2.5 pl-9 pr-3 text-xs text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950/20 transition-all shadow-2xs"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/70 py-2.5 pl-9 pr-10 text-xs text-neutral-950 placeholder:text-neutral-400 focus:bg-white focus:border-neutral-950 focus:outline-none focus:ring-1 focus:ring-neutral-950/20 transition-all shadow-2xs"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer z-10"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5 text-[#A88B4D]" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            {/* Quick Fill Helper */}
            <div className="flex items-center justify-between pt-0.5">
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1.5 text-[10.5px] text-[#A88B4D] hover:text-neutral-950 font-semibold transition-colors cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span>Fill Default Admin Credentials</span>
              </button>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full mt-1 flex items-center justify-center gap-2 rounded-xl bg-neutral-950 py-2.5 px-4 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:bg-neutral-800 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-neutral-950 font-medium transition-colors"
            >
              ← Back to Storefront
            </Link>
            <div className="inline-flex items-center gap-1 text-[10px] text-neutral-500">
              <ShieldCheck className="h-3 w-3 text-[#A88B4D]" />
              <span>256-Bit Encrypted</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="mt-3 text-center text-[10px] text-neutral-500 font-medium">
          CASELÉ Qatar • Private Store Management Platform
        </p>
      </div>
    </div>
  );
}
