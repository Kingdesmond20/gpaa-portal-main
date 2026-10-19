import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabaseClient';
import { getProfile, signOut as authSignOut } from '../lib/authApi';
import type { Profile } from '../types';

interface AuthContextValue {
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // The user whose profile is loaded (or loading). Lets the auth listener
  // tell a genuine sign-in apart from a token refresh for the same user.
  const profileUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadProfile = async (nextSession: Session | null) => {
      if (!nextSession) {
        profileUserIdRef.current = null;
        if (!cancelled) setProfile(null);
        return;
      }
      profileUserIdRef.current = nextSession.user.id;
      try {
        const nextProfile = await getProfile(nextSession.user.id);
        if (!cancelled) setProfile(nextProfile);
      } catch {
        if (!cancelled) setProfile(null);
      }
    };

    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (cancelled) return;
      setSession(initialSession);
      loadProfile(initialSession).finally(() => {
        if (!cancelled) setLoading(false);
      });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (cancelled) return;
      setSession(nextSession);
      // A newly signed-in user has a session before their profile arrives.
      // Stay in `loading` until it does, or ProtectedRoute role="admin" sees
      // profile === null and bounces admins to "/". Token refreshes for the
      // same user skip this so open pages don't flash a skeleton.
      const isNewUser = nextSession !== null && nextSession.user.id !== profileUserIdRef.current;
      if (isNewUser) setLoading(true);
      loadProfile(nextSession).finally(() => {
        if (!cancelled && isNewUser) setLoading(false);
      });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await authSignOut();
  };

  return (
    <AuthContext.Provider value={{ session, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
