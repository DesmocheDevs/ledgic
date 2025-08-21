'use client';

import { useState, useEffect } from 'react';

const UI_SEXOS = ['MASCULINO', 'FEMENINO', 'OTRO'] as const;
type UISexo = typeof UI_SEXOS[number];

type UIClient = {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  sexo: string;
  cedula: string;
  numero: string | null;
  direccion: string;
  createdAt: string;
  updatedAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<UIClient[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    numero: '',
    correo: '',
    direccion: '',
    sexo: 'MASCULINO' as UISexo,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Consumimos la API del servidor, que usa DI y Prisma del lado servidor
  useEffect(() => {
    async function fetchClients() {
      try {
        const res = await fetch('/api/clients');
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
        setClients(data);
      } catch (err) {
        console.error('Error fetching clients:', err);
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar clientes';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validación rápida en cliente (complementa la del servidor)
    if (formData.nombre.trim().length < 2) return setError('Nombre debe tener al menos 2 caracteres');
    if (formData.apellido.trim().length < 2) return setError('Apellido debe tener al menos 2 caracteres');
    if (formData.cedula.trim().length < 5) return setError('Cédula debe tener al menos 5 caracteres');
    if (formData.direccion.trim().length < 5) return setError('Dirección debe tener al menos 5 caracteres');

    setSubmitting(true);
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          numero: formData.numero || null,
          sexo: formData.sexo,
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
      
      const newClient = await res.json();
      setClients([...clients, newClient]);
      setFormData({
        nombre: '',
        apellido: '',
        cedula: '',
        numero: '',
        correo: '',
        direccion: '',
        sexo: 'MASCULINO',
      });
      setError(null);
  } catch (err: unknown) {
      console.error('Error creating client:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el cliente';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
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
      setClients(clients.filter((c) => c.id !== id));
    } catch (err: unknown) {
      console.error('Error deleting client:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al eliminar el cliente';
      setError(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 16 }}>
      <h1 style={{ marginBottom: 12 }}>Clientes</h1>
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
          {clients.length === 0 && <p>No hay clientes registrados</p>}
          {clients.map((client) => (
            <div key={client.id} style={{ 
              border: '1px solid #e5e5e5', 
              borderRadius: 8, 
              padding: 16, 
              marginBottom: 12,
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <h3 style={{ margin: 0, color: '#111827' }}>
                    {client.nombre} {client.apellido}
                  </h3>
                  <p style={{ margin: '4px 0', color: '#666', fontSize: '14px' }}>
                    {client.sexo.charAt(0) + client.sexo.slice(1).toLowerCase()}
                  </p>
                </div>
                <button 
                  onClick={() => handleDelete(client.id)} 
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
                <div><strong>Email:</strong> {client.email}</div>
                <div><strong>Cédula:</strong> {client.cedula}</div>
                <div><strong>Teléfono:</strong> {client.numero || 'No especificado'}</div>
                <div><strong>Dirección:</strong> {client.direccion}</div>
              </div>
              <div style={{ marginTop: 8, fontSize: '12px', color: '#999' }}>
                Registrado: {new Date(client.createdAt).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
        <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleInputChange} required />
        <input name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleInputChange} required />
        <input name="cedula" placeholder="Cédula" value={formData.cedula} onChange={handleInputChange} required />
        <input name="numero" placeholder="Número" value={formData.numero} onChange={handleInputChange} />
        <input name="correo" placeholder="Correo (ej: correo@dominio.com)" value={formData.correo} onChange={handleInputChange} required />
        <input name="direccion" placeholder="Dirección" value={formData.direccion} onChange={handleInputChange} required />
        <select name="sexo" value={formData.sexo} onChange={handleInputChange}>
          {UI_SEXOS.map((s) => (
            <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <button type="submit" disabled={submitting} style={{ background: '#111827', color: 'white', padding: '8px 12px', borderRadius: 6 }}>
          {submitting ? 'Guardando…' : 'Agregar Cliente'}
        </button>
      </form>
    </div>
  );
}