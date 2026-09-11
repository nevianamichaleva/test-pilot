"use client";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getFirebaseAuth, getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";
import { ensureUserProfile, fetchUserProfile } from "@/lib/userProfile";
import { isPassingPercent } from "@/lib/rewards";

const AuthContext = createContext({
  user: null,
  profile: null,
  loading: true,
  configured: false,
  displayName: "",
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
  getBestForContent: () => null,
  isContentSolved: () => false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      return undefined;
    }
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false);
      return undefined;
    }

    let unsubProfile = null;
    const unsubAuth = onAuthStateChanged(auth, async (nextUser) => {
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        await ensureUserProfile(nextUser.uid, {
          displayName: nextUser.displayName || "",
          email: nextUser.email || "",
        });
      } catch {
        // Продължаваме със snapshot, ако има документ.
      }

      const db = getFirebaseDb();
      if (!db) {
        setLoading(false);
        return;
      }

      unsubProfile = onSnapshot(
        doc(db, "users", nextUser.uid),
        (snap) => {
          if (snap.exists()) {
            setProfile({ id: snap.id, ...snap.data() });
          } else {
            setProfile(null);
          }
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    });

    return () => {
      unsubAuth();
      if (unsubProfile) unsubProfile();
    };
  }, [configured]);

  const register = useCallback(async ({ name, email, password }) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase Auth не е конфигуриран.");
    const displayName = String(name || "").trim();
    if (!displayName) throw new Error("Въведи име.");
    const cred = await createUserWithEmailAndPassword(auth, String(email || "").trim(), password);
    await updateProfile(cred.user, { displayName });
    await ensureUserProfile(cred.user.uid, {
      displayName,
      email: cred.user.email || email,
    });
    return cred.user;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const auth = getFirebaseAuth();
    if (!auth) throw new Error("Firebase Auth не е конфигуриран.");
    const cred = await signInWithEmailAndPassword(auth, String(email || "").trim(), password);
    return cred.user;
  }, []);

  const logout = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return null;
    const data = await fetchUserProfile(user.uid);
    if (data) setProfile(data);
    return data;
  }, [user]);

  const getBestForContent = useCallback(
    (contentKey) => {
      if (!contentKey || !profile?.bestByContent) return null;
      const entry = profile.bestByContent[contentKey];
      return entry && typeof entry === "object" ? entry : null;
    },
    [profile]
  );

  const isContentSolved = useCallback(
    (contentKey) => {
      const best = getBestForContent(contentKey);
      return Boolean(best && isPassingPercent(best.percent));
    },
    [getBestForContent]
  );

  const displayName = useMemo(() => {
    if (profile?.displayName) return String(profile.displayName);
    if (user?.displayName) return String(user.displayName);
    return "";
  }, [profile, user]);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      configured,
      displayName,
      register,
      login,
      logout,
      refreshProfile,
      getBestForContent,
      isContentSolved,
    }),
    [
      user,
      profile,
      loading,
      configured,
      displayName,
      register,
      login,
      logout,
      refreshProfile,
      getBestForContent,
      isContentSolved,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
