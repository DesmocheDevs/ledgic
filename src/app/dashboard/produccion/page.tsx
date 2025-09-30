"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, CheckCircle, Package, ClipboardList } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AuthLoading } from '@/components/auth/AuthLoading';
import { Sidebar } from '../components/Sidebar';
import { TopBar } from '../components/TopBar';
import { Button } from '@/components/ui/button';

type ActiveSection = 'hogar' | 'produccion' | 'ventas' | 'trabajadores' | 'clientes' | 'productos' | 'reportes';

export default function ProduccionPage() {
  const { isLoading: authLoading, user } = useAuth();
  const [activeSection, setActiveSection] = useState<ActiveSection>('produccion');
  const router = useRouter();

  const handleSectionChange = (section: string) => {
    setActiveSection(section as ActiveSection);
  };

  const handleStartProduction = () => {
    router.push('/dashboard/produccion/planificar');
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading message="Cargando producción..." />;
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
                  Producción
                </h3>
                <p className="text-sm text-gray-600">
                  Gestión de procesos productivos y lotes de producción
                </p>
              </div>
              <div className="grid gap-6 rounded-lg border border-gray-200 bg-white p-8 shadow-sm lg:grid-cols-[2fr_1fr]">
                <div className="space-y-5">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <PlayCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">Flujo de producción</h4>
                      <p className="text-sm text-gray-500">
                        Administra tus lotes de principio a fin: planificación, asignación de recursos, operaciones,
                        control de calidad y cierre con análisis de costos.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm text-gray-600 sm:grid-cols-2">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                      <span>Planifica cantidades, fechas objetivo y prioridades de producción.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Package className="mt-0.5 h-4 w-4 text-blue-600" />
                      <span>Asigna materiales del inventario y controla su disponibilidad.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <ClipboardList className="mt-0.5 h-4 w-4 text-secondary" />
                      <span>Registra operaciones, monitorea avances y verifica la calidad.</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <PlayCircle className="mt-0.5 h-4 w-4 text-primary" />
                      <span>Finaliza lotes con reportes automáticos de costos y precios sugeridos.</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button size="lg" onClick={handleStartProduction} className="w-full sm:w-auto">
                      <PlayCircle className="mr-2 h-5 w-5" />
                      Iniciar nueva producción
                    </Button>
                    <p className="text-xs text-gray-400">
                      Serás redirigido al paso de planificación para comenzar un nuevo lote.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 rounded-lg bg-slate-50 p-5 text-sm text-slate-600">
                  <h5 className="text-base font-semibold text-slate-900">Últimos indicadores</h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Lotes activos</span>
                      <span className="font-semibold text-slate-900">3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Eficiencia promedio</span>
                      <span className="font-semibold text-green-600">87%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Operarios asignados</span>
                      <span className="font-semibold text-blue-600">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Costo por unidad</span>
                      <span className="font-semibold text-primary">$65.40</span>
                    </div>
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