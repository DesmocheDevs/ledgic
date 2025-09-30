"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ProductionLayout from "@/components/produccion/ProductionLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, AlertTriangle, Eye, Ruler, Shield } from "lucide-react";

interface ChecklistItem {
  id: string;
  descripcion: string;
  verificado: boolean;
  critico: boolean;
}

interface ChecklistCategoria {
  id: string;
  categoria: string;
  icono: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  items: ChecklistItem[];
}

interface MuestraRevisada {
  id: string;
  talla: string;
  estado: "aprobado" | "rechazado" | "pendiente";
  defectos: string[];
}

interface InspeccionState {
  cantidadInspeccionada: string;
  cantidadAprobada: string;
  cantidadRechazada: string;
  observaciones: string;
}

const CATEGORIAS_INICIALES: ChecklistCategoria[] = [
  {
    id: "QC001",
    categoria: "Dimensiones",
    icono: Ruler,
    items: [
      { id: "DIM001", descripcion: "Longitud del zapato según talla", verificado: false, critico: true },
      { id: "DIM002", descripcion: "Ancho correcto en el empeine", verificado: false, critico: true },
      { id: "DIM003", descripcion: "Altura del tacón dentro de especificación", verificado: false, critico: false },
    ],
  },
  {
    id: "QC002",
    categoria: "Acabados",
    icono: Eye,
    items: [
      { id: "ACA001", descripcion: "Costuras rectas y uniformes", verificado: false, critico: true },
      { id: "ACA002", descripcion: "Sin hilos sueltos o cortados", verificado: false, critico: false },
      { id: "ACA003", descripcion: "Brillo y textura del cuero uniforme", verificado: false, critico: false },
      { id: "ACA004", descripcion: "Ojetes bien colocados y alineados", verificado: false, critico: true },
    ],
  },
  {
    id: "QC003",
    categoria: "Funcionalidad",
    icono: Shield,
    items: [
      { id: "FUN001", descripcion: "Suela bien adherida sin despegues", verificado: false, critico: true },
      { id: "FUN002", descripcion: "Flexibilidad adecuada del calzado", verificado: false, critico: true },
      { id: "FUN003", descripcion: "Cordones pasan fácilmente por ojetes", verificado: false, critico: false },
    ],
  },
];

const MUESTRAS_INICIALES: MuestraRevisada[] = [
  { id: "M001", talla: "42", estado: "aprobado", defectos: [] },
  { id: "M002", talla: "40", estado: "rechazado", defectos: ["Costura irregular", "Ojete desalineado"] },
  { id: "M003", talla: "44", estado: "aprobado", defectos: [] },
  { id: "M004", talla: "38", estado: "aprobado", defectos: [] },
  { id: "M005", talla: "41", estado: "rechazado", defectos: ["Suela mal adherida"] },
];

const getEstadoBadge = (estado: MuestraRevisada["estado"]) => {
  switch (estado) {
    case "aprobado":
      return (
        <Badge className="flex items-center space-x-1 bg-green-500 text-white">
          <CheckCircle className="h-3 w-3" />
          <span>Aprobado</span>
        </Badge>
      );
    case "rechazado":
      return (
        <Badge className="flex items-center space-x-1 bg-red-500 text-white">
          <XCircle className="h-3 w-3" />
          <span>Rechazado</span>
        </Badge>
      );
    default:
      return <Badge variant="secondary">Pendiente</Badge>;
  }
};

