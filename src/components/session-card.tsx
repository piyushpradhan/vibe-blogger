import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

interface Session {
  id: string
  title: string
  postCount: number
  updatedAt: string
  preview: string
}

interface SessionCardProps {
  session: Session
}

export function SessionCard({ session }: SessionCardProps) {
  const formattedDate = formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })

  return (
    <Link href={`/dashboard/session/${session.id}`}>
      <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1">{session.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{session.preview}</p>
        </CardContent>
        <CardFooter className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{session.postCount} posts</span>
          </div>
          <div>Updated {formattedDate}</div>
        </CardFooter>
      </Card>
    </Link>
  )
}

