import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { PaymentChip } from "./PaymentChip";
import { StatusChip } from "./StatusChip";
import { useAppContext } from "../App";
import { toast } from "sonner@2.0.3";
import { DriverFrameMobile } from "./DriverFrameMobile";
import { Hash } from "lucide-react";

const formatMNT = (amount: number | undefined | null) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '0₮';
  return `${amount.toLocaleString()}₮`;
};

export function DriverFrame() {
  // Check if mobile
  const isMobile = window.innerWidth < 768;
  
  if (isMobile) {
    return <DriverFrameMobile />;
  }

  return <DriverFrameDesktop />;
}

function DriverFrameDesktop() {
  const { orders, users, products, updateProduct } = useAppContext();
  const [activeTab, setActiveTab] = useState("my-list");

  // Filter orders assigned to current driver (mock: Бат)
  const myOrders = orders.filter(o => o.driver === "Бат");
  const unassignedOrders = orders.filter(o => !o.driver || o.driver === null);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList>
        <TabsTrigger value="my-list">миний жагсаалт ({myOrders.length})</TabsTrigger>
        <TabsTrigger value="new-select">шинэ сонгох ({unassignedOrders.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="my-list" className="space-y-4">
        <MyOrdersList orders={myOrders} />
      </TabsContent>

      <TabsContent value="new-select" className="space-y-4">
        <NewSelectTab orders={unassignedOrders} onAssign={() => setActiveTab("my-list")} />
      </TabsContent>
    </Tabs>
  );
}

function MyOrdersList({ orders }: { orders: any[] }) {
  const [filterTab, setFilterTab] = useState("all");
  
  const today = new Date().toISOString().split('T')[0];
  
  // Separate today and tomorrow orders
  const todayOrders = orders.filter(o => {
    const assignedDate = o.assignedDate || today;
    return assignedDate === today;
  });
  
  const tomorrowOrders = orders.filter(o => {
    const assignedDate = o.assignedDate || today;
    return assignedDate !== today;
  });

  const filterTabs = [
    { key: "all", label: "БГД", count: todayOrders.length },
    { key: "in_transit", label: "ЗАМД ЯВНА", count: todayOrders.filter(o => o.status === "IN_TRANSIT").length },
    { key: "delivered", label: "ХҮРГЭСЭН", count: todayOrders.filter(o => o.status === "DELIVERED").length },
    { key: "cancelled", label: "ЦУЦЛАСАН", count: todayOrders.filter(o => o.status === "CANCELLED").length },
    { key: "not_paid", label: "ТӨЛӨӨГҮЙ", count: todayOrders.filter(o => o.payment_state === "NOT_PAID").length },
    { key: "tomorrow", label: "МАРГААШИЙН АЖИЛ", count: tomorrowOrders.length }
  ];

  const filteredOrders = filterTab === "tomorrow"
    ? tomorrowOrders
    : filterTab === "all" 
      ? todayOrders 
      : todayOrders.filter(o => {
          if (filterTab === "in_transit") return o.status === "IN_TRANSIT";
          if (filterTab === "delivered") return o.status === "DELIVERED";
          if (filterTab === "cancelled") return o.status === "CANCELLED";
          if (filterTab === "not_paid") return o.payment_state === "NOT_PAID";
          return true;
        });

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterTabs.map((tab) => (
          <Button
            key={tab.key}
            variant={filterTab === tab.key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterTab(tab.key)}
            className="whitespace-nowrap"
          >
            {tab.label} ({tab.count})
          </Button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">#</TableHead>
              <TableHead className="w-48">Бараа/Дүн</TableHead>
              <TableHead className="w-32">Төлөв</TableHead>
              <TableHead className="w-[280px]">Хаяг</TableHead>
              <TableHead className="w-28">Утас</TableHead>
              <TableHead className="w-52">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Захиалга байхгүй
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <OrderRow 
                  key={order.id} 
                  order={order} 
                  isNotPaidTab={filterTab === "not_paid"}
                  isTomorrowTab={filterTab === "tomorrow"}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function OrderRow({ order, isNotPaidTab, isTomorrowTab }: { order: any; isNotPaidTab: boolean; isTomorrowTab: boolean }) {
  const { updateOrder, users, products, updateProduct } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank" | null>(
    isNotPaidTab ? "bank" : null
  );
  const [customOrder, setCustomOrder] = useState<string>(order.customOrder || "");
  const [isEditingOrder, setIsEditingOrder] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ 
    open: boolean; 
    type: "cancel" | "delivered-with-payment"; 
    note: string 
  }>({ open: false, type: "cancel", note: "" });

  const isPrepaid = order.prepaid;
  const isLocked = order.status === "DELIVERED" || order.status === "CANCELLED";

  // Check if driver has permission to work (Driver Lead approved)
  const currentDriver = users.find((d: any) => d.name === "Бат");
  const hasPermission = currentDriver?.started === true;
  
  // Format timestamp to MM/DD HH:mm
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const handleCancelClick = () => {
    // Check permission first
    if (!hasPermission) {
      toast.error("Ахлах зөшөөрөл олгоогүй байна", { 
        description: "Driver Lead 'Ажилд гарсан' товч дарж зөвшөөрөл өгөх шаардлагатай" 
      });
      return;
    }

    if (isLocked && order.status === "DELIVERED") {
      toast.error("Буцаах боломжгүй", { description: "Хүргэсэн захиалгыг цуцлах боломжгүй" });
      return;
    }
    setConfirmDialog({ open: true, type: "cancel", note: "" });
  };

  const handleDeliveredClick = () => {
    // Check permission first
    if (!hasPermission) {
      toast.error("Ахлах зөшөөрөл олгоогүй байна", { 
        description: "Driver Lead 'Ажилд гарсан' товч дарж зөвшөөрөл өгөх шаардлагатай" 
      });
      return;
    }

    if (isLocked && order.status === "CANCELLED") {
      toast.error("Буцаах боломжгүй", { description: "Цуцалсан захиалгыг хүргэх боломжгүй" });
      return;
    }

    // Deduct stock from warehouse when order is DELIVERED
    if (order.products && order.products.length > 0) {
      order.products.forEach((orderProduct: any) => {
        const product = products.find((p: any) => p.name === orderProduct.name);
        if (product) {
          updateProduct(product.id, {
            stock: product.stock - orderProduct.quantity
          });
        }
      });
    }

    // Logic 1: ТӨЛӨӨГҮЙ захиалга (мөнгө ороогүй + төлөөгүй tab)
    if (isNotPaidTab) {
      // Instant delivery without note
      updateOrder(order.id, {
        status: "DELIVERED",
        payment_method: "bank",
        history: [...(order.history || []), {
          timestamp: new Date().toISOString(),
          action: "DELIVERED",
          user: "Бат",
          note: "Хүргэсэн. Дансаар төлнө гэсэн (төлөөгүй жагсаалтаас)."
        }]
      });
      toast.success("Хүргэсэн");
      return;
    }

    // Logic 2: МӨНГӨ ОРСОН захиалга (prepaid=true)
    if (isPrepaid) {
      // Need note
      setConfirmDialog({ open: true, type: "delivered-with-payment", note: "" });
      return;
    }

    // Logic 3: МӨНГӨ ОРООГҮЙ захиалга (prepaid=false)
    // Must have payment method selected
    if (!paymentMethod) {
      toast.error("Төлбөрийн хэлбэр сонгоно уу", { description: "Бэлэн эсвэл данс сонгох шаардлагатай" });
      return;
    }

    // Instant delivery without note
    updateOrder(order.id, {
      status: "DELIVERED",
      payment_method: paymentMethod,
      payment_state: "PAID",
      history: [...(order.history || []), {
        timestamp: new Date().toISOString(),
        action: "DELIVERED",
        user: "Бат",
        note: `Хүргэсэн. ${paymentMethod === "cash" ? "Бэлэн мөнгөөр" : "Дансаар"} төлсөн.`
      }]
    });
    toast.success("Хүргэсэн");
  };

  const handleSaveOrder = () => {
    updateOrder(order.id, { customOrder });
    setIsEditingOrder(false);
    toast.success("Дараалал хадгалагдлаа");
  };

  const confirmAction = () => {
    const now = new Date().toISOString();

    if (!confirmDialog.note.trim()) {
      toast.error("Тайлбар оруулна уу!");
      return;
    }

    if (confirmDialog.type === "cancel") {
      // Return products to stock when order is cancelled
      if (order.products && order.products.length > 0) {
        order.products.forEach((orderProduct: any) => {
          const product = products.find((p: any) => p.name === orderProduct.name);
          if (product) {
            updateProduct(product.id, {
              stock: product.stock + orderProduct.quantity
            });
          }
        });
      }

      updateOrder(order.id, {
        status: "CANCELLED",
        goodsReturned: order.orderTotal,
        history: [...(order.history || []), {
          timestamp: now,
          action: "CANCELLED",
          user: "Бат",
          note: confirmDialog.note
        }]
      });
      toast.success("Захиалга цуцлагдсан");
    } else if (confirmDialog.type === "delivered-with-payment") {
      updateOrder(order.id, {
        status: "DELIVERED",
        history: [...(order.history || []), {
          timestamp: now,
          action: "DELIVERED",
          user: "Бат",
          note: confirmDialog.note
        }]
      });
      toast.success("Хүргэсэн");
    }

    setConfirmDialog({ open: false, type: "cancel", note: "" });
  };

  return (
    <>
      <TableRow className={isLocked ? "bg-gray-50 opacity-60" : ""}>
        <TableCell>
          <div className="flex flex-col gap-1">
            {/* Custom Order Number */}
            {isEditingOrder ? (
              <div className="flex items-center gap-1">
                <Hash className="w-3 h-3 text-gray-500" />
                <Input
                  type="number"
                  value={customOrder}
                  onChange={(e) => setCustomOrder(e.target.value)}
                  className="w-12 h-6 text-xs p-1"
                  placeholder="№"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveOrder();
                    } else if (e.key === "Escape") {
                      setIsEditingOrder(false);
                      setCustomOrder(order.customOrder || "");
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 px-1 text-xs"
                  onClick={handleSaveOrder}
                >
                  ✓
                </Button>
              </div>
            ) : (
              <div
                className="flex items-center gap-1 cursor-pointer hover:bg-blue-100 px-1 py-0.5 rounded -ml-1"
                onClick={() => setIsEditingOrder(true)}
                title="Дараалал засах"
              >
                <Hash className="w-3 h-3 text-gray-500" />
                <span className="text-sm font-bold text-blue-600">
                  {customOrder || "—"}
                </span>
              </div>
            )}
            
            {/* OPP Number (Operator-created order number) */}
            <div className="text-[10px] text-orange-600 leading-none font-medium">
              OPP: {order.opp || "—"}
            </div>
            
            {/* Timestamp and Order Number */}
            <div className="text-[10px] text-gray-500 leading-none">
              {formatTimestamp(order.created_at)}
            </div>
            <div className="text-xs leading-none text-gray-600">
              #{order.orderNumber}
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="space-y-1">
            {order.products && order.products.map((orderProduct: any, idx: number) => {
              // Fetch full product details from products context
              const fullProduct = products.find((p: any) => p.name === orderProduct.name);
              
              return (
                <div key={idx} className="flex items-center gap-2">
                  {fullProduct?.image && (
                    <img 
                      src={fullProduct.image} 
                      alt={orderProduct.name}
                      className="w-8 h-8 object-cover rounded border"
                    />
                  )}
                  <div className="flex-1">
                    <div className="text-sm font-medium">{orderProduct.name}</div>
                    <div className="text-xs text-gray-500">{orderProduct.quantity}ширхэг</div>
                  </div>
                </div>
              );
            })}
            {(!order.products || order.products.length === 0) && (
              <div className="text-sm text-gray-500">—</div>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">{formatMNT(order.orderTotal)}</div>
        </TableCell>
        <TableCell>
          <div className="flex flex-col gap-1">
            <StatusChip status={order.status} />
            <PaymentChip 
              paymentState={order.payment_state}
              paymentMethod={order.payment_method}
            />
          </div>
        </TableCell>
        <TableCell>
          <div className="break-words whitespace-normal w-[280px]">
            {order.address}
            {/* Only add district/province if not already in address */}
            {!order.address.includes(order.district) && order.district && `, ${order.district}`}
            {!order.address.includes(order.province) && order.province !== "Улаанбаатар" && `, ${order.province}`}
          </div>
          {order.operator_note && (
            <Badge variant="destructive" className="text-xs mt-1">
              санамж: {order.operator_note}
            </Badge>
          )}
        </TableCell>
        <TableCell className="text-sm">{order.customerPhone}</TableCell>
        <TableCell>
          {isTomorrowTab ? (
            // МАРГААШИЙН АЖИЛ: товчнууд disabled
            <div className="text-xs text-gray-500 italic">
              📅 Маргаашийн ажил
            </div>
          ) : isLocked ? (
            <div className="text-xs text-gray-500 italic">
              {order.status === "DELIVERED" ? "✓ Буцаах боломжгүй" : "✗ Буцаах боломжгүй"}
            </div>
          ) : (
            <div className="flex gap-1 flex-wrap">
              {isPrepaid ? (
                // МӨНГӨ ОРСОН захиалга: бэлэн/данс АЛГА, зөвхөн хүргэсэн + цуцлах
                <>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleDeliveredClick}
                    className="h-7 text-xs px-2 bg-green-50"
                  >
                    хүргэсэн
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={handleCancelClick}
                    className="h-7 text-xs px-2"
                  >
                    цуцлах
                  </Button>
                </>
              ) : isNotPaidTab ? (
                // ТӨЛӨӨГҮЙ tab: бэлэн/данс DISABLED (автоматаар данс), хүргэсэн + цуцлах
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    disabled
                    className="h-7 text-xs px-2 opacity-50 cursor-not-allowed"
                  >
                    бэлэн
                  </Button>
                  <Button 
                    size="sm" 
                    variant="default"
                    disabled
                    className="h-7 text-xs px-2 opacity-50 cursor-not-allowed"
                  >
                    данс
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleDeliveredClick}
                    className="h-7 text-xs px-2 bg-green-50"
                  >
                    хүргэсэн
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={handleCancelClick}
                    className="h-7 text-xs px-2"
                  >
                    цуцлах
                  </Button>
                </>
              ) : (
                // МӨНГӨ ОРООГҮЙ захиалга: бэлэн/днс toggle, хүргэсэн идэвхжинэ, цуцлах
                <>
                  <Button 
                    size="sm" 
                    variant={paymentMethod === "cash" ? "default" : "outline"}
                    onClick={() => setPaymentMethod(paymentMethod === "cash" ? null : "cash")}
                    className="h-7 text-xs px-2"
                  >
                    бэлэн
                  </Button>
                  <Button 
                    size="sm" 
                    variant={paymentMethod === "bank" ? "default" : "outline"}
                    onClick={() => setPaymentMethod(paymentMethod === "bank" ? null : "bank")}
                    className="h-7 text-xs px-2"
                  >
                    данс
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleDeliveredClick}
                    disabled={!paymentMethod}
                    className={`h-7 text-xs px-2 ${paymentMethod ? "bg-green-50" : "opacity-50 cursor-not-allowed"}`}
                  >
                    хүргэсэн
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={handleCancelClick}
                    className="h-7 text-xs px-2"
                  >
                    цуцлах
                  </Button>
                </>
              )}
            </div>
          )}
        </TableCell>
      </TableRow>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog.type === "cancel" ? "Цуцлах шалтгаан" : "Хүргэсэн тайлбар"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog.type === "cancel" 
                ? "Захиалгыг яагаад цуцалж байгаа талаар тайлбар бичнэ үү. Энэ тайлбар түүхэнд хадгалагдана."
                : "Мөнгө орсон захиалга учир хүргэсэн тэмдэглэл бичнэ үү. Энэ тайлбар түүхэнд хадгалагдана."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Тайлбар бичих..."
            value={confirmDialog.note}
            onChange={(e) => setConfirmDialog({ ...confirmDialog, note: e.target.value })}
            className="min-h-24"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
              Болих
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Батлах
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function NewSelectTab({ orders, onAssign }: { orders: any[]; onAssign: () => void }) {
  const { updateOrder, users, getMongolianTime } = useAppContext();
  const [showProvince, setShowProvince] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");

  const districts = [
    "Баянгол", "Баянзүрх", "Сүхбаатар", "Чингэлтэй", 
    "Хан-Уул", "Налайх", "Багануур", "Багахангай", "Сонгинохайрхан"
  ];

  // Filter orders based on selection
  const filteredOrders = orders.filter(order => {
    if (showProvince) {
      // Show all province orders (not Улаанбаатар)
      return order.province !== "Улаанбаатар";
    } else if (selectedDistrict) {
      // Show specific district orders
      return order.district === selectedDistrict && order.province === "Улаанбаатар";
    }
    // Show all when nothing selected
    return true;
  });

  const handleAssignToSelf = (order: any) => {
    const today = getMongolianTime();
    
    // Find current driver (Бат)
    const currentDriver = users.find(d => d.name === "Бат");
    
    // Determine date based on driver's started status
    let targetDate = new Date(today);
    if (currentDriver && currentDriver.started) {
      // Driver already started work today -> assign to tomorrow
      targetDate.setDate(targetDate.getDate() + 1);
      toast.info(`Та ажилд гарсан учир захиалга маргаашийн ажилруу орлоо!`);
    }
    
    const targetDateStr = targetDate.toISOString().split('T')[0];
    
    updateOrder(order.id, {
      driver: "Бат",
      status: "IN_TRANSIT",
      assignedDate: targetDateStr,
      created_at: targetDate.toISOString(), // ⬅️ created_at өөрчлөх!
      history: [
        ...(order.history || []),
        {
          timestamp: new Date().toISOString(),
          action: "Захиалга жолоочид хуваарилагдсан",
          user: "Бат",
          note: `Өөрт авсан${currentDriver?.started ? ' (маргаашийн ажил)' : ''}`
        }
      ]
    });
    toast.success(`#${order.orderNumber} ${currentDriver?.started ? 'маргаашийн ажилруу' : 'өнөөдрийн ажилруу'} эмэгдлээ!`);
  };

  // Format timestamp to MM/DD HH:mm
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-2 block">Дүүрэг</label>
            <Select 
              value={selectedDistrict} 
              onValueChange={(val) => {
                setSelectedDistrict(val);
                setShowProvince(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Дүүрэг сонгох" />
              </SelectTrigger>
              <SelectContent>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-2 block">&nbsp;</label>
            <Button
              variant={showProvince ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                setShowProvince(!showProvince);
                setSelectedDistrict("");
              }}
            >
              Аймаг
            </Button>
          </div>
        </div>

        {/* Display filter status */}
        <div className="mt-3 text-sm text-gray-600">
          {showProvince && "Орон нутгийн захиалгууд"}
          {selectedDistrict && `${selectedDistrict} дүүргийн захиалгууд`}
          {!showProvince && !selectedDistrict && "Бүх захиалга"}
          {" "}({filteredOrders.length})
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">#</TableHead>
              <TableHead className="w-48">Бараа/Дүн</TableHead>
              <TableHead>Хаяг</TableHead>
              <TableHead className="w-28">Утас</TableHead>
              <TableHead className="w-32">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-8">
                  Шинэ захиалга байхгүй
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="text-[10px] text-gray-500 leading-none mb-0.5">
                        {formatTimestamp(order.created_at)}
                      </div>
                      <div className="text-sm leading-none">
                        #{order.orderNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{order.customerName || "Хэрэглэгч"}</div>
                    <div className="text-xs text-gray-500">{formatMNT(order.orderTotal)}</div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="break-words whitespace-normal">
                      {order.address}
                      {/* Only add district/province if not already in address */}
                      {!order.address.includes(order.district) && order.district && `, ${order.district}`}
                      {!order.address.includes(order.province) && order.province !== "Улаанбаатар" && `, ${order.province}`}
                    </div>
                    {order.operator_note && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        санамж: {order.operator_note}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{order.customerPhone}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleAssignToSelf(order)} className="h-7 text-xs">
                      өөрт авах
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}