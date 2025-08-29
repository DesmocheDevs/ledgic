'use client';

import { useState, useEffect } from 'react';

type UIMaterial = {
  id: string;
  precioCompra: string;
  proveedor: string | null;
  inventarioId: string;
  inventario: {
    id: string;
    nombre: string;
    categoria: string;
    estado: string;
    unidadMedida: string;
  };
  createdAt: string;
  updatedAt: string;
};

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

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<UIMaterial[]>([]);
  const [inventories, setInventories] = useState<UIInventory[]>([]);
  const [formData, setFormData] = useState({
    precioCompra: '',
    proveedor: '',
    inventarioId: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const materialsRes = await fetch('/api/materials');
        if (!materialsRes.ok) {
          throw new Error(`Error al cargar materiales: ${materialsRes.status}`);
        }
        const materialsData = await materialsRes.json();
        setMaterials(materialsData);

        const inventoriesRes = await fetch('/api/inventory');
        if (!inventoriesRes.ok) {
          throw new Error(`Error al cargar inventarios: ${inventoriesRes.status}`);
        }
        const inventoriesData = await inventoriesRes.json();
        setInventories(inventoriesData);
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar datos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.precioCompra.trim().length === 0) return setError('Precio de compra es requerido');
    if (isNaN(Number(formData.precioCompra)) || Number(formData.precioCompra) <= 0) {
      return setError('Precio de compra debe ser un número válido mayor a 0');
    }
    if (formData.inventarioId.trim().length === 0) return setError('Debe seleccionar un inventario');

    setSubmitting(true);
    try {
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          proveedor: formData.proveedor || null,
          precioCompra: Number(formData.precioCompra),
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error del servidor (${res.status})`);
      }
      
      const newMaterial = await res.json();
      setMaterials([...materials, newMaterial]);
      setFormData({
        precioCompra: '',
        proveedor: '',
        inventarioId: '',
      });
      setError(null);
  } catch (err: unknown) {
      console.error('Error creating material:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el material';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error del servidor (${res.status})`);
      }
      setMaterials(materials.filter((m) => m.id !== id));
    } catch (err: unknown) {
      console.error('Error deleting material:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el material';
      setError(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Materiales</h1>
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
          {materials.length === 0 && <p>No hay materiales registrados</p>}
          {materials.map((material) => (
            <div key={material.id} style={{ 
              border: '1px solid #e5e5e5', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 12,
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ margin: 0, color: '#111827' }}>
                    {material.inventario.nombre}
                  </h3>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                    Categoría: {material.inventario.categoria}
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(material.id)} 
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: '14px' }}>
                <div><strong>Precio de Compra:</strong> ${Number(material.precioCompra).toFixed(2)}</div>
                <div><strong>Unidad de Medida:</strong> {material.inventario.unidadMedida}</div>
                <div><strong>Estado:</strong> {material.inventario.estado}</div>
                {material.proveedor && (
                  <div><strong>Proveedor:</strong> {material.proveedor}</div>
                )}
              </div>
              <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
                Registrado: {new Date(material.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <select 
          name="inventarioId" 
          value={formData.inventarioId} 
          onChange={handleInputChange}
          required
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db' }}
        >
          <option value="">Seleccionar inventario...</option>
          {inventories
            .filter(inv => inv.estado === 'ACTIVO')
            .map((inventory) => (
              <option key={inventory.id} value={inventory.id}>
                {inventory.nombre} - {inventory.categoria} ({inventory.unidadMedida})
              </option>
            ))}
        </select>
        <input 
          name="precioCompra" 
          type="number" 
          step="0.01" 
          min="0" 
          placeholder="Precio de compra (ej: 15.50)" 
          value={formData.precioCompra} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          name="proveedor" 
          placeholder="Proveedor (opcional)" 
          value={formData.proveedor} 
          onChange={handleInputChange} 
        />
        <button 
          type="submit" 
          disabled={submitting} 
          style={{ background: '#111827', color: 'white', padding: '8px 12px', borderRadius: 6 }}
        >
          {submitting ? 'Guardando…' : 'Agregar Material'}
        </button>
      </form>
    </div>
  );
}
