export function Skeleton({ className = "" }: { className?: string }): JSX.Element {
  return <div className={`skeleton ${className}`} />;
}

export function JobCardSkeleton(): JSX.Element {
  return (
    <div className="card p-5">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="mt-3 h-4 w-1/2" />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="mt-5 h-9 w-full" />
    </div>
  );
}

export function JobListSkeleton({ count = 6 }: { count?: number }): JSX.Element {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <JobCardSkeleton key={index} />
      ))}
    </div>
  );
}
