import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MicroPost } from "./micro-post";
import type { Post } from "@/types";
import { useCallback } from "react";

interface SortableMicroPostProps {
  post: Post;
  sessionId: string;
}

export function SortableMicroPost({ post, sessionId }: SortableMicroPostProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: post.id,
    data: {
      type: "post",
      post,
    },
  });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        listeners?.onKeyDown?.(e);
      }
    },
    [listeners],
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      role="listitem"
      aria-label={`Post ${post.id}`}
      aria-describedby={`post-${post.id}-content`}
    >
      <MicroPost
        post={post}
        sessionId={sessionId}
        dragHandleProps={{
          ...listeners,
          role: "button",
          "aria-label": "Drag to reorder",
          tabIndex: 0,
          onKeyDown: handleKeyDown,
          "data-rbd-drag-handle-draggable-id": post.id,
          "data-rbd-drag-handle-context-id": "0",
          draggable: true,
        }}
      />
    </div>
  );
}
