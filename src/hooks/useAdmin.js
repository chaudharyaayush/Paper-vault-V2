import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setAuthenticated(!!session);
      setLoading(false);
    }

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthenticated(!!session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function login(email, password) {
    const { error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      console.error("Admin login error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    return { success: true };
  }

  async function logout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error("Admin logout error:", error);
    }
  }

  return {
    authenticated,
    loading,
    login,
    logout,
  };
}
