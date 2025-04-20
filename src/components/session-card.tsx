import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/trpc/react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const utils = api.useUtils()
  const formattedDate = formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })

  const deleteSessionMutation = api.session.delete.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.session.getAll.cancel();
      
      // Snapshot the previous value
      const previousSessions = utils.session.getAll.getData();
      
      // Optimistically update to the new value
      if (previousSessions) {
        utils.session.getAll.setData(undefined, previousSessions.filter(s => s.id !== variables.id));
      }
      
      // Return a context object with the snapshotted value
      return { previousSessions };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSessions) {
        utils.session.getAll.setData(undefined, context.previousSessions);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      void utils.session.getAll.invalidate();
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    deleteSessionMutation.mutate({ id: session.id })
    setShowDeleteDialog(false)
  }

  return (
    <div className="relative group">
      <Link href={`/dashboard/session/${session.id}`}>
        <Card className="h-full overflow-hidden transition-all hover:border-primary/50 hover:shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-1">{session.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 flex-1">
            <p className="text-sm text-muted-foreground line-clamp-2">{session.preview}</p>
          </CardContent>
          <CardFooter className="flex justify-between text-xs text-muted-foreground whitespace-nowrap mt-auto">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{session.postCount} posts</span>
            </div>
            <div className="ml-2">Updated {formattedDate}</div>
          </CardFooter>
        </Card>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this session? This action cannot be undone and will also delete all posts and generated blogs associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

