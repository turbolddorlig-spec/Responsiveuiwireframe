import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner@2.0.3";
import { Plus, Minus, ArrowRightLeft, Package, TrendingUp, TrendingDown, Archive } from "lucide-react";
import { useAppContext } from "../App";
import { Pagination } from "./Pagination";
import { ProductThumb } from "./ProductThumb";

const formatMNT = (amount: number) => `${amount.toLocaleString()}₮`;

type TransactionType = "IN" | "OUT";
type Transaction = {
  id: number;
  productId: number;
  productName: string;
  productCode: string;
  type: TransactionType;
  quantity: number;
  note: string;
  createdAt: string;
  createdBy: string;
};

export function WarehouseFrame() {
  const { products, updateProduct, getMongolianTime } = useAppContext();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      productId: 1,
      productName: "Coca Cola 1.5L",
      productCode: "BEV001",
      type: "IN",
      quantity: 50,
      note: "Шинэ бараа ирлээ",
      createdAt: new Date(2024, 9, 20, 10, 30).toISOString(),
      createdBy: "Агуулахын ажилтан"
    },
    {
      id: 2,
      productId: 2,
      productName: "Pepsi 1.5L",
      productCode: "BEV002",
      type: "OUT",
      quantity: 20,
      note: "Захиалгад гарлаа",
      createdAt: new Date(2024, 9, 20, 14, 15).toISOString(),
      createdBy: "Агуулахын ажилтан"
    },
    {
      id: 3,
      productId: 3,
      productName: "Snickers 50g",
      productCode: "SNK001",
      type: "IN",
      quantity: 100,
      note: "Нөөц нөхлөө",
      createdAt: new Date(2024, 9, 21, 9, 0).toISOString(),
      createdBy: "Агуулахын ажилтан"
    }
  ]);
  const [isInDialogOpen, setIsInDialogOpen] = useState(false);
  const [isOutDialogOpen, setIsOutDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const itemsPerPage = 10;

  // Statistics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum: number, p: any) => sum + p.stock, 0);
  const today = new Date().toISOString().split('T')[0];
  const todayTransactions = transactions.filter(t => t.createdAt.split('T')[0] === today);
  const todayIn = todayTransactions.filter(t => t.type === "IN").reduce((sum, t) => sum + t.quantity, 0);
  const todayOut = todayTransactions.filter(t => t.type === "OUT").reduce((sum, t) => sum + t.quantity, 0);

  const handleAddStock = (productId: number, quantity: number, note: string) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    updateProduct(productId, { stock: product.stock + quantity });
    
    const newTransaction: Transaction = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      type: "IN",
      quantity,
      note,
      createdAt: getMongolianTime().toISOString(),
      createdBy: "Агуулахын ажилтан"
    };
    
    setTransactions([newTransaction, ...transactions]);
    toast.success(`${quantity} ширхэг ${product.name} орлоод бүртгэгдлээ`);
  };

  const handleRemoveStock = (productId: number, quantity: number, note: string) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;

    if (product.stock < quantity) {
      toast.error("Нөөц хүрэлцэхгүй байна");
      return;
    }

    updateProduct(productId, { stock: product.stock - quantity });
    
    const newTransaction: Transaction = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      productCode: product.code,
      type: "OUT",
      quantity,
      note,
      createdAt: getMongolianTime().toISOString(),
      createdBy: "Агуулахын ажилтан"
    };
    
    setTransactions([newTransaction, ...transactions]);
    toast.success(`${quantity} ширхэг ${product.name} зарлагад бүртгэгдлээ`);
  };

  const currentProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const currentHistory = transactions.slice(
    (historyPage - 1) * itemsPerPage,
    historyPage * itemsPerPage
  );

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl">Агуулахын удирдлага</h1>
        <p className="text-sm text-gray-500">Барааны нөөц, орлого зарлагын систем</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Барааны төрөл</p>
              <p className="text-2xl mt-1">{totalProducts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Нийт нөөц</p>
              <p className="text-2xl mt-1">{totalStock}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Archive className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Өнөөдрийн орлого</p>
              <p className="text-2xl mt-1 text-green-600">+{todayIn}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Өнөөдрийн зарлага</p>
              <p className="text-2xl mt-1 text-red-600">-{todayOut}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="stock" className="space-y-4">
        <TabsList>
          <TabsTrigger value="stock">Барааны нөөц</TabsTrigger>
          <TabsTrigger value="history">Орлого/Зарлага түүх</TabsTrigger>
        </TabsList>

        {/* Stock Management Tab */}
        <TabsContent value="stock" className="space-y-4">
          <div className="flex gap-2">
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setIsInDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Орлого бүртгэх
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700"
              onClick={() => setIsOutDialogOpen(true)}
            >
              <Minus className="w-4 h-4 mr-2" />
              Зарлага бүртгэх
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <div className="p-4 border-b">
              <h3>Барааны нөөц</h3>
              <p className="text-sm text-gray-500">{products.length} бараа</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">Зураг</TableHead>
                  <TableHead className="w-32">Код</TableHead>
                  <TableHead>Нэр</TableHead>
                  <TableHead className="w-32">Ангилал</TableHead>
                  <TableHead className="w-24">Үнэ</TableHead>
                  <TableHead className="w-24">Нөөц</TableHead>
                  <TableHead className="w-32">Төлөв</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      Бараа олдсонгүй
                    </TableCell>
                  </TableRow>
                ) : (
                  currentProducts.map((product: any) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <ProductThumb src={product.image} alt={product.name} size={48} />
                      </TableCell>
                      <TableCell className="text-sm">{product.code}</TableCell>
                      <TableCell className="text-sm">{product.name}</TableCell>
                      <TableCell className="text-sm">{product.category}</TableCell>
                      <TableCell className="text-sm">{formatMNT(product.price)}</TableCell>
                      <TableCell className="text-sm">
                        <span className={product.stock < 10 ? "text-red-600" : product.stock < 50 ? "text-yellow-600" : "text-green-600"}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell>
                        {product.stock < 10 ? (
                          <Badge variant="destructive">Дууссан</Badge>
                        ) : product.stock < 50 ? (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Бага</Badge>
                        ) : (
                          <Badge variant="default" className="bg-green-100 text-green-800">Хангалттай</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination
              totalItems={products.length}
              currentPage={currentPage}
              totalPages={Math.ceil(products.length / itemsPerPage)}
              onPageChange={setCurrentPage}
            />
          </div>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
            <div className="p-4 border-b">
              <h3>Орлого/Зарлага түүх</h3>
              <p className="text-sm text-gray-500">{transactions.length} бүртгэл</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40">Огноо цаг</TableHead>
                  <TableHead className="w-24">Төрөл</TableHead>
                  <TableHead className="w-32">Барааны код</TableHead>
                  <TableHead>Барааны нэр</TableHead>
                  <TableHead className="w-24">Тоо ширхэг</TableHead>
                  <TableHead className="w-48">Тэмдэглэл</TableHead>
                  <TableHead className="w-40">Бүртгэсэн</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                      Түүх олдсонгүй
                    </TableCell>
                  </TableRow>
                ) : (
                  currentHistory.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="text-sm">{formatDateTime(transaction.createdAt)}</TableCell>
                      <TableCell>
                        {transaction.type === "IN" ? (
                          <Badge className="bg-green-100 text-green-800">Орлого</Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-800">Зарлага</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{transaction.productCode}</TableCell>
                      <TableCell className="text-sm">{transaction.productName}</TableCell>
                      <TableCell className="text-sm">
                        <span className={transaction.type === "IN" ? "text-green-600" : "text-red-600"}>
                          {transaction.type === "IN" ? "+" : "-"}{transaction.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{transaction.note}</TableCell>
                      <TableCell className="text-sm text-gray-600">{transaction.createdBy}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            <Pagination
              totalItems={transactions.length}
              currentPage={historyPage}
              totalPages={Math.ceil(transactions.length / itemsPerPage)}
              onPageChange={setHistoryPage}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Stock Dialog */}
      <StockInDialog 
        open={isInDialogOpen}
        onClose={() => setIsInDialogOpen(false)}
        onSubmit={handleAddStock}
        products={products}
      />

      {/* Remove Stock Dialog */}
      <StockOutDialog 
        open={isOutDialogOpen}
        onClose={() => setIsOutDialogOpen(false)}
        onSubmit={handleRemoveStock}
        products={products}
      />
    </div>
  );
}

function StockInDialog({ 
  open, 
  onClose, 
  onSubmit,
  products 
}: { 
  open: boolean; 
  onClose: () => void;
  onSubmit: (productId: number, quantity: number, note: string) => void;
  products: any[];
}) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || !quantity) {
      toast.error("Бараа, тоо ширхэг заавал бөглөнө үү");
      return;
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      toast.error("Тоо ширхэг 0-ээс их байх ёстой");
      return;
    }

    onSubmit(parseInt(selectedProductId), qty, note);
    onClose();
    setSelectedProductId("");
    setQuantity("");
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Орлого бүртгэх</DialogTitle>
          <DialogDescription className="sr-only">
            Барааны орлого бүртгэх
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Бараа сонгох *</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Бараа сонгох" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product: any) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.code} - {product.name} (Нөөц: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Тоо ширхэг *</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              required
              min="1"
            />
          </div>
          <div>
            <Label>Тэмдэглэл</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Тэмдэглэл..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Болих
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Орлого бүртгэх
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function StockOutDialog({ 
  open, 
  onClose, 
  onSubmit,
  products 
}: { 
  open: boolean; 
  onClose: () => void;
  onSubmit: (productId: number, quantity: number, note: string) => void;
  products: any[];
}) {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const selectedProduct = products.find((p: any) => p.id === parseInt(selectedProductId));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || !quantity) {
      toast.error("Бараа, тоо ширхэг заавал бөглөнө үү");
      return;
    }

    const qty = parseInt(quantity);
    if (qty <= 0) {
      toast.error("Тоо ширхэг 0-ээс их байх ёстой");
      return;
    }

    onSubmit(parseInt(selectedProductId), qty, note);
    onClose();
    setSelectedProductId("");
    setQuantity("");
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Зарлага бүртгэх</DialogTitle>
          <DialogDescription className="sr-only">
            Барааны зарлага бүртгэх
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Бараа сонгох *</Label>
            <Select value={selectedProductId} onValueChange={setSelectedProductId}>
              <SelectTrigger>
                <SelectValue placeholder="Бараа сонгох" />
              </SelectTrigger>
              <SelectContent>
                {products.map((product: any) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.code} - {product.name} (Нөөц: {product.stock})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedProduct && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">
                Одоогийн нөөц: <span className="text-gray-900">{selectedProduct.stock}</span>
              </p>
            </div>
          )}
          <div>
            <Label>Тоо ширхэг *</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              required
              min="1"
              max={selectedProduct?.stock || undefined}
            />
          </div>
          <div>
            <Label>Тэмдэглэл</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Тэмдэглэл..."
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Болих
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              <Minus className="w-4 h-4 mr-2" />
              Зарлага бүртгэх
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
