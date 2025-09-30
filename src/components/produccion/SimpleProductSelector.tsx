"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Package, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  nombre: string;
  categoria: string;
}

export const SimpleProductSelector: React.FC = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      console.log('🔄 Cargando productos en selector simple...');
      const response = await fetch('/api/products');

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Productos recibidos:', data);

      if (data.success && Array.isArray(data.data)) {
        setProductos(data.data);
      } else {
        // Datos de respaldo
        setProductos([
          { id: '1', nombre: 'Zapato Casual Cuero', categoria: 'Calzado' },
          { id: '2', nombre: 'Zapato Deportivo Running', categoria: 'Deportivo' },
          { id: '3', nombre: 'Bota de Trabajo', categoria: 'Industrial' },
          { id: '4', nombre: 'Sandalia Verano', categoria: 'Estacional' }
        ]);
      }
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      // Datos de respaldo
      setProductos([
        { id: '1', nombre: 'Zapato Casual Cuero', categoria: 'Calzado' },
        { id: '2', nombre: 'Zapato Deportivo Running', categoria: 'Deportivo' },
        { id: '3', nombre: 'Bota de Trabajo', categoria: 'Industrial' },
        { id: '4', nombre: 'Sandalia Verano', categoria: 'Estacional' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="w-5 h-5" />
          <span>Selector de Producto Simple</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="producto-simple">Producto a fabricar</Label>
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder={loading ? "Cargando productos..." : "Selecciona un producto"} />
              </SelectTrigger>
              <SelectContent>
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <SelectItem key={producto.id} value={producto.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{producto.nombre}</span>
                        <span className="text-xs text-muted-foreground">{producto.categoria}</span>
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

          {selectedProduct && (
            <div className="p-3 bg-blue-50 rounded-md">
              <p className="text-sm">
                <strong>Producto seleccionado:</strong> {
                  productos.find(p => p.id === selectedProduct)?.nombre || 'Producto no encontrado'
                }
              </p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Productos disponibles: {productos.length} | Estado: {loading ? 'Cargando...' : 'Listo'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};