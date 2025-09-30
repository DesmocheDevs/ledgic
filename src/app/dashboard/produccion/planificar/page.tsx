"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProductionLayout from '@/components/produccion/ProductionLayout';
import { ProductionFlowNavigator } from '@/components/produccion/ProductionFlowNavigator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Package, Clock, Loader2 } from 'lucide-react';
import { useProductionFlow } from '@/hooks/useProductionFlow';

interface Product {
  id: string;
  nombre: string;
  categoria: string;
}

interface InventoryItem {
  id: string;
  nombre: string;
  categoria: string;
  estado: string;
  unidadMedida: string;
  tipo: string;
  currentQuantity: number;
}

type MaterialAvailabilityStatus = "disponible" | "agotado" | "critico";

interface ProductMaterialRequirement {
  material: string;
  cantidad: string;
  disponible: string;
  estado: MaterialAvailabilityStatus;
}

interface ApiMaterial {
  id?: string;
  nombre?: string;
  categoria?: string;
  estado?: string;
  unidadMedida?: string;
  tipo?: string;
  cantidadActual?: number | string;
  inventario?: {
    id?: string;
    nombre?: string;
    categoria?: string;
    estado?: string;
    unidadMedida?: string;
    tipo?: string;
    currentQuantity?: number | string;
    cantidadActual?: number | string;
  };
}

type ApiProduct = Partial<Product> & {
  productId?: string;
  name?: string;
  category?: string;
};

const PRODUCTOS_RESPALDO: Product[] = [
  { id: 'zapato-casual', nombre: 'Zapato Casual Cuero', categoria: 'Calzado' },
  { id: 'zapato-deportivo', nombre: 'Zapato Deportivo Running', categoria: 'Calzado Deportivo' },
  { id: 'bota-trabajo', nombre: 'Bota de Trabajo Seguridad', categoria: 'Calzado Industrial' },
  { id: 'sandalia-verano', nombre: 'Sandalia Verano Mujer', categoria: 'Calzado Estacional' }
];

const MATERIALES_RESPALDO: InventoryItem[] = [
  { id: 'cuero-natural', nombre: 'Cuero natural', categoria: 'Materia prima', estado: 'ACTIVO', unidadMedida: 'm²', tipo: 'MATERIAL', currentQuantity: 150 },
  { id: 'hilo-poliester', nombre: 'Hilo poliéster', categoria: 'Insumos', estado: 'ACTIVO', unidadMedida: 'm', tipo: 'MATERIAL', currentQuantity: 8500 },
  { id: 'suela-goma', nombre: 'Suela de goma', categoria: 'Componentes', estado: 'ACTIVO', unidadMedida: 'pares', tipo: 'MATERIAL', currentQuantity: 350 },
  { id: 'hebillas-metalicas', nombre: 'Hebillas metálicas', categoria: 'Componentes', estado: 'ACTIVO', unidadMedida: 'unidades', tipo: 'MATERIAL', currentQuantity: 1200 },
];

