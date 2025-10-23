import { Plus, History, Edit } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "./ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "./ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { StatusChip } from "./StatusChip";
import { PaymentChip } from "./PaymentChip";
import { useAppContext } from "../App";
import { toast } from "sonner@2.0.3";
import { Pagination } from "./Pagination";
import { ProductThumb } from "./ProductThumb";

type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  extraPhone?: string;
  address: string;
  district: string;
  province: string;
  operator_note?: string;
  status: "NEW" | "READY_FOR_DELIVERY" | "ASSIGNED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "RETURNED" | "CANCELLED";
  orderTotal: number;
  opp: string;
  driver?: string;
  prepaid: boolean;
  payment_state: "NOT_PAID" | "PAID_TO_DRIVER" | "PAID_TO_COMPANY";
  history?: { timestamp: string; action: string; user: string; note?: string }[];
  products?: { name: string; color?: string; size?: string; quantity?: number }[];
};

const formatMNT = (amount: number) => `${amount.toLocaleString()}₮`;

export function OrdersFrame() {
  const { orders, updateOrder, users, products } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpp, setSelectedOpp] = useState("all");
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const distinctOpps = Array.from(new Set(orders.map(o => o.opp)));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
    setCurrentPage(1);
  };

  const filteredOrders = orders.filter(order => {
    const searchMatch = 
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const oppMatch = selectedOpp === "all" || order.opp === selectedOpp;
    return searchMatch && oppMatch;
  }).reverse();

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {/* Top Controls */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Хайх..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />
        <Select value={selectedOpp} onValueChange={setSelectedOpp}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="ОПП" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="all" value="all">Бүгд</SelectItem>
            {distinctOpps.filter(o => o !== "all").map(opp => (
              <SelectItem key={opp} value={opp}>{opp}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Dialog open={isNewOrderOpen} onOpenChange={setIsNewOrderOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus className="w-4 h-4 mr-2" />
              Шинэ захиалга
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Шинэ захиалга</DialogTitle>
              <DialogDescription className="sr-only">
                Шинэ захиалга үүсгэх хэсэг
              </DialogDescription>
            </DialogHeader>
            <NewOrderForm onClose={() => setIsNewOrderOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">ID</TableHead>
              <TableHead className="w-32">Утас</TableHead>
              <TableHead className="w-[200px]">Бараа</TableHead>
              <TableHead className="w-[280px]">Хаяг</TableHead>
              <TableHead className="w-32">Төлөв</TableHead>
              <TableHead className="w-32">Нийт дүн</TableHead>
              <TableHead className="w-24">ОПП</TableHead>
              <TableHead className="w-32">Жолооч</TableHead>
              <TableHead className="w-20">Түүх</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => {
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
                      <div className="text-[10px] text-orange-600 leading-none font-medium mt-0.5">
                        OPP: {order.opp}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{order.customerPhone}</div>
                    {order.extraPhone && <div className="text-gray-500">/ {order.extraPhone}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1.5">
                    {order.products && order.products.map((orderProduct: any, idx: number) => {
                      // Fetch full product details from products context
                      const fullProduct = products.find((p: any) => p.name === orderProduct.name);
                      
                      return (
                        <div key={idx} className="flex items-center gap-2">
                          {fullProduct?.image && (
                            <ProductThumb src={fullProduct.image} alt={orderProduct.name} size={40} />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-gray-900 truncate">{orderProduct.name}</div>
                            <div className="text-xs text-gray-600">{orderProduct.quantity} ширхэг</div>
                          </div>
                        </div>
                      );
                    })}
                    {(!order.products || order.products.length === 0) && (
                      <div className="text-sm text-gray-500">—</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1 max-w-xs">
                    <div className="break-words whitespace-normal" title={order.address}>{order.address}</div>
                    {!order.address.includes(order.district) && !order.address.includes(order.province) && (
                      <div className="text-sm text-gray-500">{order.district}, {order.province}</div>
                    )}
                    {order.operator_note && (
                      <Badge variant="destructive" className="text-xs mt-1">
                        санамж: {order.operator_note}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <StatusChip status={order.status} />
                    <PaymentChip 
                      paymentState={order.payment_state}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div>{formatMNT(order.orderTotal)}</div>
                  {order.prepaid && (
                    <div className="text-xs text-green-600">урьдчилсан</div>
                  )}
                </TableCell>
                <TableCell className="text-sm">{order.opp}</TableCell>
                <TableCell className="text-sm">{order.driver || "-"}</TableCell>
                <TableCell>
                  <Drawer>
                    <DrawerTrigger asChild>
                      <Button variant="outline" size="sm" className="h-7 px-2">
                        <History className="w-3 h-3" />
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[60vh]">
                      <DrawerHeader>
                        <DrawerTitle>Түүх #{order.orderNumber}</DrawerTitle>
                        <DrawerDescription>Захиалгын түүхүүд</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 space-y-3 overflow-y-auto">
                        {order.history && order.history.length > 0 ? (
                          [...order.history].reverse().map((entry: any, idx: number) => (
                            <div key={idx} className="flex gap-3">
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                              <div className="flex-1">
                                <div className="text-xs text-gray-500">
                                  {new Date(entry.timestamp).toLocaleString('mn-MN')}
                                </div>
                                <div className="text-sm">
                                  <span className="font-semibold">{entry.action}</span>
                                  {" - "}
                                  {entry.user}
                                </div>
                                {entry.note && (
                                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-1">
                                    {entry.note}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">Түүх алга</div>
                        )}
                      </div>
                    </DrawerContent>
                  </Drawer>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 px-2"
                    onClick={() => setEditingOrder(order)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                </TableCell>
              </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredOrders.length / itemsPerPage)}
        totalItems={filteredOrders.length}
        onPageChange={handlePageChange}
      />

      {/* Edit Order Dialog */}
      {editingOrder && (
        <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Захиалга засах #{editingOrder.orderNumber}</DialogTitle>
              <DialogDescription className="sr-only">
                Захиалгын мэдээлэл засах
              </DialogDescription>
            </DialogHeader>
            <EditOrderForm order={editingOrder} onClose={() => setEditingOrder(null)} onSave={(updatedOrder) => {
              updateOrder(editingOrder.id, updatedOrder);
              setEditingOrder(null);
              toast.success("Захиалга засагдлаа!");
            }} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function NewOrderForm({ onClose }: { onClose: () => void }) {
  const { orders, addOrder, users, products, getAvailableStock, updateProduct } = useAppContext();
  const [prepaid, setPrepaid] = useState(false);
  const [channel, setChannel] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [extraPhone, setExtraPhone] = useState<string>("");
  const [customerName, setCustomerName] = useState<string>("");
  const [operatorNote, setOperatorNote] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [productSearch, setProductSearch] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<{ productId: number; quantity: number }[]>([]);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);

  const districts = [
    "Багануур",
    "Багахангай", 
    "Баянгол",
    "Баянзүрх",
    "Налайх",
    "Сонгинохайрхан",
    "Сүхбаатар",
    "Хан-Уул",
    "Чингэлтэй"
  ];

  const provinces = [
    "Улаанбаатар",
    "Архангай",
    "Баян-Өлгий",
    "Баянхонгор",
    "Булган",
    "Говь-Алтай",
    "Говьсүмбэр",
    "Дархан-Уул",
    "Дорноговь",
    "Дорнод",
    "Дундговь",
    "Завхан",
    "Орхо",
    "Өвөрхангай",
    "Өмнөговь",
    "Сүхбаата��",
    "Сэлэнгэ",
    "Төв",
    "Увс",
    "Ховд",
    "Хөвсгөл",
    "Хэнтий"
  ];

  const handleLocationChange = (value: string) => {
    setLocation(value);
    setAddress(value + ", ");
  };

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    
    if (value.length >= 8) {
      const duplicateOrder = orders.find(order => 
        order.customerPhone === value && 
        order.status !== "DELIVERED" && 
        order.status !== "CANCELLED"
      );

      if (duplicateOrder) {
        setPhoneError(`⚠️ Давхардсан ахиалга: #${duplicateOrder.orderNumber} (${duplicateOrder.status}). Хүргэсэн эсвэл цуцалсан байвал дахин захиалах боломжтой.`);
      } else {
        setPhoneError("");
      }
    } else {
      setPhoneError("");
    }
  };

  const filteredProducts = products.filter((product: any) => {
    if (!productSearch) return false;
    const query = productSearch.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.code.toLowerCase().includes(query)
    );
  }).slice(0, 5);

  const addProductToOrder = (productId: number) => {
    const existing = selectedProducts.find(p => p.productId === productId);
    if (existing) {
      setSelectedProducts(selectedProducts.map(p => 
        p.productId === productId ? { ...p, quantity: p.quantity + 1 } : p
      ));
    } else {
      setSelectedProducts([...selectedProducts, { productId, quantity: 1 }]);
    }
    setProductSearch("");
    setShowProductSuggestions(false);
  };

  const removeProduct = (productId: number) => {
    setSelectedProducts(selectedProducts.filter(p => p.productId !== productId));
  };

  const updateProductQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    setSelectedProducts(selectedProducts.map(p => 
      p.productId === productId ? { ...p, quantity } : p
    ));
  };

  const calculateTotal = () => {
    return selectedProducts.reduce((total, item) => {
      const product = products.find((p: any) => p.id === item.productId);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim() || phone.length < 8) {
      toast.error("Утасны дугаар буруу байна");
      return;
    }

    if (!location) {
      toast.error("Хэсэг сонгоно уу");
      return;
    }

    if (!address.trim()) {
      toast.error("Хаяг оруулна уу");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Бараа сонгон уу");
      return;
    }

    // Check stock availability
    for (const item of selectedProducts) {
      const availableStock = getAvailableStock(item.productId);
      if (item.quantity > availableStock) {
        const product = products.find((p: any) => p.id === item.productId);
        toast.error(`${product?.name} - Үлдэгдэл хүрэлцэхгүй (Боломжит: ${availableStock})`);
        return;
      }
    }

    const newOrderNumber = String(orders.length + 1).padStart(5, '0');
    
    const totalAmount = selectedProducts.reduce((sum, item) => {
      const product = products.find((p: any) => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    const productsArray = selectedProducts.map(item => {
      const product = products.find((p: any) => p.id === item.productId);
      return {
        name: product?.name || "",
        quantity: item.quantity
      };
    });

    const now = new Date().toISOString();

    const newOrder = {
      id: Date.now(),
      orderNumber: newOrderNumber,
      customerName,
      customerPhone: phone,
      address,
      district: location,
      province: "Улаанбаатар",
      orderTotal: totalAmount,
      prepaid,
      payment_state: prepaid ? "PAID" : "NOT_PAID",
      payment_method: prepaid ? channel : null,
      status: "NEW",
      driver: null,
      opp: "default",
      assignedDate: null,
      operator_note: operatorNote,
      goodsReturned: 0,
      driverSalary: 0,
      customOrder: "",
      products: productsArray,
      created_at: now,
      history: [{
        timestamp: now,
        action: "CREATED",
        user: "Operator",
        note: "Захиалга үүсгэгдсэн"
      }]
    };

    addOrder(newOrder);
    
    // Do NOT deduct stock when order is created
    // Stock will be deducted when order is DELIVERED

    toast.success(`Захиалга #${newOrderNumber} амжилттай үүсгэгдлээ`);
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Утас *</Label>
          <Input 
            placeholder="99887766" 
            value={phone}
            onChange={(e) => handlePhoneChange(e.target.value)}
            className={phoneError ? "border-red-500" : ""}
            required 
          />
          {phoneError && (
            <p className="text-xs text-red-600 mt-1 bg-red-50 p-2 rounded border border-red-200">
              {phoneError}
            </p>
          )}
        </div>
        <div>
          <Label>Нэмэлт утас</Label>
          <Input 
            placeholder="88776655" 
            value={extraPhone}
            onChange={(e) => setExtraPhone(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Суваг *</Label>
          <Select value={channel} onValueChange={(value) => {
            setChannel(value);
            setLocation("");
            setAddress("");
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Сонгох" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="city" value="city">Хот (9 дүүрэг)</SelectItem>
              <SelectItem key="countryside" value="countryside">Орон нутаг (21 аймаг)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>{channel === "city" ? "Дүүрэг *" : "Аймаг *"}</Label>
          <Select value={location} onValueChange={handleLocationChange} disabled={!channel}>
            <SelectTrigger>
              <SelectValue placeholder={!channel ? "Эхлээд суваг сонгоно уу" : "Сонгох"} />
            </SelectTrigger>
            <SelectContent>
              {channel === "city" && districts.map(district => (
                <SelectItem key={district} value={district}>{district}</SelectItem>
              ))}
              {channel === "countryside" && provinces.map(province => (
                <SelectItem key={province} value={province}>{province}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Дэлгэрэнгүй хаяг *</Label>
        <Textarea 
          placeholder="3-р хороо, 15-р байр" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={!location}
        />
        {!location && (
          <p className="text-xs text-gray-500 mt-1">Дүүрэг/Аймаг сонгох үед автоматаар гарч ирнэ</p>
        )}
      </div>

      <div>
        <Label>Тайлбар / Санамж (жолоочид)</Label>
        <Textarea 
          placeholder="Жолоочид зориулсан санамж..." 
          value={operatorNote}
          onChange={(e) => setOperatorNote(e.target.value)}
          className="border-red-200" 
        />
        <p className="text-xs text-red-600 mt-1">Улаан pill-ээр харагдана</p>
      </div>

      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="prepaid"
            checked={prepaid}
            onCheckedChange={(checked) => setPrepaid(checked as boolean)}
          />
          <Label htmlFor="prepaid" className="cursor-pointer">
            💰 Мөнгө орсон (урьдчилгаа төлбөр)
          </Label>
        </div>
        <p className="text-xs text-green-700 mt-1 ml-6">
          {prepaid 
            ? "✓ Жагсаалт дээр \"рьдчилсан\" тэмдэглэгээ гарна. Жолооч зөвхөн \"хүргэсэн\" дарна."
            : "○ Жолооч \"бэлэн\"/\"данс\" сонгоод \"хүргэсэн\" дарна."}
        </p>
      </div>

      <div className="space-y-4">
        <Label>Бараанууд *</Label>
        <div className="relative">
          <Input
            placeholder="Барааны нэр эсвэл код хайх..."
            value={productSearch}
            onChange={(e) => {
              setProductSearch(e.target.value);
              setShowProductSuggestions(true);
            }}
            onFocus={() => setShowProductSuggestions(true)}
            onBlur={() => setTimeout(() => setShowProductSuggestions(false), 200)}
          />
          {showProductSuggestions && filteredProducts.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto w-full mt-1">
              {filteredProducts.map(product => {
                const availableStock = getAvailableStock(product.id);
                return (
                  <div
                    key={product.id}
                    className="p-3 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 flex items-center justify-between"
                    onClick={() => addProductToOrder(product.id)}
                  >
                    <div className="flex items-center gap-2">
                      {product.image && (
                        <ProductThumb src={product.image} alt={product.name} size={40} />
                      )}
                      <div>
                        <div className="text-sm font-medium">{product.name}</div>
                        <div className="text-xs text-gray-500">Код: {product.code}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-green-600">{availableStock} ширхэг</div>
                      <div className="text-xs text-gray-500">{formatMNT(product.price)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Products Table */}
        {selectedProducts.length > 0 && (
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Бараа</TableHead>
                  <TableHead className="w-32">Үлдэгдэл</TableHead>
                  <TableHead className="w-24">Тоо ширхэг</TableHead>
                  <TableHead className="w-32">Үнэ</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProducts.map(item => {
                  const product = products.find((p: any) => p.id === item.productId);
                  const availableStock = getAvailableStock(item.productId);
                  const subtotal = (product?.price || 0) * item.quantity;
                  
                  return (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {product?.image && (
                            <ProductThumb src={product.image} alt={product.name} size={40} />
                          )}
                          <div>
                            <div className="text-sm font-medium">{product?.name}</div>
                            <div className="text-xs text-gray-500">{product?.code}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm ${availableStock < item.quantity ? 'text-red-600 font-medium' : 'text-green-600'}`}>
                          {availableStock} ширхэг
                        </span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateProductQuantity(item.productId, parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatMNT(subtotal)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => removeProduct(item.productId)}
                        >
                          ×
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                <TableRow>
                  <TableCell colSpan={3} className="font-semibold text-right">Нийт дүн:</TableCell>
                  <TableCell className="font-semibold">{formatMNT(calculateTotal())}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}

        {selectedProducts.length === 0 && (
          <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
            Бараа нэмээгүй байна. Дээрх хайлтаар барааг сонгоно уу.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSubmit}>Хадгалах</Button>
      </div>
    </div>
  );
}

function EditOrderForm({ order, onClose, onSave }: { order: any; onClose: () => void; onSave: (updates: any) => void }) {
  const [phone, setPhone] = useState(order.customerPhone || "");
  const [extraPhone, setExtraPhone] = useState(order.extraPhone || "");
  const [address, setAddress] = useState(order.address || "");
  const [district, setDistrict] = useState(order.district || "");
  const [province, setProvince] = useState(order.province || "");
  const [operatorNote, setOperatorNote] = useState(order.operator_note || "");
  const [orderTotal, setOrderTotal] = useState(order.orderTotal?.toString() || "");
  const [prepaid, setPrepaid] = useState(order.prepaid || false);
  const [status, setStatus] = useState(order.status || "NEW");

  const handleSave = () => {
    if (!phone || !address || !orderTotal) {
      toast.error("Бүх шаардлагатай талбаруудыг бөглөнө үү!");
      return;
    }

    const totalAmount = parseFloat(orderTotal);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      toast.error("Захиалгын дүн буруу байна!");
      return;
    }

    const updates = {
      customerName: order.customerName || "",
      customerPhone: phone,
      extraPhone: extraPhone || undefined,
      address,
      district,
      province,
      operator_note: operatorNote,
      orderTotal: totalAmount,
      prepaid,
      status,
      payment_state: prepaid ? "PAID_TO_COMPANY" : order.payment_state
    };

    onSave(updates);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Утас *</Label>
          <Input 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <Label>Нэмэлт утас</Label>
          <Input 
            value={extraPhone}
            onChange={(e) => setExtraPhone(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Хаяг *</Label>
        <Textarea 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Дүүрэг</Label>
          <Input 
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
        </div>
        <div>
          <Label>Аймаг</Label>
          <Input 
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label>Захиалгын нийт дүн *</Label>
        <Input 
          type="number"
          value={orderTotal}
          onChange={(e) => setOrderTotal(e.target.value)}
        />
      </div>

      <div>
        <Label>Тайлбар</Label>
        <Textarea 
          value={operatorNote}
          onChange={(e) => setOperatorNote(e.target.value)}
        />
      </div>

      <div>
        <Label>Төлөв</Label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="NEW" value="NEW">NEW</SelectItem>
            <SelectItem key="READY_FOR_DELIVERY" value="READY_FOR_DELIVERY">READY_FOR_DELIVERY</SelectItem>
            <SelectItem key="ASSIGNED" value="ASSIGNED">ASSIGNED</SelectItem>
            <SelectItem key="OUT_FOR_DELIVERY" value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</SelectItem>
            <SelectItem key="DELIVERED" value="DELIVERED">DELIVERED</SelectItem>
            <SelectItem key="RETURNED" value="RETURNED">RETURNED</SelectItem>
            <SelectItem key="CANCELLED" value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="edit-prepaid"
          checked={prepaid}
          onCheckedChange={(checked) => setPrepaid(checked as boolean)}
        />
        <Label htmlFor="edit-prepaid" className="cursor-pointer">
          💰 Урьдчилгаа төлбөр
        </Label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onClose}>Болих</Button>
        <Button onClick={handleSave}>Хадгалах</Button>
      </div>
    </div>
  );
}