import Link from "next/link"
import { Globe2, Mail, MessagesSquare, Send, Share2 } from "lucide-react"


import { Button } from "@/components/ui/button"
import { BrandLogo } from "../shared/brand-logo"
import { Input } from "../ui/input"


const footerLinks = {
  Explore: [
    { label: "Properties", href: "/properties" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Locations", href: "/properties" },
  ],
  "For owners": [
    { label: "List a property", href: "/auth/register?role=LANDLORD" },
    { label: "Landlord dashboard", href: "/dashboard/landlord" },
    { label: "Rental requests", href: "/dashboard/landlord/requests" },
  ],
}

const socialLinks = [
  { label: "Community", icon: MessagesSquare },
  { label: "Website", icon: Globe2 },
  { label: "Share", icon: Share2 },
  { label: "Email", icon: Mail },
]

export function SiteFooter() {
  return (
    <footer className="border-t bg-[#07101f] text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.9fr_1.2fr]">
          <div>
            <BrandLogo className="text-white" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              A better way to find your next place—verified homes, clear
              decisions, and secure payments.
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map(({ label, icon: Icon }) => (
                <Button
                  key={label}
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                  aria-label={label}
                >
                  <Icon />
                </Button>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-semibold text-white">{heading}</h3>
              <ul className="mt-4 space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-amber-400"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-white">Stay in the loop</h3>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Get new listings and renting tips in your inbox.
            </p>
            <div className="mt-4 flex gap-2">
              <Input
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500"
              />
              <Button type="button" size="icon-lg" aria-label="Subscribe">
                <Send />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 RentNest. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/contact" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
