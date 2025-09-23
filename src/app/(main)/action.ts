'use server';

import { createClient } from '@/utils/supabase/server';


const getUserProfile = async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  console.log("user", user)
  return user;


}

export { getUserProfile };