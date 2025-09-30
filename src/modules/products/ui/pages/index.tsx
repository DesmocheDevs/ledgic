'use client';

import { useState, useEffect } from 'react';
import { useRequireAuth } from '@/hooks/useAuth';
import { AuthLoading } from '@/components/auth/AuthLoading';

type UIProduct = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: string;
  categoria: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProductsPage() {
  // Client-side authentication check
  const { isLoading: authLoading } = useRequireAuth();
  const [products, setProducts] = useState<UIProduct[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Show loading while checking authentication
  if (authLoading) {
    return <AuthLoading message="Cargando productos..." />;
  }

  // Consumimos la API del servidor, que usa DI y Prisma del lado servidor
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
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
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar productos';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación rápida en cliente (complementa la del servidor)
    if (formData.nombre.trim().length < 2) return setError('Nombre debe tener al menos 2 caracteres');
    if (formData.precio.trim().length === 0) return setError('Precio es requerido');
    if (isNaN(Number(formData.precio)) || Number(formData.precio) <= 0) {
      return setError('Precio debe ser un número válido mayor a 0');
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          descripcion: formData.descripcion || null,
          categoria: formData.categoria || null,
          precio: Number(formData.precio),
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
      
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: '',
      });
      setError(null);
  } catch (err: unknown) {
      console.error('Error creating product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el producto';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
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
      setProducts(products.filter((p) => p.id !== id));
    } catch (err: unknown) {
      console.error('Error deleting product:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el producto';
      setError(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Productos</h1>
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
          {products.length === 0 && <p>No hay productos registrados</p>}
          {products.map((product) => (
            <div key={product.id} style={{ 
              border: '1px solid #e5e5e5', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 12,
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ margin: 0, color: '#111827' }}>
                    {product.nombre}
                  </h3>
                  {product.categoria && (
                    <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                      Categoría: {product.categoria}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => handleDelete(product.id)} 
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
                <div><strong>Precio:</strong> ${Number(product.precio).toFixed(2)}</div>
                {product.descripcion && (
                  <div><strong>Descripción:</strong> {product.descripcion}</div>
                )}
              </div>
              <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
                Registrado: {new Date(product.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <input 
          name="nombre" 
          placeholder="Nombre del producto" 
          value={formData.nombre} 
          onChange={handleInputChange} 
          required 
        />
        <textarea 
          name="descripcion" 
          placeholder="Descripción (opcional)" 
          value={formData.descripcion} 
          onChange={handleInputChange}
          rows={3}
          style={{ resize: 'vertical' }}
        />
        <input 
          name="precio" 
          type="number" 
          step="0.01" 
          min="0" 
          placeholder="Precio (ej: 19.99)" 
          value={formData.precio} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          name="categoria" 
          placeholder="Categoría (opcional)" 
          value={formData.categoria} 
          onChange={handleInputChange} 
        />
        <button 
          type="submit" 
          disabled={submitting} 
          style={{ background: '#111827', color: 'white', padding: '8px 12px', borderRadius: 6 }}
        >
          {submitting ? 'Guardando…' : 'Agregar Producto'}
        </button>
      </form>
    </div>
  );
}