const PlanificarProduccionPage = () => {
  const router = useRouter();
  const { flowState, createFlow, transitionToStep, updateFlowData, getMockProducts, getMockMaterials } = useProductionFlow();

  const [formData, setFormData] = useState({
    producto: '',
    cantidad: '',
    fechaInicio: '',
    fechaFin: '',
    prioridad: ''
  });

  const [productos, setProductos] = useState<Product[]>([]);
  const [materiales, setMateriales] = useState<InventoryItem[]>([]);
  const [selectedProductMaterials, setSelectedProductMaterials] = useState<ProductMaterialRequirement[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos de respaldo por si las APIs fallan
  // Debug: Monitorear cambios en productos
  useEffect(() => {
    console.log('📦 Productos actualizados:', productos.length, productos);
  }, [productos]);

  const loadProductos = useCallback(async () => {
    try {
      console.log('🔄 Cargando productos...');

      // Usar datos simulados inmediatamente para mejor UX
      const mockProducts = getMockProducts();
      setProductos(mockProducts);
      console.log(`📦 ${mockProducts.length} productos simulados cargados`);

      // Intentar cargar productos reales en segundo plano
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          const productosApi = Array.isArray(data)
            ? (data as ApiProduct[])
            : Array.isArray((data as { data?: unknown }).data)
              ? ((data as { data: unknown[] }).data as ApiProduct[])
              : null;

          if (productosApi) {
            const normalizados: Product[] = productosApi.map((producto: ApiProduct, index: number) => ({
              id: producto.id ?? producto.productId ?? `producto-${index}`,
              nombre: producto.nombre ?? producto.name ?? 'Producto sin nombre',
              categoria: producto.categoria ?? producto.category ?? 'Sin categoría',
            }));

            setProductos(normalizados);
            console.log(`📦 ${normalizados.length} productos reales cargados`);
          }
        }
      } catch (apiError) {
        console.log('API de productos no disponible, usando datos simulados');
      }
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      setProductos(PRODUCTOS_RESPALDO);
    } finally {
      setLoading(false);
    }
  }, [getMockProducts]);

  const loadMateriales = useCallback(async () => {
    try {
      console.log('🔄 Cargando materiales del inventario...');

      // Usar datos simulados inmediatamente para mejor UX
      const mockMaterials = getMockMaterials();
      setMateriales(mockMaterials);
      console.log(`📦 ${mockMaterials.length} materiales simulados cargados`);

      // Intentar cargar materiales reales en segundo plano
      try {
        const response = await fetch('/api/materials');
        if (response.ok) {
          const data = await response.json();
          const materialesApi = Array.isArray(data)
            ? (data as ApiMaterial[])
            : Array.isArray((data as { data?: unknown }).data)
              ? ((data as { data: unknown[] }).data as ApiMaterial[])
              : null;

          if (materialesApi) {
            const normalizados: InventoryItem[] = materialesApi.map((material: ApiMaterial, index: number) => ({
              id: material.id ?? material.inventario?.id ?? `material-${index}`,
              nombre: material.inventario?.nombre ?? material.nombre ?? 'Material sin nombre',
              categoria: material.inventario?.categoria ?? material.categoria ?? 'Sin categoría',
              estado: material.inventario?.estado ?? material.estado ?? 'ACTIVO',
              unidadMedida: material.inventario?.unidadMedida ?? material.unidadMedida ?? 'N/A',
              tipo: material.inventario?.tipo ?? material.tipo ?? 'MATERIAL',
              currentQuantity: Number(
                material.cantidadActual ??
                  material.inventario?.cantidadActual ??
                  material.inventario?.currentQuantity ??
                  0
              ),
            }));
            setMateriales(normalizados);
            console.log(`📦 ${normalizados.length} materiales reales cargados`);
          }
        }
      } catch (apiError) {
        console.log('API de materiales no disponible, usando datos simulados');
      }
    } catch (error) {
      console.error('❌ Error cargando materiales:', error);
      setMateriales(MATERIALES_RESPALDO);
    }
  }, [getMockMaterials]);

  // Cargar datos reales desde la API
  useEffect(() => {
    console.log('🚀 Iniciando carga de datos en página de planificación...');
    loadProductos();
    loadMateriales();
  }, [loadProductos, loadMateriales]);

  // Cuando cambia el producto seleccionado, cargar sus materiales (BOM)
  const loadProductMaterials = useCallback(async (productId: string) => {
    try {
      console.log('🔄 Cargando materiales del producto:', productId);

      // Buscar materiales reales del inventario que correspondan al producto
      const productoSeleccionado = productos.find(p => p.id === productId);
      if (productoSeleccionado) {
        // Crear materiales simulados basados en el producto seleccionado
        if (productoSeleccionado.nombre.includes('Zapato Casual') || productoSeleccionado.nombre.includes('Zapato Deportivo')) {
          setSelectedProductMaterials([
            { material: 'Cuero natural', cantidad: '2.5 m²', disponible: '150.75 m²', estado: 'disponible' },
            { material: 'Hilo poliéster', cantidad: '150 m', disponible: '8,500 m', estado: 'disponible' },
            { material: 'Suela de goma', cantidad: '2 pares', disponible: '350 pares', estado: 'disponible' },
            { material: 'Ojetes metálicos', cantidad: '12 unidades', disponible: '7,500 unidades', estado: 'disponible' }
          ]);
        } else if (productoSeleccionado.nombre.includes('Bota')) {
          setSelectedProductMaterials([
            { material: 'Cuero natural', cantidad: '3.2 m²', disponible: '150.75 m²', estado: 'disponible' },
            { material: 'Hilo poliéster', cantidad: '200 m', disponible: '8,500 m', estado: 'disponible' },
            { material: 'Suela de goma', cantidad: '2 pares', disponible: '350 pares', estado: 'disponible' },
            { material: 'Hebillas metálicas', cantidad: '4 unidades', disponible: '1,200 unidades', estado: 'disponible' },
            { material: 'Plantilla interior', cantidad: '2 pares', disponible: '180 pares', estado: 'disponible' }
          ]);
        } else {
          setSelectedProductMaterials([
            { material: 'Cuero sintético', cantidad: '1.2 m²', disponible: '200.25 m²', estado: 'disponible' },
            { material: 'Hilo poliéster', cantidad: '80 m', disponible: '8,500 m', estado: 'disponible' },
            { material: 'Hebillas metálicas', cantidad: '2 unidades', disponible: '1,200 unidades', estado: 'disponible' }
          ]);
        }
        console.log(`📦 Materiales del producto ${productoSeleccionado.nombre} cargados`);
      }
    } catch (error) {
      console.error('Error cargando materiales del producto:', error);
      setSelectedProductMaterials([]);
    }
  }, [productos]);

  useEffect(() => {
    if (formData.producto) {
      loadProductMaterials(formData.producto);
    } else {
      setSelectedProductMaterials([]);
    }
  }, [formData.producto, loadProductMaterials]);

  const handleNext = async (): Promise<boolean> => {
    try {
      // Crear datos básicos de planificación incluso si están vacíos
      const planningPayload = {
        quantity: Number(formData.cantidad) || 100,
        priority: formData.prioridad || "media",
        startDate: formData.fechaInicio || undefined,
        endDate: formData.fechaFin || undefined,
      };

      // Actualizar datos del flujo
      updateFlowData({
        planningData: planningPayload,
        productId: formData.producto || 'default-product',
      });

      let flowId = flowState.flowId;
      if (!flowId) {
        flowId = await createFlow('company-id-placeholder', formData.producto || 'default-product') ?? 'simulated-flow';
      }

      // Siempre retornar true para permitir navegación fluida
      console.log('✅ Planificación procesada, avanzando al siguiente paso');
      return true;
    } catch (error) {
      console.error('Error en planificación:', error);
      // Incluso si hay error, permitir continuar
      return true;
    }
  };

  return (
    <ProductionLayout
      title="Planificar Producción"
  subtitle={`Selecciona el producto y define las cantidades a producir (${productos.length} productos, ${materiales.length} materiales)`}
      step={1}
      totalSteps={6}
      showBackButton={false}
    >
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Formulario de planificación */}
          <div className="space-y-6">
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Datos del Producto</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="producto">Producto a fabricar</Label>
                <Select value={formData.producto} onValueChange={(value: string) => setFormData(prev => ({ ...prev, producto: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona un producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.length > 0 ? (
                      productos.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id || 'default'}>
                          <div className="flex flex-col">
                            <span className="font-medium">{producto.nombre}</span>
                            <span className="text-xs text-muted-foreground">{producto.categoria} • {producto.id}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-products" disabled>
                        {loading ? 'Cargando productos...' : 'No hay productos disponibles'}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="cantidad">Cantidad planeada</Label>
                <Input
                  id="cantidad"
                  type="number"
                  placeholder="Ej: 100"
                  value={formData.cantidad}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, cantidad: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="prioridad">Prioridad</Label>
                <Select value={formData.prioridad} onValueChange={(value: string) => setFormData(prev => ({ ...prev, prioridad: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecciona prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Fechas Estimadas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fechaInicio">Fecha de inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, fechaInicio: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="fechaFin">Fecha estimada de finalización</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, fechaFin: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-gray-100 p-3 rounded-md">
                <Clock className="w-4 h-4" />
                <span>Tiempo estimado: 5-7 días laborales</span>
              </div>
            </CardContent>
            </Card>
          </div>
        </div>

        {/* Vista previa de materiales BOM */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Materiales Requeridos (BOM)</CardTitle>
              <p className="text-sm text-muted-foreground">Lista de materiales basada en el producto seleccionado</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="ml-2">Cargando materiales...</span>
                  </div>
                ) : selectedProductMaterials.length > 0 ? (
                  selectedProductMaterials.map((material: ProductMaterialRequirement, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-background rounded-md border">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{material.material}</h4>
                        <p className="text-xs text-muted-foreground">Necesario: {material.cantidad}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Disponible: {material.disponible}</p>
                        <span className={`inline-block w-2 h-2 rounded-full mt-1 ${
                          material.estado === 'disponible' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4 text-muted-foreground">
                    Selecciona un producto para ver los materiales requeridos
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estado general:</span>
                  <span className="text-yellow-600 font-medium">Revisar materiales</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navegación del flujo */}
      <ProductionFlowNavigator
        currentStep={1}
        totalSteps={6}
        canProceed={true}
        onNext={handleNext}
        nextDisabled={false}
      />
    </ProductionLayout>
  );
};

export default function Page() {
    return <PlanificarProduccionPage />;
}
