import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Session {
  id: string;
  title: string;
  postCount: number;
  updatedAt: string;
  preview: string;
}

interface SessionCardProps {
  session: Session;
}

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Session</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this session? This action cannot be
            undone and will also delete all posts and generated blogs associated
            with it.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function SessionCard({ session }: SessionCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const utils = api.useUtils();
  const formattedDate = formatDistanceToNow(new Date(session.updatedAt), {
    addSuffix: true,
  });

  const deleteSessionMutation = api.session.delete.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.session.getAll.cancel();

      // Snapshot the previous value
      const previousSessions = utils.session.getAll.getData();

      // Optimistically update to the new value
      if (previousSessions) {
        utils.session.getAll.setData(
          undefined,
          previousSessions.filter((s) => s.id !== variables.id),
        );
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
    e.preventDefault();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    deleteSessionMutation.mutate({ id: session.id });
    setShowDeleteDialog(false);
  };

  return (
    <div className="group relative">
      <Link
        href={`/dashboard/session/${session.id}`}
        className="block"
        aria-label={`View session: ${session.title}`}
      >
        <Card className="hover:border-primary/50 flex h-full flex-col overflow-hidden transition-all hover:shadow-sm">
          <CardHeader>
            <CardTitle className="line-clamp-1">{session.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-0">
            <p className="text-muted-foreground line-clamp-2 text-sm">
              {session.preview}
            </p>
          </CardContent>
          <CardFooter className="text-muted-foreground mt-auto flex justify-between text-xs whitespace-nowrap">
            <div className="flex items-center gap-1">
              <MessageSquare
                className="h-3.5 w-3.5 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{session.postCount} posts</span>
            </div>
            <div className="ml-2">Updated {formattedDate}</div>
          </CardFooter>
        </Card>
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        onClick={handleDelete}
        aria-label="Delete session"
      >
        <Trash2 className="text-destructive h-4 w-4" aria-hidden="true" />
      </Button>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        isLoading={deleteSessionMutation.isPending}
      />
    </div>
  );
}
