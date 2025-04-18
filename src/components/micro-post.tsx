import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from "lucide-react"
import { api } from "@/trpc/react"

import type { Post } from "@/types";

interface MicroPostProps {
  post: Post
  onDelete?: () => void
  dragHandleProps?: Record<string, unknown>
  sessionId: string
}

export function MicroPost({ post, onDelete, dragHandleProps, sessionId }: MicroPostProps) {
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
  const utils = api.useUtils()
  const deletePostMutation = api.post.delete.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.session.getById.cancel({ id: sessionId });
      
      // Snapshot the previous value
      const previousSession = utils.session.getById.getData({ id: sessionId });
      
      // Optimistically update to the new value
      if (previousSession) {
        utils.session.getById.setData({ id: sessionId }, {
          ...previousSession,
          posts: previousSession.posts.filter(p => p.id !== variables.id)
        });
      }
      
      // Return a context object with the snapshotted value
      return { previousSession };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSession) {
        utils.session.getById.setData({ id: sessionId }, context.previousSession);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      void utils.session.getById.invalidate({ id: sessionId });
    },
  })

  const handleDelete = () => {
    deletePostMutation.mutate({ id: post.id });
  }

  return (
    <div className="relative pl-6">
      <button 
        className="absolute -left-0 top-4 text-muted-foreground hover:text-foreground transition-colors z-50 rounded-full cursor-grab"
        {...dragHandleProps}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <Card>
        <CardContent className="px-4">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
        <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t flex justify-between items-center">
          <span>Posted {formattedDate}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

