import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { PaymentChip } from "./PaymentChip";
import { StatusChip } from "./StatusChip";
import { useAppContext } from "../App";
import { toast } from "sonner@2.0.3";
import { ChevronDown, ChevronUp, Phone, MapPin, DollarSign, Hash } from "lucide-react";

const formatMNT = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0₮';
  return `${amount.toLocaleString()}₮`;
};

export function DriverFrameMobile() {
  const { orders, users } = useAppContext();
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  // Current driver (mock: Бат)
  const currentDriver = users.find((d: any) => d.name === "Бат");
  const hasPermission = currentDriver?.started === true;

  // Filter orders assigned to current driver
  const myOrders = orders.filter(o => o.driver === "Бат");

  const today = new Date().toISOString().split('T')[0];
  
  const todayOrders = myOrders.filter(o => {
    const assignedDate = o.assignedDate || today;
    return assignedDate === today;
  });

  // Calculate totals
  const cashTotal = todayOrders
    .filter(o => o.status === "DELIVERED" && o.payment_state === "PAID_TO_DRIVER" && o.payment_method === "cash")
    .reduce((sum, o) => sum + o.orderTotal, 0);

  const bankTotal = todayOrders
    .filter(o => o.status === "DELIVERED" && o.payment_state === "PAID_TO_DRIVER" && o.payment_method === "bank")
    .reduce((sum, o) => sum + o.orderTotal, 0);

  const filterTabs = [
    { key: "all", label: "БҮГД", count: todayOrders.length },
    { key: "in_transit", label: "ЗАМД", count: todayOrders.filter(o => o.status === "IN_TRANSIT").length },
    { key: "delivered", label: "ХҮРГЭСЭН", count: todayOrders.filter(o => o.status === "DELIVERED").length },
    { key: "not_paid", label: "ТӨЛӨӨГҮЙ", count: todayOrders.filter(o => o.payment_state === "NOT_PAID").length },
  ];

  const filteredOrders = activeTab === "all" 
    ? todayOrders 
    : todayOrders.filter(o => {
        if (activeTab === "in_transit") return o.status === "IN_TRANSIT";
        if (activeTab === "delivered") return o.status === "DELIVERED";
        if (activeTab === "not_paid") return o.payment_state === "NOT_PAID";
        return true;
      });

  const toggleExpand = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Money Summary - Sticky Top */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-600 to-green-700 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm opacity-90">Өнөөдрийн орлого</span>
          </div>
          {!hasPermission && (
            <Badge variant="destructive" className="text-xs">
              🔒 Ахлах зөвшөөрөөгүй
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
            <div className="text-xs opacity-80 mb-1">💵 Бэлэн</div>
            <div className="text-xl font-bold">{formatMNT(cashTotal)}</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 backdrop-blur">
            <div className="text-xs opacity-80 mb-1">💳 Данс</div>
            <div className="text-xl font-bold">{formatMNT(bankTotal)}</div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-white/20 text-center">
          <div className="text-xs opacity-80">Нийт</div>
          <div className="text-2xl font-bold">{formatMNT(cashTotal + bankTotal)}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-[168px] z-10 bg-white border-b shadow-sm p-2 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {filterTabs.map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className="whitespace-nowrap text-xs h-8"
            >
              {tab.label} <Badge variant="secondary" className="ml-1 text-xs">{tab.count}</Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="p-3 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📦</div>
            <div>Захиалга байхгүй</div>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <MobileOrderCard
              key={order.id}
              order={order}
              isExpanded={expandedOrders.has(order.id)}
              onToggleExpand={() => toggleExpand(order.id)}
              isNotPaidTab={activeTab === "not_paid"}
              hasPermission={hasPermission}
            />
          ))
        )}
      </div>
    </div>
  );
}

