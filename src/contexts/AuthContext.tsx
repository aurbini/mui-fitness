import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db } from "../lib/supabase";
import { User, Profile, AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data, error } = await auth.getCurrentUser();
      if (error) {
        console.error("Error getting current user:", error);
        setUser(null);
      } else {
        setUser(data.user ?? null);
        if (data.user) {
          await loadProfile(data.user.id);
        }
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (event: any, session: any) => {
      setUser(session?.user ?? null);

      if (session?.user) {
        await loadProfile(session.user.id);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await db.getProfile(userId);
      if (error) throw error;
      setProfile(Array.isArray(data) ? data[0] : data);
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData: any = {}
  ) => {
    const { data, error } = await auth.signUp(email, password, userData);
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await auth.signIn(email, password);
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await auth.signInWithGoogle();
    return { data, error };
  };

  const signOut = async () => {
    const { error } = await auth.signOut();
    setProfile(null);
    return { error };
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { data: null, error: new Error("No user logged in") };

    const { data, error } = await db.updateProfile(user.id, updates);
    if (!error && data) {
      setProfile(Array.isArray(data) ? data[0] : data);
    }
    return { data, error };
  };

  const value = {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
