// CMS Client - Now uses Lovable Cloud (local Supabase)
import { supabase } from '@/integrations/supabase/client';

// Re-export the local Supabase client as cmsClient
// All CMS tables are now on Lovable Cloud
export const cmsClient = supabase;