function MobileOrderCard({ 
  order, 
  isExpanded, 
  onToggleExpand, 
  isNotPaidTab,
  hasPermission 
}: { 
  order: any; 
  isExpanded: boolean; 
  onToggleExpand: () => void;
  isNotPaidTab: boolean;
  hasPermission: boolean;
}) {
  const { updateOrder } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank" | null>(null);
  const [customOrder, setCustomOrder] = useState<string>(order.customOrder || "");
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ 
    open: boolean; 
    type: "cancel" | "delivered"; 
    note: string 
  }>({ open: false, type: "cancel", note: "" });

  const isPrepaid = order.prepaid;
  const isLocked = order.status === "DELIVERED" || order.status === "CANCELLED";

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const handleSaveOrder = () => {
    updateOrder(order.id, { customOrder });
    setIsEditingOrder(false);
    toast.success("Дараалал хадгалагдлаа");
  };

  const handleCancelClick = () => {
    if (!hasPermission) {
      toast.error("🔒 Ахлах зөвшөөрөл олгоогүй байна");
      return;
    }
    if (isLocked && order.status === "DELIVERED") {
      toast.error("Хүргэсэн захиалгыг цуцлах боломжгүй");
      return;
    }
    setConfirmDialog({ open: true, type: "cancel", note: "" });
  };

  const handleDeliveredClick = () => {
    if (!hasPermission) {
      toast.error("🔒 Ахлах зөвшөөрөл олгоогүй байна");
      return;
    }
    if (isLocked && order.status === "CANCELLED") {
      toast.error("Цуцалсан захиалгыг хүргэх боломжгүй");
      return;
    }

    // If prepaid, instant delivery
    if (isPrepaid) {
      updateOrder(order.id, {
        status: "DELIVERED",
        payment_state: "PAID_TO_COMPANY",
        history: [
          ...(order.history || []),
          { timestamp: new Date().toISOString(), action: "Хүргэлээ", user: "Жолооч: Бат", note: "Урьдчилгаа төлбөртэй" }
        ]
      });
      toast.success("✅ Хүргэлээ!");
      return;
    }

    // Not paid tab - instant delivery with payment method
    if (isNotPaidTab && paymentMethod) {
      updateOrder(order.id, {
        status: "DELIVERED",
        payment_state: "PAID_TO_DRIVER",
        payment_method: paymentMethod,
        history: [
          ...(order.history || []),
          { 
            timestamp: new Date().toISOString(), 
            action: "Хүргэлээ", 
            user: "Жолооч: Бат", 
            note: `${paymentMethod === "cash" ? "💵 Бэлэн" : "💳 Данс"}аар төлсөн` 
          }
        ]
      });
      toast.success(`✅ Хүргэлээ! ${paymentMethod === "cash" ? "💵 Бэлэн" : "💳 Данс"}`);
      return;
    }

    // Regular delivery - ask for payment method
    setConfirmDialog({ open: true, type: "delivered", note: "" });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.type === "cancel") {
      updateOrder(order.id, {
        status: "CANCELLED",
        history: [
          ...(order.history || []),
          { 
            timestamp: new Date().toISOString(), 
            action: "Цуцаллаа", 
            user: "Жолооч: Бат",
            note: confirmDialog.note || undefined
          }
        ]
      });
      toast.success("❌ Цуцаллаа");
    } else if (confirmDialog.type === "delivered") {
      if (!paymentMethod && !isPrepaid) {
        toast.error("Төлбөрийн хэлбэр сонгоно уу!");
        return;
      }

      updateOrder(order.id, {
        status: "DELIVERED",
        payment_state: "PAID_TO_DRIVER",
        payment_method: paymentMethod,
        history: [
          ...(order.history || []),
          { 
            timestamp: new Date().toISOString(), 
            action: "Хүргэлээ", 
            user: "Жолооч: Бат",
            note: confirmDialog.note || `${paymentMethod === "cash" ? "💵 Бэлэн" : "💳 Данс"}аар төлсөн`
          }
        ]
      });
      toast.success(`✅ Хүргэлээ! ${paymentMethod === "cash" ? "💵 Бэлэн" : "💳 Данс"}`);
    }

    setConfirmDialog({ open: false, type: "cancel", note: "" });
  };

  return (
    <>
      <Card className={`overflow-hidden ${isLocked ? 'opacity-60' : ''}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 border-b">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {/* Custom Order Number */}
              {isEditingOrder ? (
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-gray-500" />
                  <Input
                    type="number"
                    value={customOrder}
                    onChange={(e) => setCustomOrder(e.target.value)}
                    className="w-16 h-6 text-sm p-1"
                    placeholder="№"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={handleSaveOrder}
                  >
                    ✓
                  </Button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-1 cursor-pointer hover:bg-blue-200 px-2 py-1 rounded"
                  onClick={() => setIsEditingOrder(true)}
                >
                  <Hash className="w-3 h-3 text-gray-500" />
                  <span className="text-lg font-bold text-blue-600">
                    {customOrder || "—"}
                  </span>
                </div>
              )}
              <div className="text-xs text-gray-500">
                #{order.orderNumber}
              </div>
              {/* OPP Number */}
              <div className="text-xs text-orange-600 font-medium">
                OPP: {order.opp || "—"}
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {formatTimestamp(order.created_at)}
            </div>
          </div>

          <div className="flex gap-2">
            <StatusChip status={order.status} />
            <PaymentChip paymentState={order.payment_state} />
          </div>
        </div>

        {/* Product Preview */}
        <div className="p-3 bg-white">
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <div className="font-medium">{order.customerName || "Хэрэглэгч"}</div>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {formatMNT(order.orderTotal)}
            </div>
          </div>

          {isPrepaid && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 mb-2">
              ✓ Урьдчилсан төлбөр
            </Badge>
          )}

          {/* Contact & Address */}
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${order.customerPhone}`} className="text-blue-600 font-medium">
                {order.customerPhone}
              </a>
              {order.extraPhone && (
                <span className="text-gray-500">/ {order.extraPhone}</span>
              )}
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-gray-900">{order.address}</div>
                <div className="text-xs text-gray-500">{order.district}</div>
              </div>
            </div>
          </div>

          {order.operator_note && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              ⚠️ {order.operator_note}
            </div>
          )}

          {/* Expand Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-2 text-xs"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              <>Хураах <ChevronUp className="w-3 h-3 ml-1" /></>
            ) : (
              <>Түүх харах <ChevronDown className="w-3 h-3 ml-1" /></>
            )}
          </Button>

          {/* Expanded Details - Show History */}
          {isExpanded && order.history && order.history.length > 0 && (
            <div className="mt-3 pt-3 border-t space-y-2">
              <div className="text-xs font-medium text-gray-600 mb-2">Түүх</div>
              {order.history.map((h: any, idx: number) => (
                <div key={idx} className="text-xs text-gray-600">
                  <div className="font-medium">{h.action}</div>
                  <div className="text-gray-500">{h.user} • {new Date(h.timestamp).toLocaleString('mn-MN')}</div>
                  {h.note && <div className="text-gray-700 italic">"{h.note}"</div>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {!isLocked && (
          <div className="p-3 bg-gray-50 border-t space-y-2">
            {/* Payment Method Selection - Only for not paid orders */}
            {!isPrepaid && order.payment_state === "NOT_PAID" && (
              <div className="flex gap-2">
                <Button
                  variant={paymentMethod === "cash" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setPaymentMethod("cash")}
                >
                  💵 Бэлэн
                </Button>
                <Button
                  variant={paymentMethod === "bank" ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setPaymentMethod("bank")}
                >
                  💳 Данс
                </Button>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={handleCancelClick}
                disabled={!hasPermission}
              >
                ❌ Цуцлах
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleDeliveredClick}
                disabled={!hasPermission || (!isPrepaid && !paymentMethod && !isNotPaidTab)}
              >
                ✅ Хүргэсэн
              </Button>
            </div>

            {!hasPermission && (
              <div className="text-xs text-center text-red-600">
                🔒 Ахлах зөвшөөрөл шаардлагатай
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent className="max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "cancel" ? "❌ Цуцлах уу?" : "✅ Хүргэсэн үү?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "cancel" 
                ? "Захиалгыг цуцлахдаа итгэлтэй байна уу?"
                : "Хүргэлтийг баталгаажуулж байна."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Тайлбар (заавал биш)"
            value={confirmDialog.note}
            onChange={(e) => setConfirmDialog({ ...confirmDialog, note: e.target.value })}
            className="text-sm"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Буцах</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              Тийм
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}