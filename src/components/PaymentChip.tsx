import { Badge } from "./ui/badge";

type PaymentState = "NOT_PAID" | "PAID_TO_DRIVER" | "PAID_TO_COMPANY" | "PAID";
type PaymentMethod = "CASH" | "CARD" | "TRANSFER" | "QPAY";

const paymentConfig: Record<PaymentState, { label: string; className: string }> = {
  PAID_TO_COMPANY: { label: "✓ КОМПАНИД", className: "bg-green-100 text-green-700 border-green-300" },
  PAID_TO_DRIVER: { label: "✓ ЖОЛООЧИД", className: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  PAID: { label: "✓ ТӨЛСӨН", className: "bg-green-100 text-green-700 border-green-300" },
  NOT_PAID: { label: "⊗ ТӨЛӨӨГҮЙ", className: "bg-red-100 text-red-700 border-red-300" }
};

export function PaymentChip({ 
  paymentState,
  paymentMethod
}: { 
  paymentState: PaymentState;
  paymentMethod?: PaymentMethod;
}) {
  const config = paymentConfig[paymentState];
  
  if (!config) {
    return (
      <Badge variant="outline" className="text-xs">
        {paymentState}
      </Badge>
    );
  }
  
  return (
    <Badge variant="outline" className={`text-xs border ${config.className}`}>
      {config.label}
    </Badge>
  );
}