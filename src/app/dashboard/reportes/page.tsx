"use client"

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';

type ActiveSection = 'hogar' | 'produccion' | 'ventas' | 'trabajadores' | 'clientes' | 'productos' | 'reportes';

export default function ReportesPage() {
  const { isLoading: authLoading, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('reportes');

  const handleSectionChange = (section: string) => {
    setActiveSection(section as ActiveSection);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading message="Cargando reportes..." />;
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
                  Reportes e IA
                </h3>
                <p className="text-sm text-gray-600">
                  Análisis inteligente y reportes avanzados con inteligencia artificial
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Reportes Financieros */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-100 mr-3">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Reportes Financieros</h4>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Análisis de ingresos, gastos, utilidades y proyecciones financieras.
                  </p>
                  <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    Generar Reporte
                  </button>
                </div>

                {/* Análisis de Ventas */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 mr-3">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Análisis de Ventas</h4>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Métricas de ventas, tendencias y análisis predictivo con IA.
                  </p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                    Ver Análisis
                  </button>
                </div>

                {/* Reportes de Producción */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-purple-100 mr-3">
                      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Producción</h4>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Reportes de eficiencia, tiempos de producción y optimización.
                  </p>
                  <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                    Ver Reporte
                  </button>
                </div>

                {/* IA Predictiva */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-orange-100 mr-3">
                      <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">IA Predictiva</h4>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Predicciones inteligentes de demanda, precios y tendencias.
                  </p>
                  <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors">
                    Consultar IA
                  </button>
                </div>

                {/* Dashboard Ejecutivo */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-100 mr-3">
                      <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V17a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Dashboard Ejecutivo</h4>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Resumen ejecutivo con KPIs principales y métricas clave.
                  </p>
                  <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Ver Dashboard
                  </button>
                </div>

                {/* Reportes Personalizados */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-teal-100 mr-3">
                      <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-medium text-gray-900">Reportes Personalizados</h4>
                  </div>
                  <p className="text-gray-500 text-sm mb-4">
                    Crea reportes personalizados según tus necesidades específicas.
                  </p>
                  <button className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
                    Crear Reporte
                  </button>
                </div>
              </div>

              {/* Sección de IA Avanzada */}
              <div className="mt-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Inteligencia Artificial Avanzada</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                    <h5 className="text-md font-medium text-gray-900 mb-2">Análisis Predictivo</h5>
                    <p className="text-gray-600 text-sm mb-4">
                      Utiliza machine learning para predecir tendencias de mercado, demanda de productos y comportamiento de clientes.
                    </p>
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      Iniciar Análisis
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                    <h5 className="text-md font-medium text-gray-900 mb-2">Optimización Automatizada</h5>
                    <p className="text-gray-600 text-sm mb-4">
                      Algoritmos de IA que sugieren optimizaciones en precios, inventario y procesos operativos.
                    </p>
                    <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Ver Sugerencias
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}