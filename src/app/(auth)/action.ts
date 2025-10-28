'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs'
import { Provider } from '@supabase/supabase-js';

function now() {
  return new Date().toISOString();
}

export async function login(formData: FormData) {
  try {
    const supabase = await createClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required.',
        timestamp: now(),
        status: 'validation_error',
      };
    }

    const res = await supabase.auth.signInWithPassword({ email, password });

    if (res.error) {
      return {
        success: false,
        message: res.error.message || 'Login failed.',
        timestamp: now(),
        status: 'auth_error',
      };
    }

    revalidatePath('/', 'layout');

    return {
      success: true,
      message: 'Login successful.',
      timestamp: now(),
      status: 'success',
    };

  } catch (error: any) {
    console.error("Login error:", error);
    return {
      success: false,
      message: error.message || 'Server error.',
      timestamp: now(),
      status: 'server_error',
    };
  }
}

export async function loginWithOAuth(provider: Provider, next: string) {
  const supabase = await createClient()

  const {data, error} = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${next}`,
    },
  })

  if (data.url) {
    redirect(data.url) 
  }
}



export async function signup(formData: FormData) {
  const supabase = await createClient();

  const fullname = formData.get('fullname') as string;
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const methode = formData.get('methode') as string;

  if (!fullname || !username || !email || !password || !confirmPassword) {
    return {
      success: false,
      message: 'All fields are required.',
      timestamp: now(),
      status: 'validation_error',
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: 'Passwords do not match.',
      timestamp: now(),
      status: 'password_mismatch',
    };
  }

  if (methode === 'email') {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    console.log('User', user);
    if (user) {
      return {
        success: false,
        message: `Email ${email} is already registered.`,
        timestamp: now(),
        status: 'email_exists',
      };
    }

    const existingUsername = await prisma.user.findUnique({
      where: { username },
      select: { username: true },
    });

    if (existingUsername) {
      return {
        success: false,
        message: `Username ${username} is already taken.`,
        timestamp: now(),
        status: 'username_exists',
      };
    }
  }

  const res = await supabase.auth.signUp({ email, password });

  if (res.error) {
    return {
      success: false,
      message: res.error.message || 'Signup failed.',
      timestamp: now(),
      status: 'auth_error',
    };
  }
  revalidatePath('/', 'layout');
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        id: res.data.user?.id || '',
        email,
        username,
        fullName: fullname,
        password: hashedPassword,
      },
    });

    if (newUser) {
      return {
        success: true,
        message: 'Registration successful. Please check your email for verification.',
        timestamp: now(),
        status: 'success',
      };
    }

  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Database error.',
      timestamp: now(),
      status: 'database_error',
    };
  }
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      message: error.message || 'Logout failed.',
      timestamp: now(),
      status: 'auth_error',
    };
  }

  return {
    success: true,
    message: 'Logout successful.',
    timestamp: now(),
    status: 'success',
  };
}
