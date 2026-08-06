import { FeaturedProperties } from "@/components/home/featured-properties"
import { HeroSection } from "@/components/home/hero-section"
import { OwnerCta } from "@/components/home/owner-cta"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection />
        <FeaturedProperties />
        <OwnerCta />
      </main>
      <SiteFooter />
    </div>
  )
}

