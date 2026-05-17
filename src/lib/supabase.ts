import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dfjccrvqluwzuqrskiii.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_f38og-vf25WLhNG9hBqvkg_aOsedikd';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
}

export function handleSupabaseError(error: any, operation: OperationType, table: string) {
  console.error(`Supabase Error during ${operation} on ${table}:`, error);
  // In a real app, you might want to show a toast or throw a specific error
  throw error;
}