const ControlCalidadPage = () => {
  const router = useRouter();
  const [checklist, setChecklist] = useState<ChecklistCategoria[]>(CATEGORIAS_INICIALES);
  const [inspeccion, setInspeccion] = useState<InspeccionState>({
    cantidadInspeccionada: "",
    cantidadAprobada: "",
    cantidadRechazada: "",
    observaciones: "",
  });
  const [muestrasRevisadas] = useState<MuestraRevisada[]>(MUESTRAS_INICIALES);

  const totalItems = useMemo(
    () => checklist.reduce((acumulado, categoria) => acumulado + categoria.items.length, 0),
    [checklist],
  );

  const itemsVerificados = useMemo(
    () => checklist.reduce((acumulado, categoria) => acumulado + categoria.items.filter((item) => item.verificado).length, 0),
    [checklist],
  );

  const itemsCriticosPendientes = useMemo(
    () =>
      checklist.reduce(
        (acumulado, categoria) =>
          acumulado + categoria.items.filter((item) => item.critico && !item.verificado).length,
        0,
      ),
    [checklist],
  );

  const porcentajeCompletado = (itemsVerificados / totalItems) * 100;
  const puedeAprobar = itemsCriticosPendientes === 0 && porcentajeCompletado === 100;

  const handleChecklistChange = (categoriaId: string, itemId: string, checked: boolean) => {
    setChecklist((prev) =>
      prev.map((categoria) =>
        categoria.id === categoriaId
          ? {
              ...categoria,
              items: categoria.items.map((item) =>
                item.id === itemId ? { ...item, verificado: checked } : item,
              ),
            }
          : categoria,
      ),
    );
  };

  const handleNext = () => {
    router.push("/dashboard/produccion/finalizar");
  };

  const handleBack = () => {
    router.push("/dashboard/produccion/registrar-operaciones");
  };

  return (
    <ProductionLayout
      title="Control de Calidad"
      subtitle="Inspección y verificación de estándares de calidad"
      step={5}
      totalSteps={6}
      onBack={handleBack}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Lista de Verificación</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Progreso: </span>
                  <span className="font-bold">
                    {itemsVerificados}/{totalItems}
                  </span>
                </div>
              </CardTitle>
              <p className="text-sm text-muted-foreground">Lote: LOT-2024-001 • Zapato Casual Cuero</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {checklist.map((categoria) => {
                  const IconoCategoria = categoria.icono;
                  return (
                    <div key={categoria.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center space-x-2">
                        <IconoCategoria className="h-5 w-5 text-secondary" />
                        <h4 className="text-lg font-medium">{categoria.categoria}</h4>
                        <Badge variant="outline">
                          {categoria.items.filter((item) => item.verificado).length}/{categoria.items.length}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        {categoria.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={item.id}
                              checked={item.verificado}
                              onCheckedChange={(checked) =>
                                handleChecklistChange(categoria.id, item.id, Boolean(checked))
                              }
                            />
                            <Label
                              htmlFor={item.id}
                              className={`flex-1 text-sm ${item.verificado ? "line-through text-muted-foreground" : ""}`}
                            >
                              {item.descripcion}
                            </Label>
                            {item.critico && <Badge variant="destructive" className="text-xs">Crítico</Badge>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {itemsCriticosPendientes > 0 && (
                <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-center space-x-2 text-red-800">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Atención: Items críticos pendientes</span>
                  </div>
                  <p className="mt-1 text-sm text-red-700">
                    Hay {itemsCriticosPendientes} elementos críticos sin verificar que deben completarse antes de aprobar.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary">Muestras Inspeccionadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                {muestrasRevisadas.map((muestra) => (
                  <div key={muestra.id} className="rounded-lg border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <span className="font-medium">Muestra {muestra.id}</span>
                        <span className="ml-2 text-sm text-muted-foreground">Talla {muestra.talla}</span>
                      </div>
                      {getEstadoBadge(muestra.estado)}
                    </div>
                    {muestra.defectos.length > 0 && (
                      <div className="mt-2">
                        <p className="mb-1 text-xs text-muted-foreground">Defectos encontrados:</p>
                        <ul className="space-y-1 text-xs">
                          {muestra.defectos.map((defecto) => (
                            <li key={defecto} className="text-red-600">
                              • {defecto}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary">Registro de Inspección</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="inspeccionada" className="text-sm font-medium">
                  Cantidad inspeccionada
                </Label>
                <Input
                  id="inspeccionada"
                  type="number"
                  placeholder="Ej: 100"
                  value={inspeccion.cantidadInspeccionada}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setInspeccion((prev) => ({ ...prev, cantidadInspeccionada: event.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="aprobada" className="text-sm font-medium">
                  Cantidad aprobada
                </Label>
                <Input
                  id="aprobada"
                  type="number"
                  placeholder="Ej: 85"
                  value={inspeccion.cantidadAprobada}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setInspeccion((prev) => ({ ...prev, cantidadAprobada: event.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="rechazada" className="text-sm font-medium">
                  Cantidad rechazada
                </Label>
                <Input
                  id="rechazada"
                  type="number"
                  placeholder="Ej: 15"
                  value={inspeccion.cantidadRechazada}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setInspeccion((prev) => ({ ...prev, cantidadRechazada: event.target.value }))
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
                  placeholder="Detalles de la inspección..."
                  value={inspeccion.observaciones}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setInspeccion((prev) => ({ ...prev, observaciones: event.target.value }))
                  }
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="production-card">
            <CardHeader>
              <CardTitle className="heading-secondary">Resumen de Calidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary">{porcentajeCompletado.toFixed(1)}%</div>
                <p className="text-sm text-muted-foreground">Verificación completada</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Items verificados:</span>
                  <span className="font-medium">
                    {itemsVerificados}/{totalItems}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Items críticos pendientes:</span>
                  <span className={`font-medium ${itemsCriticosPendientes > 0 ? "text-red-600" : "text-green-600"}`}>
                    {itemsCriticosPendientes}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Muestras aprobadas:</span>
                  <span className="font-medium text-green-600">
                    {muestrasRevisadas.filter((muestra) => muestra.estado === "aprobado").length}/
                    {muestrasRevisadas.length}
                  </span>
                </div>
              </div>

              <div
                className={`rounded-lg border p-4 ${
                  puedeAprobar ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"
                }`}
              >
                <div className={`flex items-center space-x-2 ${puedeAprobar ? "text-green-800" : "text-yellow-800"}`}>
                  {puedeAprobar ? <CheckCircle className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                  <span className="font-medium">
                    {puedeAprobar ? "Listo para finalizar" : "Verificación pendiente"}
                  </span>
                </div>
                <p className={`mt-1 text-sm ${puedeAprobar ? "text-green-700" : "text-yellow-700"}`}>
                  {puedeAprobar
                    ? "Todas las verificaciones están completas."
                    : "Complete todos los items críticos antes de continuar."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Volver a Operaciones
        </Button>
        <Button onClick={handleNext} disabled={!puedeAprobar} size="lg">
          Finalizar Producción
        </Button>
      </div>
    </ProductionLayout>
  );
};

export default function Page() {
  return <ControlCalidadPage />;
}
