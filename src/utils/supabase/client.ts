import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Support for environment variables (for Vercel deployment)
// Safely check if import.meta.env exists (Vite-specific)
let envProjectId: string | undefined;
let envAnonKey: string | undefined;

try {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const envUrl = import.meta.env.VITE_SUPABASE_URL;
    envProjectId = envUrl?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
} catch (e) {
  // import.meta.env not available (e.g., in Figma Make environment)
  envProjectId = undefined;
  envAnonKey = undefined;
}

// Use environment variables if available, otherwise use info.tsx
const finalProjectId = envProjectId || projectId;
const finalAnonKey = envAnonKey || publicAnonKey;

// Validate configuration
if (!finalProjectId || !finalAnonKey) {
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("❌ SUPABASE CONFIGURATION АЛДАА!");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("");
  console.error("Supabase projectId эсвэл publicAnonKey олдсонгүй!");
  console.error("");
  console.error("✅ ШИЙДЭЛ:");
  console.error("   1. /utils/supabase/info.tsx файл байгаа эсэхийг шалгах");
  console.error("   2. projectId болон publicAnonKey утгууд байгаа эсэхийг шалгах");
  console.error("   3. Vercel дээр: Environment Variables тохируулах (VERCEL_SUPABASE_SETUP.md үзнэ үү)");
  console.error("");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  throw new Error("Supabase configuration not found");
}

// Create a singleton Supabase client
export const supabase = createSupabaseClient(
  `https://${finalProjectId}.supabase.co`,
  finalAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  }
);

// Log configuration (without exposing full key)
console.log("✅ Supabase Client initialized");
console.log(`   Project ID: ${finalProjectId}`);
console.log(`   URL: https://${finalProjectId}.supabase.co`);
console.log(`   Source: ${envProjectId ? 'Environment Variables' : 'info.tsx'}`);

// Helper to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  
  // Get user profile with role
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return profile;
};

// Helper to get access token
export const getAccessToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || null;
};