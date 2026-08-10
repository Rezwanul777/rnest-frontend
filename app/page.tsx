import { FeaturedProperties } from "@/components/home/featured-properties"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorks } from "@/components/home/how-it-works"
import { OwnerCta } from "@/components/home/owner-cta"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { getCategories } from "@/services/category.service"
import { getFeaturedPropertyData } from "@/services/property.service"

export const dynamic = "force-dynamic"

export default async function Page() {
  const [categories, featuredData] = await Promise.all([
    getCategories(),
    getFeaturedPropertyData(),
  ])

  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <SiteHeader />
      <main>
        <HeroSection
          categories={categories}
          featuredProperty={featuredData.listings[0] ?? null}
          propertyCount={featuredData.meta.total}
        />
        <FeaturedProperties properties={featuredData.listings} />
        <HowItWorks />
        <OwnerCta />
      </main>
      <SiteFooter />
    </div>
  )
}
