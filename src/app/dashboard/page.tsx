"use client"

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { StatusCard } from './components/StatusCard';
import { FinancialOverview } from './components/FinancialOverview';

type ActiveSection = 'hogar' | 'produccion' | 'ventas' | 'trabajadores' | 'clientes' | 'productos' | 'reportes';

export default function DashboardPage() {
  const { isLoading: authLoading, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('hogar');

  const handleSectionChange = (section: string) => {
    setActiveSection(section as ActiveSection);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading message="Cargando dashboard..." />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'hogar':
        return (
          <>
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-black" style={{ fontFamily: 'var(--font-helvetica)' }}>
                Estado general
              </h3>
              <p className="text-sm text-gray-600">
                Bienvenido, {user?.name}
              </p>
            </div>
            <FinancialOverview />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
              <StatusCard title="Producción" />
              <StatusCard title="Ventas" />
              <StatusCard title="Inventario" />
            </div>
          </>
        );

      case 'produccion':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-black" style={{ fontFamily: 'var(--font-helvetica)' }}>
                Producción
              </h3>
              <p className="text-sm text-gray-600">
                Gestión de procesos productivos y lotes de producción
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Panel de Producción</h4>
                <p className="text-gray-500">
                  Aquí se mostrarán los controles de producción, lotes activos y métricas de fabricación.
                </p>
              </div>
            </div>
          </div>
        );

      case 'ventas':
        return (
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
                <h4 className="text-lg font-medium text-gray-900 mb-2">Panel de Ventas</h4>
                <p className="text-gray-500">
                  Visualiza métricas de ventas, gestiona pedidos y controla la facturación.
                </p>
              </div>
            </div>
          </div>
        );

      case 'trabajadores':
        return (
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
                <h4 className="text-lg font-medium text-gray-900 mb-2">Panel de Recursos Humanos</h4>
                <p className="text-gray-500">
                  Administra empleados, horarios, nóminas y seguimiento de productividad.
                </p>
              </div>
            </div>
          </div>
        );

      case 'clientes':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-black" style={{ fontFamily: 'var(--font-helvetica)' }}>
                Clientes
              </h3>
              <p className="text-sm text-gray-600">
                Gestión de clientes y relaciones comerciales
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
                  <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Panel de Clientes</h4>
                <p className="text-gray-500">
                  Gestiona tu base de clientes, historial de compras y comunicación.
                </p>
              </div>
            </div>
          </div>
        );

      case 'productos':
        return (
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
                <h4 className="text-lg font-medium text-gray-900 mb-2">Panel de Productos</h4>
                <p className="text-gray-500">
                  Administra tu catálogo de productos, precios y categorías.
                </p>
              </div>
            </div>
          </div>
        );

      case 'reportes':
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-black" style={{ fontFamily: 'var(--font-helvetica)' }}>
                Reportes e IA
              </h3>
              <p className="text-sm text-gray-600">
                Análisis inteligente y reportes avanzados
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="text-center py-8">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Panel de Reportes e IA</h4>
                <p className="text-gray-500 max-w-md mx-auto">
                  Genera reportes avanzados con inteligencia artificial, análisis predictivos y métricas empresariales.
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6" style={{ fontFamily: 'var(--font-opensans)' }}>
      <div className="flex gap-6 h-full">
        <div className="relative">
          <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        </div>
        <main className="flex-1 flex flex-col rounded-2xl bg-white overflow-hidden">
          <TopBar user={user as any} />
          <section className="flex-1 p-6 overflow-auto">
            {renderContent()}
          </section>
        </main>
      </div>
    </div>
  );
}
