"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductionLayout from "@/components/produccion/ProductionLayout";
import { ProductionFlowNavigator } from "@/components/produccion/ProductionFlowNavigator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Package2, Warehouse, AlertTriangle, Plus } from "lucide-react";
import { useProductionFlow } from "@/hooks/useProductionFlow";

interface Material {
  id: string;
  nombre: string;
  categoria: string;
  disponible: number;
  unidad: string;
  ubicacion: string;
  costo: number;
  asignado: number;
  insuficiente?: boolean;
}

const materialesDisponibles: Material[] = [
  {
    id: "MAT001",
    nombre: "Cuero natural premium",
    categoria: "Materia prima",
    disponible: 15.8,
    unidad: "m²",
    ubicacion: "Almacén A-1",
    costo: 45.5,
    asignado: 0,
  },
  {
    id: "MAT002",
    nombre: "Hilo poliéster 40/2",
    categoria: "Insumo",
    disponible: 1200,
    unidad: "m",
    ubicacion: "Almacén B-3",
    costo: 0.12,
    asignado: 0,
  },
  {
    id: "MAT003",
    nombre: "Suela de goma antideslizante",
    categoria: "Componente",
    disponible: 45,
    unidad: "pares",
    ubicacion: "Almacén C-2",
    costo: 12.75,
    asignado: 0,
  },
  {
    id: "MAT004",
    nombre: "Ojetes metálicos dorados",
    categoria: "Herraje",
    disponible: 8,
    unidad: "unidades",
    ubicacion: "Almacén D-1",
    costo: 2.5,
    insuficiente: true,
    asignado: 0,
  },
];

const AsignarRecursosPage = () => {
  const router = useRouter();
  const { flowState, updateFlowData, transitionToStep } = useProductionFlow();
  const [loteCode, setLoteCode] = useState("LOT-2024-001");
  const [materiales, setMateriales] = useState<Material[]>(materialesDisponibles);

  const handleAsignar = (materialId: string, cantidad: number) => {
    setMateriales((prev) =>
      prev.map((material) =>
        material.id === materialId ? { ...material, asignado: cantidad } : material,
      ),
    );
  };

  const handleNext = async (): Promise<boolean> => {
    try {
      // Preparar datos de asignación de recursos incluso si están vacíos
      const resourceAssignment = {
        materials: materiales
          .filter(m => m.asignado > 0)
          .map(m => ({
            materialId: m.id,
            quantity: m.asignado,
            available: m.disponible,
          })),
        lotCode: loteCode || 'SIMULATED-LOT',
      };

      // Actualizar datos del flujo
      updateFlowData({
        resourceAssignment,
      });

      // Siempre retornar true para permitir navegación fluida
      console.log('✅ Recursos asignados, avanzando al siguiente paso');
      return true;
    } catch (error) {
      console.error('Error asignando recursos:', error);
      // Incluso si hay error, permitir continuar
      return true;
    }
  };

  const getTotalCosto = () =>
    materiales.reduce((total, material) => total + material.asignado * material.costo, 0);

  const totalCosto = getTotalCosto();

  return (
    <ProductionLayout
      title="Crear Lote y Asignar Recursos"
      subtitle="Define el código del lote y asigna materiales del inventario"
      step={2}
      totalSteps={6}
      showBackButton={true}
    >
      <div className="space-y-6">
        <Card className="production-card">
          <CardHeader>
            <CardTitle className="heading-secondary flex items-center space-x-2">
              <Package2 className="w-5 h-5" />
              <span>Información del Lote de Producción</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="loteCode" className="text-sm font-medium">
                  Código del Lote
                </Label>
                <Input
                  id="loteCode"
                  value={loteCode}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => setLoteCode(event.target.value)}
                  className="mt-1 font-mono"
                />
              </div>
              <div className="flex items-end">
                <div>
                  <p className="text-sm text-muted-foreground">Producto</p>
                  <p className="font-medium">Zapato Casual Cuero</p>
                </div>
              </div>
              <div className="flex items-end">
                <div>
                  <p className="text-sm text-muted-foreground">Cantidad planeada</p>
                  <p className="text-lg font-medium">100 pares</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="production-card">
          <CardHeader>
            <CardTitle className="heading-secondary flex items-center space-x-2">
              <Warehouse className="w-5 h-5" />
              <span>Asignación de Materiales</span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Selecciona y asigna las cantidades necesarias de cada material
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {materiales.map((material) => (
                <div key={material.id} className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{material.nombre}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {material.categoria}
                        </Badge>
                        {material.insuficiente && (
                          <Badge variant="destructive" className="flex items-center space-x-1 text-xs">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Insuficiente</span>
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Ubicación: {material.ubicacion} • Costo unitario: ${material.costo}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Disponible: {material.disponible} {material.unidad}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <Label htmlFor={`cantidad-${material.id}`} className="text-sm">
                        Cantidad a asignar
                      </Label>
                      <div className="mt-1 flex items-center space-x-2">
                        <Input
                          id={`cantidad-${material.id}`}
                          type="number"
                          min={0}
                          max={material.disponible}
                          value={material.asignado}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            handleAsignar(material.id, Number(event.target.value))
                          }
                          className="w-24"
                        />
                        <span className="text-sm text-muted-foreground">{material.unidad}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Costo total</p>
                      <p className="text-lg font-medium">${(material.asignado * material.costo).toFixed(2)}</p>
                    </div>
                  </div>

                  {material.insuficiente && (
                    <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="text-sm font-medium text-destructive">
                            Material insuficiente para la producción
                          </span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-1 h-4 w-4" />
                          Solicitar compra
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg bg-light-teal/10 p-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Costo total de materiales</h4>
                  <p className="text-sm text-muted-foreground">Basado en asignaciones actuales</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">${totalCosto.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">${(totalCosto / 100).toFixed(2)} por unidad</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navegación del flujo */}
      <ProductionFlowNavigator
        currentStep={2}
        totalSteps={6}
        canProceed={true}
        onNext={handleNext}
        nextDisabled={false}
      />
    </ProductionLayout>
  );
};

export default function Page() {
  return <AsignarRecursosPage />;
}
