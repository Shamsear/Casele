import { Logo } from "@/components/brand/logo";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-dark-border/50 bg-black pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Logo size="sm" />
            <p className="mt-3 text-sm text-warm-gray">
              Protect. Express. Elevate.
            </p>
            <p className="mt-2 text-xs text-warm-gray/60">
              Premium mobile phone cases designed for style and durability.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Links</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/shop", label: "Shop All" },
                { href: "/track", label: "Track Order" },
                { href: "/about", label: "About Us" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-warm-gray hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-warm-gray">
              <li>
                <a
                  href="https://instagram.com/casele.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @casele.co
                </a>
              </li>
              <li>
                <a
                  href="https://casele.co"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  www.casele.co
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-warm-gray/60">
            © {new Date().getFullYear()} CASELÉ. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-warm-gray/60">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="/contact" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
