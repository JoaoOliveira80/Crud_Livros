export default function SkeletonCards({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="card-ambient p-6 flex flex-col gap-4 animate-pulse"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-20 bg-surface-container-low rounded-full" />
            <div className="h-4 w-10 bg-surface-container-low rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-6 w-3/4 bg-surface-container-low rounded" />
            <div className="h-4 w-1/2 bg-surface-container-low rounded" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="h-3 w-full bg-surface-container-low rounded" />
            <div className="h-3 w-5/6 bg-surface-container-low rounded" />
          </div>
          <div className="flex items-center justify-between mt-auto pt-4">
            <div className="h-3 w-16 bg-surface-container-low rounded" />
            <div className="flex gap-3">
              <div className="h-3 w-10 bg-surface-container-low rounded" />
              <div className="h-3 w-12 bg-surface-container-low rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
