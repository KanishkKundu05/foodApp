"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionToolbarProps {
  title?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  showSearch?: boolean
  showFilter?: boolean
  showExport?: boolean
  showCreate?: boolean
  onFilter?: () => void
  onExport?: () => void
  onCreate?: () => void
  createLabel?: string
  className?: string
  children?: React.ReactNode
}

export function ActionToolbar({
  title,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  showSearch = true,
  showFilter = true,
  showExport = true,
  showCreate = true,
  onFilter,
  onExport,
  onCreate,
  createLabel = "Create",
  className,
  children,
}: ActionToolbarProps) {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}>
      <div className="flex flex-col gap-2">{title && <h2 className="text-2xl font-bold">{title}</h2>}</div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {showSearch && onSearchChange && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
        )}

        <div className="flex gap-2">
          {showFilter && onFilter && (
            <Button variant="outline" size="sm" onClick={onFilter}>
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          )}

          {showExport && onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}

          {showCreate && onCreate && (
            <Button size="sm" onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              {createLabel}
            </Button>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}
