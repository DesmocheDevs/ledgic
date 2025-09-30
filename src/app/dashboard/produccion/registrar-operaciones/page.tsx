"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductionLayout from "@/components/produccion/ProductionLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Play, TrendingUp, Package, Clock, Users, AlertTriangle } from "lucide-react";

interface Operacion {
  id: string;
  nombre: string;
  orden: number;
  estado: "completado" | "en_proceso" | "pendiente";
  cantidadProcesada: number;
  cantidadPlanificada: number;
  horasReales: number;
  horasEstimadas: number;
  costosReales: number;
  costosEstimados: number;
  operario: string;
  fechaInicio: string | null;
  fechaFin: string | null;
}

interface RegistroActual {
  operacionId: string;
  cantidadProcesada: string;
  horasTrabajadas: string;
  observaciones: string;
}

const OPERACIONES_INICIALES: Operacion[] = [
  {
    id: "OP001",
    nombre: "Corte de cuero",
    orden: 1,
    estado: "completado",
    cantidadProcesada: 100,
    cantidadPlanificada: 100,
    horasReales: 8.5,
    horasEstimadas: 8,
    costosReales: 425,
    costosEstimados: 400,
    operario: "Juan Pérez",
    fechaInicio: "2024-01-15 08:00",
    fechaFin: "2024-01-15 16:30",
  },
  {
    id: "OP002",
    nombre: "Costura principal",
    orden: 2,
    estado: "en_proceso",
    cantidadProcesada: 65,
    cantidadPlanificada: 100,
    horasReales: 9,
    horasEstimadas: 12,
    costosReales: 450,
    costosEstimados: 600,
    operario: "María García",
    fechaInicio: "2024-01-16 08:00",
    fechaFin: null,
  },
  {
    id: "OP003",
    nombre: "Montado de suela",
    orden: 3,
    estado: "pendiente",
    cantidadProcesada: 0,
    cantidadPlanificada: 100,
    horasReales: 0,
    horasEstimadas: 6,
    costosReales: 0,
    costosEstimados: 300,
    operario: "-",
    fechaInicio: null,
    fechaFin: null,
  },
  {
    id: "OP004",
    nombre: "Acabados finales",
    orden: 4,
    estado: "pendiente",
    cantidadProcesada: 0,
    cantidadPlanificada: 100,
    horasReales: 0,
    horasEstimadas: 4,
    costosReales: 0,
    costosEstimados: 200,
    operario: "-",
    fechaInicio: null,
    fechaFin: null,
  },
];

const getEstadoBadge = (estado: Operacion["estado"]) => {
  switch (estado) {
    case "completado":
      return <Badge className="bg-green-500 text-white">Completado</Badge>;
    case "en_proceso":
      return <Badge className="bg-yellow-500 text-white">En Proceso</Badge>;
    default:
      return <Badge variant="secondary">Pendiente</Badge>;
  }
};

