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
    <div className="relative h-screen max-h-[100svh] w-full flex items-center justify-center bg-neutral-950 px-3 sm:px-4 overflow-hidden select-none selection:bg-[#C5A869]/30 selection:text-white">
      {/* Ambient Luxury Glow Orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#C5A869]/15 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-neutral-800/20 blur-[120px]" />

      {/* Subtle Grid Background Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />

      <div className="relative w-full max-w-[390px] my-auto">
        {/* Main Glass Card */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-neutral-800/90 bg-neutral-900/85 p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
          {/* Header Branding */}
          <div className="text-center space-y-1.5">
            <div className="flex justify-center">
              <Logo size="md" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A869]/30 bg-[#C5A869]/10 px-2.5 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A869] animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#DFCA9B]">
                Storefront Portal
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white font-display">
              Admin Access
            </h1>
            <p className="text-[11px] text-neutral-400 max-w-xs mx-auto">
              Sign in to manage catalog, spend discounts, and orders
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-xs text-rose-300 animate-scale-in">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-400" />
              <span className="text-[11px] leading-tight">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-4 space-y-3">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@casele.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-2.5 pl-9 pr-3 text-xs text-white placeholder:text-neutral-600 focus:border-[#C5A869] focus:outline-none focus:ring-1 focus:ring-[#C5A869]/50 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-2.5 pl-9 pr-10 text-xs text-white placeholder:text-neutral-600 focus:border-[#C5A869] focus:outline-none focus:ring-1 focus:ring-[#C5A869]/50 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-white transition-colors cursor-pointer z-10"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5 text-[#C5A869]" />
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
                className="inline-flex items-center gap-1.5 text-[10.5px] text-[#C5A869] hover:text-[#DFCA9B] font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span>Fill Default Admin Credentials</span>
              </button>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full mt-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A869] via-[#DFCA9B] to-[#C5A869] py-2.5 px-4 text-xs font-bold uppercase tracking-widest text-neutral-950 shadow-md shadow-[#C5A869]/20 transition-all hover:brightness-105 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-950 border-t-transparent" />
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
          <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              ← Back to Storefront
            </Link>
            <div className="inline-flex items-center gap-1 text-[10px] text-neutral-500">
              <ShieldCheck className="h-3 w-3 text-[#C5A869]" />
              <span>256-Bit Encrypted</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="mt-3 text-center text-[10px] text-neutral-600">
          CASELÉ Qatar • Private Store Management Platform
        </p>
      </div>
    </div>
  );
}
