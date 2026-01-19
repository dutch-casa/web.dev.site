"use client"

import { useState, useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Input } from "@/components/ui/input"
import { TagFilter } from "@/components/vault/tag-filter"
import { VaultCard } from "@/components/vault/vault-card"
import { IconSearch } from "@tabler/icons-react"

import vaultData from "@/content/vault/vault.json"
import cacheDataRaw from "@/content/vault/vault-cache.json"

type OGCache = Record<string, {
  title: string
  description: string
  image: string | null
  logo: string | null
  url: string
}>

const cacheData = cacheDataRaw as OGCache

type Resource = {
  url: string
  tags: string[]
  free: boolean
}

type PriceFilter = "all" | "free" | "paid"

export default function VaultPage() {
  const [search, setSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all")

  const resources = vaultData.resources as Resource[]
  const tags = vaultData.tags as { id: string; label: string }[]

  // Get primary tags (first 6) for the filter
  const primaryTags = tags.slice(0, 8)

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      // Price filter
      if (priceFilter === "free" && !resource.free) return false
      if (priceFilter === "paid" && resource.free) return false

      // Tag filter (OR logic)
      if (selectedTags.length > 0) {
        const hasMatchingTag = selectedTags.some((tag) =>
          resource.tags.includes(tag)
        )
        if (!hasMatchingTag) return false
      }

      // Search filter
      if (search.trim()) {
        const cached = cacheData[resource.url]
        const searchLower = search.toLowerCase()
        const title = cached?.title || resource.url
        const description = cached?.description || ""

        const matchesSearch =
          title.toLowerCase().includes(searchLower) ||
          description.toLowerCase().includes(searchLower) ||
          resource.url.toLowerCase().includes(searchLower)

        if (!matchesSearch) return false
      }

      return true
    })
  }, [resources, selectedTags, search, priceFilter])

  const handleToggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((t) => t !== tagId)
        : [...prev, tagId]
    )
  }

  const handleClearTags = () => {
    setSelectedTags([])
  }

  return (
    <main className="min-h-screen px-4 py-16 md:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            The Vault
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A curated collection of the best resources for web developers.
            Tools, documentation, tutorials, and more.
          </p>
        </header>

        <div className="mb-6 space-y-4">
          <div className="relative max-w-md">
            <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <TagFilter
              tags={primaryTags}
              selected={selectedTags}
              onToggle={handleToggleTag}
              onClear={handleClearTags}
            />

            <div className="flex items-center gap-1 rounded-full bg-muted p-1">
              {(["all", "free", "paid"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPriceFilter(filter)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    priceFilter === filter
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {filter === "all" ? "All" : filter === "free" ? "Free" : "Paid"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-12 text-center">
            <p className="text-muted-foreground">
              No resources found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredResources.map((resource) => {
                const cached = cacheData[resource.url]
                return (
                  <VaultCard
                    key={resource.url}
                    url={resource.url}
                    title={cached?.title || new URL(resource.url).hostname}
                    description={cached?.description || ""}
                    image={cached?.image || null}
                    tags={resource.tags}
                    allTags={tags}
                  />
                )
              })}
            </AnimatePresence>
          </motion.div>
        )}

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {filteredResources.length} of {resources.length} resources
        </p>
      </div>
    </main>
  )
}
