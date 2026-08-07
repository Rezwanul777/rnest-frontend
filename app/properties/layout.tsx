import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="rentnest-grid">{children}</div>
      <SiteFooter />
    </div>
  )
}
