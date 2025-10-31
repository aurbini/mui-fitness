import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { auth, db } from "../lib/supabase";
import { supabase } from "../lib/supabase";
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
    // Check if this is an OAuth callback (has hash fragments)
    const hashParams = window.location.hash;

    // Get initial session with timeout
    const getInitialSession = async () => {
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setLoading(false);
      }, 5000);

      try {
        // Wait a bit for Supabase to process hash fragments if present
        if (hashParams) {
          await new Promise((resolve) => setTimeout(resolve, 200));
        }

        // Get session with explicit timeout wrapper
        const sessionPromise = supabase.auth.getSession().then(
          (result) => result,
          (err) => ({ data: { session: null }, error: err })
        );

        // Longer timeout for Firefox which may need more time to process OAuth
        const timeoutPromise = new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                data: { session: null },
                error: new Error("getSession timeout"),
              }),
            4000 // Increased from 2000 to 4000ms for Firefox compatibility
          )
        );

        const result = (await Promise.race([
          sessionPromise,
          timeoutPromise,
        ])) as any;
        const sessionData = result?.data;
        const sessionError = result?.error;

        // Use the session user or get current user
        if (sessionData?.session?.user) {
          // Clear hash now that we have the session
          if (hashParams) {
            window.history.replaceState(null, "", window.location.pathname);
          }
          setUser(sessionData.session.user);
          // Load profile but don't wait - it won't block loading state
          loadProfile(sessionData.session.user.id).catch((err) => {
            console.error("Error loading profile:", err);
          });
        } else if (sessionError && hashParams) {
          // If getSession failed but we have hash params, wait for Supabase to process it
          // DON'T clear the hash yet - Supabase needs it to process the session
          // Give Supabase more time to process the hash (Firefox may need longer)
          await new Promise((resolve) => setTimeout(resolve, 3000));

          // Try one more time to get the session after waiting
          try {
            const { data: retryData, error: retryError } =
              await supabase.auth.getSession();
            if (!retryError && retryData?.session?.user) {
              // Clear hash now that we have the session
              window.history.replaceState(null, "", window.location.pathname);
              setUser(retryData.session.user);
              loadProfile(retryData.session.user.id).catch((err) => {
                console.error("Error loading profile:", err);
              });
            } else {
              // Try getUser as a fallback (works better in some browsers)
              try {
                const { data: userData, error: userError } =
                  await supabase.auth.getUser();
                if (!userError && userData?.user) {
                  setUser(userData.user);
                  loadProfile(userData.user.id).catch((err) => {
                    console.error("Error loading profile:", err);
                  });
                }
              } catch (getUserErr) {
                // getUser fallback failed, let auth state change listener handle it
              }

              // Clear hash anyway to clean up URL (after we've given Supabase time)
              window.history.replaceState(null, "", window.location.pathname);
              // Don't set user to null - let the auth state change listener handle it
            }
          } catch (retryErr) {
            // Clear hash anyway to clean up URL
            window.history.replaceState(null, "", window.location.pathname);
            // Don't set user to null - let the auth state change listener handle it
          }
        } else {
          // No hash params or no error - fallback to getCurrentUser
          const { data, error } = await auth.getCurrentUser();

          if (error) {
            console.error("Error getting current user:", error);
            setUser(null);
          } else {
            setUser(data.user ?? null);
            if (data.user) {
              // Load profile but don't wait - it won't block loading state
              loadProfile(data.user.id).catch((err) => {
                console.error("Error loading profile:", err);
              });
            }
          }
        }
      } catch (err) {
        console.error("Exception in getInitialSession:", err);
        setUser(null);
      } finally {
        clearTimeout(timeoutId);
        setLoading(false);
      }
    };

    // Listen for auth changes FIRST - important for OAuth callbacks
    const {
      data: { subscription },
    } = auth.onAuthStateChange(async (event: any, session: any) => {
      if (session?.user) {
        setUser(session.user);
        // Load profile but don't wait - won't block
        loadProfile(session.user.id).catch((err) => {
          console.error("Error loading profile:", err);
        });
      } else {
        setUser(null);
        setProfile(null);
      }

      // Always set loading to false when auth state changes
      setLoading(false);
    });

    // Then get initial session
    getInitialSession();

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await db.getProfile(userId);

      if (error) {
        console.error("Error loading profile:", error);
        setProfile(null);
        return;
      }

      // Handle case where profile doesn't exist yet
      if (data) {
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error("Exception loading profile:", error);
      setProfile(null);
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
