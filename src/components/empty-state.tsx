import type { ReactNode } from "react";
import { MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
  isLoading?: boolean;
}

export function EmptyState({
  icon = (
    <MessageSquare
      className="text-muted-foreground/50 h-12 w-12"
      aria-hidden="true"
    />
  ),
  title,
  description,
  action,
  className,
  isLoading = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
    >
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {icon}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-2 text-sm">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
}
