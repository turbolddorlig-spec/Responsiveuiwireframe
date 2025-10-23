import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package,
  Truck, 
  UserCheck, 
  Wallet, 
  Warehouse, 
  Settings,
  LogOut,
  Users
} from "lucide-react";
import zoodShopyLogo from "figma:asset/98b13064736497621f0dd1f4976ade4c7b1f74e8.png";

type MenuItem = {
  id: string;
  label: string;
  icon: ReactNode;
};

const menuItems: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart className="w-5 h-5" /> },
  { id: "products", label: "Products", icon: <Package className="w-5 h-5" /> },
  { id: "driver", label: "Driver", icon: <Truck className="w-5 h-5" /> },
  { id: "driver_lead", label: "Driver Lead", icon: <UserCheck className="w-5 h-5" /> },
  { id: "accounting", label: "Accounting", icon: <Wallet className="w-5 h-5" /> },
  { id: "warehouse", label: "Warehouse", icon: <Warehouse className="w-5 h-5" /> },
  { id: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
];

type AppShellProps = {
  children: ReactNode;
  activeMenu: string;
  onMenuChange: (id: string) => void;
  currentUser?: { name: string; role: string };
  onLogout?: () => void;
};

// Role-based menu access control
const getMenuItemsForRole = (role: string): string[] => {
  const roleMenuMap: Record<string, string[]> = {
    super_admin: ["dashboard", "orders", "products", "driver", "driver_lead", "accounting", "warehouse", "users", "settings"],
    admin: ["dashboard", "orders", "products", "driver", "driver_lead", "accounting", "warehouse", "users", "settings"],
    operator: ["orders", "products"],
    driver: ["driver"],
    driver_lead: ["driver_lead"],
    accounting: ["accounting"],
    warehouse: ["warehouse", "products"],
  };
  
  return roleMenuMap[role] || [];
};

export function AppShell({ children, activeMenu, onMenuChange, currentUser, onLogout }: AppShellProps) {
  const allowedMenus = currentUser ? getMenuItemsForRole(currentUser.role) : [];
  const filteredMenuItems = menuItems.filter(item => allowedMenus.includes(item.id));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - 240px fixed width */}
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-gray-900 font-semibold">Logistics</h1>
            <p className="text-xs text-gray-500">Захиалгын систем</p>
          </div>
        </div>
        
        <ScrollArea className="flex-1 p-3">
          <nav className="space-y-1">
            {filteredMenuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeMenu === item.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-3"
                onClick={() => onMenuChange(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Button>
            ))}
            {onLogout && (
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
                onClick={onLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            )}
          </nav>
        </ScrollArea>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
            <h2 className="text-gray-700">
              {menuItems.find(m => m.id === activeMenu)?.label || "Dashboard"}
            </h2>
            <div className="flex items-center gap-4">
              {currentUser && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-900">{currentUser.name}</div>
                    <div className="text-xs text-gray-500">{currentUser.role}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content - 1200-1440px container, no horizontal scroll */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-screen-xl mx-auto p-6 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}