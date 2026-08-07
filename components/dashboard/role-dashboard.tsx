import { ArrowUpRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type DashboardItem = {
  title: string
  description: string
}

type RoleDashboardProps = {
  label: string
  title: string
  description: string
  userName: string
  items: DashboardItem[]
}

export function RoleDashboard({
  label,
  title,
  description,
  userName,
  items,
}: RoleDashboardProps) {
  return (
    <div className="space-y-8">
      <section className="max-w-3xl space-y-4">
        <Badge variant="outline">{label}</Badge>
        <div>
          <p className="mb-2 text-sm text-muted-foreground">
            Welcome back, {userName}.
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
        </div>
        <p className="text-base leading-7 text-muted-foreground">
          {description}
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <Card key={item.title} className="bg-card/80">
            <CardContent className="flex h-full min-h-40 flex-col justify-between gap-6 py-5">
              <ArrowUpRight className="size-5 text-amber-500" />
              <div>
                <h2 className="font-semibold">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
