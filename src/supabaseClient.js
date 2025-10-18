import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getUserId = () => {
  let userId = localStorage.getItem('book_finder_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now();
    localStorage.setItem('book_finder_user_id', userId);
  }
  return userId;
};
