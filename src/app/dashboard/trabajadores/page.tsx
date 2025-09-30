"use client"

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';

type ActiveSection = 'hogar' | 'produccion' | 'ventas' | 'trabajadores' | 'clientes' | 'productos' | 'reportes';

export default function TrabajadoresPage() {
  const { isLoading: authLoading, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('trabajadores');

  const handleSectionChange = (section: string) => {
    setActiveSection(section as ActiveSection);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading message="Cargando trabajadores..." />;
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
                  Trabajadores
                </h3>
                <p className="text-sm text-gray-600">
                  Gestión de recursos humanos y personal
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
                    <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Módulo de Recursos Humanos</h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Administra empleados, horarios, nóminas y seguimiento de productividad.
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