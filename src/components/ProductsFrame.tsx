import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Plus, Pencil, Trash2, Package, ImagePlus } from "lucide-react";
import { ProductThumb } from "./ProductThumb";
import { useAppContext } from "../App";
import { toast } from "sonner@2.0.3";
import { Textarea } from "./ui/textarea";
import { Pagination } from "./Pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const formatMNT = (amount: number) => `${amount.toLocaleString()}₮`;

export function ProductsFrame() {
  const { products, addProduct, updateProduct, deleteProduct, getAvailableStock, getAssignedStock } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter products
  const filteredProducts = products.filter((product: any) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(query) ||
      product.code.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (product: any) => {
    if (window.confirm(`${product.name} барааг устгах уу?`)) {
      deleteProduct(product.id);
      toast.success("Бараа амжилттай устгагдлаа");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Барааны удирдлага</h1>
          <p className="text-sm text-gray-500">Нийт {products.length} бараа бүртгэлтэй</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Бараа нэмэх
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="max-w-md">
          <Label>Хайх (нэр, код, ангилал)</Label>
          <Input
            placeholder="Хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <div className="p-4 border-b">
          <h3>Барааны жагсаалт</h3>
          <p className="text-sm text-gray-500">{filteredProducts.length} бараа</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Зураг</TableHead>
              <TableHead className="w-32">Код</TableHead>
              <TableHead>Нэр</TableHead>
              <TableHead className="w-32">Ангилал</TableHead>
              <TableHead className="w-24">Үнэ</TableHead>
              <TableHead className="w-40">Боломжит үлдэгдэл</TableHead>
              <TableHead className="w-32">Төлөв</TableHead>
              <TableHead className="w-32">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                  Бараа олдсонгүй
                </TableCell>
              </TableRow>
            ) : (
              currentProducts.map((product: any) => {
                const assignedStock = getAssignedStock(product.id);
                const availableStock = getAvailableStock(product.id);
                
                return (
                <TableRow key={product.id}>
                  <TableCell>
                    <ProductThumb src={product.image} alt={product.name} size={48} />
                  </TableCell>
                  <TableCell className="text-sm">{product.code}</TableCell>
                  <TableCell>
                    <div className="text-sm">{product.name}</div>
                    {product.description && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {product.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{product.category}</TableCell>
                  <TableCell className="text-sm">{formatMNT(product.price)}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600">
                        Агуулах: <span className="font-medium">{product.stock}</span>
                      </div>
                      <div className="text-xs text-orange-600">
                        Захиалгад: <span className="font-medium">{assignedStock}</span>
                      </div>
                      <div className={`text-xs font-medium ${
                        availableStock > 10 ? 'text-green-600' : 
                        availableStock > 0 ? 'text-yellow-600' : 
                        'text-red-600'
                      }`}>
                        Боломжит: {availableStock}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.active ? "default" : "secondary"}>
                      {product.active ? "Идэвхтэй" : "Идэвхгүй"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <Pagination
          totalItems={filteredProducts.length}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredProducts.length / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Add Product Dialog */}
      <AddProductDialog 
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />

      {/* Edit Product Dialog */}
      {editingProduct && (
        <EditProductDialog 
          open={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
        />
      )}
    </div>
  );
}

function AddProductDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addProduct } = useAppContext();
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    size: "",
    color: "",
    price: "",
    stock: "",
    image: "",
    active: true
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.price || !formData.stock) {
      toast.error("Код, нэр, үнэ, үлдэгдэл заавал бөглөнө үү");
      return;
    }

    const newProduct = {
      id: Date.now(),
      code: formData.code,
      name: formData.name,
      description: formData.description,
      category: formData.size && formData.color ? `${formData.color} - ${formData.size}` : formData.size || formData.color || "Ерөнхий",
      price: parseInt(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      image: formData.image || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400",
      active: formData.active
    };

    addProduct(newProduct);
    toast.success("Бараа амжилттай нэмэгдлээ");
    onClose();
    setFormData({
      code: "",
      name: "",
      description: "",
      size: "",
      color: "",
      price: "",
      stock: "",
      image: "",
      active: true
    });
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Шинэ бүтээгдэхүүн нэмэх</DialogTitle>
          <DialogDescription className="sr-only">
            Шинэ бараа бүртгэх
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <Label>Бүтээгдэхүүний зураг</Label>
            <div className="mt-2 flex flex-col items-start gap-3">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <ImagePlus className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-xs text-blue-600 mt-1">Зураг нэмэх</p>
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
            </div>
          </div>

          {/* Name and Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Бүтээгдэхүүний нэр *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Жишээ: Цамц"
                required
              />
            </div>
            <div>
              <Label>Бүтээгдэхүүний код *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Жишээ: PRD001"
                required
              />
            </div>
          </div>

          {/* Size and Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Хэмжээ</Label>
              <Input
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="Жишээ: M, Large, 42, Free Size"
              />
            </div>
            <div>
              <Label>Өнгө</Label>
              <Input
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="Жишээ: Улаан, Цэнхэр, Хар, гэх мэт"
              />
            </div>
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Үнэ *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label>Үлдэгдэл *</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label>Тайлбар</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Бүтээгдэхүүний дэлгэрэнгүй тайлбар..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Болих
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Хадгалах
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditProductDialog({ 
  open, 
  onClose, 
  product 
}: { 
  open: boolean; 
  onClose: () => void;
  product: any;
}) {
  const { updateProduct } = useAppContext();
  const [formData, setFormData] = useState({
    code: product.code,
    name: product.name,
    description: product.description || "",
    category: product.category,
    price: product.price.toString(),
    stock: product.stock.toString(),
    image: product.image,
    active: product.active
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.price) {
      toast.error("Код, нэр, үнэ заавал бөглөнө үү");
      return;
    }

    const updatedProduct = {
      code: formData.code,
      name: formData.name,
      description: formData.description,
      category: formData.category || "Ерөнхий",
      price: parseInt(formData.price) || 0,
      stock: parseInt(formData.stock) || 0,
      image: formData.image,
      active: formData.active
    };

    updateProduct(product.id, updatedProduct);
    toast.success("Бараа амжилттай шинэчлэгдлээ");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Бараа засварлах</DialogTitle>
          <DialogDescription className="sr-only">
            Барааны мэдээлэл засварлах
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Барааны код *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Ангилал</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Барааны нэр *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Тайлбар</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Үнэ *</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Нөөц</Label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label>Зургийн URL</Label>
            <Input
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="active" className="cursor-pointer">Идэвхтэй</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Болих
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Хадгалах
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}