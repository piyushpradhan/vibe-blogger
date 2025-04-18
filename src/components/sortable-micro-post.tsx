import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MicroPost } from "./micro-post";
import type { Post } from "@/types";

interface SortableMicroPostProps {
  post: Post;
  onDelete?: () => void;
  sessionId: string;
}

export function SortableMicroPost({ post, onDelete, sessionId }: SortableMicroPostProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <MicroPost 
        post={post} 
        onDelete={onDelete} 
        sessionId={sessionId}
        dragHandleProps={{
          ...listeners,
          role: "button",
          "aria-label": "Drag to reorder",
          tabIndex: 0
        }} 
      />
    </div>
  );
} 