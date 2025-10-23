import { useState } from "react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Card, CardContent } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Lock, Unlock, Eye, DollarSign, CheckCircle, RotateCcw, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { DateTabs } from "./DateTabs";
import { useAppContext } from "../App";
import { getDateByOffset } from "../App";
import { StatusChip } from "./StatusChip";
import { PaymentChip } from "./PaymentChip";
import { Pagination } from "./Pagination";
import { ProductThumb } from "./ProductThumb";

type Driver = {
  id: number;
  name: string;
  started: boolean;
  startedDate?: string;
};

const formatMNT = (amount: number) => {
  return `${amount.toLocaleString()}₮`;
};

export function AccountingFrame() {
  const { selectedDate, setSelectedDate, orders, users, updateOrder, getMongolianTime } = useAppContext();
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const [isLocked, setIsLocked] = useState(false);
  const [selectedDriverDetail, setSelectedDriverDetail] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Convert selectedDate to actual date using Mongolian time
  const getActualDate = () => {
    const baseDate = getMongolianTime(); // Use Mongolian time
    if (selectedDate === "yesterday") {
      baseDate.setDate(baseDate.getDate() - 1);
    } else if (selectedDate === "dayBefore") {
      baseDate.setDate(baseDate.getDate() - 2);
    } else if (selectedDate === "tomorrow") {
      baseDate.setDate(baseDate.getDate() + 1);
    }
    // else selectedDate === "today", use current date
    return baseDate.toISOString().split('T')[0];
  };

  const currentDate = getActualDate();

  // Helper function to get the date when order was completed (DELIVERED or CANCELLED)
  const getCompletedDate = (order: any): string | null => {
    if (!order.history || order.history.length === 0) return null;
    
    // Find the last DELIVERED or CANCELLED action in history
    const completionAction = [...order.history]
      .reverse()
      .find((h: any) => h.action === "DELIVERED" || h.action === "CANCELLED");
    
    if (completionAction && completionAction.timestamp) {
      try {
        return new Date(completionAction.timestamp).toISOString().split('T')[0];
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  // Filter orders by date logic:
  // - For DELIVERED/CANCELLED orders: use completion date from history
  // - For IN_TRANSIT orders: use assignedDate
  const todayOrders = orders.filter(o => {
    // For completed orders, check completion date
    if (o.status === "DELIVERED" || o.status === "CANCELLED") {
      const completedDate = getCompletedDate(o);
      if (completedDate) {
        return completedDate === currentDate;
      }
    }
    
    // For in-transit orders or fallback, use assignedDate
    const dateToCheck = o.assignedDate || (o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : null);
    
    if (!dateToCheck) return false;
    
    try {
      return dateToCheck === currentDate;
    } catch (error) {
      console.error('Invalid date for order:', o.id, dateToCheck);
      return false;
    }
  });

  // Calculate KPI from real data
  const calculateKPI = (driverFilter: string = "all") => {
    let filteredOrders = todayOrders;
    
    if (driverFilter !== "all") {
      filteredOrders = todayOrders.filter(o => o.driver === driverFilter);
    }

    const total = filteredOrders.length;
    const delivered = filteredOrders.filter(o => o.status === "DELIVERED").length;
    const cancelled = filteredOrders.filter(o => o.status === "CANCELLED").length;
    
    // Орон нутаг = prepaid буюу мөнгө орсон захиалга
    const countryside = filteredOrders.filter(o => o.prepaid === true).length;

    // Нийт авч явсан барааны дүн (бүх захиалга)
    const totalAmount = filteredOrders.reduce((sum, o) => sum + (o.orderTotal || 0), 0);
    
    // Хүргэсэн барааны дүн
    const deliveredAmount = filteredOrders
      .filter(o => o.status === "DELIVERED")
      .reduce((sum, o) => sum + (o.orderTotal || 0), 0);
    
    // Орон нутгийн барааны дүн (мөнгө орсон)
    const countrysideAmount = filteredOrders
      .filter(o => o.prepaid === true)
      .reduce((sum, o) => sum + (o.orderTotal || 0), 0);
    
    // Цуцласан барааны дүн
    const cancelledAmount = filteredOrders
      .filter(o => o.status === "CANCELLED")
      .reduce((sum, o) => sum + (o.orderTotal || 0), 0);

    // Төлбөрийн төлөв
    const paidToDriver = filteredOrders
      .filter(o => o.payment_state === "PAID_TO_DRIVER")
      .reduce((sum, o) => sum + (o.orderTotal || 0), 0);
    const paidToCompany = filteredOrders
      .filter(o => o.payment_state === "PAID_TO_COMPANY")
      .reduce((sum, o) => sum + (o.orderTotal || 0), 0);

    // Жолоочийн цалин: хүргэсэн захиалга * 5000₮
    const driverSalary = delivered * 5000;

    // Хүлээн авах дүн = Нийт - Орон нутаг - Цуцласан - Цалин
    const toReceive = totalAmount - countrysideAmount - cancelledAmount - driverSalary;

    return {
      total,
      delivered,
      cancelled,
      countryside,
      totalAmount,
      deliveredAmount,
      countrysideAmount,
      cancelledAmount,
      paidToDriver,
      paidToCompany,
      driverSalary,
      toReceive
    };
  };

  const kpi = calculateKPI(selectedDriver);

  // Get all drivers from context
  const allDrivers: Driver[] = users.filter((u: any) => u.role === "driver").map((u: any) => ({
    id: u.id,
    name: u.name,
    started: u.started || false,
    startedDate: u.startedDate
  }));

  // Get unique driver names from orders
  const driverNamesFromOrders = Array.from(
    new Set(todayOrders.map(o => o.driver).filter(Boolean))
  );

  const handleLock = () => {
    if (isLocked) {
      toast.info("Өдөр түгжээтэй байна");
      return;
    }
    setIsLocked(true);
    toast.success(`${currentDate} огноо амжилттай түгжигдлээ`);
  };

  const handleUnlock = () => {
    setIsLocked(false);
    toast.info(`${currentDate} огноо түгжээ тайлагдлаа`);
  };

  const handlePaymentChange = (orderId: number, currentState: string) => {
    if (isLocked) {
      toast.error("Түгжээтэй өдөр - засварлах боломжгүй");
      return;
    }

    let newState = currentState;
    
    // Төлбөрийн төлөв солих логик
    if (currentState === "NOT_PAID") {
      newState = "PAID_TO_DRIVER";
      toast.success("Төлбөрийн төлөв: Жолоочид төлсөн");
    } else if (currentState === "PAID_TO_DRIVER") {
      newState = "PAID_TO_COMPANY";
      toast.success("Төлбөрийн төлөв: Компанид төлсөн");
    } else if (currentState === "PAID_TO_COMPANY") {
      toast.info("Төлбөр компанид төлөгдсөн байна");
      return;
    }

    updateOrder(orderId, { payment_state: newState });
  };

  const handleStatusToggle = (orderId: number, currentStatus: string) => {
    if (isLocked) {
      toast.error("Түгжээтэй өдөр - засварлах боломжгүй");
      return;
    }

    let newStatus = currentStatus;
    
    if (currentStatus === "CANCELLED") {
      newStatus = "DELIVERED";
      toast.success("Захиалга ХҮРГЭСЭН болгогдлоо");
    } else if (currentStatus === "DELIVERED") {
      newStatus = "CANCELLED";
      toast.success("Захиалга ЦУЦЛАСАН болгогдл��о");
    }

    updateOrder(orderId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Нягтлан бодох бүртгэл</h1>
          <p className="text-sm text-gray-500">
            {currentDate} | {todayOrders.length} захиалга
          </p>
        </div>
        <Button 
          onClick={isLocked ? handleUnlock : handleLock}
          variant={isLocked ? "secondary" : "default"}
          className="gap-2"
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4" />
              Түгжээтэй
            </>
          ) : (
            <>
              <Unlock className="w-4 h-4" />
              LOCK
            </>
          )}
        </Button>
      </div>

      {/* Date Tabs */}
      <DateTabs 
        selectedDate={selectedDate} 
        onSelectDate={setSelectedDate} 
        getMongolianTime={getMongolianTime}
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="w-64">
          <Label>Жолооч</Label>
          <Select value={selectedDriver} onValueChange={setSelectedDriver}>
            <SelectTrigger>
              <SelectValue placeholder="Бүгд" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="all">Бүгд</SelectItem>
              {allDrivers.map((d) => (
                <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {isLocked && (
          <Badge variant="destructive" className="mt-6">
            Түгжээтэй өдөр - Засварлах боломжгүй
          </Badge>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-5 gap-4">
        <KPICard title="Нийт" value={kpi.total.toString()} />
        <KPICard title="Хүргэсэн" value={kpi.delivered.toString()} className="bg-green-50" />
        <KPICard title="Орон нутаг" value={kpi.countryside.toString()} className="bg-blue-50" />
        <KPICard title="Цуцлагдсан" value={kpi.cancelled.toString()} className="bg-red-50" />
        <KPICard title="Нийт дүн" value={formatMNT(kpi.totalAmount)} className="bg-indigo-50" />
        
        <KPICard title="Орон нутгийн дүн" value={formatMNT(kpi.countrysideAmount)} className="bg-blue-50" />
        <KPICard title="Цуцласан дүн" value={formatMNT(kpi.cancelledAmount)} className="bg-red-50" />
        <KPICard title="Жолооч цалин" value={formatMNT(kpi.driverSalary)} className="bg-purple-50" />
        <KPICard title="Хүлээн авах дүн" value={formatMNT(kpi.toReceive)} className="bg-orange-50" />
      </div>

      {/* Driver Summary Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b">
          <h3>Жолооч бүрийн тайлан</h3>
          <p className="text-sm text-gray-500">Өдрийн эцсийн тооцоо</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Жолооч</TableHead>
              <TableHead className="text-center">Хүргэсэн</TableHead>
              <TableHead className="text-center">Цуцалсан</TableHead>
              <TableHead className="text-right">Хүргэсэн дүн</TableHead>
              <TableHead className="text-right">Жолоочид төлсөн</TableHead>
              <TableHead className="text-right">Компанид төлсөн</TableHead>
              <TableHead className="text-right">Цалин (3К/зах)</TableHead>
              <TableHead className="text-right">Хүлээлгэх</TableHead>
              <TableHead className="text-center">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {driverNamesFromOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                  Өнөөдөр захиалга байхгүй
                </TableCell>
              </TableRow>
            ) : (
              driverNamesFromOrders.map((driverName) => {
                const driverKPI = calculateKPI(driverName);
                return (
                  <TableRow key={driverName}>
                    <TableCell>{driverName}</TableCell>
                    <TableCell className="text-center">{driverKPI.delivered}</TableCell>
                    <TableCell className="text-center">{driverKPI.cancelled}</TableCell>
                    <TableCell className="text-right">{formatMNT(driverKPI.deliveredAmount)}</TableCell>
                    <TableCell className="text-right text-purple-600">
                      {formatMNT(driverKPI.paidToDriver)}
                    </TableCell>
                    <TableCell className="text-right text-blue-600">
                      {formatMNT(driverKPI.paidToCompany)}
                    </TableCell>
                    <TableCell className="text-right text-indigo-600">
                      {formatMNT(driverKPI.driverSalary)}
                    </TableCell>
                    <TableCell className="text-right text-orange-600">
                      {formatMNT(driverKPI.toReceive)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDriverDetail(driverName)}
                        className="h-7 px-2"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Дэлгэрэнгүй
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Driver Detail Dialog */}
      {selectedDriverDetail && (
        <DriverDetailDialog
          driverName={selectedDriverDetail}
          orders={todayOrders.filter(o => o.driver === selectedDriverDetail)}
          isLocked={isLocked}
          onClose={() => setSelectedDriverDetail(null)}
        />
      )}

      {/* Selected Driver Orders Table */}
      {selectedDriver !== "all" && (
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b">
            <h3>{selectedDriver}-ийн захиалгууд</h3>
            <p className="text-sm text-gray-500">
              {todayOrders.filter(o => o.driver === selectedDriver).length} захиалга
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Дугаар</TableHead>
                <TableHead className="w-48">Бараа</TableHead>
                <TableHead className="w-32">Утас</TableHead>
                <TableHead>Хаяг</TableHead>
                <TableHead className="w-28">Төлөв</TableHead>
                <TableHead className="w-32">Төлбөр</TableHead>
                <TableHead className="w-24 text-right">Дүн</TableHead>
                <TableHead className="w-32 text-center">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayOrders.filter(o => o.driver === selectedDriver).length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    {selectedDriver} жолоочийн захиалга байхгүй
                  </TableCell>
                </TableRow>
              ) : (
                todayOrders.filter(o => o.driver === selectedDriver).map((order) => {
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="text-sm">
                        #{order.orderNumber}
                        {order.opp && (
                          <div className="text-[10px] text-orange-600 font-medium">
                            OPP: {order.opp}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{order.customerName}</div>
                      </TableCell>
                      <TableCell className="text-sm">{order.customerPhone}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {order.address}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={order.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentChip 
                          paymentState={order.payment_state}
                          paymentMethod={order.payment_method}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {formatMNT(order.orderTotal)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Status Toggle Button */}
                          {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle(order.id, order.status)}
                              disabled={isLocked}
                              className="h-7 px-2 text-xs"
                            >
                              {order.status === "DELIVERED" ? (
                                <>
                                  <XCircle className="w-3 h-3 mr-1 text-red-600" />
                                  Цуцлах
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                                  Хүргэсэн
                                </>
                              )}
                            </Button>
                          )}
                          
                          {/* Payment Change Button */}
                          {order.status === "DELIVERED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePaymentChange(order.id, order.payment_state)}
                              disabled={isLocked || order.payment_state === "PAID_TO_COMPANY"}
                              className="h-7 px-2 text-xs"
                            >
                              {order.payment_state === "NOT_PAID" && (
                                <>
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Жолоочид
                                </>
                              )}
                              {order.payment_state === "PAID_TO_DRIVER" && (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Компанид
                                </>
                              )}
                              {order.payment_state === "PAID_TO_COMPANY" && (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                                  Дууссан
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-900 mb-2">Тайлбар</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Орон нутаг</strong> = Урьдчилан мөнгө орсон захиалга (prepaid)</li>
          <li>• <strong>Нийт дүн</strong> = Жолооч авч явсан бүх захиалгын дүн</li>
          <li>• <strong>Жолоочийн цалин</strong> = Хүргэсэн захиалга × 5,000₮</li>
          <li>• <strong>Хүлээн авах дүн</strong> = Нийт дүн - Орон нутгийн дүн - Цуцласан дүн - Жолооч цалин</li>
          <li>• LOCK товч дарсны дараа өдрийг түгжиж, засварлах боломжгүй болно</li>
        </ul>
      </div>
    </div>
  );
}

function KPICard({ title, value, className = "" }: { title: string; value: string; className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <div className="text-sm text-gray-600 mb-1">{title}</div>
        <div className="text-2xl">{value}</div>
      </CardContent>
    </Card>
  );
}

function DriverDetailDialog({
  driverName,
  orders,
  isLocked,
  onClose
}: {
  driverName: string;
  orders: any[];
  isLocked: boolean;
  onClose: () => void;
}) {
  const { updateOrder } = useAppContext();

  const deliveredOrders = orders.filter(o => o.status === "DELIVERED");
  const cancelledOrders = orders.filter(o => o.status === "CANCELLED");
  
  const totalDelivered = deliveredOrders.reduce((sum, o) => sum + (o.orderTotal || 0), 0);
  const paidToDriver = orders.filter(o => o.payment_state === "PAID_TO_DRIVER").reduce((sum, o) => sum + (o.orderTotal || 0), 0);
  const paidToCompany = orders.filter(o => o.payment_state === "PAID_TO_COMPANY").reduce((sum, o) => sum + (o.orderTotal || 0), 0);
  const salary = deliveredOrders.length * 3000;
  const toReceive = paidToDriver - salary;

  const handlePaymentChange = (orderId: number, currentState: string) => {
    if (isLocked) {
      toast.error("Түгжээтэй өдөр - засварлах боломжгүй");
      return;
    }

    let newState = currentState;
    
    // Төлбөрийн төлөв солих логик
    if (currentState === "NOT_PAID") {
      newState = "PAID_TO_DRIVER";
      toast.success("Төлбөрийн төлөв: Жолоочид төлсөн");
    } else if (currentState === "PAID_TO_DRIVER") {
      newState = "PAID_TO_COMPANY";
      toast.success("Төлбөрийн төлөв: Компанид төлсөн");
    } else if (currentState === "PAID_TO_COMPANY") {
      toast.info("Төлбөр компанид төлөгдсөн байна");
      return;
    }

    updateOrder(orderId, { payment_state: newState });
  };

  const handleStatusToggle = (orderId: number, currentStatus: string) => {
    if (isLocked) {
      toast.error("Түгжээтэй өдөр - засварлах боломжгүй");
      return;
    }

    let newStatus = currentStatus;
    
    if (currentStatus === "CANCELLED") {
      newStatus = "DELIVERED";
      toast.success("Захиалга ХҮРГЭСЭН болгогдлоо");
    } else if (currentStatus === "DELIVERED") {
      newStatus = "CANCELLED";
      toast.success("Захиалга ЦУЦЛАСАН болгогдлоо");
    }

    updateOrder(orderId, { status: newStatus });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{driverName}-ийн дэлгэрэнгүй тайлан</DialogTitle>
          <DialogDescription className="sr-only">
            Жолоочийн захиалга, төлбөрийн дэлгэрэнгүй
          </DialogDescription>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-5 gap-3">
          <Card className="bg-green-50">
            <CardContent className="pt-4">
              <div className="text-xs text-gray-600">Хүргэсэн</div>
              <div className="text-xl">{deliveredOrders.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-red-50">
            <CardContent className="pt-4">
              <div className="text-xs text-gray-600">Цуцалсан</div>
              <div className="text-xl">{cancelledOrders.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50">
            <CardContent className="pt-4">
              <div className="text-xs text-gray-600">Хүргэсэн дүн</div>
              <div className="text-lg">{formatMNT(totalDelivered)}</div>
            </CardContent>
          </Card>
          <Card className="bg-indigo-50">
            <CardContent className="pt-4">
              <div className="text-xs text-gray-600">Цалин</div>
              <div className="text-lg">{formatMNT(salary)}</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-50">
            <CardContent className="pt-4">
              <div className="text-xs text-gray-600">Хүлээлгэх</div>
              <div className="text-lg">{formatMNT(toReceive)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Table */}
        <div className="border rounded-lg">
          <div className="p-3 border-b bg-gray-50">
            <h3 className="text-sm">Заиалгууд ({orders.length})</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Дугаар</TableHead>
                <TableHead className="w-48">Бараа</TableHead>
                <TableHead className="w-32">Утас</TableHead>
                <TableHead>Хаяг</TableHead>
                <TableHead className="w-28">Төлөв</TableHead>
                <TableHead className="w-32">Төлбөр</TableHead>
                <TableHead className="w-24 text-right">Дүн</TableHead>
                <TableHead className="w-32 text-center">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                    Захиалга байхгүй
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => {
                  const firstProduct = order.items[0];
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="text-sm">
                        #{order.orderNumber}
                        {order.opp && (
                          <div className="text-[10px] text-orange-600 font-medium">
                            OPP: {order.opp}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ProductThumb src={firstProduct.image} alt={firstProduct.name} size={28} />
                          <div className="min-w-0">
                            <div className="text-sm truncate">{firstProduct.name}</div>
                            {order.items.length > 1 && (
                              <div className="text-xs text-gray-500">+{order.items.length - 1} бараа</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{order.customerPhone}</TableCell>
                      <TableCell className="text-sm max-w-[200px] truncate">
                        {order.address}
                      </TableCell>
                      <TableCell>
                        <StatusChip status={order.status} />
                      </TableCell>
                      <TableCell>
                        <PaymentChip 
                          paymentState={order.payment_state}
                          paymentMethod={order.payment_method}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-right">
                        {formatMNT(order.orderTotal)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Status Toggle Button */}
                          {(order.status === "DELIVERED" || order.status === "CANCELLED") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusToggle(order.id, order.status)}
                              disabled={isLocked}
                              className="h-7 px-2 text-xs"
                            >
                              {order.status === "DELIVERED" ? (
                                <>
                                  <XCircle className="w-3 h-3 mr-1 text-red-600" />
                                  Цуцлах
                                </>
                              ) : (
                                <>
                                  <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                                  Хүргэсэн
                                </>
                              )}
                            </Button>
                          )}
                          
                          {/* Payment Change Button */}
                          {order.status === "DELIVERED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePaymentChange(order.id, order.payment_state)}
                              disabled={isLocked || order.payment_state === "PAID_TO_COMPANY"}
                              className="h-7 px-2 text-xs"
                            >
                              {order.payment_state === "NOT_PAID" && (
                                <>
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Жолоочид
                                </>
                              )}
                              {order.payment_state === "PAID_TO_DRIVER" && (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Компанид
                                </>
                              )}
                              {order.payment_state === "PAID_TO_COMPANY" && (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
                                  Дууссан
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Хаах
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}