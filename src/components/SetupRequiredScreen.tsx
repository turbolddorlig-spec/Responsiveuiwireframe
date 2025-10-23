import { AlertCircle, Database, FileText, Users, CheckCircle, ExternalLink, RefreshCw, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { useState } from "react";
import { toast } from "sonner";

interface SetupRequiredScreenProps {
  errorCode?: string;
  errorMessage?: string;
}

export function SetupRequiredScreen({ errorCode, errorMessage }: SetupRequiredScreenProps) {
  const isSchemaError = errorCode === 'PGRST205' || errorMessage?.includes('schema cache') || errorMessage?.includes('table');
  const [copied, setCopied] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const supabaseUrl = `https://${projectId}.supabase.co`;
  const sqlEditorUrl = `${supabaseUrl}/project/default/sql/new`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Хуулагдлаа!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Хуулахад алдаа гарлаа");
    }
  };

  const copySqlAndOpenEditor = async () => {
    // Read SQL file content
    const sqlContent = `-- ============================================================================
-- COMPLETE SUPABASE SETUP FOR LOGISTICS SYSTEM
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Profiles Table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'operator', 'driver', 'driver_lead', 'accounting', 'warehouse')),
    driver_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    size TEXT,
    color TEXT,
    price NUMERIC(12, 0) NOT NULL DEFAULT 0,
    description TEXT,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    customer_phone TEXT,
    total_price NUMERIC(12, 0) DEFAULT 0,
    status TEXT DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED')),
    payment_status TEXT DEFAULT 'UNPAID' CHECK (payment_status IN ('PAID', 'UNPAID', 'PARTIAL')),
    payment_method TEXT CHECK (payment_method IN ('CASH', 'CARD', 'TRANSFER', 'QPAY')),
    delivery_date TEXT,
    delivery_time TEXT,
    address TEXT,
    district TEXT,
    khoroo TEXT,
    driver_id UUID REFERENCES user_profiles(id),
    notes TEXT,
    products JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Driver Leads Table
CREATE TABLE IF NOT EXISTS driver_leads (
    id SERIAL PRIMARY KEY,
    name TEXT,
    phone TEXT NOT NULL,
    district TEXT,
    province TEXT,
    note TEXT,
    status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CONTACTED', 'CLOSED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stocks Table
CREATE TABLE IF NOT EXISTS stocks (
    id SERIAL PRIMARY KEY,
    product_code TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 0,
    warehouse TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT positive_qty CHECK (qty >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_phone ON user_profiles(phone);
CREATE INDEX IF NOT EXISTS idx_products_code ON products(code);
CREATE INDEX IF NOT EXISTS idx_orders_code ON orders(code);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_stocks_product_code ON stocks(product_code);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stocks_updated_at BEFORE UPDATE ON stocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Allow authenticated users to view profiles" ON user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow users to update own profile" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- RLS Policies for products
CREATE POLICY "Allow all authenticated users to view products" ON products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admins to manage products" ON products FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse')
    )
);

-- RLS Policies for orders
CREATE POLICY "Allow authenticated users to view orders" ON orders FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND (
            role IN ('super_admin', 'admin', 'operator', 'driver_lead', 'accounting')
            OR (role = 'driver' AND driver_id = auth.uid())
        )
    )
);

CREATE POLICY "Allow admins and operators to manage orders" ON orders FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'operator')
    )
);

-- RLS Policies for stocks
CREATE POLICY "Allow authenticated users to view stocks" ON stocks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow warehouse to manage stocks" ON stocks FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'warehouse')
    )
);

-- RLS Policies for driver_leads
CREATE POLICY "Allow authenticated users to view driver leads" ON driver_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow admins to manage driver leads" ON driver_leads FOR ALL TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'driver_lead')
    )
);

-- Insert sample products
INSERT INTO products (code, name, size, color, price, description, stock) VALUES
('PRD001', 'Сүү 1л', '1л', 'Цагаан', 3500, 'Эрүүл мэндийн сүү', 150),
('PRD002', 'Талх', '500г', 'Бор', 2000, 'Шинэ талх', 200),
('PRD003', 'Төмс', '1кг', 'Шар', 1500, 'Шинэ төмс', 300),
('PRD004', 'Лууван', '1кг', 'Улаан', 2500, 'Шинэ лууван', 100),
('PRD005', 'Сонгино', '1кг', 'Улаан', 1800, 'Шинэ сонгино', 150),
('PRD006', 'Өндөг', '30ш', 'Цагаан', 12000, 'Шинэ өндөг', 80),
('PRD007', 'Гурил', '1кг', 'Цагаан', 2200, 'Цагаан гурил', 250),
('PRD008', 'Будаа', '1кг', 'Цагаан', 3000, 'Чанартай будаа', 180),
('PRD009', 'Элсэн чихэр', '1кг', 'Цагаан', 2800, 'Элсэн чихэр', 120),
('PRD010', 'Тос', '1л', 'Шар', 8500, 'Ургамлын тос', 90)
ON CONFLICT (code) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Setup completed successfully!';
    RAISE NOTICE 'Tables created: user_profiles, products, orders, driver_leads, stocks';
    RAISE NOTICE 'Sample data inserted: 10 products';
    RAISE NOTICE '';
    RAISE NOTICE '📝 Next steps:';
    RAISE NOTICE '1. Go to Authentication > Users';
    RAISE NOTICE '2. Create demo users (see CREDENTIALS.md)';
    RAISE NOTICE '3. Link user profiles';
    RAISE NOTICE '4. Refresh your app (F5)';
END $$;`;

    try {
      await navigator.clipboard.writeText(sqlContent);
      setSqlCopied(true);
      toast.success("✅ SQL код хуулагдлаа! Одоо Supabase SQL Editor нээгдэж байна...");
      setTimeout(() => setSqlCopied(false), 3000);
      
      // Open SQL Editor in new tab
      window.open(sqlEditorUrl, '_blank');
    } catch (err) {
      toast.error("Хуулахад алдаа гарлаа");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <Card className="max-w-5xl w-full shadow-2xl border-red-200">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-3xl text-red-900">
            ⚠️ Supabase Database Setup хийх шаардлагатай!
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Танд аль хэдийн Supabase credentials байна - зөвхөн database tables үүсгэх хэрэгтэй.<br />
            <strong className="text-blue-600">Edge Functions deploy хийх ХЭРЭГГҮЙ!</strong> Frontend нь шууд Supabase client ашиглана.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Supabase Connection Info */}
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-900">✅ Supabase холболт бэлэн байна</AlertTitle>
            <AlertDescription className="mt-2 space-y-1">
              <div className="font-mono text-xs">
                <strong>Project URL:</strong> {supabaseUrl}
              </div>
              <div className="text-xs text-green-700">
                Танд зөвхөн database schema үүсгэх үлдсэн!
              </div>
            </AlertDescription>
          </Alert>

          {/* Error Details */}
          {isSchemaError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Database алдаа илэрлээ</AlertTitle>
              <AlertDescription className="mt-2 font-mono text-xs">
                {errorCode && <div>Error Code: {errorCode}</div>}
                {errorMessage && <div>Message: {errorMessage}</div>}
                <div className="mt-2 text-sm">
                  ☝️ Энэ нь "products" table байхгүй байна. Доорх алхмуудыг дагана уу.
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Quick Setup Steps */}
          <div className="space-y-4">
            <h3 className="font-bold text-2xl flex items-center gap-2 text-center justify-center">
              <Database className="h-6 w-6 text-blue-600" />
              3 АЛХМААР SETUP ХИЙНЭ ҮҮ
            </h3>

            {/* Quick Action Buttons */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white space-y-4">
              <h4 className="text-xl font-bold text-center">🚀 ONE-CLICK SETUP</h4>
              <p className="text-sm text-center text-blue-100">
                Энэ товч дарвал SQL код автоматаар хуулагдаж, Supabase SQL Editor нээгдэнэ
              </p>
              
              <Button 
                size="lg"
                className="w-full bg-white text-blue-900 hover:bg-blue-50 h-16 text-lg font-bold"
                onClick={copySqlAndOpenEditor}
              >
                {sqlCopied ? (
                  <>
                    <Check className="h-6 w-6 mr-2" />
                    ✅ SQL код хуулагдлаа! SQL Editor нээх...
                  </>
                ) : (
                  <>
                    <Database className="h-6 w-6 mr-2" />
                    SQL ХУУЛЖ SETUP ЭХЛҮҮЛЭХ
                  </>
                )}
              </Button>

              <div className="bg-white/20 rounded-lg p-4 space-y-2 text-sm">
                <p className="font-bold">✅ Энэ товч дарахад:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>SQL код clipboard руу хуулагдана</li>
                  <li>Supabase SQL Editor шинэ tab-д нээгдэнэ</li>
                  <li>SQL Editor дээр Ctrl+V (Mac: Cmd+V) дарж paste хийнэ</li>
                  <li>RUN ▶️ товч дарна</li>
                  <li>Доорх "Refresh" товч дарна</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Documentation Links */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              📚 Дэлгэрэнгүй заавар
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="justify-start h-auto py-2"
                onClick={() => window.open('/SETUP_WALKTHROUGH.md', '_blank')}
              >
                <FileText className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">SETUP_WALKTHROUGH.md</div>
                  <div className="text-xs text-gray-600">Алхам алхмаар заавар</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-2"
                onClick={() => window.open('/QUICKSTART.md', '_blank')}
              >
                <FileText className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">QUICKSTART.md</div>
                  <div className="text-xs text-gray-600">Хурдан эхлэх (5 мин)</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-2"
                onClick={() => window.open('/CREDENTIALS.md', '_blank')}
              >
                <Users className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">CREDENTIALS.md</div>
                  <div className="text-xs text-gray-600">Demo хэрэглэгчид</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="justify-start h-auto py-2"
                onClick={() => window.open('/TROUBLESHOOTING.md', '_blank')}
              >
                <AlertCircle className="h-4 w-4 mr-2" />
                <div className="text-left">
                  <div className="font-medium">TROUBLESHOOTING.md</div>
                  <div className="text-xs text-gray-600">Асуудал шийдэх</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center pt-4">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => window.location.reload()}
            >
              Setup дууссан бол refresh хийх
            </Button>
            <p className="text-xs text-gray-600 mt-2">
              Setup хийж дууссаны дараа энэ хуудсыг refresh хийнэ үү
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}