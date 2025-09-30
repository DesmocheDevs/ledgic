"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface User {
  name?: string | null
  email?: string | null
  image?: string | null
  id?: string
  personaId?: number
}

interface TopBarProps {
  user?: User | null
}

export function TopBar({ user }: TopBarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true
    });
  };

  return (
    <header className="w-full flex items-center justify-between h-12 bg-white px-6 rounded-b-none" aria-label="Barra superior">
      <h2 className="text-xl font-bold text-black font-helvetica">
        Buen día, {user?.name || 'Usuario'}
      </h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-absolute-white rounded-full px-4 h-10 text-xs text-black min-w-[190px]">
          <span>Nombre de un negocio</span>
          <span className="rotate-90">›</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
          aria-label="Cerrar sesión"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
