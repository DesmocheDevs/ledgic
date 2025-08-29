'use client';

import { useState, useEffect } from 'react';

// Define a UI-only EstadoInventario type to avoid importing domain entities in the client bundle
const UI_ESTADOS = ['ACTIVO', 'INACTIVO', 'DESCONTINUADO'] as const;
type UIEstadoInventario = typeof UI_ESTADOS[number];

type UIInventory = {
  id: string;
  nombre: string;
  categoria: string;
  estado: string;
  unidadMedida: string;
  proveedor: string | null;
  tipo: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function InventoryPage() {
  const [inventories, setInventories] = useState<UIInventory[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    estado: 'ACTIVO' as UIEstadoInventario,
    unidadMedida: '',
    proveedor: '',
    tipo: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Consumimos la API del servidor, que usa DI y Prisma del lado servidor
  useEffect(() => {
    async function fetchInventories() {
      try {
        const res = await fetch('/api/inventory');
        if (!res.ok) {
          try {
            const errorData = await res.json();
            const errorMessage = errorData.error || `Error del servidor (${res.status})`;
            throw new Error(errorMessage);
          } catch {
            // Fallback: intenta leer el texto plano del error
            try {
              const errorText = await res.text();
              throw new Error(errorText || `Error del servidor (${res.status}): ${res.statusText}`);
            } catch {
              throw new Error(`Error del servidor (${res.status}): ${res.statusText}`);
            }
          }
        }
        const data = await res.json();
        setInventories(data);
      } catch (err) {
        console.error('Error fetching inventories:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar inventarios';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchInventories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación rápida en cliente (complementa la del servidor)
    if (formData.nombre.trim().length < 2) return setError('Nombre debe tener al menos 2 caracteres');
    if (formData.categoria.trim().length < 2) return setError('Categoría debe tener al menos 2 caracteres');
    if (formData.unidadMedida.trim().length === 0) return setError('Unidad de medida es requerida');
    if (formData.unidadMedida.length > 50) return setError('Unidad de medida no puede exceder 50 caracteres');

    setSubmitting(true);
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          proveedor: formData.proveedor || null,
          tipo: formData.tipo || null,
          estado: formData.estado,
        }),
      });
      
      if (!res.ok) {
        try {
          const errorData = await res.clone().json();
          const errorMessage = errorData.error || `Error del servidor (${res.status})`;
          throw new Error(errorMessage);
        } catch {
          // Fallback: intenta leer el texto plano del error
          try {
            const errorText = await res.text();
            throw new Error(errorText || `Error del servidor (${res.status}): ${res.statusText}`);
          } catch {
            throw new Error(`Error del servidor (${res.status}): ${res.statusText}`);
          }
        }
      }
      
      const newInventory = await res.json();
      setInventories([...inventories, newInventory]);
      setFormData({
        nombre: '',
        categoria: '',
        estado: 'ACTIVO',
        unidadMedida: '',
        proveedor: '',
        tipo: '',
      });
      setError(null);
  } catch (err: unknown) {
      console.error('Error creating inventory:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el inventario';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        try {
          const errorData = await res.json();
          const errorMessage = errorData.error || `Error del servidor (${res.status})`;
          throw new Error(errorMessage);
        } catch {
          // Fallback: intenta leer el texto plano del error
          try {
            const errorText = await res.text();
            throw new Error(errorText || `Error del servidor (${res.status}): ${res.statusText}`);
          } catch {
            throw new Error(`Error del servidor (${res.status}): ${res.statusText}`);
          }
        }
      }
      setInventories(inventories.filter((i) => i.id !== id));
    } catch (err: unknown) {
      console.error('Error deleting inventory:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el inventario';
      setError(errorMessage);
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO': return '#10b981';
      case 'INACTIVO': return '#f59e0b';
      case 'DESCONTINUADO': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Gestión de Inventario</h1>
      {error && (
        <div style={{ 
          marginBottom: 12, 
          padding: 12, 
          background: '#fee2e2', 
          color: '#991b1b', 
          borderRadius: 8,
          border: '1px solid #fecaca',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={{ marginBottom: 16 }}>
          {inventories.length === 0 && <p>No hay inventarios registrados</p>}
          {inventories.map((inventory) => (
            <div key={inventory.id} style={{ 
              border: '1px solid #e5e5e5', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 12,
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ margin: 0, color: '#111827' }}>
                    {inventory.nombre}
                  </h3>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                    {inventory.categoria}
                  </p>
                  <div style={{ 
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 12,
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getEstadoColor(inventory.estado)
                  }}>
                    {inventory.estado}
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(inventory.id)} 
                  style={{ 
                    background: '#fee2e2', 
                    color: '#991b1b', 
                    border: '1px solid #fecaca', 
                    padding: '6px 12px', 
                    borderRadius: 6,
                    cursor: 'pointer'
                  }}
                >
                  Eliminar
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: '14px' }}>
                <div><strong>Unidad:</strong> {inventory.unidadMedida}</div>
                <div><strong>Proveedor:</strong> {inventory.proveedor || 'No especificado'}</div>
                <div><strong>Tipo:</strong> {inventory.tipo || 'No especificado'}</div>
              </div>
              <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
                Registrado: {new Date(inventory.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <input name="nombre" placeholder="Nombre del producto" value={formData.nombre} onChange={handleInputChange} required />
        <input name="categoria" placeholder="Categoría" value={formData.categoria} onChange={handleInputChange} required />
        <select name="estado" value={formData.estado} onChange={handleInputChange}>
          {UI_ESTADOS.map((estado) => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
        <input name="unidadMedida" placeholder="Unidad de medida (ej: kg, litros, unidades)" value={formData.unidadMedida} onChange={handleInputChange} required />
        <input name="proveedor" placeholder="Proveedor (opcional)" value={formData.proveedor} onChange={handleInputChange} />
        <input name="tipo" placeholder="Tipo (opcional)" value={formData.tipo} onChange={handleInputChange} />
        <button type="submit" disabled={submitting} style={{ background: '#111827', color: 'white', padding: '8px 12px', borderRadius: 6 }}>
          {submitting ? 'Guardando…' : 'Agregar Inventario'}
        </button>
      </form>
    </div>
  );
}