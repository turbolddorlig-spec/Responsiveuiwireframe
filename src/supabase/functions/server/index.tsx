import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-549cd952/health", (c) => {
  return c.json({ status: "ok" });
});

// ==================== ORDERS API ====================

// Get all orders
app.get("/make-server-549cd952/orders", async (c) => {
  try {
    const orders = await kv.get("orders") || [];
    return c.json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create new order
app.post("/make-server-549cd952/orders", async (c) => {
  try {
    const newOrder = await c.req.json();
    const orders = await kv.get("orders") || [];
    
    // Auto-increment ID
    const maxId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) : 0;
    newOrder.id = maxId + 1;
    newOrder.createdAt = new Date().toISOString();
    
    orders.push(newOrder);
    await kv.set("orders", orders);
    
    return c.json({ success: true, data: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update order
app.put("/make-server-549cd952/orders/:id", async (c) => {
  try {
    const orderId = parseInt(c.req.param("id"));
    const updates = await c.req.json();
    const orders = await kv.get("orders") || [];
    
    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }
    
    orders[index] = { ...orders[index], ...updates };
    await kv.set("orders", orders);
    
    return c.json({ success: true, data: orders[index] });
  } catch (error) {
    console.error("Error updating order:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== PRODUCTS API ====================

// Get all products
app.get("/make-server-549cd952/products", async (c) => {
  try {
    const products = await kv.get("products") || [];
    return c.json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create new product
app.post("/make-server-549cd952/products", async (c) => {
  try {
    const newProduct = await c.req.json();
    const products = await kv.get("products") || [];
    
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0;
    newProduct.id = maxId + 1;
    newProduct.createdAt = new Date().toISOString();
    
    products.push(newProduct);
    await kv.set("products", products);
    
    return c.json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error creating product:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update product
app.put("/make-server-549cd952/products/:id", async (c) => {
  try {
    const productId = parseInt(c.req.param("id"));
    const updates = await c.req.json();
    const products = await kv.get("products") || [];
    
    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
      return c.json({ success: false, error: "Product not found" }, 404);
    }
    
    products[index] = { ...products[index], ...updates };
    await kv.set("products", products);
    
    return c.json({ success: true, data: products[index] });
  } catch (error) {
    console.error("Error updating product:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete product
app.delete("/make-server-549cd952/products/:id", async (c) => {
  try {
    const productId = parseInt(c.req.param("id"));
    const products = await kv.get("products") || [];
    
    const filtered = products.filter(p => p.id !== productId);
    await kv.set("products", filtered);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== USERS API ====================

// Get all users
app.get("/make-server-549cd952/users", async (c) => {
  try {
    const users = await kv.get("users") || [];
    return c.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Create new user
app.post("/make-server-549cd952/users", async (c) => {
  try {
    const newUser = await c.req.json();
    const users = await kv.get("users") || [];
    
    const maxId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    newUser.id = maxId + 1;
    newUser.createdAt = new Date().toISOString();
    
    users.push(newUser);
    await kv.set("users", users);
    
    return c.json({ success: true, data: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update user
app.put("/make-server-549cd952/users/:id", async (c) => {
  try {
    const userId = parseInt(c.req.param("id"));
    const updates = await c.req.json();
    const users = await kv.get("users") || [];
    
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    
    users[index] = { ...users[index], ...updates };
    await kv.set("users", users);
    
    return c.json({ success: true, data: users[index] });
  } catch (error) {
    console.error("Error updating user:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete user
app.delete("/make-server-549cd952/users/:id", async (c) => {
  try {
    const userId = parseInt(c.req.param("id"));
    const users = await kv.get("users") || [];
    
    const filtered = users.filter(u => u.id !== userId);
    await kv.set("users", filtered);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ==================== AUTH API ====================

// Login
app.post("/make-server-549cd952/auth/login", async (c) => {
  try {
    const { username, password } = await c.req.json();
    const users = await kv.get("users") || [];
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return c.json({ success: false, error: "Invalid credentials" }, 401);
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return c.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error("Error during login:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Initialize default data
app.post("/make-server-549cd952/init", async (c) => {
  try {
    // Check if data already exists
    const existingUsers = await kv.get("users");
    if (existingUsers && existingUsers.length > 0) {
      return c.json({ success: true, message: "Data already initialized" });
    }
    
    // Initialize default users
    const defaultUsers = [
      { 
        id: 1, 
        username: "super", 
        password: "super123", 
        name: "Супер Админ", 
        role: "super_admin",
        createdAt: new Date().toISOString()
      },
      { 
        id: 2, 
        username: "admin", 
        password: "admin123", 
        name: "Админ Дорж", 
        role: "admin",
        createdAt: new Date().toISOString()
      },
      { 
        id: 3, 
        username: "operator", 
        password: "operator123", 
        name: "Оператор Болд", 
        role: "operator",
        createdAt: new Date().toISOString()
      },
      { 
        id: 4, 
        username: "driver1", 
        password: "driver123", 
        name: "Жолооч Бат", 
        role: "driver",
        phone: "99001122",
        createdAt: new Date().toISOString()
      },
      { 
        id: 5, 
        username: "lead1", 
        password: "lead123", 
        name: "Ахлагч Цэрэн", 
        role: "driver_lead",
        createdAt: new Date().toISOString()
      },
      { 
        id: 6, 
        username: "account1", 
        password: "account123", 
        name: "Нягтлан Сара", 
        role: "accounting",
        createdAt: new Date().toISOString()
      },
      { 
        id: 7, 
        username: "warehouse1", 
        password: "warehouse123", 
        name: "Агуулах Ганбат", 
        role: "warehouse",
        createdAt: new Date().toISOString()
      }
    ];
    
    await kv.set("users", defaultUsers);
    await kv.set("products", []);
    await kv.set("orders", []);
    
    return c.json({ success: true, message: "Default data initialized" });
  } catch (error) {
    console.error("Error initializing data:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

Deno.serve(app.fetch);