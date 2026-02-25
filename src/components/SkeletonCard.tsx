const SkeletonCard = () => (
  <div className="animate-pulse rounded-lg border border-border bg-card p-4">
    <div className="mb-3 h-40 rounded-md bg-muted" />
    <div className="mb-2 h-4 w-3/4 rounded bg-muted" />
    <div className="mb-2 h-3 w-full rounded bg-muted" />
    <div className="flex items-center justify-between">
      <div className="h-5 w-16 rounded bg-muted" />
      <div className="h-9 w-24 rounded bg-muted" />
    </div>
  </div>
);

export default SkeletonCard;
