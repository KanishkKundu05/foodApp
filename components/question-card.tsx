import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface QuestionCardProps {
  title: string
  subtitle: string
  href: string
}

export function QuestionCard({ title, subtitle, href }: QuestionCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{title}</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{subtitle}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
