import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";
import { api } from "@/trpc/react";
import { useCallback } from "react";

import type { Post } from "@/types";

interface DragHandleProps {
  "aria-label": string;
  "data-rbd-drag-handle-draggable-id": string;
  "data-rbd-drag-handle-context-id": string;
  draggable: boolean;
  role: string;
  tabIndex: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

interface MicroPostProps {
  post: Post;
  dragHandleProps?: DragHandleProps;
  sessionId: string;
}

function useDeletePost(sessionId: string) {
  const utils = api.useUtils();

  return api.post.delete.useMutation({
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await utils.session.getById.cancel({ id: sessionId });

      // Snapshot the previous value
      const previousSession = utils.session.getById.getData({ id: sessionId });

      // Optimistically update to the new value
      if (previousSession) {
        utils.session.getById.setData(
          { id: sessionId },
          {
            ...previousSession,
            posts: previousSession.posts.filter((p) => p.id !== variables.id),
          },
        );
      }

      // Return a context object with the snapshotted value
      return { previousSession };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousSession) {
        utils.session.getById.setData(
          { id: sessionId },
          context.previousSession,
        );
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the correct data
      void utils.session.getById.invalidate({ id: sessionId });
    },
  });
}

export function MicroPost({
  post,
  dragHandleProps,
  sessionId,
}: MicroPostProps) {
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });
  const deletePostMutation = useDeletePost(sessionId);

  const handleDelete = useCallback(() => {
    deletePostMutation.mutate({ id: post.id });
  }, [deletePostMutation, post.id]);

  return (
    <div className="relative pl-6">
      {dragHandleProps && (
        <button
          className="text-muted-foreground hover:text-foreground absolute top-4 -left-0 z-50 cursor-grab rounded-full transition-colors"
          {...dragHandleProps}
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <Card>
        <CardContent className="px-4">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
        <CardFooter className="text-muted-foreground flex items-center justify-between border-t px-4 py-2 text-xs">
          <span>Posted {formattedDate}</span>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-destructive/10 hover:text-destructive h-6 w-6 cursor-pointer p-0"
            onClick={handleDelete}
            disabled={deletePostMutation.isPending}
            aria-label="Delete post"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
