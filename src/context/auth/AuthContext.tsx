"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
}

interface AuthContextType {
  usuario: string | null;
  staff: boolean;
  cliente: Cliente | null;
  authenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

interface AuthResponse {
  authenticated: boolean;
  usuario: string | null;
  staff: boolean;
  cliente: Cliente | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SIN_SESION: AuthResponse = {
  authenticated: false,
  usuario: null,
  staff: false,
  cliente: null,
};

async function consultarSesion(): Promise<AuthResponse> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return SIN_SESION;
  }

  const data = (await response.json()) as Partial<AuthResponse>;

  return {
    authenticated: Boolean(data.authenticated),
    usuario: data.usuario ?? null,
    staff: Boolean(data.staff),
    cliente: data.cliente ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<AuthResponse>(SIN_SESION);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      setSesion(await consultarSesion());
    } catch (error) {
      console.error("Error al consultar la sesión:", error);
      setSesion(SIN_SESION);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    consultarSesion()
      .then((data) => {
        if (activo) setSesion(data);
      })
      .catch((error: unknown) => {
        console.error("Error al consultar la sesión:", error);
        if (activo) setSesion(SIN_SESION);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario: sesion.usuario,
        staff: sesion.staff,
        cliente: sesion.cliente,
        authenticated: sesion.authenticated,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de un AuthProvider");
  }

  return context;
}
