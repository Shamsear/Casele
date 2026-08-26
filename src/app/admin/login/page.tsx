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
        setError("Invalid credentials. Please verify your email and password.");
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
    <div className="relative min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-12 overflow-hidden selection:bg-[#C5A869]/30 selection:text-white">
      {/* Ambient Luxury Glow Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#C5A869]/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-neutral-800/20 blur-[140px]" />

      {/* Subtle Grid Background Pattern */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="relative rounded-3xl border border-neutral-800/90 bg-neutral-900/80 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl">
          {/* Header Branding */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#C5A869]/30 bg-[#C5A869]/10 px-3 py-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A869] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#DFCA9B]">
                Storefront Portal
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Admin Access
            </h1>
            <p className="text-xs text-neutral-400 max-w-xs mx-auto">
              Sign in to manage catalog, active spend discounts, inventory, and orders
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 animate-scale-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@casele.co"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-3 pl-10 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-[#C5A869] focus:outline-none focus:ring-1 focus:ring-[#C5A869]/50 transition-all"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 py-3 pl-10 pr-11 text-sm text-white placeholder:text-neutral-600 focus:border-[#C5A869] focus:outline-none focus:ring-1 focus:ring-[#C5A869]/50 transition-all"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Quick Fill Helper */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleQuickFill}
                className="inline-flex items-center gap-1.5 text-[11px] text-[#C5A869] hover:text-[#DFCA9B] font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span>Fill Default Admin Credentials</span>
              </button>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A869] via-[#DFCA9B] to-[#C5A869] py-3 px-4 text-xs font-bold uppercase tracking-widest text-neutral-950 shadow-lg shadow-[#C5A869]/20 transition-all hover:brightness-105 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
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
          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-500">
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-white transition-colors"
            >
              ← Back to Storefront
            </Link>
            <div className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
              <ShieldCheck className="h-3.5 w-3.5 text-[#C5A869]" />
              <span>256-Bit Encrypted</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <p className="mt-6 text-center text-[11px] text-neutral-600">
          CASELÉ Qatar • Private Store Management Platform
        </p>
      </div>
    </div>
  );
}
