"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import ProductionLayout from "@/components/produccion/ProductionLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Calendar,
  BarChart3,
} from "lucide-react";

interface ResumenProduccion {
  loteCode: string;
  producto: string;
  cantidadPlanificada: number;
  cantidadProducida: number;
  cantidadAprobada: number;
  cantidadRechazada: number;
  fechaInicio: string;
  fechaFinalizacion: string;
  diasReales: number;
  diasEstimados: number;
}

interface CostosComparacion {
  materialesPlaneado: number;
  materialesReal: number;
  manoObraPlaneado: number;
  manoObraReal: number;
  indirectosPlaneado: number;
  indirectosReal: number;
  totalPlaneado: number;
  totalReal: number;
}

const resumenProduccion: ResumenProduccion = {
  loteCode: "LOT-2024-001",
  producto: "Zapato Casual Cuero",
  cantidadPlanificada: 100,
  cantidadProducida: 85,
  cantidadAprobada: 82,
  cantidadRechazada: 3,
  fechaInicio: "2024-01-15",
  fechaFinalizacion: "2024-01-22",
  diasReales: 7,
  diasEstimados: 6,
};

const costosComparacion: CostosComparacion = {
  materialesPlaneado: 4285.5,
  materialesReal: 4156.75,
  manoObraPlaneado: 1250,
  manoObraReal: 1375.5,
  indirectosPlaneado: 375,
  indirectosReal: 425,
  totalPlaneado: 5910.5,
  totalReal: 5957.25,
};

