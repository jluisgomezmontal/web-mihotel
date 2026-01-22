import * as React from "react"
import { cn } from "@/lib/utils"

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "spinner" | "dots" | "pulse"
  text?: string
  fullScreen?: boolean
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16"
}

const Spinner = ({ size = "md", className }: { size?: string; className?: string }) => (
  <svg
    className={cn("animate-spin", sizeClasses[size as keyof typeof sizeClasses], className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
)

const Dots = ({ size = "md", className }: { size?: string; className?: string }) => {
  const dotSize = size === "sm" ? "h-2 w-2" : size === "lg" ? "h-4 w-4" : size === "xl" ? "h-5 w-5" : "h-3 w-3"
  
  return (
    <div className={cn("flex space-x-2", className)}>
      <div className={cn(dotSize, "bg-current rounded-full animate-bounce")} style={{ animationDelay: "0ms" }} />
      <div className={cn(dotSize, "bg-current rounded-full animate-bounce")} style={{ animationDelay: "150ms" }} />
      <div className={cn(dotSize, "bg-current rounded-full animate-bounce")} style={{ animationDelay: "300ms" }} />
    </div>
  )
}

const Pulse = ({ size = "md", className }: { size?: string; className?: string }) => (
  <div className={cn("relative", sizeClasses[size as keyof typeof sizeClasses])}>
    <div className="absolute inset-0 rounded-full bg-current opacity-75 animate-ping" />
    <div className="relative rounded-full bg-current h-full w-full" />
  </div>
)

export function Loader({
  size = "md",
  variant = "spinner",
  text,
  fullScreen = false,
  className,
  ...props
}: LoaderProps) {
  const loaderContent = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullScreen && "fixed inset-0 bg-background/80 backdrop-blur-sm z-50",
        className
      )}
      {...props}
    >
      {variant === "spinner" && <Spinner size={size} />}
      {variant === "dots" && <Dots size={size} />}
      {variant === "pulse" && <Pulse size={size} />}
      {text && (
        <p className={cn(
          "text-muted-foreground font-medium",
          size === "sm" && "text-xs",
          size === "md" && "text-sm",
          size === "lg" && "text-base",
          size === "xl" && "text-lg"
        )}>
          {text}
        </p>
      )}
    </div>
  )

  return loaderContent
}

export function LoaderOverlay({ text, size = "lg" }: { text?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  return <Loader fullScreen size={size} text={text} />
}
