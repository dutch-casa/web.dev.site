"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { IconExternalLink } from "@tabler/icons-react"

type VaultCardProps = {
  url: string
  title: string
  description: string
  image: string | null
  tags: string[]
  allTags: { id: string; label: string }[]
}

export function VaultCard({
  url,
  title,
  description,
  image,
  tags,
  allTags,
}: VaultCardProps) {
  const tagLabels = tags
    .map((t) => allTags.find((at) => at.id === t))
    .filter(Boolean)

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="text-4xl font-bold opacity-20">
              {new URL(url).hostname.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight line-clamp-1 transition-colors group-hover:text-primary">
            {title}
          </h3>
          <IconExternalLink
            className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </div>

        <p className="mb-3 flex-1 text-sm text-muted-foreground line-clamp-2">
          {description || new URL(url).hostname}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {tagLabels.slice(0, 3).map((tag) => (
            <Badge key={tag!.id} variant="secondary" className="text-xs">
              {tag!.label}
            </Badge>
          ))}
          {tagLabels.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tagLabels.length - 3}
            </Badge>
          )}
        </div>
      </div>
    </motion.a>
  )
}
