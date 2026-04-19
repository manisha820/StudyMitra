import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://erevwzaymsqqdjyzkolt.supabase.co';
const supabaseAnonKey = 'sb_publishable_wRHkgcx0pIneUUWVh7Tr4g_RMzYBBlG';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
