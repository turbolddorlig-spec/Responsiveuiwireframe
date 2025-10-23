import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Plus, Edit, Trash2, UserCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { useAppContext } from "../App";

type UserRole = "super_admin" | "admin" | "operator" | "driver" | "driver_lead" | "accounting" | "warehouse";

const roleLabels: Record<UserRole, string> = {
  super_admin: "Супер Админ",
  admin: "Админ",
  operator: "Оператор",
  driver: "Жолооч",
  driver_lead: "Ахлах жолооч",
  accounting: "Нягтлан бодогч",
  warehouse: "Агуулах"
};

const roleColors: Record<UserRole, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  operator: "bg-green-100 text-green-800",
  driver: "bg-orange-100 text-orange-800",
  driver_lead: "bg-yellow-100 text-yellow-800",
  accounting: "bg-pink-100 text-pink-800",
  warehouse: "bg-gray-100 text-gray-800"
};

export function UsersFrame() {
  const { users, addUser, updateUser, deleteUser } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("operator");
  const [driverName, setDriverName] = useState("");

  const resetForm = () => {
    setUsername("");
    setPassword("");
    setName("");
    setRole("operator");
    setDriverName("");
  };

  const handleAddUser = () => {
    if (!username || !password || !name) {
      toast.error("Бүх талбарыг бөглөнө үү!");
      return;
    }

    // Check if username already exists
    if (users.find((u: any) => u.username === username)) {
      toast.error("Нэвтрэх нэр аль хэдийн бүртгэгдсэн байна!");
      return;
    }

    const newUser = {
      id: Date.now(),
      username,
      password,
      name,
      role,
      driverName: role === "driver" ? driverName || name : undefined,
      createdAt: new Date().toISOString()
    };

    addUser(newUser);
    toast.success(`${name} амжилттай нэмэгдлээ!`);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEditUser = () => {
    if (!name) {
      toast.error("Нэр заавал бөглөнө үү!");
      return;
    }

    const updatedUser = {
      ...editingUser,
      name,
      role,
      driverName: role === "driver" ? driverName || name : undefined,
      password: password || editingUser.password // Update password only if provided
    };

    updateUser(editingUser.id, updatedUser);
    toast.success(`${name} амжилттай шинэчлэгдлээ!`);
    setIsEditDialogOpen(false);
    setEditingUser(null);
    resetForm();
  };

  const handleDeleteUser = (user: any) => {
    if (user.role === "super_admin") {
      toast.error("Супер админыг устгах боломжгүй!");
      return;
    }

    if (confirm(`${user.name}-г устгах уу?`)) {
      deleteUser(user.id);
      toast.success(`${user.name} устгагдлаа!`);
    }
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setName(user.name);
    setRole(user.role);
    setDriverName(user.driverName || "");
    setPassword(""); // Leave password empty
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Хэрэглэгчдийн удирдлага</h2>
          <p className="text-sm text-gray-600 mt-1">
            Системийн хэрэглэгчдийг удирдах, нэмэх, засах, устгах
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Хэрэглэгч нэмэх
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Шинэ хэрэглэгч нэмэх</DialogTitle>
              <DialogDescription>
                Системд шинэ хэрэглэгч нэмж, эрх мэдэл олгоно уу
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Нэвтрэх нэр *</Label>
                <Input
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label>Нууц үг *</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <Label>Бүтэн нэр *</Label>
                <Input
                  placeholder="Бат-Эрдэнэ"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label>Эрх *</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="super_admin" value="super_admin">Супер Админ</SelectItem>
                    <SelectItem key="admin" value="admin">Админ</SelectItem>
                    <SelectItem key="operator" value="operator">Оператор</SelectItem>
                    <SelectItem key="driver" value="driver">Жолооч</SelectItem>
                    <SelectItem key="driver_lead" value="driver_lead">Ахлах жолооч</SelectItem>
                    <SelectItem key="accounting" value="accounting">Нягтлан бодогч</SelectItem>
                    <SelectItem key="warehouse" value="warehouse">Агуулах</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {role === "driver" && (
                <div>
                  <Label>Жолоочийн нэр (захиалга дээр харагдах)</Label>
                  <Input
                    placeholder="Бат"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Хоосон үлдээвэл бүтэн нэрийг ашиглана
                  </p>
                </div>
              )}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Болих
                </Button>
                <Button onClick={handleAddUser}>Нэмэх</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Хэрэглэгч</TableHead>
              <TableHead>Нэвтрэх нэр</TableHead>
              <TableHead>Эрх</TableHead>
              <TableHead>Жолоочийн нэр</TableHead>
              <TableHead>Үүсгэсэн огноо</TableHead>
              <TableHead className="w-20"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm">{user.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {user.username}
                  </code>
                </TableCell>
                <TableCell>
                  <Badge className={roleColors[user.role as UserRole]}>
                    {roleLabels[user.role as UserRole]}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.driverName ? (
                    <span className="text-sm text-gray-900">{user.driverName}</span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('mn-MN') : '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(user)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {user.role !== "super_admin" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Хэрэглэгч засах</DialogTitle>
            <DialogDescription>
              Хэрэглэгчийн мэдээллийг шинэчлэх
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Бүтэн нэр *</Label>
              <Input
                placeholder="Бат-Эрдэнэ"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label>Нууц үг (шинэчлэх бол)</Label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Хоосон үлдээвэл нууц үг өөрчлөгдөхгүй
              </p>
            </div>
            <div>
              <Label>Эрх *</Label>
              <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="super_admin" value="super_admin">Супер Админ</SelectItem>
                  <SelectItem key="admin" value="admin">Админ</SelectItem>
                  <SelectItem key="operator" value="operator">Оператор</SelectItem>
                  <SelectItem key="driver" value="driver">Жолооч</SelectItem>
                  <SelectItem key="driver_lead" value="driver_lead">Ахлах жолооч</SelectItem>
                  <SelectItem key="accounting" value="accounting">Нягтлан бодогч</SelectItem>
                  <SelectItem key="warehouse" value="warehouse">Агуулах</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === "driver" && (
              <div>
                <Label>Жолоочийн нэр</Label>
                <Input
                  placeholder="Бат"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                />
              </div>
            )}
            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Болих
              </Button>
              <Button onClick={handleEditUser}>Хадгалах</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}