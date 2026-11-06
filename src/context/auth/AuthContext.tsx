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
  cliente: Cliente | null;
  authenticated: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

interface AuthResponse {
  authenticated: boolean;
  cliente: Cliente | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function consultarSesion(): Promise<AuthResponse> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return { authenticated: false, cliente: null };
  }

  const data = (await response.json()) as AuthResponse;

  return {
    authenticated: Boolean(data.authenticated),
    cliente: data.cliente ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await consultarSesion();
      setAuthenticated(data.authenticated);
      setCliente(data.cliente);
    } catch (error) {
      console.error("Error al consultar la sesión:", error);
      setAuthenticated(false);
      setCliente(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let activo = true;

    consultarSesion()
      .then((data) => {
        if (!activo) return;
        setAuthenticated(data.authenticated);
        setCliente(data.cliente);
      })
      .catch((error: unknown) => {
        console.error("Error al consultar la sesión:", error);

        if (!activo) return;
        setAuthenticated(false);
        setCliente(null);
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
        cliente,
        authenticated,
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
