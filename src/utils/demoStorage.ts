// LocalStorage wrapper for demo mode
import { demoUsers, demoProducts, demoOrders, demoDriverLeads, demoStocks } from './demoData';

const STORAGE_KEYS = {
  DEMO_MODE: 'logistics_demo_mode',
  PRODUCTS: 'logistics_demo_products',
  ORDERS: 'logistics_demo_orders',
  USERS: 'logistics_demo_users',
  DRIVER_LEADS: 'logistics_demo_driver_leads',
  STOCKS: 'logistics_demo_stocks',
  CURRENT_USER: 'logistics_demo_current_user'
};

// Initialize demo data if not exists
export const initDemoData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(demoProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(demoOrders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(demoUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DRIVER_LEADS)) {
    localStorage.setItem(STORAGE_KEYS.DRIVER_LEADS, JSON.stringify(demoDriverLeads));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STOCKS)) {
    localStorage.setItem(STORAGE_KEYS.STOCKS, JSON.stringify(demoStocks));
  }
  localStorage.setItem(STORAGE_KEYS.DEMO_MODE, 'true');
};

// Check if demo mode is active
export const isDemoMode = () => {
  return localStorage.getItem(STORAGE_KEYS.DEMO_MODE) === 'true';
};

// Enable demo mode
export const enableDemoMode = () => {
  console.log('🎮 DEMO MODE ENABLED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Using LocalStorage (No Supabase needed)');
  console.log('⚠️  Data will be lost on browser refresh');
  console.log('📝 To use real database: Setup Supabase');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  initDemoData();
  
  // Debug: Check what was saved
  console.log('🔍 DEBUG: Checking saved data');
  console.log('  Demo mode flag:', localStorage.getItem(STORAGE_KEYS.DEMO_MODE));
  console.log('  Users saved:', localStorage.getItem(STORAGE_KEYS.USERS) ? 'YES' : 'NO');
  console.log('  Products saved:', localStorage.getItem(STORAGE_KEYS.PRODUCTS) ? 'YES' : 'NO');
  console.log('  Orders saved:', localStorage.getItem(STORAGE_KEYS.ORDERS) ? 'YES' : 'NO');
};

// Disable demo mode
export const disableDemoMode = () => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Generic storage functions
export const getFromStorage = (key: string, defaultValue: any): any => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const saveToStorage = (key: string, value: any): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Demo API - Products
export const demoProductsAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay
    return getFromStorage(STORAGE_KEYS.PRODUCTS, demoProducts);
  },
  create: async (product: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS, demoProducts);
    const newProduct = { ...product, id: Date.now() };
    products.push(newProduct);
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return newProduct;
  },
  update: async (id: number, updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS, demoProducts);
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return products[index];
    }
    throw new Error('Product not found');
  },
  delete: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const products = getFromStorage(STORAGE_KEYS.PRODUCTS, demoProducts);
    const filtered = products.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PRODUCTS, filtered);
  }
};

// Demo API - Orders
export const demoOrdersAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getFromStorage(STORAGE_KEYS.ORDERS, demoOrders);
  },
  create: async (order: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const orders = getFromStorage(STORAGE_KEYS.ORDERS, demoOrders);
    const newOrder = { ...order, id: Date.now(), created_at: new Date().toISOString() };
    orders.push(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return newOrder;
  },
  update: async (id: number, updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const orders = getFromStorage(STORAGE_KEYS.ORDERS, demoOrders);
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      saveToStorage(STORAGE_KEYS.ORDERS, orders);
      return orders[index];
    }
    throw new Error('Order not found');
  },
  delete: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const orders = getFromStorage(STORAGE_KEYS.ORDERS, demoOrders);
    const filtered = orders.filter(o => o.id !== id);
    saveToStorage(STORAGE_KEYS.ORDERS, filtered);
  }
};

