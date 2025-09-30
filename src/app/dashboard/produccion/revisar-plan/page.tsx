"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProductionLayout from "@/components/produccion/ProductionLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, DollarSign, Users, Package, AlertTriangle } from "lucide-react";

interface MaterialAsignado {
  nombre: string;
  cantidad: string;
  costo: number;
  alerta?: boolean;
}

interface Operacion {
  etapa: string;
  tiempo: string;
  operarios: number;
  costo: number;
}

const planResumen = {
  loteCode: "LOT-2024-001",
  producto: "Zapato Casual Cuero",
  cantidad: 100,
  fechaInicio: "2024-01-15",
  fechaFin: "2024-01-22",
  prioridad: "Alta",
  costoMateriales: 4285.5,
  costoManoObra: 1250,
  costoIndirectos: 375,
  tiempoEstimado: "5-7 días",
  operarios: 4,
};

const materialesAsignados: MaterialAsignado[] = [
  { nombre: "Cuero natural premium", cantidad: "250 m²", costo: 2275 },
  { nombre: "Hilo poliéster 40/2", cantidad: "15000 m", costo: 1800 },
  { nombre: "Suela de goma antideslizante", cantidad: "100 pares", costo: 1275 },
  { nombre: "Ojetes metálicos dorados", cantidad: "1200 unidades", costo: 3000, alerta: true },
];

const operaciones: Operacion[] = [
  { etapa: "Corte de cuero", tiempo: "8 horas", operarios: 2, costo: 400 },
  { etapa: "Costura principal", tiempo: "12 horas", operarios: 3, costo: 600 },
  { etapa: "Montado de suela", tiempo: "6 horas", operarios: 2, costo: 300 },
  { etapa: "Acabados finales", tiempo: "4 horas", operarios: 1, costo: 200 },
];

const RevisarPlanPage = () => {
  const router = useRouter();

  const costoTotal = planResumen.costoMateriales + planResumen.costoManoObra + planResumen.costoIndirectos;
  const costoUnitario = costoTotal / planResumen.cantidad;
  const precioSugerido = costoUnitario * 1.4;

  const handleAprobar = () => {
    router.push("/dashboard/produccion/registrar-operaciones");
  };

  const handleBack = () => {
    router.push("/dashboard/produccion/asignar-recursos");
  };

  return (
    <ProductionLayout
      title="Revisar y Aprobar Plan"
      subtitle="Revisa todos los detalles antes de aprobar el plan de producción"
      step={3}
      totalSteps={6}
      onBack={handleBack}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Resumen del Lote</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Código del Lote</p>
                    <p className="font-mono text-lg font-bold">{planResumen.loteCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Producto</p>
                    <p className="font-medium">{planResumen.producto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cantidad a producir</p>
                    <p className="text-xl font-bold text-primary">{planResumen.cantidad} pares</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de inicio</p>
                    <p className="font-medium">{planResumen.fechaInicio}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha estimada de finalización</p>
                    <p className="font-medium">{planResumen.fechaFin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Prioridad</p>
                    <Badge variant="destructive">{planResumen.prioridad}</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary">Materiales Asignados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {materialesAsignados.map((material) => (
                  <div key={material.nombre} className="flex items-center justify-between rounded-md border bg-background p-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="text-sm font-medium">{material.nombre}</h4>
                        <p className="text-xs text-muted-foreground">Cantidad: {material.cantidad}</p>
                      </div>
                      {material.alerta && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${material.costo.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Materiales:</span>
                    <span className="text-lg font-bold">${planResumen.costoMateriales.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Operaciones de Producción</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {operaciones.map((operacion) => (
                  <div key={operacion.etapa} className="flex items-center justify-between rounded-md border bg-background p-3">
                    <div>
                      <h4 className="text-sm font-medium">{operacion.etapa}</h4>
                      <div className="mt-1 flex items-center space-x-4 text-xs text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{operacion.tiempo}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{operacion.operarios} operarios</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${operacion.costo}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Mano de Obra:</span>
                    <span className="text-lg font-bold">${planResumen.costoManoObra.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Análisis de Costos</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Materiales:</span>
                  <span className="font-medium">${planResumen.costoMateriales.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Mano de obra:</span>
                  <span className="font-medium">${planResumen.costoManoObra.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Costos indirectos:</span>
                  <span className="font-medium">${planResumen.costoIndirectos.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold">Total:</span>
                    <span className="text-lg font-bold text-primary">${costoTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-lg bg-light-teal/20 p-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Costo por unidad:</span>
                  <span className="font-bold">${costoUnitario.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Precio sugerido:</span>
                  <span className="font-bold text-green-600">${precioSugerido.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">Con margen del 40%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Recursos Necesarios</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Tiempo estimado:</span>
                <span className="font-medium">{planResumen.tiempoEstimado}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Operarios requeridos:</span>
                <span className="font-medium">{planResumen.operarios} personas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Horas totales:</span>
                <span className="font-medium">30 horas</span>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Listo para producir</span>
            </div>
            <p className="mt-1 text-sm text-green-700">
              Todos los recursos están disponibles y el plan está completo.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Volver a Asignación
        </Button>
        <Button onClick={handleAprobar} size="lg">
          Aprobar Plan de Producción
        </Button>
      </div>
    </ProductionLayout>
  );
};

export default function Page() {
  return <RevisarPlanPage />;
}
