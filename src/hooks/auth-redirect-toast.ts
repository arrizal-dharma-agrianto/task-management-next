'use client'

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import Cookies from 'js-cookie'

export function useRedirectReasonToast() {
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const cookies = document.cookie
      .split("; ")
      .reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {} as Record<string, string>);

    const reason = cookies["auth_redirect_reason"];

    if (reason === "already_logged_in") {
      setTimeout(() => {
        toast.warning("You are already logged in.",{
          duration: 5000,
          description: "You must log out first to access auth page.",
        });
        Cookies.remove('auth_redirect_reason', { path: '/' })
      }, 100);
    }

    if (reason === "you_must_login_first") {
      setTimeout(() => {
        toast.error("You must log in first.", {
          duration: 5000,
          description: "Access denied. Please sign in to continue.",
        });
        Cookies.remove('auth_redirect_reason', { path: '/' })
      }, 100);
    }

    if (reason === "login_successful") {
      setTimeout(() => {
        toast.success("Login successful!", {
          duration: 5000,
          description: "You are now logged in.",
        });
        Cookies.remove('auth_redirect_reason', { path: '/' })
      }, 100);
    }
  }, []);
}