"use client";

import { createClient as createBrowserClient } from "@/utils/supabase/client";

/** Singleton browser client for Client Components only. */
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  browserClient ??= createBrowserClient();
  return browserClient;
}
