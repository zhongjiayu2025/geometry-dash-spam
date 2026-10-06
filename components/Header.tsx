import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  BookOpen,
  ChevronDown,
  Gamepad2,
  KeyRound,
  Keyboard,
  Menu,
  MousePointer2,
  Trophy,
  X,
} from "lucide-react";
import HeaderRouteState from "./HeaderRouteState";

const coreItems = [
  { href: "/", label: "Spam Test", icon: Gamepad2 },
  { href: "/geometry-dash-wave", label: "Wave", icon: Activity },
  { href: "/cps-test", label: "CPS Test", icon: MousePointer2 },
  { href: "/demon-list", label: "Demon List", icon: Trophy },
  { href: "/geometry-dash-codes", label: "Codes", icon: KeyRound },
  { href: "/blog", label: "Guides", icon: BookOpen },
];

const moreItems = [
  ["/spam-challenge-list", "Spam Challenge List"],
  ["/demon-list/spam-demons", "Spam Demon References"],
  ["/demon-list/wave-demons", "Wave Demons"],
  ["/hardest-level", "Hardest Level"],
  ["/easiest-demons", "Easiest Demons"],
  ["/geometry-dash-difficulty-faces", "Difficulty Faces"],
  ["/geometry-dash-vault-of-secrets-codes", "Vault of Secrets Codes"],
  ["/how-to-get-diamonds-geometry-dash", "Get Diamonds"],
  ["/how-to-get-gold-keys-geometry-dash", "Get Gold Keys"],
  ["/geometry-dash-stuttering-high-end-pc", "PC Stutter Guide"],
  ["/dashmetry", "Dashmetry / Challenge Rush"],
  ["/geometry-dash-breeze", "Geometry Dash Breeze"],
  ["/geometry-dash-clicker", "Geometry Dash Clicker"],
] as const;

const routeLinkClass =
  "nav-route-link rounded-lg text-slate-400 transition-colors hover:bg-white/5 hover:text-white";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/5 bg-[#020617]/95 md:h-20 lg:bg-[#020617]/90 lg:backdrop-blur-xl">
      <HeaderRouteState />

      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Geometry Dash Spam home">
          <Image
            src="/logo.svg"
            alt="Geometry Dash Spam logo"
            width={40}
            height={40}
            className="h-9 w-9 rounded-lg"
          />
          <div className="hidden sm:block">
            <div className="font-display font-bold uppercase tracking-tight text-white">Geometry Dash Spam</div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-blue-400">Spam · Wave · CPS</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {coreItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              data-nav-href={href}
              className={`${routeLinkClass} flex items-center gap-1.5 px-3 py-2 text-sm`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          ))}

          <details data-header-menu className="group relative">
            <summary
              className="flex cursor-pointer list-none items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-white [&::-webkit-details-marker]:hidden"
              aria-label="More Geometry Dash pages"
            >
              <Keyboard className="h-4 w-4" aria-hidden="true" />
              More GD
              <ChevronDown className="h-3 w-3 transition-transform group-open:rotate-180" aria-hidden="true" />
            </summary>
            <div className="absolute right-0 top-full w-56 pt-2">
              <div className="grid max-h-[70vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0b1021] p-2 shadow-2xl">
                {moreItems.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    data-nav-href={href}
                    className={`${routeLinkClass} px-3 py-2 text-sm text-slate-300`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </details>
        </nav>

        <details data-header-menu className="group lg:hidden">
          <summary
            className="cursor-pointer list-none rounded-lg p-2 text-slate-300 transition-colors hover:bg-white/5 hover:text-white [&::-webkit-details-marker]:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-6 w-6 group-open:hidden" aria-hidden="true" />
            <X className="hidden h-6 w-6 group-open:block" aria-hidden="true" />
          </summary>

          <div
            id="mobile-navigation"
            className="absolute inset-x-0 top-full max-h-[82vh] overflow-y-auto border-b border-white/10 bg-[#0b1021] p-4 shadow-2xl"
          >
            <nav className="grid gap-1" aria-label="Mobile navigation">
              {coreItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  data-nav-href={href}
                  className={`${routeLinkClass} flex items-center gap-3 px-4 py-3 text-slate-300`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </Link>
              ))}

              <div className="mt-3 border-t border-white/10 pt-3">
                <p className="mb-2 px-4 text-xs uppercase tracking-widest text-slate-500">More GD</p>
                {moreItems.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    data-nav-href={href}
                    className={`${routeLinkClass} block px-4 py-2.5`}
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/sitemap"
                  data-nav-href="/sitemap"
                  className="nav-route-link mt-1 block rounded-lg px-4 py-2.5 font-semibold text-blue-400 hover:bg-white/5 hover:text-blue-300"
                >
                  All tools & guides →
                </Link>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
                <Link href="/about" data-nav-href="/about" className="nav-route-link p-2 text-center text-sm text-slate-500 hover:text-white">
                  About
                </Link>
                <Link href="/contact" data-nav-href="/contact" className="nav-route-link p-2 text-center text-sm text-slate-500 hover:text-white">
                  Contact
                </Link>
                <Link href="/sitemap" data-nav-href="/sitemap" className="nav-route-link p-2 text-center text-sm text-slate-500 hover:text-white">
                  Sitemap
                </Link>
              </div>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
