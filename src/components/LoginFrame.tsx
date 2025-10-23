import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Lock, User as UserIcon } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { authAPI } from "../utils/api";
import { demoAuthAPI, enableDemoMode, isDemoMode } from "../utils/demoStorage";
import { SetupChecker } from "./SetupChecker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import zoodShopyLogo from "figma:asset/98b13064736497621f0dd1f4976ade4c7b1f74e8.png";

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

export function LoginFrame({ onLogin, users }: { onLogin: (user: User) => void; users: User[] }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if demo mode is active
      const useDemoMode = isDemoMode();
      
      if (useDemoMode) {
        // Use demo authentication
        const user = await demoAuthAPI.login(phone, password);
        toast.success(`🎮 Demo Mode: Тавтай морил, ${user.name}!`);
        onLogin(user);
      } else {
        // Call Supabase authentication
        const user = await authAPI.login(phone, password);
        toast.success(`Тавтай морил, ${user.name}!`);
        onLogin(user);
      }
    } catch (error: any) {
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("❌ НЭВТРЭХ АЛДАА!");
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.error("");
      console.error("Login error:", error);
      console.error("");
      
      // More detailed error messages
      let errorMessage = "Утасны дугаар эсвэл нууц үг буруу байна!";
      
      if (error.message?.includes('Invalid login credentials')) {
        console.error("🔍 ШАЛТГААН: Demo хэрэглэгчид үүсгээгүй эсвэл Auto Confirm хийгээгүй");
        console.error("");
        console.error("✅ ШИЙДЭЛ:");
        console.error("   1. Нэвтрэх дэлгэц дээрх '🔍 Setup шалгах' товч дарна");
        console.error("   2. ЭСВЭЛ '🎮 DEMO MODE эхлүүлэх' товч дарна (Supabase хэрэггүй!)");
        console.error("   3. ЭСВЭЛ ШУУД_ЗАСАХ.md файлыг нээж заавар дагана");
        console.error("");
        errorMessage = "⚠️ Нэвтрэх нэр эсвэл нууц үг буруу байна!\n\nDemo хэрэглэгчид үүсгээгүй бол '🎮 DEMO MODE' товч дарна уу.";
      } else if (error.message?.includes('Email not confirmed')) {
        console.error("🔍 ШАЛТГААН: Email баталгаажаагүй");
        console.error("");
        console.error("✅ ШИЙДЭЛ:");
        console.error("   Supabase Dashboard → Authentication → Users");
        console.error("   Хэрэглэгч дээр дарж 'Confirm email' товч дарна");
        console.error("");
        errorMessage = "И-мэйл баталгаажаагүй байна!";
      } else if (error.code === 'PGRST205' || error.message?.includes('table') || error.message?.includes('schema')) {
        console.error("🔍 ШАЛТГААН: Supabase database tables үүсгээгүй");
        console.error("");
        console.error("✅ ШИЙДЭЛ:");
        console.error("   1. '🔍 Setup шалгах' товч дарна");
        console.error("   2. ЭСВЭЛ '🎮 DEMO MODE эхлүүлэх' товч дарна (Supabase хэрэггүй!)");
        console.error("   3. ЭСВЭЛ ШУУД_ЗАСАХ.md файл нээж SQL кодыг ажиллуулна");
        console.error("");
        errorMessage = "⚠️ Supabase schema үүсгээгүй байна!\n\n'🎮 DEMO MODE' товч дарж шууд туршиж үзнэ үү!";
      } else if (error.message) {
        console.error("🔍 АЛДАА:", error.message);
        console.error("");
        errorMessage = error.message;
      }
      
      console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      
      toast.error(errorMessage, { duration: 10000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoMode = async () => {
    enableDemoMode();
    toast.success("🎮 Demo Mode эхэллээ! LocalStorage ашиглана.", { duration: 3000 });
    
    // Direct login with demo credentials
    setIsLoading(true);
    try {
      const user = await demoAuthAPI.login("99000000", "super123");
      toast.success(`🎮 Demo Mode: Тавтай морил, ${user.name}!`);
      onLogin(user);
    } catch (error: any) {
      console.error("Demo login error:", error);
      toast.error("Demo Mode нэвтрэлт амжилтгүй болсон!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 animate-gradient"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtOC44MzctNy4xNjMtMTYtMTYtMTZTNCAxNi4xNjMgNCAxNiA2LjE2MyAzMiAxNSAzMnMxNi03LjE2MyAxNi0xNnptMCA0MGMwLTguODM3LTcuMTYzLTE2LTE2LTE2UzQgNTYuMTYzIDQgNTZzMTEuMTYzIDE2IDE2IDE2IDE2LTcuMTYzIDE2LTE2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
      
      {/* Floating shapes */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Login Card with glassmorphism */}
      <Card className="w-full max-w-md shadow-2xl backdrop-blur-md bg-white/90 border-white/20 relative z-10">
        <CardHeader className="space-y-1 text-center">
          {/* Logo with gradient and animation */}
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl transform hover:scale-105 transition-all duration-300 hover:rotate-3">
            <svg className="w-14 h-14 text-white animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <CardTitle className="text-4xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Logistics System
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Захиалгын удирдлагын систем
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Нэвтрэх нэр</Label>
              <div className="relative group">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400 transition-colors group-focus-within:text-purple-600" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Нэвтрэх нэр"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-11 h-12 border-2 border-gray-200 focus:border-purple-400 transition-all duration-200 rounded-xl"
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Нууц үг</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-pink-400 transition-colors group-focus-within:text-pink-600" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 h-12 border-2 border-gray-200 focus:border-pink-400 transition-all duration-200 rounded-xl"
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Нэвтэрч байна...
                </span>
              ) : (
                "Нэвтрэх"
              )}
            </Button>

            {/* Development helpers */}
            <div className="space-y-3 pt-4 border-t-2 border-gray-100">
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 rounded-xl"
                onClick={handleDemoMode}
              >
                <span className="flex items-center gap-2 text-base">
                  🎮 DEMO MODE эхлүүлэх (Шууд нэвтрэх)
                </span>
              </Button>
              
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-xl p-4 text-xs space-y-2 shadow-inner">
                <p className="font-semibold text-purple-900 text-sm flex items-center gap-1">
                  <span>👥</span> Demo хэрэглэгчид:
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-purple-700">
                  <div className="flex items-center gap-1">
                    <span className="text-base">👑</span>
                    <strong>Super Admin:</strong>
                  </div>
                  <div className="text-purple-600 font-mono bg-white/60 px-2 py-0.5 rounded">99000000</div>
                  
                  <div className="col-span-2 text-purple-500 text-[10px] -mt-1 ml-6">super123</div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-base">⚙️</span>
                    <strong>Admin:</strong>
                  </div>
                  <div className="text-purple-600 font-mono bg-white/60 px-2 py-0.5 rounded">99000001</div>
                  
                  <div className="col-span-2 text-purple-500 text-[10px] -mt-1 ml-6">admin123</div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-base">📋</span>
                    <strong>Operator:</strong>
                  </div>
                  <div className="text-purple-600 font-mono bg-white/60 px-2 py-0.5 rounded">99000002</div>
                  
                  <div className="col-span-2 text-purple-500 text-[10px] -mt-1 ml-6">operator123</div>
                </div>
                <p className="text-purple-600 pt-1 text-center bg-white/40 rounded-lg py-1.5 px-2">
                  💡 Эсвэл дээрх "Demo Mode" товч дарна
                </p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button type="button" variant="ghost" className="w-full text-sm hover:bg-purple-50 transition-colors rounded-xl h-10">
                    🔍 Setup шалгах (Supabase)
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Supabase Setup Checker</DialogTitle>
                  </DialogHeader>
                  <SetupChecker />
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export type { UserRole, User };