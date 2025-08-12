import { Skeleton } from "@/components/ui/skeleton"

export default function PaymentSuccessLoading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
          <Skeleton className="h-4 w-36 mx-auto" />
        </div>
        <div className="flex gap-4 justify-center">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