const FinalizarProduccionPage = () => {
  const router = useRouter();

  const analisisUnitario = useMemo(
    () => ({
      costoUnitarioPlaneado: costosComparacion.totalPlaneado / resumenProduccion.cantidadPlanificada,
      costoUnitarioReal: costosComparacion.totalReal / resumenProduccion.cantidadProducida,
      eficienciaProduccion:
        (resumenProduccion.cantidadProducida / resumenProduccion.cantidadPlanificada) * 100,
      tasaCalidad: (resumenProduccion.cantidadAprobada / resumenProduccion.cantidadProducida) * 100,
    }),
    [],
  );

  const precioSugerido = useMemo(
    () => ({
      margen30: analisisUnitario.costoUnitarioReal * 1.3,
      margen40: analisisUnitario.costoUnitarioReal * 1.4,
      margen50: analisisUnitario.costoUnitarioReal * 1.5,
    }),
    [analisisUnitario.costoUnitarioReal],
  );

  const variacionCostos = useMemo(
    () => costosComparacion.totalReal - costosComparacion.totalPlaneado,
    [],
  );

  const variacionPorcentaje = useMemo(
    () => (variacionCostos / costosComparacion.totalPlaneado) * 100,
    [variacionCostos],
  );

  const getVariacionBadge = (valor: number, esPositivoMalo = true, suffix = "") => {
    const esPositivo = valor > 0;
    const esMalo = esPositivoMalo ? esPositivo : !esPositivo;
    return (
      <Badge className={`${esMalo ? "bg-red-500" : "bg-green-500"} flex items-center space-x-1 text-white`}>
        {esMalo ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        <span>
          {esPositivo ? "+" : ""}
          {Math.abs(valor) < 0.01 ? valor.toFixed(2) : valor.toFixed(2)}
          {suffix}
        </span>
      </Badge>
    );
  };

  const handleFinalizar = () => {
    router.push("/dashboard/produccion");
  };

  const handleNuevaProduccion = () => {
    router.push("/dashboard/produccion/planificar");
  };

  return (
    <ProductionLayout
      title="Finalizar Producción"
      subtitle="Resumen final y análisis de costos del lote completado"
      step={6}
      totalSteps={6}
      showBackButton={false}
    >
      <div className="space-y-8">
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <div className="mb-2 flex items-center justify-center space-x-2 text-green-800">
            <CheckCircle className="h-8 w-8" />
            <h2 className="text-2xl font-bold">¡Producción Completada!</h2>
          </div>
          <p className="text-green-700">Lote {resumenProduccion.loteCode} finalizado exitosamente</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="production-card">
              <CardHeader>
                <CardTitle className="heading-secondary flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Resumen de Producción</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Producto</p>
                      <p className="text-lg font-medium">{resumenProduccion.producto}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Código del Lote</p>
                      <p className="font-mono text-lg font-bold">{resumenProduccion.loteCode}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Planificado</p>
                        <p className="text-xl font-bold">{resumenProduccion.cantidadPlanificada}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Producido</p>
                        <p className="text-xl font-bold text-primary">{resumenProduccion.cantidadProducida}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Aprobado</p>
                        <p className="text-xl font-bold text-green-600">{resumenProduccion.cantidadAprobada}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rechazado</p>
                        <p className="text-xl font-bold text-red-600">{resumenProduccion.cantidadRechazada}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duración</p>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{resumenProduccion.diasReales} días</span>
                        <span className="text-xs text-muted-foreground">
                          (estimado: {resumenProduccion.diasEstimados} días)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Eficiencia de producción:</span>
                        <span className="font-bold text-primary">
                          {analisisUnitario.eficienciaProduccion.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tasa de calidad:</span>
                        <span className="font-bold text-green-600">
                          {analisisUnitario.tasaCalidad.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="production-card">
              <CardHeader>
                <CardTitle className="heading-secondary flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Análisis de Costos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Materiales</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Planeado:</span>
                          <span className="font-medium">${costosComparacion.materialesPlaneado.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Real:</span>
                          <span className="font-medium">${costosComparacion.materialesReal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Variación:</span>
                          {getVariacionBadge(
                            costosComparacion.materialesReal - costosComparacion.materialesPlaneado,
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Mano de Obra</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Planeado:</span>
                          <span className="font-medium">${costosComparacion.manoObraPlaneado.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Real:</span>
                          <span className="font-medium">${costosComparacion.manoObraReal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Variación:</span>
                          {getVariacionBadge(costosComparacion.manoObraReal - costosComparacion.manoObraPlaneado)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className="mb-2 text-sm text-muted-foreground">Costos Indirectos</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Planeado:</span>
                          <span className="font-medium">${costosComparacion.indirectosPlaneado.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Real:</span>
                          <span className="font-medium">${costosComparacion.indirectosReal.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs">Variación:</span>
                          {getVariacionBadge(costosComparacion.indirectosReal - costosComparacion.indirectosPlaneado)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-lg font-bold">Total General</span>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">${costosComparacion.totalReal.toFixed(2)}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground">vs planeado:</span>
                          {getVariacionBadge(variacionPorcentaje, true, "%")}
                        </div>
                      </div>
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
                  <span>Costeo Unitario</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Costo real por unidad</p>
                  <p className="text-3xl font-bold text-primary">
                    ${analisisUnitario.costoUnitarioReal.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    vs planeado: ${analisisUnitario.costoUnitarioPlaneado.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg bg-light-teal/20 p-3">
                    <p className="text-sm font-medium">Desglose por unidad:</p>
                    <div className="mt-2 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Materiales:</span>
                        <span>
                          $
                          {(costosComparacion.materialesReal / resumenProduccion.cantidadProducida).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mano de obra:</span>
                        <span>
                          $
                          {(costosComparacion.manoObraReal / resumenProduccion.cantidadProducida).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Indirectos:</span>
                        <span>
                          $
                          {(costosComparacion.indirectosReal / resumenProduccion.cantidadProducida).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

              <Card className="production-card">
                <CardHeader>
                  <CardTitle className="heading-secondary">Precios Sugeridos de Venta</CardTitle>
                  <p className="text-sm text-muted-foreground">Basado en costos reales</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-md border bg-background p-3">
                      <div>
                        <p className="font-medium">Margen 30%</p>
                        <p className="text-xs text-muted-foreground">Competitivo</p>
                      </div>
                      <p className="text-lg font-bold">${precioSugerido.margen30.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-light-teal bg-light-teal/20 p-3">
                      <div>
                        <p className="font-medium">Margen 40%</p>
                        <p className="text-xs text-muted-foreground">Recomendado</p>
                      </div>
                      <p className="text-lg font-bold text-primary">${precioSugerido.margen40.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between rounded-md border bg-background p-3">
                      <div>
                        <p className="font-medium">Margen 50%</p>
                        <p className="text-xs text-muted-foreground">Premium</p>
                      </div>
                      <p className="text-lg font-bold">${precioSugerido.margen50.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3 text-xs text-muted-foreground">
                    <p>* Precios sugeridos antes de impuestos y gastos de comercialización</p>
                  </div>
                </CardContent>
              </Card>

            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-2 flex items-center space-x-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Lote finalizado</span>
              </div>
              <p className="text-sm text-green-700">
                La producción se ha completado exitosamente. Los datos han sido guardados para análisis futuro.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 border-t pt-8">
          <Button variant="outline" size="lg" onClick={handleNuevaProduccion}>
            Nueva Producción
          </Button>
          <Button size="lg" onClick={handleFinalizar}>
            Finalizar y Volver al Inicio
          </Button>
        </div>
      </div>
    </ProductionLayout>
  );
};

export default function Page() {
  return <FinalizarProduccionPage />;
}