const RegistrarOperacionesPage = () => {
  const router = useRouter();
  const [operaciones, setOperaciones] = useState<Operacion[]>(OPERACIONES_INICIALES);
  const [registroActual, setRegistroActual] = useState<RegistroActual>({
    operacionId: "",
    cantidadProcesada: "",
    horasTrabajadas: "",
    observaciones: "",
  });

  const totalProgreso =
    (operaciones.reduce((acumulado, operacion) => acumulado + operacion.cantidadProcesada, 0) /
      (operaciones.length * 100)) *
    100;

  const operacionSeleccionada = operaciones.find((operacion) => operacion.id === registroActual.operacionId);

  const handleRegistrar = () => {
    if (!operacionSeleccionada) return;
    const cantidad = Number(registroActual.cantidadProcesada);
    const horas = Number(registroActual.horasTrabajadas);

    setOperaciones((prev) =>
      prev.map((operacion) =>
        operacion.id === operacionSeleccionada.id
          ? {
              ...operacion,
              cantidadProcesada: Math.min(cantidad, operacion.cantidadPlanificada),
              horasReales: operacion.horasReales + horas,
              estado: cantidad >= operacion.cantidadPlanificada ? "completado" : "en_proceso",
            }
          : operacion,
      ),
    );

    setRegistroActual({ operacionId: "", cantidadProcesada: "", horasTrabajadas: "", observaciones: "" });
  };

  const handleNext = () => {
    router.push("/dashboard/produccion/control-calidad");
  };

  const handleBack = () => {
    router.push("/dashboard/produccion/revisar-plan");
  };

  const operacionesCompletadas = operaciones.filter((operacion) => operacion.estado === "completado").length;

  return (
    <ProductionLayout
      title="Registrar Operaciones de Producción"
      subtitle="Lleva el control de las operaciones y avance de producción"
      step={4}
      totalSteps={6}
      onBack={handleBack}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary flex items-center space-x-2">
                <Play className="h-5 w-5" />
                <span>Registrar Operación</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Operación</Label>
                <Select
                  value={registroActual.operacionId}
                  onValueChange={(value) => setRegistroActual((prev) => ({ ...prev, operacionId: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar operación" />
                  </SelectTrigger>
                  <SelectContent>
                    {operaciones
                      .filter((operacion) => operacion.estado !== "completado")
                      .map((operacion) => (
                        <SelectItem key={operacion.id} value={operacion.id}>
                          {operacion.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cantidad" className="text-sm font-medium">
                  Cantidad procesada
                </Label>
                <Input
                  id="cantidad"
                  type="number"
                  placeholder="Ej: 25"
                  value={registroActual.cantidadProcesada}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setRegistroActual((prev) => ({ ...prev, cantidadProcesada: event.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="horas" className="text-sm font-medium">
                  Horas trabajadas
                </Label>
                <Input
                  id="horas"
                  type="number"
                  step="0.5"
                  placeholder="Ej: 2.5"
                  value={registroActual.horasTrabajadas}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setRegistroActual((prev) => ({ ...prev, horasTrabajadas: event.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="observaciones" className="text-sm font-medium">
                  Observaciones
                </Label>
                <Textarea
                  id="observaciones"
                  placeholder="Comentarios adicionales..."
                  value={registroActual.observaciones}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setRegistroActual((prev) => ({ ...prev, observaciones: event.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleRegistrar}
                disabled={!registroActual.operacionId || !registroActual.cantidadProcesada}
                className="w-full"
              >
                Registrar Operación
              </Button>
            </CardContent>
          </Card>

          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Progreso General</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progreso del lote</span>
                    <span className="font-bold">{totalProgreso.toFixed(1)}%</span>
                  </div>
                  <Progress value={totalProgreso} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-lg bg-light-teal/20 p-3">
                    <p className="text-2xl font-bold text-primary">
                      {(
                        operaciones.reduce((acc, operacion) => acc + operacion.cantidadProcesada, 0) /
                        operaciones.length
                      ).toFixed(0)}
                    </p>
                    <p className="text-xs text-muted-foreground">Promedio procesado</p>
                  </div>
                  <div className="rounded-lg bg-light-teal/20 p-3">
                    <p className="text-2xl font-bold text-secondary">
                      {operacionesCompletadas}/{operaciones.length}
                    </p>
                    <p className="text-xs text-muted-foreground">Operaciones completadas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Estado de Operaciones</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Lote: LOT-2024-001 • Zapato Casual Cuero</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {operaciones.map((operacion) => {
                  const porcentaje = (operacion.cantidadProcesada / operacion.cantidadPlanificada) * 100;
                  const variacion = operacion.costosReales - operacion.costosEstimados;

                  return (
                    <div key={operacion.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium">{operacion.nombre}</h4>
                            {getEstadoBadge(operacion.estado)}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">Operario: {operacion.operario}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Progreso</p>
                          <p className="text-lg font-bold">
                            {operacion.cantidadProcesada}/{operacion.cantidadPlanificada}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 text-sm md:grid-cols-4">
                        <div>
                          <p className="text-muted-foreground">Tiempo</p>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">
                              {operacion.horasReales}h / {operacion.horasEstimadas}h
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Costo Real</p>
                          <p className="font-medium">${operacion.costosReales}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Costo Estimado</p>
                          <p className="font-medium">${operacion.costosEstimados}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Variación</p>
                          <p className={`font-medium ${variacion > 0 ? "text-red-600" : "text-green-600"}`}>
                            ${Math.abs(variacion)}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3">
                        <div className="mb-1 flex justify-between text-xs">
                          <span>Progreso</span>
                          <span>{porcentaje.toFixed(1)}%</span>
                        </div>
                        <Progress value={porcentaje} className="h-2" />
                      </div>

                      {operacion.fechaInicio && (
                        <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                          <span>Inicio: {operacion.fechaInicio}</span>
                          {operacion.fechaFin && <span>Fin: {operacion.fechaFin}</span>}
                        </div>
                      )}

                      {operacion.estado === "pendiente" && (
                        <div className="mt-4 rounded-md border border-yellow-200 bg-yellow-100 p-3 text-xs text-yellow-700">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Esta operación aún no ha sido iniciada. Asigna un operario para continuar.</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Volver a Revisión
        </Button>
        <Button onClick={handleNext} disabled={operacionesCompletadas < 2} size="lg">
          Continuar a Control de Calidad
        </Button>
      </div>
    </ProductionLayout>
  );
};

export default function Page() {
  return <RegistrarOperacionesPage />;
}
