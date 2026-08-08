"use client"

import * as React from "react"
import Link from "next/link"
import { Building2, ExternalLink, MapPin, Receipt, ShieldCheck } from "lucide-react"

import { RentalRequestStatusBadge } from "@/components/dashboard/rental-request-status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Property } from "@/types/property"
import type { RentalRequest } from "@/types/rental-request"

const takaFormatter = new Intl.NumberFormat("en-BD")

type AdminContentModerationProps = {
  properties: Property[]
  requests: RentalRequest[]
}

export function AdminContentModeration({
  properties,
  requests,
}: AdminContentModerationProps) {
  const [activeTab, setActiveTab] = React.useState<"PROPERTIES" | "REQUESTS">("PROPERTIES")

  return (
    <div className="space-y-6">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("PROPERTIES")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "PROPERTIES"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Building2 className="size-4" /> Global Listings ({properties.length})
        </button>
        <button
          onClick={() => setActiveTab("REQUESTS")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "REQUESTS"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Receipt className="size-4" /> Rental Requests ({requests.length})
        </button>
      </div>

      {activeTab === "PROPERTIES" && (
        <Card className="overflow-hidden bg-card/90">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Property</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No property listings found.
                  </TableCell>
                </TableRow>
              ) : (
                properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="min-w-64">
                      <p className="font-medium">{property.title}</p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                        <MapPin className="size-3 text-amber-500" /> {property.location}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{property.category.name}</Badge>
                    </TableCell>
                    <TableCell className="font-medium text-amber-600 dark:text-amber-400">
                      ৳{takaFormatter.format(property.rent)}/mo
                    </TableCell>
                    <TableCell>
                      <Badge variant={property.isAvailable ? "success" : "secondary"}>
                        {property.isAvailable ? "Available" : "Hidden"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/properties/${property.id}`} target="_blank">
                          View Listing <ExternalLink className="ml-1 size-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}

      {activeTab === "REQUESTS" && (
        <Card className="overflow-hidden bg-card/90">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Property</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Move-in Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No rental requests found.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium min-w-56">
                      {request.property.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {request.tenant?.name || request.tenantId || "Tenant"}
                    </TableCell>
                    <TableCell>
                      {new Date(request.requestedMoveInDate).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <RentalRequestStatusBadge status={request.status} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  )
}
