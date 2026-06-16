/**
 * AuthContext.tsx — Firebase Authentication
 *
 * Kya karta hai:
 *  - Firebase Email/Password se login & register
 *  - User profile Firestore "users" collection mein store hota hai
 *  - Email verification Firebase se hoti hai (link via email)
 *  - Password reset Firebase se hota hai (link via email)
 *  - onAuthStateChanged se session automatically restore hota hai
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, setUserProfile, updateUserProfile, type UserProfile } from "@/lib/firestore";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "admin" | "seller" | "buyer" | "manager";

export interface AuthUser {
  id: string;
  full_name: string;
  email: string;
  company_name: string | null;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  company_name?: string;
  role?: UserRole;
}

interface AuthState {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  accessToken: string | null;   // kept for backward-compat with api.ts interceptor
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  // Legacy shape kept so existing AuthForm / pages don't break
  verifyEmail: (email: string, otp: string) => Promise<void>;
  verifyResetOtp: (email: string, otp: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

function fbUserToAuthUser(profile: UserProfile, fbUser: FirebaseUser): AuthUser {
  return {
    id:           profile.id,
    full_name:    profile.full_name,
    email:        profile.email,
    company_name: profile.company_name,
    role:         profile.role,
    is_verified:  fbUser.emailVerified,
    is_active:    profile.is_active,
    created_at:   profile.created_at,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    accessToken: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // ── Auto-restore session ───────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setState({ user: null, firebaseUser: null, accessToken: null, isLoading: false, isAuthenticated: false });
        return;
      }
      try {
        const token   = await fbUser.getIdToken();
        const profile = await getUserProfile(fbUser.uid);
        if (profile) {
          setState({
            user: fbUserToAuthUser(profile, fbUser),
            firebaseUser: fbUser,
            accessToken: token,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({ user: null, firebaseUser: fbUser, accessToken: null, isLoading: false, isAuthenticated: false });
        }
      } catch {
        setState({ user: null, firebaseUser: null, accessToken: null, isLoading: false, isAuthenticated: false });
      }
    });
    return unsub;
  }, []);

  // ── Login ──────────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    const cred    = await signInWithEmailAndPassword(auth, email, password);
    const token   = await cred.user.getIdToken();
    const profile = await getUserProfile(cred.user.uid);
    if (!profile) throw new Error("User profile bulunamadı. Lütfen tekrar kayıt olun.");

    setState({
      user: fbUserToAuthUser(profile, cred.user),
      firebaseUser: cred.user,
      accessToken: token,
      isLoading: false,
      isAuthenticated: true,
    });
    window.location.href = "/dashboard";
  }, []);

  // ── Register ───────────────────────────────────────────────────────────────
  const register = useCallback(async (data: RegisterData) => {
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);

    const profile: Omit<UserProfile, "id"> = {
      full_name:    data.full_name,
      email:        data.email,
      company_name: data.company_name ?? null,
      role:         data.role ?? "buyer",
      is_verified:  false,
      is_active:    true,
      created_at:   new Date().toISOString(),
    };
    await setUserProfile(cred.user.uid, profile);
    await sendEmailVerification(cred.user);

    sessionStorage.setItem("otp_email", data.email);
    sessionStorage.setItem("otp_mode",  "verify_email");
    window.location.href = "/auth/otp";
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await signOut(auth);
    setState({ user: null, firebaseUser: null, accessToken: null, isLoading: false, isAuthenticated: false });
    window.location.href = "/auth/login";
  }, []);

  // ── Forgot Password ────────────────────────────────────────────────────────
  const forgotPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    sessionStorage.setItem("otp_email", email);
    sessionStorage.setItem("otp_mode",  "reset_password");
  }, []);

  // ── Resend Verification ────────────────────────────────────────────────────
  const resendVerificationEmail = useCallback(async () => {
    if (state.firebaseUser) await sendEmailVerification(state.firebaseUser);
  }, [state.firebaseUser]);

  // ── Refresh Token ──────────────────────────────────────────────────────────
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!auth.currentUser) return false;
    try {
      const token = await auth.currentUser.getIdToken(true);
      setState((s) => ({ ...s, accessToken: token }));
      return true;
    } catch {
      return false;
    }
  }, []);

  // ── Legacy stubs (UI pages still call these) ───────────────────────────────
  const verifyEmail = useCallback(async (_e: string, _o: string) => {
    // Firebase uses email link — just redirect to login
    sessionStorage.removeItem("otp_email");
    sessionStorage.removeItem("otp_mode");
    window.location.href = "/auth/login";
  }, []);

  const verifyResetOtp = useCallback(async (_e: string, _o: string) => {
    sessionStorage.removeItem("otp_email");
    sessionStorage.removeItem("otp_mode");
    window.location.href = "/auth/login";
  }, []);

  const resetPassword = useCallback(async (email: string, _o: string, _p: string) => {
    await sendPasswordResetEmail(auth, email);
    sessionStorage.removeItem("reset_email");
    sessionStorage.removeItem("reset_otp");
    window.location.href = "/auth/login";
  }, []);

  const value: AuthContextValue = {
    ...state,
    login, register, logout,
    forgotPassword, resendVerificationEmail, refreshToken,
    verifyEmail, verifyResetOtp, resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
