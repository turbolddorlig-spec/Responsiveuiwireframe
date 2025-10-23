import { Badge } from "./ui/badge";

type StatusType = 
  | "NEW"
  | "READY_FOR_DELIVERY"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "RETURNED"
  | "CANCELLED";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  NEW: { label: "Шинэ", className: "bg-blue-100 text-blue-700 border-blue-300" },
  READY_FOR_DELIVERY: { label: "Бэлэн", className: "bg-cyan-100 text-cyan-700 border-cyan-300" },
  ASSIGNED: { label: "Оноосон", className: "bg-indigo-100 text-indigo-700 border-indigo-300" },
  OUT_FOR_DELIVERY: { label: "Хүргэлтэнд", className: "bg-purple-100 text-purple-700 border-purple-300" },
  IN_TRANSIT: { label: "Замд явна", className: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  DELIVERED: { label: "Хүргэсэн", className: "bg-green-100 text-green-700 border-green-300" },
  RETURNED: { label: "Буцаасан", className: "bg-orange-100 text-orange-700 border-orange-300" },
  CANCELLED: { label: "Цуцласан", className: "bg-red-100 text-red-700 border-red-300" }
};

export function StatusChip({ status }: { status: StatusType | string }) {
  const config = statusConfig[status as StatusType];
  
  // Fallback for unknown status
  if (!config) {
    return (
      <Badge variant="outline" className="text-xs">
        {status}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className={`text-xs border ${config.className}`}>
      {config.label}
    </Badge>
  );
}