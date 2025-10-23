import { useState, useEffect, createContext, useContext } from "react";
import { Toaster, toast } from "sonner@2.0.3";
import { LoginFrame } from "./components/LoginFrame";
import { AppShell } from "./components/AppShell";
import { SetupRequiredScreen } from "./components/SetupRequiredScreen";
import { DashboardFrame } from "./components/DashboardFrame";
import { OrdersFrame } from "./components/OrdersFrame";
import { ProductsFrame } from "./components/ProductsFrame";
import { DriverFrame } from "./components/DriverFrame";
import { DriverLeadFrame } from "./components/DriverLeadFrame";
import { AccountingFrame } from "./components/AccountingFrame";
import { WarehouseFrame } from "./components/WarehouseFrame";
import { UsersFrame } from "./components/UsersFrame";
import { productsAPI, ordersAPI, usersAPI } from "./utils/api";
import { 
  demoProductsAPI, 
  demoOrdersAPI, 
  demoUsersAPI, 
  demoDriverLeadsAPI,
  isDemoMode,
  enableDemoMode
} from "./utils/demoStorage";

type UserRole = "super_admin" | "admin" | "operator" | "driver" | "driver_lead" | "accounting" | "warehouse";

type User = {
  id?: number;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  driverName?: string; // For driver role - which driver they are
  createdAt?: string;
};

type MenuItem = "dashboard" | "orders" | "products" | "driver" | "driver_lead" | "accounting" | "warehouse" | "users" | "settings";
type DateSelection = "today" | "yesterday" | "dayBefore" | "tomorrow";

// Mongolian Time (UTC+8) utilities
export const getMongolianTime = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const mongolianTime = new Date(utc + (3600000 * 8)); // UTC+8
  return mongolianTime;
};

