"use client"

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';

type ActiveSection = 'hogar' | 'produccion' | 'ventas' | 'trabajadores' | 'clientes' | 'productos' | 'reportes';

export default function VentasPage() {
  const { isLoading: authLoading, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('ventas');

  const handleSectionChange = (section: string) => {
    setActiveSection(section as ActiveSection);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading message="Cargando ventas..." />;
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
                  Ventas
                </h3>
                <p className="text-sm text-gray-600">
                  Gestión de ventas, facturación y clientes
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Módulo de Ventas</h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Gestiona tus ventas, facturación y relación con clientes.
                    Crea cotizaciones, procesa pedidos y emite facturas.
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