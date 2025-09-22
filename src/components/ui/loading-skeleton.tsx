import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
  variant?: "card" | "text" | "circle" | "button";
}

const variantClasses = {
  card: "h-32 w-full rounded-lg",
  text: "h-4 w-full rounded",
  circle: "h-12 w-12 rounded-full",
  button: "h-10 w-24 rounded-lg",
};

export function LoadingSkeleton({ className, count = 1, variant = "card" }: LoadingSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "animate-pulse bg-muted/50",
            variantClasses[variant],
            className
          )}
        />
      ))}
    </div>
  );
}

export function LoadingSkeletonGrid({ count = 6, cols = 3 }: { count?: number; cols?: number }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
      {Array.from({ length: count }).map((_, index) => (
        <LoadingSkeleton key={index} variant="card" />
      ))}
    </div>
  );
}