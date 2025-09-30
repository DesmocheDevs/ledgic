'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useAuth';
import { AuthLoading } from '@/components/auth/AuthLoading';

type UIMaterial = {
  id: string;
  precioCompra: string;
  proveedor: string | null;
  cantidadActual: number | null;
  valorTotalInventario: number | null;
  costoPromedioPonderado: number | null;
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
  // Client-side authentication check
  const { isLoading: authLoading } = useRequireAuth();

  const [materials, setMaterials] = useState<UIMaterial[]>([]);
  const [inventories, setInventories] = useState<UIInventory[]>([]);
  const [formData, setFormData] = useState({
    precioCompra: '',
    proveedor: '',
    inventarioId: '',
  });
  const [initFormData, setInitFormData] = useState({
    cantidad_inicial: '',
    costo_unitario_inicial: '',
    fecha_ingreso: '',
  });
  const [compraFormData, setCompraFormData] = useState({
    cantidad_comprada: '',
    precio_unitario_compra: '',
  });
  const [consumoFormData, setConsumoFormData] = useState({
    cantidad_consumida: '',
    lote_id: '',
  });
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'crear' | 'inicializar' | 'compra' | 'consumo'>('crear');
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

  const handleInitInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInitFormData({ ...initFormData, [e.target.name]: e.target.value });
  };

  const handleCompraInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCompraFormData({ ...compraFormData, [e.target.name]: e.target.value });
  };

  const handleConsumoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setConsumoFormData({ ...consumoFormData, [e.target.name]: e.target.value });
  };

  const refreshMaterials = async () => {
    try {
      const materialsRes = await fetch('/api/materials');
      if (!materialsRes.ok) {
        throw new Error(`Error al cargar materiales: ${materialsRes.status}`);
      }
      const materialsData = await materialsRes.json();
      setMaterials(materialsData);
    } catch (err) {
      console.error('Error refreshing materials:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar materiales';
      setError(errorMessage);
    }
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
      
      await refreshMaterials();
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

  const handleInitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return setError('Debe seleccionar un material');
    setError(null);

    if (initFormData.cantidad_inicial.trim().length === 0) return setError('Cantidad inicial es requerida');
    if (isNaN(Number(initFormData.cantidad_inicial)) || Number(initFormData.cantidad_inicial) <= 0) {
      return setError('Cantidad inicial debe ser un número válido mayor a 0');
    }
    if (initFormData.costo_unitario_inicial.trim().length === 0) return setError('Costo unitario inicial es requerido');
    if (isNaN(Number(initFormData.costo_unitario_inicial)) || Number(initFormData.costo_unitario_inicial) <= 0) {
      return setError('Costo unitario inicial debe ser un número válido mayor a 0');
    }

    setSubmitting(true);
    try {
      const payload: { cantidad_inicial: number; costo_unitario_inicial: number; fecha_ingreso?: string } = {
        cantidad_inicial: Number(initFormData.cantidad_inicial),
        costo_unitario_inicial: Number(initFormData.costo_unitario_inicial),
      };
      if (initFormData.fecha_ingreso) {
        payload.fecha_ingreso = initFormData.fecha_ingreso;
      }

      const res = await fetch(`/api/materials/${selectedMaterial}/inicializar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error del servidor (${res.status})`);
      }
      
      await refreshMaterials();
      setInitFormData({
        cantidad_inicial: '',
        costo_unitario_inicial: '',
        fecha_ingreso: '',
      });
      setSelectedMaterial(null);
      setActiveTab('crear');
      setError(null);
    } catch (err: unknown) {
      console.error('Error initializing inventory:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al inicializar el inventario';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return setError('Debe seleccionar un material');
    setError(null);

    if (compraFormData.cantidad_comprada.trim().length === 0) return setError('Cantidad comprada es requerida');
    if (isNaN(Number(compraFormData.cantidad_comprada)) || Number(compraFormData.cantidad_comprada) <= 0) {
      return setError('Cantidad comprada debe ser un número válido mayor a 0');
    }
    if (compraFormData.precio_unitario_compra.trim().length === 0) return setError('Precio unitario de compra es requerido');
    if (isNaN(Number(compraFormData.precio_unitario_compra)) || Number(compraFormData.precio_unitario_compra) <= 0) {
      return setError('Precio unitario de compra debe ser un número válido mayor a 0');
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/materials/${selectedMaterial}/compra`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cantidad_comprada: Number(compraFormData.cantidad_comprada),
          precio_unitario_compra: Number(compraFormData.precio_unitario_compra),
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error del servidor (${res.status})`);
      }
      
      await refreshMaterials();
      setCompraFormData({
        cantidad_comprada: '',
        precio_unitario_compra: '',
      });
      setSelectedMaterial(null);
      setActiveTab('crear');
      setError(null);
    } catch (err: unknown) {
      console.error('Error registering purchase:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al registrar la compra';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConsumoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return setError('Debe seleccionar un material');
    setError(null);

    if (consumoFormData.cantidad_consumida.trim().length === 0) return setError('Cantidad consumida es requerida');
    if (isNaN(Number(consumoFormData.cantidad_consumida)) || Number(consumoFormData.cantidad_consumida) <= 0) {
      return setError('Cantidad consumida debe ser un número válido mayor a 0');
    }
    if (consumoFormData.lote_id.trim().length === 0) return setError('ID del lote es requerido');

    setSubmitting(true);
    try {
      const res = await fetch(`/api/materials/${selectedMaterial}/consumo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cantidad_consumida: Number(consumoFormData.cantidad_consumida),
          lote_id: consumoFormData.lote_id,
        }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Error del servidor (${res.status})`);
      }
      
      await refreshMaterials();
      setConsumoFormData({
        cantidad_consumida: '',
        lote_id: '',
      });
      setSelectedMaterial(null);
      setActiveTab('crear');
      setError(null);
    } catch (err: unknown) {
      console.error('Error registering consumption:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al registrar el consumo';
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

  const getSelectedMaterialName = () => {
    if (!selectedMaterial) return '';
    const material = materials.find(m => m.id === selectedMaterial);
    return material ? material.inventario.nombre : '';
  };

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading message="Cargando materiales..." />;
  }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 20 }}>Sistema de Gestión de Materiales</h1>
      
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
      
      {/* Lista de Materiales */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ marginBottom: 16 }}>Materiales Registrados</h2>
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
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(material.cantidadActual === null || material.cantidadActual === 0) && (
                    <button 
                      onClick={() => {setSelectedMaterial(material.id); setActiveTab('inicializar'); setError(null);}}
                      style={{ 
                        background: '#dbeafe', 
                        color: '#1e40af', 
                        border: '1px solid #93c5fd', 
                        padding: '6px 12px', 
                        borderRadius: 6,
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Inicializar
                    </button>
                  )}
                  {material.cantidadActual !== null && material.cantidadActual > 0 && (
                    <>
                      <button 
                        onClick={() => {setSelectedMaterial(material.id); setActiveTab('compra'); setError(null);}}
                        style={{ 
                          background: '#dcfce7', 
                          color: '#166534', 
                          border: '1px solid #86efac', 
                          padding: '6px 12px', 
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Compra
                      </button>
                      <button 
                        onClick={() => {setSelectedMaterial(material.id); setActiveTab('consumo'); setError(null);}}
                        style={{ 
                          background: '#fef3c7', 
                          color: '#92400e', 
                          border: '1px solid #fcd34d', 
                          padding: '6px 12px', 
                          borderRadius: 6,
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Consumo
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(material.id)} 
                    style={{ 
                      background: '#fee2e2', 
                      color: '#991b1b', 
                      border: '1px solid #fecaca', 
                      padding: '6px 12px', 
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: '14px' }}>
                <div><strong>Precio de Compra:</strong> ${Number(material.precioCompra).toFixed(2)}</div>
                <div><strong>Unidad de Medida:</strong> {material.inventario.unidadMedida}</div>
                <div><strong>Estado:</strong> {material.inventario.estado}</div>
                
                <div><strong>Cantidad Actual:</strong> {material.cantidadActual !== null ? material.cantidadActual.toFixed(2) : 'No inicializado'}</div>
                <div><strong>Valor Total:</strong> {material.valorTotalInventario !== null ? `$${material.valorTotalInventario.toFixed(2)}` : 'N/A'}</div>
                <div><strong>CPP:</strong> {material.costoPromedioPonderado !== null ? `$${material.costoPromedioPonderado.toFixed(2)}` : 'N/A'}</div>
                
                {material.proveedor && (
                  <div style={{ gridColumn: 'span 3' }}><strong>Proveedor:</strong> {material.proveedor}</div>
                )}
              </div>
              <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
                Registrado: {new Date(material.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pestañas de navegación */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #e5e5e5', marginBottom: 16 }}>
          {(['crear', 'inicializar', 'compra', 'consumo'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {setActiveTab(tab); setError(null);}}
              style={{
                padding: '12px 24px',
                border: 'none',
                background: activeTab === tab ? '#111827' : 'transparent',
                color: activeTab === tab ? 'white' : '#666',
                borderRadius: '8px 8px 0 0',
                cursor: 'pointer',
                marginRight: 4,
                fontSize: '14px',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
              }}
            >
              {tab === 'crear' && 'Crear Material'}
              {tab === 'inicializar' && 'Inicializar Inventario'}
              {tab === 'compra' && 'Registrar Compra'}
              {tab === 'consumo' && 'Registrar Consumo'}
            </button>
          ))}
        </div>

        {/* Formulario Crear Material */}
        {activeTab === 'crear' && (
          <div style={{ padding: 20, border: '1px solid #e5e5e5', borderRadius: 8, backgroundColor: '#fafafa' }}>
            <h3 style={{ marginTop: 0 }}>Crear Nuevo Material</h3>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
              <select 
                name="inventarioId" 
                value={formData.inventarioId} 
                onChange={handleInputChange}
                required
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
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
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <input 
                name="proveedor" 
                placeholder="Proveedor (opcional)" 
                value={formData.proveedor} 
                onChange={handleInputChange} 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <button 
                type="submit" 
                disabled={submitting} 
                style={{ background: '#111827', color: 'white', padding: '12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
              >
                {submitting ? 'Guardando…' : 'Agregar Material'}
              </button>
            </form>
          </div>
        )}

        {/* Formulario Inicializar Inventario */}
        {activeTab === 'inicializar' && (
          <div style={{ padding: 20, border: '1px solid #e5e5e5', borderRadius: 8, backgroundColor: '#fafafa' }}>
            <h3 style={{ marginTop: 0 }}>Inicializar Inventario</h3>
            {selectedMaterial && (
              <p style={{ margin: '0 0 16px 0', padding: 8, background: '#dbeafe', borderRadius: 4, fontSize: '14px' }}>
                Material seleccionado: <strong>{getSelectedMaterialName()}</strong>
              </p>
            )}
            <form onSubmit={handleInitSubmit} style={{ display: 'grid', gap: 12 }}>
              <select 
                value={selectedMaterial || ''} 
                onChange={(e) => setSelectedMaterial(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="">Seleccionar material...</option>
                {materials
                  .filter(m => m.cantidadActual === null || m.cantidadActual === 0)
                  .map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.inventario.nombre} - {material.inventario.categoria}
                    </option>
                  ))}
              </select>
              <input 
                name="cantidad_inicial" 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="Cantidad inicial (ej: 100)" 
                value={initFormData.cantidad_inicial} 
                onChange={handleInitInputChange} 
                required 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <input 
                name="costo_unitario_inicial" 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="Costo unitario inicial (ej: 10.50)" 
                value={initFormData.costo_unitario_inicial} 
                onChange={handleInitInputChange} 
                required 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <input 
                name="fecha_ingreso" 
                type="date" 
                placeholder="Fecha de ingreso (opcional)" 
                value={initFormData.fecha_ingreso} 
                onChange={handleInitInputChange} 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <button 
                type="submit" 
                disabled={submitting || !selectedMaterial} 
                style={{ background: '#1e40af', color: 'white', padding: '12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
              >
                {submitting ? 'Inicializando…' : 'Inicializar Inventario'}
              </button>
            </form>
          </div>
        )}

        {/* Formulario Registrar Compra */}
        {activeTab === 'compra' && (
          <div style={{ padding: 20, border: '1px solid #e5e5e5', borderRadius: 8, backgroundColor: '#fafafa' }}>
            <h3 style={{ marginTop: 0 }}>Registrar Compra</h3>
            {selectedMaterial && (
              <p style={{ margin: '0 0 16px 0', padding: 8, background: '#dcfce7', borderRadius: 4, fontSize: '14px' }}>
                Material seleccionado: <strong>{getSelectedMaterialName()}</strong>
              </p>
            )}
            <form onSubmit={handleCompraSubmit} style={{ display: 'grid', gap: 12 }}>
              <select 
                value={selectedMaterial || ''} 
                onChange={(e) => setSelectedMaterial(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="">Seleccionar material...</option>
                {materials
                  .filter(m => m.cantidadActual !== null && m.cantidadActual >= 0)
                  .map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.inventario.nombre} - Stock: {material.cantidadActual?.toFixed(2)}
                    </option>
                  ))}
              </select>
              <input 
                name="cantidad_comprada" 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="Cantidad comprada (ej: 50)" 
                value={compraFormData.cantidad_comprada} 
                onChange={handleCompraInputChange} 
                required 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <input 
                name="precio_unitario_compra" 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="Precio unitario de compra (ej: 12.00)" 
                value={compraFormData.precio_unitario_compra} 
                onChange={handleCompraInputChange} 
                required 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <button 
                type="submit" 
                disabled={submitting || !selectedMaterial} 
                style={{ background: '#166534', color: 'white', padding: '12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
              >
                {submitting ? 'Registrando…' : 'Registrar Compra'}
              </button>
            </form>
          </div>
        )}

        {/* Formulario Registrar Consumo */}
        {activeTab === 'consumo' && (
          <div style={{ padding: 20, border: '1px solid #e5e5e5', borderRadius: 8, backgroundColor: '#fafafa' }}>
            <h3 style={{ marginTop: 0 }}>Registrar Consumo</h3>
            {selectedMaterial && (
              <p style={{ margin: '0 0 16px 0', padding: 8, background: '#fef3c7', borderRadius: 4, fontSize: '14px' }}>
                Material seleccionado: <strong>{getSelectedMaterialName()}</strong>
              </p>
            )}
            <form onSubmit={handleConsumoSubmit} style={{ display: 'grid', gap: 12 }}>
              <select 
                value={selectedMaterial || ''} 
                onChange={(e) => setSelectedMaterial(e.target.value)}
                required
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              >
                <option value="">Seleccionar material...</option>
                {materials
                  .filter(m => m.cantidadActual !== null && m.cantidadActual > 0)
                  .map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.inventario.nombre} - Stock: {material.cantidadActual?.toFixed(2)}
                    </option>
                  ))}
              </select>
              <input 
                name="cantidad_consumida" 
                type="number" 
                step="0.01" 
                min="0" 
                placeholder="Cantidad consumida (ej: 25)" 
                value={consumoFormData.cantidad_consumida} 
                onChange={handleConsumoInputChange} 
                required 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <input 
                name="lote_id" 
                placeholder="ID del lote (ej: LOTE-001)" 
                value={consumoFormData.lote_id} 
                onChange={handleConsumoInputChange} 
                required 
                style={{ padding: '12px', borderRadius: '6px', border: '1px solid #d1d5db' }}
              />
              <button 
                type="submit" 
                disabled={submitting || !selectedMaterial} 
                style={{ background: '#92400e', color: 'white', padding: '12px', borderRadius: 6, border: 'none', cursor: 'pointer' }}
              >
                {submitting ? 'Registrando…' : 'Registrar Consumo'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
