import { supabase } from './supabase/client';

// ==================== AUTH API ====================

export const authAPI = {
  // Sign up new user
  signup: async (phone: string, password: string, name: string, role: string) => {
    // Use phone as email (phone@logistics.mn format)
    const email = `${phone}@logistics.mn`;
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
          name,
          role
        }
      }
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed');

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: authData.user.id,
          phone,
          name,
          role
        }
      ])
      .select()
      .single();

    if (profileError) throw profileError;

    return profile;
  },

  // Login user
  login: async (phone: string, password: string) => {
    // Use phone as email
    const email = `${phone}@logistics.mn`;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    return {
      id: profile.id,
      username: profile.phone,
      phone: profile.phone,
      password: '', // Don't return password
      role: profile.role,
      name: profile.name,
      driverName: profile.driver_name,
      createdAt: profile.created_at
    };
  },

  // Logout user
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
};

// ==================== ORDERS API ====================

export const ordersAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (order: any) => {
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: number, updates: any) => {
    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ==================== PRODUCTS API ====================

export const productsAPI = {
  getAll: async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('code', { ascending: true });

      if (error) {
        console.error("Products API error:", error);
        
        // Handle specific error codes
        if (error.code === 'PGRST116' || error.message?.includes('does not exist')) {
          throw new Error('❌ Products table does not exist. Run migrations: /supabase/migrations/20241022000001_verify_and_fix_tables.sql');
        }
        
        if (error.code === '42P01') {
          throw new Error('❌ Products table missing. See SUPABASE_404_FIX_COMPLETE.md for setup instructions.');
        }
        
        throw error;
      }
      return data;
    } catch (error: any) {
      console.error("Failed to fetch products:", error);
      
      // Enhance error message for better debugging
      if (error.message?.includes('Failed to fetch')) {
        throw new Error(`Failed to fetch products from Supabase. Check if database tables exist. See SUPABASE_404_FIX_COMPLETE.md. Original error: ${error.message}`);
      }
      
      throw error;
    }
  },

  create: async (product: any) => {
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: number, updates: any) => {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ==================== USERS API ====================

export const usersAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Transform to match expected format
    return data.map(user => ({
      id: user.id,
      username: user.phone,
      phone: user.phone,
      password: '', // Don't expose password
      role: user.role,
      name: user.name,
      driverName: user.driver_name,
      createdAt: user.created_at
    }));
  },

  create: async (user: any) => {
    // Create auth user first
    const profile = await authAPI.signup(
      user.phone || user.username,
      user.password,
      user.name,
      user.role
    );

    return {
      id: profile.id,
      username: profile.phone,
      phone: profile.phone,
      password: '',
      role: profile.role,
      name: profile.name,
      driverName: profile.driver_name,
      createdAt: profile.created_at
    };
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        name: updates.name,
        role: updates.role,
        driver_name: updates.driverName
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      username: data.phone,
      phone: data.phone,
      password: '',
      role: data.role,
      name: data.name,
      driverName: data.driver_name,
      createdAt: data.created_at
    };
  },

  delete: async (id: string) => {
    // Delete from user_profiles (will cascade to auth.users)
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// ==================== STOCKS API ====================

export const stocksAPI = {
  getAll: async (productCode?: string, warehouse?: string) => {
    let query = supabase.from('stocks').select('*');
    
    if (productCode) {
      query = query.eq('product_code', productCode);
    }
    if (warehouse) {
      query = query.eq('warehouse', warehouse);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  adjust: async (productCode: string, delta: number, warehouse: string) => {
    // Get current stock
    const { data: stocks, error: fetchError } = await supabase
      .from('stocks')
      .select('*')
      .eq('product_code', productCode)
      .eq('warehouse', warehouse)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

    if (stocks) {
      // Update existing stock
      const newQty = stocks.qty + delta;
      if (newQty < 0) throw new Error('Stock cannot be negative');

      const { data, error } = await supabase
        .from('stocks')
        .update({ qty: newQty })
        .eq('id', stocks.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Create new stock entry
      if (delta < 0) throw new Error('Stock cannot be negative');

      const { data, error } = await supabase
        .from('stocks')
        .insert([{ product_code: productCode, qty: delta, warehouse }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
};

// ==================== DRIVER LEADS API ====================

export const driverLeadsAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('driver_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (lead: any) => {
    const { data, error } = await supabase
      .from('driver_leads')
      .insert([lead])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: number, updates: any) => {
    const { data, error } = await supabase
      .from('driver_leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: number) => {
    const { error } = await supabase
      .from('driver_leads')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};