"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TestTube, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ApiTestResult {
  endpoint: string;
  status: 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
}

export const ApiTestPanel: React.FC = () => {
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [testing, setTesting] = useState(false);

  const testEndpoints = [
    { name: 'Productos', url: '/api/products' },
    { name: 'Inventario', url: '/api/inventory' },
    { name: 'Escenarios', url: '/api/production/simulation/scenarios' },
  ];

  const testApi = async (endpoint: string, url: string) => {
    setResults(prev => prev.map(result =>
      result.endpoint === endpoint
        ? { ...result, status: 'loading' as const }
        : result
    ));

    try {
      console.log(`🔄 Probando ${endpoint}...`);
      const response = await fetch(url);
      console.log(`📡 ${endpoint} respuesta:`, response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ ${endpoint} datos recibidos:`, data);

      setResults(prev => prev.map(result =>
        result.endpoint === endpoint
          ? { ...result, status: 'success' as const, data }
          : result
      ));
    } catch (error) {
      console.error(`❌ Error en ${endpoint}:`, error);
      setResults(prev => prev.map(result =>
        result.endpoint === endpoint
          ? { ...result, status: 'error' as const, error: String(error) }
          : result
      ));
    }
  };

  const runAllTests = async () => {
    setTesting(true);

    // Inicializar resultados
    setResults(testEndpoints.map(endpoint => ({
      endpoint: endpoint.name,
      status: 'loading' as const
    })));

    // Probar todos los endpoints
    for (const endpoint of testEndpoints) {
      await testApi(endpoint.name, endpoint.url);
      // Pequeña pausa entre pruebas
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setTesting(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500 text-white">Éxito</Badge>;
      case 'error':
        return <Badge className="bg-red-500 text-white">Error</Badge>;
      case 'loading':
        return <Badge className="bg-blue-500 text-white">Cargando</Badge>;
      default:
        return <Badge variant="secondary">Pendiente</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TestTube className="w-5 h-5" />
          <span>Prueba de APIs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={runAllTests}
              disabled={testing}
              className="flex items-center space-x-2"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Probando...</span>
                </>
              ) : (
                <>
                  <TestTube className="w-4 h-4" />
                  <span>Probar Todas las APIs</span>
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            {results.map((result) => (
              <div key={result.endpoint} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium">{result.endpoint}</p>
                    {result.status === 'success' && result.data && (
                      <p className="text-sm text-muted-foreground">
                        {Array.isArray(result.data) ? `${result.data.length} elementos` : 'Datos recibidos'}
                      </p>
                    )}
                    {result.status === 'error' && result.error && (
                      <p className="text-sm text-red-600">{result.error}</p>
                    )}
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>
            ))}
          </div>

          {results.length > 0 && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span>Estado general:</span>
                <div className="flex items-center space-x-2">
                  {results.filter(r => r.status === 'success').length === results.length ? (
                    <Badge className="bg-green-500 text-white">Todas las APIs funcionan</Badge>
                  ) : results.filter(r => r.status === 'error').length > 0 ? (
                    <Badge className="bg-red-500 text-white">Algunas APIs fallan</Badge>
                  ) : (
                    <Badge className="bg-yellow-500 text-white">Probando...</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};