export const getMongolianDateString = (date: Date = getMongolianTime()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDateByOffset = (daysOffset: number = 0) => {
  const mongolianTime = getMongolianTime();
  mongolianTime.setDate(mongolianTime.getDate() + daysOffset);
  return getMongolianDateString(mongolianTime);
};

type AppContextType = {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  updateOrder: (orderId: number, updates: any) => void;
  addOrder: (order: any) => void;
  selectedDate: DateSelection;
  setSelectedDate: (date: DateSelection) => void;
  navigateToDriver: () => void;
  getCurrentMongolianDate: () => string;
  getMongolianTime: () => Date;
  users: any[];
  addUser: (user: any) => void;
  updateUser: (userId: number, updates: any) => void;
  deleteUser: (userId: number) => void;
  updateDriver: (driverId: number, updates: any) => void;
  products: any[];
  addProduct: (product: any) => void;
  updateProduct: (productId: number, updates: any) => void;
  deleteProduct: (productId: number) => void;
  // Calculate available stock: warehouse stock - assigned to active orders (NEW, IN_TRANSIT)
  // Stock is only decreased when order is DELIVERED
  getAvailableStock: (productId: number) => number;
  // Calculate assigned stock to active orders (for display purposes)
  getAssignedStock: (productId: number) => number;
};

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeMenu, setActiveMenu] = useState<MenuItem>("dashboard");
  const [selectedDate, setSelectedDate] = useState<DateSelection>("today");
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupRequired, setSetupRequired] = useState(false);
  const [setupError, setSetupError] = useState<{ code?: string; message?: string } | null>(null);

  // Initialize backend data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        
        // 🎮 DEMO MODE АНХДАГЧ БАЙДЛААР ИДЭВХЖҮҮЛЭХ
        // Supabase холболтыг хүлээхгүйгээр шууд Demo Mode ашиглана
        const useDemoMode = true; // Анхдагчаар Demo Mode
        
        if (useDemoMode) {
          // Use demo data from LocalStorage
          console.log('🎮 Demo Mode идэвхтэй - LocalStorage ашиглаж байна');
          
          // Enable demo mode if not already enabled
          if (!isDemoMode()) {
            enableDemoMode();
          }
          
          const [loadedProducts, loadedOrders] = await Promise.all([
            demoProductsAPI.getAll(),
            demoOrdersAPI.getAll()
          ]);
          
          setProducts(loadedProducts || []);
          setOrders(loadedOrders || []);
          
          toast.success("🎮 Demo Mode - LocalStorage өгөгдөл татагдлаа!", { duration: 2000 });
        }
      } catch (error: any) {
        console.error("Error initializing data:", error);
        
        // Fallback to empty data
        setProducts([]);
        setOrders([]);
        
        toast.error("Өгөгдөл татахад алдаа гарлаа - Demo Mode ашиглана", { duration: 3000 });
      } finally {
        setLoading(false);
      }
    };
    
    initializeData();
  }, []);

  // Handle login
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    
    // Set default page based on role
    if (user.role === "super_admin" || user.role === "admin") {
      setActiveMenu("dashboard");
    } else if (user.role === "operator") {
      setActiveMenu("orders");
    } else if (user.role === "driver") {
      setActiveMenu("driver");
    } else if (user.role === "driver_lead") {
      setActiveMenu("driver_lead");
    } else if (user.role === "accounting") {
      setActiveMenu("accounting");
    } else if (user.role === "warehouse") {
      setActiveMenu("warehouse");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setCurrentUser(null);
    setActiveMenu("dashboard");
  };

  // Show login if not authenticated
  if (!currentUser) {
    return <LoginFrame onLogin={handleLogin} users={users} />;
  }

  // Show setup required screen BEFORE loading check
  if (setupRequired) {
    return (
      <>
        <SetupRequiredScreen errorCode={setupError?.code} errorMessage={setupError?.message} />
        <Toaster />
      </>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Өгөгдөл татаж байна...</p>
        </div>
      </div>
    );
  }

  const addUser = async (user: any) => {
    try {
      const useDemoMode = isDemoMode();
      const newUser = useDemoMode 
        ? await demoUsersAPI.create(user)
        : await usersAPI.create(user);
      setUsers([...users, newUser]);
      toast.success("Хэрэглэгч амжилттай нээгдлээ!");
    } catch (error: any) {
      console.error("Error adding user:", error);
      toast.error(error.message || "Хэрэглэгч нэмэхэд алдаа гарлаа");
    }
  };

  const updateUser = async (userId: string | number, updates: any) => {
    try {
      const useDemoMode = isDemoMode();
      const updatedUser = useDemoMode
        ? await demoUsersAPI.update(String(userId), updates)
        : await usersAPI.update(String(userId), updates);
      setUsers(users.map(u => u.id === userId ? updatedUser : u));
      toast.success("Хэрэглэгч амжилттай шинэчлэгдлээ!");
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Хэрэглэгч шинэчлэхэд алдаа гарлаа");
    }
  };

  const deleteUser = async (userId: string | number) => {
    try {
      const useDemoMode = isDemoMode();
      if (useDemoMode) {
        await demoUsersAPI.delete(String(userId));
      } else {
        await usersAPI.delete(String(userId));
      }
      setUsers(users.filter(u => u.id !== userId));
      toast.success("Хэрэлэгч амжилттай устгагдлаа!");
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Хэрэглэгч устгахад алдаа гарлаа");
    }
  };

  const updateDriver = async (driverId: string | number, updates: any) => {
    try {
      const useDemoMode = isDemoMode();
      const updatedDriver = useDemoMode
        ? await demoUsersAPI.update(String(driverId), updates)
        : await usersAPI.update(String(driverId), updates);
      setUsers(prev => prev.map(u => u.id === driverId ? updatedDriver : u));
    } catch (error: any) {
      console.error("Error updating driver:", error);
      toast.error(error.message || "Жолооч шинэчлэхэд алдаа гарлаа");
    }
  };

  const updateOrder = async (orderId: number, updates: any) => {
    try {
      const useDemoMode = isDemoMode();
      const updatedOrder = useDemoMode
        ? await demoOrdersAPI.update(orderId, updates)
        : await ordersAPI.update(orderId, updates);
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Захиалга шинэчлэхэд алдаа гарлаа");
      throw error;
    }
  };

  const addOrder = async (order: any) => {
    try {
      const useDemoMode = isDemoMode();
      const newOrder = useDemoMode
        ? await demoOrdersAPI.create(order)
        : await ordersAPI.create(order);
      setOrders(prev => [...prev, newOrder]);
      toast.success("Захиалга амжилттай үүсгэгдлээ!");
      return newOrder;
    } catch (error) {
      console.error("Error adding order:", error);
      toast.error("Захиалга үүсгэхэд алдаа гарлаа");
      throw error;
    }
  };

  const navigateToDriver = () => {
    setActiveMenu("driver");
  };

  const renderContent = () => {
    switch (activeMenu) {
      case "dashboard":
        return <DashboardFrame />;
      case "orders":
        return <OrdersFrame />;
      case "products":
        return <ProductsFrame />;
      case "driver":
        return <DriverFrame />;
      case "driver_lead":
        return <DriverLeadFrame />;
      case "accounting":
        return <AccountingFrame />;
      case "warehouse":
        return <WarehouseFrame />;
      case "users":
        return <UsersFrame />;
      case "settings":
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4">Settings</h2>
            <p className="text-gray-600">Settings тохиргоо энд байа</p>
          </div>
        );
      default:
        return <DashboardFrame />;
    }
  };

  return (
    <AppContext.Provider value={{ 
      orders, 
      setOrders, 
      updateOrder, 
      addOrder, 
      selectedDate, 
      setSelectedDate,
      navigateToDriver: () => setActiveMenu("driver"),
      getCurrentMongolianDate: getMongolianDateString,
      getMongolianTime,
      users,
      addUser,
      updateUser,
      deleteUser,
      updateDriver,
      products,
      addProduct: async (product: any) => {
        try {
          const useDemoMode = isDemoMode();
          const newProduct = useDemoMode
            ? await demoProductsAPI.create(product)
            : await productsAPI.create(product);
          setProducts([...products, newProduct]);
          toast.success("Бүтээгдэхүүн амжилттай нэмэгдлээ!");
        } catch (error) {
          console.error("Error adding product:", error);
          toast.error("Бүтээгдэхүүн нэмэхэд алдаа гарлаа");
        }
      },
      updateProduct: async (productId: number, updates: any) => {
        try {
          const useDemoMode = isDemoMode();
          const updatedProduct = useDemoMode
            ? await demoProductsAPI.update(productId, updates)
            : await productsAPI.update(productId, updates);
          setProducts(products.map(p => p.id === productId ? updatedProduct : p));
          toast.success("Бүтээгдэхүүн амжилттай шинэчлэгдлээ!");
        } catch (error) {
          console.error("Error updating product:", error);
          toast.error("Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа");
        }
      },
      deleteProduct: async (productId: number) => {
        try {
          const useDemoMode = isDemoMode();
          if (useDemoMode) {
            await demoProductsAPI.delete(productId);
          } else {
            await productsAPI.delete(productId);
          }
          setProducts(products.filter(p => p.id !== productId));
          toast.success("Бүтээгдэхүүн амжилттай устгагдлаа!");
        } catch (error) {
          console.error("Error deleting product:", error);
          toast.error("Бүтээгдэхүүн устгахад алдаа гарлаа");
        }
      },
      // Calculate available stock: warehouse stock - assigned to active orders (NEW, IN_TRANSIT)
      // Stock is only decreased when order is DELIVERED
      getAvailableStock: (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (!product) return 0;

        const warehouseStock = product.stock || 0;

        // Calculate total quantity in NEW and IN_TRANSIT orders
        const assignedStock = orders
          .filter(o => 
            (o.status === "NEW" || o.status === "IN_TRANSIT") && 
            o.products && 
            o.products.length > 0
          )
          .reduce((total, order) => {
            const productInOrder = order.products?.find((p: any) => {
              return p.name === product.name;
            });
            return total + (productInOrder?.quantity || 0);
          }, 0);

        return warehouseStock - assignedStock;
      },
      // Calculate assigned stock to active orders (for display purposes)
      getAssignedStock: (productId: number) => {
        const product = products.find(p => p.id === productId);
        if (!product) return 0;

        return orders
          .filter(o => 
            (o.status === "NEW" || o.status === "IN_TRANSIT") && 
            o.products && 
            o.products.length > 0
          )
          .reduce((total, order) => {
            const productInOrder = order.products?.find((p: any) => {
              return p.name === product.name;
            });
            return total + (productInOrder?.quantity || 0);
          }, 0);
      }
    }}>
      <AppShell 
        activeMenu={activeMenu} 
        onMenuChange={setActiveMenu}
        currentUser={currentUser}
        onLogout={handleLogout}
      >
        {renderContent()}
      </AppShell>
      <Toaster />
    </AppContext.Provider>
  );
}