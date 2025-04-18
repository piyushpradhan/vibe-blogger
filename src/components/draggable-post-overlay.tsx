import { Card, CardContent } from "@/components/ui/card";

interface DraggablePostOverlayProps {
  post: {
    content: string;
  };
}

export function DraggablePostOverlay({ post }: DraggablePostOverlayProps) {
  return (
    <Card className="shadow-lg w-full max-w-[600px] opacity-90">
      <CardContent className="p-4">
        <p className="whitespace-pre-wrap line-clamp-3">{post.content}</p>
      </CardContent>
    </Card>
  );
} 