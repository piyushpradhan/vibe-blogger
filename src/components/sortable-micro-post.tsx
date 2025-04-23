import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MicroPost } from "./micro-post";
import type { Post } from "@/types";
import { useCallback } from "react";

interface SortableMicroPostProps {
  post: Post;
  sessionId: string;
}

interface DragHandleProps {
  "aria-label": string;
  "data-rbd-drag-handle-draggable-id": string;
  "data-rbd-drag-handle-context-id": string;
  draggable: boolean;
  role: string;
  tabIndex: number;
  onKeyDown: (e: React.KeyboardEvent) => void;
  "aria-pressed"?: boolean;
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
          "aria-pressed": isDragging,
          tabIndex: 0,
          onKeyDown: handleKeyDown,
        }}
      />
    </div>
  );
}
