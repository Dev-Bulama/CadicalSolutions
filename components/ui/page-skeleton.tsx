import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-2">
      <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <Card key={r}>
          <CardContent className="py-4">
            <div className={`grid gap-4 items-center`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: cols }).map((_, c) => (
                <Skeleton key={c} className="h-4" style={{ width: `${60 + Math.random() * 30}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function CardListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-64" />
              </div>
              <Skeleton className="h-7 w-20 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function FormSkeleton({ fields = 6 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
      <Skeleton className="h-10 w-32 rounded-md mt-2" />
    </div>
  )
}

export function ChartSkeleton({ height = 240 }: { height?: number }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="w-full rounded-lg" style={{ height }} />
      </CardContent>
    </Card>
  )
}
