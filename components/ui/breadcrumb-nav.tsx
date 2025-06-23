import { ChevronRight, Home } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[]
  showHome?: boolean
  className?: string
}

export function BreadcrumbNav({ items, showHome = true, className }: BreadcrumbNavProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm text-muted-foreground", className)}>
      {showHome && (
        <>
          <Link href="/" className="flex items-center hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          {items.length > 0 && <ChevronRight className="h-4 w-4" />}
        </>
      )}

      {items.map((item, index) => (
        <Fragment key={index}>
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && <ChevronRight className="h-4 w-4" />}
        </Fragment>
      ))}
    </nav>
  )
}
