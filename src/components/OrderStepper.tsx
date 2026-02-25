const STEPS = ["Order Received", "Preparing", "Out for Delivery", "Delivered"];

const OrderStepper = ({ status }: { status: string }) => {
  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="mt-4 flex items-center gap-0">
      {STEPS.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isActive = i === currentIndex;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center text-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : isCompleted
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted && !isActive ? "✓" : i + 1}
              </div>
              <span
                className={`mt-1.5 text-[10px] leading-tight font-medium sm:text-xs ${
                  isActive
                    ? "text-primary"
                    : isCompleted
                    ? "text-success"
                    : "text-muted-foreground"
                }`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-1 h-0.5 flex-1 rounded transition-colors ${
                  i < currentIndex ? "bg-success" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStepper;
