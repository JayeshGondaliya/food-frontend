const STEPS = [
  { key: "received", label: "Order Received" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" }
];

const stepColors = {
  received: "bg-blue-500",
  preparing: "bg-yellow-500",
  out_for_delivery: "bg-red-500",
  delivered: "bg-green-500"
};

const OrderStepper = ({ status }: { status: string }) => {
  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="mt-4 flex items-center gap-0">
      {STEPS.map((step, i) => {
        const isCompleted = i <= currentIndex;
        const isActive = i === currentIndex;
        const isLast = i === STEPS.length - 1;

        return (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center text-center">
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-500
                  ${isActive
                    ? `${stepColors[step.key as keyof typeof stepColors]} text-white ring-4 ring-opacity-30 animate-pulse-scale`
                    : isCompleted
                    ? `${stepColors[step.key as keyof typeof stepColors]} text-white`
                    : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {isCompleted && !isActive ? "✓" : i + 1}
              </div>
              <span
                className={`
                  mt-1.5 text-[10px] leading-tight font-medium transition-colors duration-300 sm:text-xs
                  ${isActive
                    ? stepColors[step.key as keyof typeof stepColors].replace("bg-", "text-")
                    : isCompleted
                    ? "text-success"
                    : "text-muted-foreground"
                  }
                `}
              >
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`
                  mx-1 h-0.5 flex-1 rounded transition-all duration-700
                  ${i < currentIndex
                    ? stepColors[STEPS[i].key as keyof typeof stepColors]
                    : "bg-muted"
                  }
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderStepper; 