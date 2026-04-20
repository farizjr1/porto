import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/config";

export const createClient = () =>
  createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey());
