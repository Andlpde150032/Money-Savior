import { Skeleton } from "@/components/ui/skeleton"

export function ExpenseSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </div>
          <Skeleton className="mt-3 h-6 w-[150px]" />
        </div>
      ))}
    </div>
  )
}
