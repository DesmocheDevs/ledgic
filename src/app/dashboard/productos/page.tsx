"use client"

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';

type ActiveSection = 'hogar' | 'produccion' | 'ventas' | 'trabajadores' | 'clientes' | 'productos' | 'reportes';

export default function ProductosPage() {
  const { isLoading: authLoading, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('productos');

  const handleSectionChange = (section: string) => {
    setActiveSection(section as ActiveSection);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading message="Cargando productos..." />;
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6" style={{ fontFamily: 'var(--font-opensans)' }}>
      <div className="flex gap-6 h-full">
        <div className="relative">
          <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        </div>
        <main className="flex-1 flex flex-col rounded-2xl bg-white overflow-hidden">
          <TopBar user={user as any} />
          <section className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2 text-black" style={{ fontFamily: 'var(--font-helvetica)' }}>
                  Productos
                </h3>
                <p className="text-sm text-gray-600">
                  Gestión de catálogo de productos
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4">
                    <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Módulo de Productos</h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Administra tu catálogo de productos, precios y categorías.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}