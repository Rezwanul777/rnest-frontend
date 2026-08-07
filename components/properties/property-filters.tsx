"use client"

import { RotateCcw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Category } from "@/types/property"

export type PropertyFiltersState = {
  search: string
  categoryId: string
  minRent: string
  maxRent: string
  amenities: string[]
}

type PropertyFiltersProps = {
  filters: PropertyFiltersState
  onChange: (filters: PropertyFiltersState) => void
  onReset: () => void
  categories: Category[]
  amenities: string[]
}

export function PropertyFilters({
  filters,
  onChange,
  onReset,
  categories,
  amenities,
}: PropertyFiltersProps) {
  function update<Key extends keyof PropertyFiltersState>(
    key: Key,
    value: PropertyFiltersState[Key]
  ) {
    onChange({ ...filters, [key]: value })
  }

  function toggleAmenity(amenity: string) {
    const amenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((item) => item !== amenity)
      : [...filters.amenities, amenity]

    update("amenities", amenities)
  }

  return (
    <div className="space-y-7">
      <div>
        <label htmlFor="property-search" className="text-sm font-medium">
          Search
        </label>
        <div className="relative mt-2">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="property-search"
            value={filters.search}
            onChange={(event) => update("search", event.target.value)}
            placeholder="Location or property name"
            className="pl-9"
          />
        </div>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Property type</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[{ id: "", name: "All types" }, ...categories].map((category) => {
            const active = filters.categoryId === category.id

            return (
              <button
                key={category.id || "all-types"}
                type="button"
                onClick={() => update("categoryId", category.id)}
                className={`rounded-lg border px-3 py-2 text-left text-xs font-medium transition-colors ${
                  active
                    ? "border-amber-500/40 bg-amber-400/10 text-amber-700 dark:text-amber-300"
                    : "bg-background/50 text-muted-foreground hover:bg-muted"
                }`}
                aria-pressed={active}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Monthly rent</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <label>
            <span className="sr-only">Minimum rent</span>
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.minRent}
              onChange={(event) => update("minRent", event.target.value)}
              placeholder="Min ৳"
            />
          </label>
          <label>
            <span className="sr-only">Maximum rent</span>
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              value={filters.maxRent}
              onChange={(event) => update("maxRent", event.target.value)}
              placeholder="Max ৳"
            />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Amenities</legend>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2.5">
          {amenities.map((amenity) => (
            <label
              key={amenity}
              className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"
            >
              <input
                type="checkbox"
                checked={filters.amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="size-4 rounded border-input accent-amber-500"
              />
              {amenity}
            </label>
          ))}
          {amenities.length === 0 && (
            <p className="col-span-2 text-xs text-muted-foreground">
              No amenity options are available yet.
            </p>
          )}
        </div>
      </fieldset>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={onReset}
      >
        <RotateCcw /> Reset filters
      </Button>
    </div>
  )
}
