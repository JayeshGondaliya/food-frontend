const statusConfig: Record<string, { bg: string; text: string }> = {
  "Order Received": { bg: "bg-info/10", text: "text-info" },
  Preparing: { bg: "bg-warning/10", text: "text-warning" },
  "Out for Delivery": { bg: "bg-primary/10", text: "text-primary" },
  Delivered: { bg: "bg-success/10", text: "text-success" },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || { bg: "bg-muted", text: "text-muted-foreground" };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
