"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  clearStoredAuth,
  persistAuth,
  readStoredUser,
  updateStoredUser,
} from "@/lib/auth-storage";
import {
  loginWithGoogle as googleLoginRequest,
  login as loginRequest,
  register as registerRequest,
  resendRegistrationOtp as resendRegistrationOtpRequest,
  logout as logoutRequest,
  getMe,
  verifyRegistrationOtp as verifyRegistrationOtpRequest,
  type RegistrationOtpResponse,
} from "@/services/auth-service";
import type { UserProfile } from "@/types";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface VerifyOtpInput {
  email: string;
  otp: string;
}

interface AuthContextValue {
  status: AuthStatus;
  user: UserProfile | null;
  login: (input: LoginInput) => Promise<UserProfile>;
  register: (input: RegisterInput) => Promise<RegistrationOtpResponse>;
  verifyRegistrationOtp: (input: VerifyOtpInput) => Promise<UserProfile>;
  resendRegistrationOtp: (email: string) => Promise<RegistrationOtpResponse>;
  loginWithGoogle: (idToken: string) => Promise<UserProfile>;
  logout: () => void;
  refreshProfile: () => Promise<UserProfile | null>;
  replaceUser: (user: UserProfile) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    let cancelled = false;

    // First try cached user for instant UI, then verify with server
    queueMicrotask(() => {
      const storedUser = readStoredUser();

      if (cancelled) {
        return;
      }

      if (storedUser) {
        setUser(storedUser);
        setStatus("authenticated");
      }

      // Verify session with server via HttpOnly cookie
      void getMe()
        .then((profile) => {
          if (cancelled) {
            return;
          }

          if (profile) {
            setUser(profile);
            updateStoredUser(profile);
            setStatus("authenticated");
          } else {
            clearStoredAuth();
            setUser(null);
            setStatus("unauthenticated");
          }
        })
        .catch(() => {
          if (cancelled) {
            return;
          }

          clearStoredAuth();
          setUser(null);
          setStatus("unauthenticated");
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      user,
      async login(input) {
        const response = await loginRequest(input);
        persistAuth(response.user);
        setUser(response.user);
        setStatus("authenticated");
        return response.user;
      },
      async register(input) {
        return registerRequest(input);
      },
      async verifyRegistrationOtp(input) {
        const response = await verifyRegistrationOtpRequest(input);
        persistAuth(response.user);
        setUser(response.user);
        setStatus("authenticated");
        return response.user;
      },
      async resendRegistrationOtp(email) {
        return resendRegistrationOtpRequest({ email });
      },
      async loginWithGoogle(idToken) {
        const response = await googleLoginRequest({ idToken });
        persistAuth(response.user);
        setUser(response.user);
        setStatus("authenticated");
        return response.user;
      },
      async logout() {
        await logoutRequest();
        clearStoredAuth();
        setUser(null);
        setStatus("unauthenticated");
      },
      async refreshProfile() {
        const profile = await getMe();

        if (!profile) {
          clearStoredAuth();
          setUser(null);
          setStatus("unauthenticated");
          return null;
        }

        setUser(profile);
        updateStoredUser(profile);
        setStatus("authenticated");
        return profile;
      },
      replaceUser(nextUser) {
        setUser(nextUser);
        updateStoredUser(nextUser);
      },
    }),
    [status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider.");
  }

  return context;
}
