import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Calendar, Printer } from "lucide-react";
import { StatusChip } from "./StatusChip";
import { PaymentChip } from "./PaymentChip";
import { useAppContext } from "../App";
import { toast } from "sonner@2.0.3";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";

type Driver = {
  id: number;
  name: string;
  started: boolean;
  startedDate?: string;
};

const formatMNT = (amount: number) => `${amount.toLocaleString()}₮`;

export function DriverLeadFrame() {
  const { orders, updateOrder, users, products } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriver, setSelectedDriver] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);

  // Initialize drivers if empty
  const allDrivers: Driver[] = users.filter((u: any) => u.role === "driver").map((u: any) => ({
    id: u.id,
    name: u.name,
    started: u.started || false,
    startedDate: u.startedDate
  }));

  // Get unique drivers from orders
  const driverNames = Array.from(new Set(orders.map(o => o.driver).filter(Boolean)));

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (searchQuery && !order.customerPhone.includes(searchQuery)) return false;
    if (selectedDriver !== "all" && order.driver !== selectedDriver) return false;
    
    if (selectedStatus !== "all") {
      if (selectedStatus === "DELIVERED" && order.status !== "DELIVERED") return false;
      if (selectedStatus === "CANCELLED" && order.status !== "CANCELLED") return false;
      if (selectedStatus === "IN_TRANSIT" && order.status !== "IN_TRANSIT") return false;
      if (selectedStatus === "NEW" && order.status !== "NEW") return false;
    }

    if (selectedPayment !== "all") {
      if (selectedPayment === "PAID" && order.payment_state !== "PAID") return false;
      if (selectedPayment === "NOT_PAID" && order.payment_state !== "NOT_PAID") return false;
    }
    
    return true;
  });

  const unassignedOrders = orders.filter(o => !o.driver || o.status === "NEW");

  // Get today's date
  const today = new Date().toISOString().split('T')[0];

  // Calculate stats for each driver
  const getDriverStats = (driverName: string) => {
    const driverOrders = orders.filter(o => o.driver === driverName);
    const todayOrders = driverOrders.filter(o => {
      const assignedDate = o.assignedDate || today;
      return assignedDate === today;
    });
    const tomorrowOrders = driverOrders.filter(o => {
      const assignedDate = o.assignedDate || today;
      return assignedDate !== today;
    });

    return {
      countToday: todayOrders.length,
      countTomorrow: tomorrowOrders.length,
      todayOrders,
      tomorrowOrders
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Жолоочийн удирдлага</h1>
          <p className="text-sm text-gray-500">Нийт {orders.length} захиалга, {unassignedOrders.length} хувиарилагдаагүй</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsMergeDialogOpen(true)}
        >
          Захиалга нэгтгэх
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <Label>Хайх (утсаар)</Label>
            <Input
              placeholder="99887766"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Label>Жолооч</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">Бүгд</SelectItem>
                {driverNames.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Төлөв</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">бүгд</SelectItem>
                <SelectItem key="DELIVERED" value="DELIVERED">хүргэсэн</SelectItem>
                <SelectItem key="CANCELLED" value="CANCELLED">цуцалсан</SelectItem>
                <SelectItem key="IN_TRANSIT" value="IN_TRANSIT">замд явна</SelectItem>
                <SelectItem key="NEW" value="NEW">шинэ</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Төлбөр</Label>
            <Select value={selectedPayment} onValueChange={setSelectedPayment}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="all" value="all">бүгд</SelectItem>
                <SelectItem key="PAID" value="PAID">төлсөн</SelectItem>
                <SelectItem key="NOT_PAID" value="NOT_PAID">төлөөгүй</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* All Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <div className="p-4 border-b flex items-center justify-between">
          <div>
            <h3>Бүх захиалгууд</h3>
            <p className="text-sm text-gray-500">{filteredOrders.length} захиалга</p>
          </div>
        </div>
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Дугаар</TableHead>
              <TableHead className="w-[280px]">Хаяг</TableHead>
              <TableHead className="w-24">Жолооч</TableHead>
              <TableHead className="w-32">Төлөв</TableHead>
              <TableHead className="w-32">Төлбөр</TableHead>
              <TableHead className="w-48">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                  Захиалга олдсонгүй
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                return (
                  <OrderRowWithAssign 
                    key={order.id} 
                    order={order} 
                    allDrivers={allDrivers}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-4 gap-4">
        {allDrivers.map((driver) => {
          const stats = getDriverStats(driver.name);
          return (
            <DriverCard 
              key={driver.id} 
              driver={driver}
              stats={stats}
            />
          );
        })}
      </div>

      {/* Merge Orders Dialog */}
      <MergeOrdersDialog 
        open={isMergeDialogOpen}
        onClose={() => setIsMergeDialogOpen(false)}
        drivers={allDrivers}
      />
    </div>
  );
}

function DriverCard({ 
  driver, 
  stats 
}: { 
  driver: Driver;
  stats: { countToday: number; countTomorrow: number; todayOrders: any[]; tomorrowOrders: any[] };
}) {
  const [isWorkListOpen, setIsWorkListOpen] = useState(false);
  const { updateDriver, setOrders, getMongolianTime } = useAppContext();

  const badgeClass = driver.started 
    ? "bg-gray-400" 
    : "bg-green-600 hover:bg-green-700";

  const handleStartWork = () => {
    if (driver.started) {
      toast.info(`${driver.name} аль хэдийн ажилд гарсан байна`);
      return;
    }

    // Жолоочийн ажилд гарах товч дарахад
    updateDriver(driver.id, { 
      started: true, 
      startedDate: getMongolianTime().toISOString() 
    });

    // Тухайн жолоочийн бүх захиалгын created_at огног +1 өдөр болгох
    setOrders((prevOrders: any[]) => 
      prevOrders.map((order: any) => {
        if (order.driver === driver.name) {
          const currentDate = new Date(order.created_at);
          const nextDay = new Date(currentDate);
          nextDay.setDate(nextDay.getDate() + 1);
          
          return {
            ...order,
            created_at: nextDay.toISOString()
          };
        }
        return order;
      })
    );

    toast.success(`${driver.name} амжилттай ажилд гарлаа! Захиалгууд маргаашийн огноо руу шилжлээ.`);
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3>{driver.name}</h3>
            <Badge className={badgeClass}>
              {driver.started ? "Ажилд гарсан" : "Ажилд гараагүй"}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-600">
            Өнөөдр: {stats.countToday} | Маргааш: {stats.countTomorrow}
          </div>

          <div className="space-y-2">
            <Button 
              variant={driver.started ? "secondary" : "default"}
              size="sm" 
              className="w-full"
              onClick={handleStartWork}
              disabled={driver.started}
            >
              {driver.started ? "✅ Ажилд гарсан" : "🚀 Ажилд гарах"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setIsWorkListOpen(true)}
            >
              Ажлын жагсаалт харах
            </Button>
          </div>
        </div>
      </div>

      <WorkListDialog 
        driver={driver}
        stats={stats}
        open={isWorkListOpen}
        onClose={() => setIsWorkListOpen(false)}
      />
    </>
  );
}

function WorkListDialog({ 
  driver, 
  stats,
  open, 
  onClose 
}: { 
  driver: Driver;
  stats: { countToday: number; countTomorrow: number; todayOrders: any[]; tomorrowOrders: any[] };
  open: boolean; 
  onClose: () => void;
}) {
  const { updateOrder, users } = useAppContext();
  const canReassign = !driver.started;

  const allDrivers: Driver[] = users.filter((u: any) => u.role === "driver").map((u: any) => ({
    id: u.id,
    name: u.name,
    started: u.started || false,
    startedDate: u.startedDate
  }));

  const handleReassign = (order: any, newDriverName: string) => {
    updateOrder(order.id, { driver: newDriverName });
    toast.success(`Захиалга #${order.orderNumber} ${newDriverName}-д шилжүүллээ`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Ажлын жагсаалт - {driver.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Жолоочийн өнөөдөр болон маргаашийн ажлын жагсаалт
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="today">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="today">Өнөөдрийн ажил ({stats.countToday})</TabsTrigger>
            <TabsTrigger value="tomorrow">Маргаашийн ажил ({stats.countTomorrow})</TabsTrigger>
          </TabsList>
          <TabsContent value="today" className="space-y-2 max-h-[400px] overflow-y-auto">
            {!canReassign && (
              <Badge variant="destructive" className="mb-2">
                Жолооч ажилд гарсан тул шилжүүлэх боломжгүй
              </Badge>
            )}
            {stats.todayOrders.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Өнөөдрийн ажил байхгүй
              </div>
            ) : (
              stats.todayOrders.map((order) => {
                return (
                  <div key={order.id} className="border border-gray-200 rounded p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <div>#{order.orderNumber} - {order.customerName || "Хэрэглэгч"}</div>
                        {order.opp && (
                          <div className="text-xs text-orange-600 font-medium">
                            OPP: {order.opp}
                          </div>
                        )}
                        <div className="text-sm text-gray-500">{order.address}</div>
                        {order.operator_note && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            санамж: {order.operator_note}
                          </Badge>
                        )}
                        <div className="text-sm text-gray-500">{formatMNT(order.orderTotal)}</div>
                      </div>
                    </div>
                    <Select 
                      disabled={!canReassign}
                      onValueChange={(newDriver) => handleReassign(order, newDriver)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Шилжүүлэх" />
                      </SelectTrigger>
                      <SelectContent>
                        {allDrivers.filter(d => d.name !== driver.name).map(d => (
                          <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })
            )}
          </TabsContent>
          <TabsContent value="tomorrow" className="space-y-2 max-h-[400px] overflow-y-auto">
            {stats.tomorrowOrders.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Маргаашийн ажил байхгүй
              </div>
            ) : (
              stats.tomorrowOrders.map((order) => {
                return (
                  <div key={order.id} className="border border-gray-200 rounded p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-1">
                        <div>#{order.orderNumber} - {order.customerName || "Хэрэглэгч"}</div>
                        <div className="text-sm text-gray-500">{order.address}</div>
                        {order.operator_note && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            санамж: {order.operator_note}
                          </Badge>
                        )}
                        <div className="text-sm text-gray-500">{formatMNT(order.orderTotal)}</div>
                      </div>
                    </div>
                    <Select 
                      disabled={!canReassign}
                      onValueChange={(newDriver) => handleReassign(order, newDriver)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Шилжүүлэх" />
                      </SelectTrigger>
                      <SelectContent>
                        {allDrivers.filter(d => d.name !== driver.name).map(d => (
                          <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function MergeOrdersDialog({ 
  open, 
  onClose,
  drivers
}: { 
  open: boolean; 
  onClose: () => void;
  drivers: Driver[];
}) {
  const { orders, updateDriver } = useAppContext();
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [isPrinting, setIsPrinting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const now = new Date().toLocaleString('mn-MN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  // Get selected driver's today orders
  const driverOrders = orders.filter(o => {
    if (o.driver !== selectedDriver) return false;
    const assignedDate = o.assignedDate || today;
    return assignedDate === today;
  });

  const totalAmount = driverOrders.reduce((sum, order) => sum + (order.orderTotal || 0), 0);
  const totalOrders = driverOrders.length;

  const handleStartWork = () => {
    const driver = drivers.find(d => d.name === selectedDriver);
    if (!driver) return;

    // Mark driver as started
    updateDriver(driver.id, { 
      started: true, 
      startedDate: today 
    });

    toast.success(`${selectedDriver} ажилд гарлаа! Өнөөдрийн ажил цоожлогдлоо.`);
    onClose();
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto print-content">
        <DialogHeader className="no-print">
          <DialogTitle>Захиалга нэгтгэх</DialogTitle>
          <DialogDescription className="sr-only">
            Олон захиалгыг нэг жолочид хуваарилах
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Driver Selection - Hide on print */}
          <div className="no-print">
            <Label>Жолооч сонгох</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Жолооч сонгох" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Print Layout */}
          {selectedDriver && totalOrders > 0 && (
            <div className="print-page">
              {/* Header - Print Only */}
              <div className="print-header">
                <h1 className="print-title">Хүргэлтийн ажилтанд захиалга олгосон баримт</h1>
                <div className="print-info-row">
                  <div className="print-info-left">
                    Хүргэлтийн ажилтан: {selectedDriver}
                  </div>
                  <div className="print-info-right">
                    Хаасан огноо: {now}
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="print-table-container">
                <table className="print-table">
                  <thead>
                    <tr className="print-table-header">
                      <th className="print-th-dd">Д/Д</th>
                      <th className="print-th-code">Захиалга №</th>
                      <th className="print-th-name">Харилцагч</th>
                      <th className="print-th-address">Хаяг</th>
                      <th className="print-th-price">Дүн</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverOrders.map((order, index) => (
                      <tr key={index} className="print-table-row">
                        <td className="print-td-dd">{index + 1}</td>
                        <td className="print-td-code">#{order.orderNumber}</td>
                        <td className="print-td-name">{order.customerName || "Хэрэглэгч"}</td>
                        <td className="print-td-address">{order.address}</td>
                        <td className="print-td-price">{formatMNT(order.orderTotal)}</td>
                      </tr>
                    ))}
                    <tr className="print-total-row">
                      <td colSpan={4} className="print-total-label">Нийт үндсэн дүн:</td>
                      <td className="print-total-value">{formatMNT(totalAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Footer - Signatures */}
              <div className="print-footer">
                <div className="print-notes-title">Тэмдэглэл:</div>
                <div className="print-signatures">
                  <div className="print-signature-line">
                    Хүргэлтийн ажилтан: __________________________/_______________/
                  </div>
                  <div className="print-signature-line">
                    Хүлээн авагч: __________________________/_______________/
                  </div>
                  <div className="print-signature-line">
                    Хаасан ажилтан: __________________________/_______________/
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedDriver && totalOrders === 0 && (
            <div className="text-center text-gray-500 py-8">
              {selectedDriver} жолоочийн өнөөдрийн захиалга байхгүй
            </div>
          )}

          {!selectedDriver && (
            <div className="text-center text-gray-500 py-8">
              Жолооч сонгоно уу
            </div>
          )}

          {/* Action Buttons - Hide on print */}
          {selectedDriver && totalOrders > 0 && (
            <div className="flex justify-between items-center pt-4 border-t no-print">
              <div>
                Нийт авч явах захиалгын дүн: <span className="font-semibold">{formatMNT(totalAmount)}</span>
                <span className="text-sm text-gray-500 ml-2">({totalOrders} захиалга)</span>
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Болих
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handlePrint}
                  disabled={isPrinting}
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Хэвлэх
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={handleStartWork}
                >
                  Ажилд гарсан
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Print Styles */}
        <style>{`
          @media print {
            .no-print {
              display: none !important;
            }
            
            .print-content {
              max-width: 100% !important;
              margin: 0 !important;
              padding: 15mm 20mm !important;
            }
            
            .print-page {
              width: 100%;
              font-family: Arial, sans-serif;
              color: #000;
            }
            
            .print-header {
              margin-bottom: 15px;
            }
            
            .print-title {
              text-align: center;
              font-size: 13pt;
              font-weight: bold;
              margin-bottom: 12px;
              letter-spacing: 0.3px;
            }
            
            .print-info-row {
              display: flex;
              justify-content: space-between;
              font-size: 9pt;
              margin-bottom: 12px;
            }
            
            .print-info-left,
            .print-info-right {
              font-size: 9pt;
            }
            
            .print-table-container {
              width: 100%;
              margin-bottom: 0;
            }
            
            .print-table {
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #000;
            }
            
            .print-table-header {
              background-color: transparent;
              border-bottom: 1px solid #000;
            }
            
            .print-table th {
              border: 1px solid #000;
              padding: 6px 8px;
              font-size: 9pt;
              font-weight: normal;
              text-align: left;
            }
            
            .print-table td {
              border: 1px solid #000;
              padding: 5px 8px;
              font-size: 9pt;
            }
            
            .print-th-dd {
              width: 35px;
              text-align: center;
            }
            
            .print-th-code {
              width: 90px;
              text-align: left;
            }
            
            .print-th-name {
              width: 120px;
              text-align: left;
            }
            
            .print-th-address {
              width: auto;
              text-align: left;
            }
            
            .print-th-price {
              width: 90px;
              text-align: right;
            }
            
            .print-td-dd {
              text-align: center;
              padding: 5px 4px;
            }
            
            .print-td-code {
              text-align: left;
              padding: 5px 8px;
            }
            
            .print-td-name {
              text-align: left;
              padding: 5px 8px;
            }
            
            .print-td-address {
              text-align: left;
              padding: 5px 8px;
            }
            
            .print-td-price {
              text-align: right;
              padding: 5px 8px;
            }
            
            .print-table-row {
              page-break-inside: avoid;
            }
            
            .print-total-row {
              border-top: 2px solid #000;
            }
            
            .print-total-label {
              text-align: right;
              font-weight: bold;
              padding: 6px 8px !important;
              font-size: 9pt;
            }
            
            .print-total-value {
              text-align: right;
              font-weight: bold;
              padding: 6px 8px !important;
              font-size: 9pt;
            }
            
            .print-footer {
              margin-top: 25px;
            }
            
            .print-notes-title {
              font-size: 9pt;
              font-weight: bold;
              margin-bottom: 15px;
            }
            
            .print-signatures {
              margin-top: 10px;
            }
            
            .print-signature-line {
              font-size: 9pt;
              margin: 10px 0;
              line-height: 1.8;
            }
          }
          
          @media screen {
            .print-header {
              display: none;
            }
            
            .print-footer {
              display: none;
            }
            
            .print-table-container {
              border: 1px solid #e5e7eb;
              border-radius: 0.5rem;
              overflow: hidden;
            }
            
            .print-table {
              width: 100%;
              border-collapse: collapse;
            }
            
            .print-table-header {
              background-color: #f9fafb;
            }
            
            .print-table th {
              padding: 0.75rem;
              text-align: left;
              font-weight: 600;
              font-size: 0.875rem;
              color: #374151;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .print-table td {
              padding: 0.75rem;
              font-size: 0.875rem;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .print-th-dd,
            .print-td-dd {
              text-align: center;
            }
            
            .print-th-price,
            .print-td-price,
            .print-total-label,
            .print-total-value {
              text-align: right;
            }
            
            .print-total-row {
              border-top: 2px solid #e5e7eb;
              font-weight: 600;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}

function OrderRowWithAssign({ 
  order, 
  allDrivers
}: { 
  order: any;
  allDrivers: Driver[];
}) {
  const { updateOrder, products } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    order.assignedDate ? new Date(order.assignedDate) : new Date()
  );
  const canReassign = !order.driver || order.status === "NEW";

  const handleReassign = (newDriverName: string) => {
    const assignedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    updateOrder(order.id, { 
      driver: newDriverName,
      assignedDate: assignedDate,
      status: "IN_TRANSIT"
    });
    toast.success(`Захиалга #${order.orderNumber} ${newDriverName}-д ${assignedDate}-нд хуваарилагдлаа`);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Огноо";
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
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
    <TableRow key={order.id}>
      <TableCell>
        <div className="flex flex-col">
          <div className="text-[10px] text-gray-500 leading-none mb-0.5">
            {formatTimestamp(order.created_at)}
          </div>
          <div className="text-sm leading-none">
            #{order.orderNumber}
          </div>
          {order.opp && (
            <div className="text-[10px] text-orange-600 font-medium mt-0.5">
              OPP: {order.opp}
            </div>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm">
        <div className="break-words whitespace-normal w-[280px]">
          {order.address}
          {order.district && `, ${order.district}`}
        </div>
        {order.operator_note && (
          <Badge variant="destructive" className="text-xs mt-1">
            санамж: {order.operator_note}
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-sm">
        {order.driver || <span className="text-gray-400">-</span>}
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
      <TableCell className="text-sm">
        <div className="flex gap-1 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                disabled={!canReassign}
                className="h-8 w-20 px-2 text-xs"
              >
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(selectedDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select 
            disabled={!canReassign}
            onValueChange={(newDriver) => handleReassign(newDriver)}
          >
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue placeholder="Жолооч" />
            </SelectTrigger>
            <SelectContent>
              {allDrivers.filter(d => d.name !== order.driver).map(d => (
                <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </TableCell>
    </TableRow>
  );
}