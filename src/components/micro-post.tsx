import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Post {
  id: string
  content: string
  createdAt: string
}

interface MicroPostProps {
  post: Post
}

export function MicroPost({ post }: MicroPostProps) {
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  return (
    <Card>
      <CardContent className="px-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
      <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t">Posted {formattedDate}</CardFooter>
    </Card>
  )
}

