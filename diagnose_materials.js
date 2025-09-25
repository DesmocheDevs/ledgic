const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function diagnoseMaterials() {
  try {
    console.log('Diagnosticando materiales con costo promedio ponderado inválido...');

    // Aui busca materiales con valores problemáticos (solo negativos, ya que Infinity/NaN requieren manejo especial)
    const badMaterials = await prisma.material.findMany({
      where: {
        costoPromedioPonderado: { lt: 0 }
      },
      select: {
        id: true,
        costoPromedioPonderado: true,
        precioCompra: true,
        proveedor: true,
        createdAt: true
      }
    });

    if (badMaterials.length > 0) {
      console.log(` Encontrado ${badMaterials.length} material(es) con costo promedio ponderado inválido:`);
      badMaterials.forEach(material => {
        console.log(`- ID: ${material.id}`);
        console.log(`  Costo Promedio Ponderado: ${material.costoPromedioPonderado}`);
        console.log(`  Precio Compra: ${material.precioCompra}`);
        console.log(`  Proveedor: ${material.proveedor || 'Sin proveedor'}`);
        console.log(`  Creado: ${material.createdAt}`);
        console.log('---');
      });
    } else {
      console.log(' No se encontraron materiales con costo promedio ponderado inválido');
    }

    // También buscar materiales donde costoPromedioPonderado sea null pero otros valores estén presentes
    const materialsWithNullCPP = await prisma.material.findMany({
      where: {
        AND: [
          { costoPromedioPonderado: null },
          { cantidadActual: { not: null } },
          { cantidadActual: { gt: 0 } }
        ]
      },
      select: {
        id: true,
        costoPromedioPonderado: true,
        cantidadActual: true,
        precioCompra: true
      }
    });

    if (materialsWithNullCPP.length > 0) {
      console.log(`Encontrado ${materialsWithNullCPP.length} material(es) con inventario inicializado pero costo promedio ponderado null:`);
      materialsWithNullCPP.forEach(material => {
        console.log(`- ID: ${material.id}`);
        console.log(`  Costo Promedio Ponderado: ${material.costoPromedioPonderado}`);
        console.log(`  Cantidad Actual: ${material.cantidadActual}`);
        console.log(`  Precio Compra: ${material.precioCompra}`);
        console.log('---');
      });
    }

  } catch (error) {
    console.error('Error durante el diagnóstico:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

diagnoseMaterials();