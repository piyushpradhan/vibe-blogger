import { Card, CardContent } from "@/components/ui/card";
import type { Post } from "@/types";

interface DraggablePostOverlayProps {
  post: Pick<Post, "content">;
  isDragging?: boolean;
}

export function DraggablePostOverlay({
  post,
  isDragging = false,
}: DraggablePostOverlayProps) {
  return (
    <Card
      className={`w-full max-w-[600px] opacity-90 shadow-lg transition-opacity duration-200 ${
        isDragging ? "opacity-100" : "opacity-90"
      }`}
      role="dialog"
      aria-label="Dragging post"
      aria-modal="true"
    >
      <CardContent className="p-4">
        <p
          className="line-clamp-3 whitespace-pre-wrap"
          aria-label="Post content preview"
        >
          {post.content}
        </p>
      </CardContent>
    </Card>
  );
}
