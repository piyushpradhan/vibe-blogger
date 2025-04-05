import type { ReactNode } from "react"
import { MessageSquare } from "lucide-react"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({
  icon = <MessageSquare className="h-12 w-12 text-muted-foreground/50" />,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        {icon}
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  )
}