// Demo API - Users
export const demoUsersAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getFromStorage(STORAGE_KEYS.USERS, demoUsers);
  },
  create: async (user: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const users = getFromStorage(STORAGE_KEYS.USERS, demoUsers);
    const newUser = { ...user, id: `demo-${Date.now()}`, createdAt: new Date().toISOString() };
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  },
  update: async (id: string, updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const users = getFromStorage(STORAGE_KEYS.USERS, demoUsers);
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      saveToStorage(STORAGE_KEYS.USERS, users);
      return users[index];
    }
    throw new Error('User not found');
  },
  delete: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const users = getFromStorage(STORAGE_KEYS.USERS, demoUsers);
    const filtered = users.filter(u => u.id !== id);
    saveToStorage(STORAGE_KEYS.USERS, filtered);
  }
};

// Demo API - Driver Leads
export const demoDriverLeadsAPI = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return getFromStorage(STORAGE_KEYS.DRIVER_LEADS, demoDriverLeads);
  },
  create: async (lead: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const leads = getFromStorage(STORAGE_KEYS.DRIVER_LEADS, demoDriverLeads);
    const newLead = { ...lead, id: Date.now(), created_at: new Date().toISOString() };
    leads.push(newLead);
    saveToStorage(STORAGE_KEYS.DRIVER_LEADS, leads);
    return newLead;
  },
  update: async (id: number, updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const leads = getFromStorage(STORAGE_KEYS.DRIVER_LEADS, demoDriverLeads);
    const index = leads.findIndex(l => l.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...updates };
      saveToStorage(STORAGE_KEYS.DRIVER_LEADS, leads);
      return leads[index];
    }
    throw new Error('Lead not found');
  },
  delete: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const leads = getFromStorage(STORAGE_KEYS.DRIVER_LEADS, demoDriverLeads);
    const filtered = leads.filter(l => l.id !== id);
    saveToStorage(STORAGE_KEYS.DRIVER_LEADS, filtered);
  }
};

// Demo API - Stocks
export const demoStocksAPI = {
  getAll: async (productCode?: string, warehouse?: string) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    let stocks = getFromStorage(STORAGE_KEYS.STOCKS, demoStocks);
    if (productCode) {
      stocks = stocks.filter(s => s.product_code === productCode);
    }
    if (warehouse) {
      stocks = stocks.filter(s => s.warehouse === warehouse);
    }
    return stocks;
  },
  adjust: async (productCode: string, delta: number, warehouse: string) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const stocks = getFromStorage(STORAGE_KEYS.STOCKS, demoStocks);
    const index = stocks.findIndex(s => s.product_code === productCode && s.warehouse === warehouse);
    
    if (index !== -1) {
      stocks[index].qty += delta;
      if (stocks[index].qty < 0) throw new Error('Stock cannot be negative');
      saveToStorage(STORAGE_KEYS.STOCKS, stocks);
      return stocks[index];
    } else {
      if (delta < 0) throw new Error('Stock cannot be negative');
      const newStock = { id: Date.now(), product_code: productCode, qty: delta, warehouse };
      stocks.push(newStock);
      saveToStorage(STORAGE_KEYS.STOCKS, stocks);
      return newStock;
    }
  }
};

// Demo Auth API
export const demoAuthAPI = {
  login: async (phone: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const users = getFromStorage(STORAGE_KEYS.USERS, demoUsers);
    
    console.log('🔍 DEBUG: Demo Login Attempt');
    console.log('  Phone:', phone);
    console.log('  Password:', password);
    console.log('  Users in storage:', users);
    console.log('  Storage key:', STORAGE_KEYS.USERS);
    console.log('  Raw localStorage:', localStorage.getItem(STORAGE_KEYS.USERS));
    
    const user = users.find(u => u.phone === phone && u.password === password);
    
    console.log('  Found user:', user);
    
    if (!user) {
      throw new Error('Invalid login credentials');
    }
    
    // Save current user
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  },
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },
  getSession: async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },
  signup: async (phone: string, password: string, name: string, role: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const users = getFromStorage(STORAGE_KEYS.USERS, demoUsers);
    
    // Check if user already exists
    if (users.some(u => u.phone === phone)) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: `demo-${Date.now()}`,
      username: phone,
      phone,
      password,
      role,
      name,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, users);
    return newUser;
  }
};