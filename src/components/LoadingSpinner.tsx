const LoadingSpinner = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-center justify-center py-12 ${className}`}>
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
  </div>
);

export default LoadingSpinner;
