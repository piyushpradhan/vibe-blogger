import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { GripVertical } from "lucide-react";

interface Post {
  id: string;
  content: string;
  createdAt: string | Date;
  sessionId: string;
  userId: string;
  updatedAt?: Date;
}

interface SortableMicroPostProps {
  post: Post;
}

export function SortableMicroPost({ post }: SortableMicroPostProps) {
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
      type: 'post',
      post
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : 1,
  };

  const formattedDate = formatDistanceToNow(
    typeof post.createdAt === 'string' ? new Date(post.createdAt) : post.createdAt, 
    { addSuffix: true }
  );

  return (
    <div ref={setNodeRef} style={style} className="relative group mb-4 pl-8">
      <div 
        className="absolute left-0 top-3 p-1.5 rounded-md hover:bg-muted opacity-0 group-hover:opacity-50 transition-opacity cursor-grab" 
        {...attributes} 
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <Card className={`${isDragging ? 'shadow-lg' : 'shadow-sm hover:shadow-md'} transition-all duration-200`}>
        <CardContent className="px-4">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </CardContent>
        <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t">
          Posted {formattedDate}
        </CardFooter>
      </Card>
    </div>
  );
} 