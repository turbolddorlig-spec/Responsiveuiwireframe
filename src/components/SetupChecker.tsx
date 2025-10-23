import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { AlertCircle, CheckCircle, XCircle, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "../utils/supabase/client";
import { projectId, publicAnonKey } from "../utils/supabase/info";

interface CheckResult {
  name: string;
  status: 'success' | 'error' | 'warning' | 'pending';
  message: string;
  action?: string;
}

export function SetupChecker() {
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<CheckResult[]>([]);
  const [showDetails, setShowDetails] = useState(false);

  const runChecks = async () => {
    setIsChecking(true);
    setShowDetails(true);
    const checks: CheckResult[] = [];

    // Check 1: Environment variables
    checks.push({
      name: "Environment Variables",
      status: projectId && publicAnonKey ? 'success' : 'error',
      message: projectId && publicAnonKey 
        ? "✅ VITE_SUPABASE_URL болон VITE_SUPABASE_ANON_KEY тохируулсан"
        : "❌ .env файл үүсгэж environment variables оруулна уу",
      action: projectId && publicAnonKey ? undefined : "1. .env файл үүсгэх\n2. Supabase Dashboard > Settings > API-с URL болон anon key авах\n3. Dev server restart (Ctrl+C, дараа npm run dev)"
    });
    setResults([...checks]);

    // Check 2: Supabase connection
    try {
      const { error } = await supabase.from('products').select('count', { count: 'exact', head: true });
      
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('schema cache')) {
          checks.push({
            name: "Database Schema",
            status: 'error',
            message: "❌ Tables үүсгээгүй байна (PGRST205 error)",
            action: "1. Supabase Dashboard > SQL Editor рүү орох\n2. /supabase/migrations/complete_setup.sql файлын БҮГДИЙГ хуулах\n3. RUN дарж schema үүсгэх\n\nДэлгэрэнгүй: SETUP_WALKTHROUGH.md үзнэ үү"
          });
        } else {
          checks.push({
            name: "Database Connection",
            status: 'error',
            message: `❌ Database холболтын алдаа: ${error.message}`,
            action: "Supabase project асаалттай эсэхийг шалгаарай"
          });
        }
      } else {
        checks.push({
          name: "Database Connection",
          status: 'success',
          message: "✅ Supabase database холбогдсон"
        });
      }
    } catch (err: any) {
      checks.push({
        name: "Database Connection",
        status: 'error',
        message: `❌ Холболтын алдаа: ${err.message || 'Unknown error'}`,
        action: ".env файлын VITE_SUPABASE_URL зөв эсэхийг шалгаарай"
      });
    }
    setResults([...checks]);

    // Check 3: Products table
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1);
      
      if (error) {
        checks.push({
          name: "Products Table",
          status: 'error',
          message: "❌ Products table байхгүй",
          action: "complete_setup.sql ажиллуулна уу"
        });
      } else {
        checks.push({
          name: "Products Table",
          status: 'success',
          message: `✅ Products table бэлэн (${data?.length || 0} бүтээгдэхүүн)`
        });
      }
    } catch (err) {
      checks.push({
        name: "Products Table",
        status: 'error',
        message: "❌ Products table шалгах боломжгүй"
      });
    }
    setResults([...checks]);

    // Check 4: Orders table
    try {
      const { data, error } = await supabase.from('orders').select('id').limit(1);
      
      if (error) {
        checks.push({
          name: "Orders Table",
          status: 'error',
          message: "❌ Orders table ба��хгүй",
          action: "complete_setup.sql ажиллуулна уу"
        });
      } else {
        checks.push({
          name: "Orders Table",
          status: 'success',
          message: `✅ Orders table бэлэн (${data?.length || 0} захиалга)`
        });
      }
    } catch (err) {
      checks.push({
        name: "Orders Table",
        status: 'error',
        message: "❌ Orders table шалгах боломжгүй"
      });
    }
    setResults([...checks]);

    // Check 5: User profiles
    try {
      const { data, error } = await supabase.from('user_profiles').select('id').limit(1);
      
      if (error) {
        checks.push({
          name: "User Profiles",
          status: 'error',
          message: "❌ user_profiles table байхгүй",
          action: "complete_setup.sql ажиллуулна уу"
        });
      } else if (!data || data.length === 0) {
        checks.push({
          name: "User Profiles",
          status: 'warning',
          message: "⚠️ Demo хэрэглэгчид үүсгээгүй байна",
          action: "1. Supabase Dashboard > Authentication > Users рүү орох\n2. 7 demo хэрэглэгч үүсгэх (CREDENTIALS.md үзнэ үү)\n3. /scripts/create-demo-users.sql ажиллуулах\n\nДэлгэрэнгүй: SETUP_WALKTHROUGH.md PART 3, 4"
        });
      } else {
        checks.push({
          name: "User Profiles",
          status: 'success',
          message: `✅ User profiles бэлэн (${data.length}+ хэрэглэгч)`
        });
      }
    } catch (err) {
      checks.push({
        name: "User Profiles",
        status: 'error',
        message: "❌ user_profiles table шалгах боломжгүй"
      });
    }
    setResults([...checks]);

    setIsChecking(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-6 w-6" />
          Setup Diagnostic
        </CardTitle>
        <CardDescription>
          Supabase setup зөв хийгдсэн эсэхийг шалгах
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runChecks} 
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Шалгаж байна...
            </>
          ) : (
            "Setup шалгах"
          )}
        </Button>

        {showDetails && results.length > 0 && (
          <div className="space-y-3 mt-4">
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  result.status === 'success' ? 'bg-green-50 border-green-200' :
                  result.status === 'error' ? 'bg-red-50 border-red-200' :
                  result.status === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="font-medium">{result.name}</div>
                    <div className="text-sm mt-1">{result.message}</div>
                    {result.action && (
                      <div className="mt-2 p-2 bg-white rounded border text-xs whitespace-pre-line">
                        <strong>Шийдэл:</strong>
                        <br />
                        {result.action}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showDetails && results.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              📚 Дэлгэрэнгүй заавар:
            </p>
            <div className="space-y-1 text-sm text-blue-800">
              <a 
                href="/ШУУД_ЗАСАХ.md" 
                target="_blank"
                className="flex items-center gap-2 hover:underline font-bold text-red-600"
              >
                <ExternalLink className="h-4 w-4" />
                🚨 ШУУД_ЗАСАХ.md - 3 МИНУТАНД ЗАСАХ!
              </a>
              <a 
                href="/SETUP_WALKTHROUGH.md" 
                target="_blank"
                className="flex items-center gap-2 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                SETUP_WALKTHROUGH.md - Алхам алхмаар заавар
              </a>
              <a 
                href="/CREDENTIALS.md" 
                target="_blank"
                className="flex items-center gap-2 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                CREDENTIALS.md - Demo хэрэглэгчдийн мэдээлэл
              </a>
              <a 
                href="/START_HERE.md" 
                target="_blank"
                className="flex items-center gap-2 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                START_HERE.md - Эхлэх заавар
              </a>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}