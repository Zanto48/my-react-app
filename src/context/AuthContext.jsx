import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Pastikan path ini benar sesuai file supabaseClient.js Anda

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek sesi saat ini
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();

    // 2. Dengarkan jika ada yang login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fungsi Login
  const login = (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  // Fungsi Register
  const register = (email, password) => {
    return supabase.auth.signUp({ email, password });
  };

  // Fungsi Logout
  const logout = () => {
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};