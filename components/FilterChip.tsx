import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FilterChipProps {
  label: string
  icon?: React.ReactNode
  active?: boolean
  removable?: boolean
  onClick?: () => void
  onRemove?: () => void
  className?: string
}

export function FilterChip({
  label,
  icon,
  active = false,
  removable = false,
  onClick,
  onRemove,
  className
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all",
        active 
          ? "bg-foreground text-background border-foreground" 
          : "bg-background text-foreground border-border hover:border-foreground",
        className
      )}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {removable && onRemove && (
        <X 
          className="h-4 w-4 ml-1 hover:opacity-70" 
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
        />
      )}
    </button>
  )
}
