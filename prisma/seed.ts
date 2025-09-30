import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear catálogos de personas
  const tipoEntidadCliente = await prisma.catalogoPersonas.upsert({
    where: { id: 1 },
    update: {},
    create: {
      descripcion: 'Cliente',
    },
  })

  const tipoEntidadUsuario = await prisma.catalogoPersonas.upsert({
    where: { id: 2 },
    update: {},
    create: {
      descripcion: 'Usuario',
    },
  })

  const tipoPersonaIndividual = await prisma.catalogoPersonas.upsert({
    where: { id: 3 },
    update: {},
    create: {
      descripcion: 'Individual',
    },
  })

  const tipoPersonaEmpresa = await prisma.catalogoPersonas.upsert({
    where: { id: 4 },
    update: {},
    create: {
      descripcion: 'Empresa',
    },
  })

  // Crear catálogos generales para métodos de costeo
  const metodoCosteoDirecto = await prisma.catalogoGeneral.upsert({
    where: { id: 1 },
    update: {},
    create: {
      descripcion: 'Costeo Directo',
      grupo: 'METODO_COSTEO',
    },
  })

  const metodoCosteoAbsorcion = await prisma.catalogoGeneral.upsert({
    where: { id: 2 },
    update: {},
    create: {
      descripcion: 'Costeo por Absorción',
      grupo: 'METODO_COSTEO',
    },
  })

  // Crear catálogos para estrategias de precio
  const estrategiaCostoPlus = await prisma.catalogoGeneral.upsert({
    where: { id: 3 },
    update: {},
    create: {
      descripcion: 'Costo Plus',
      grupo: 'ESTRATEGIA_PRECIO',
    },
  })

  const estrategiaValorPercibido = await prisma.catalogoGeneral.upsert({
    where: { id: 4 },
    update: {},
    create: {
      descripcion: 'Valor Percibido',
      grupo: 'ESTRATEGIA_PRECIO',
    },
  })

  // Crear catálogos para tipos de registro de producción
  const tipoRegistroProduccion = await prisma.catalogoGeneral.upsert({
    where: { id: 5 },
    update: {},
    create: {
      descripcion: 'Producción Diaria',
      grupo: 'TIPO_REGISTRO',
    },
  })

  const tipoRegistroMantenimiento = await prisma.catalogoGeneral.upsert({
    where: { id: 6 },
    update: {},
    create: {
      descripcion: 'Mantenimiento',
      grupo: 'TIPO_REGISTRO',
    },
  })

  // Crear una persona de prueba
  const personaPrueba = await prisma.personas.upsert({
    where: { correo: 'admin@ledgic.com' },
    update: {},
    create: {
      primerNombre: 'Admin',
      primerApellido: 'Ledgic',
      nombreCompleto: 'Admin Ledgic',
      correo: 'admin@ledgic.com',
      tipoEntidadId: tipoEntidadUsuario.id,
      tipoPersonaId: tipoPersonaIndividual.id,
    },
  })

  // Crear usuario admin de prueba
  const usuarioPrueba = await prisma.usuario.upsert({
    where: { correo: 'admin@ledgic.com' },
    update: {},
    create: {
      personaId: personaPrueba.id,
      nombre: 'Admin Ledgic',
      correo: 'admin@ledgic.com',
      contrasena: await hash('admin123', 12),
    },
  })

  // Crear compañía de prueba
  const companyPrueba = await prisma.company.upsert({
    where: { email: 'empresa@ledgic.com' },
    update: {},
    create: {
      name: 'Ledgic Demo',
      email: 'empresa@ledgic.com',
      type: 'ORGANIZATION',
    },
  })

  // Crear materiales básicos
  const cueroMaterial = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Cuero Natural Premium' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Cuero Natural Premium',
      category: 'Materia Prima',
      status: 'ACTIVE',
      unitOfMeasure: 'm²',
      itemType: 'MATERIAL',
      currentQuantity: 150.75,
      totalInventoryValue: 6854.25,
      weightedAverageCost: 45.45,
    },
  })

  const hiloMaterial = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Hilo Poliéster 40/2' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Hilo Poliéster 40/2',
      category: 'Insumo',
      status: 'ACTIVE',
      unitOfMeasure: 'm',
      itemType: 'MATERIAL',
      currentQuantity: 8500,
      totalInventoryValue: 1020,
      weightedAverageCost: 0.12,
    },
  })

  const suelaMaterial = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Suela de Goma Antideslizante' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Suela de Goma Antideslizante',
      category: 'Componente',
      status: 'ACTIVE',
      unitOfMeasure: 'pares',
      itemType: 'MATERIAL',
      currentQuantity: 350,
      totalInventoryValue: 4462.5,
      weightedAverageCost: 12.75,
    },
  })

  const ojetesMaterial = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Ojetes Metálicos Dorados' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Ojetes Metálicos Dorados',
      category: 'Herraje',
      status: 'ACTIVE',
      unitOfMeasure: 'unidades',
      itemType: 'MATERIAL',
      currentQuantity: 7500,
      totalInventoryValue: 1875,
      weightedAverageCost: 0.25,
    },
  })

  // Crear materiales adicionales para más variedad
  const cueroSintetico = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Cuero Sintético Premium' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Cuero Sintético Premium',
      category: 'Materia Prima',
      status: 'ACTIVE',
      unitOfMeasure: 'm²',
      itemType: 'MATERIAL',
      currentQuantity: 200.25,
      totalInventoryValue: 6025,
      weightedAverageCost: 30.10,
    },
  })

  const hebillasMetal = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Hebillas Metálicas Plateadas' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Hebillas Metálicas Plateadas',
      category: 'Herraje',
      status: 'ACTIVE',
      unitOfMeasure: 'unidades',
      itemType: 'MATERIAL',
      currentQuantity: 1200,
      totalInventoryValue: 840,
      weightedAverageCost: 0.70,
    },
  })

  const plantillaInterior = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Plantilla Interior Acolchada' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Plantilla Interior Acolchada',
      category: 'Componente',
      status: 'ACTIVE',
      unitOfMeasure: 'pares',
      itemType: 'MATERIAL',
      currentQuantity: 180,
      totalInventoryValue: 1260,
      weightedAverageCost: 7.00,
    },
  })

  const cordonesAlgodon = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Cordones de Algodón Encerado' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Cordones de Algodón Encerado',
      category: 'Insumo',
      status: 'ACTIVE',
      unitOfMeasure: 'pares',
      itemType: 'MATERIAL',
      currentQuantity: 300,
      totalInventoryValue: 450,
      weightedAverageCost: 1.50,
    },
  })

  // Crear productos terminados
  const zapatoProducto = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Zapato Casual Cuero' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Zapato Casual Cuero',
      category: 'Calzado',
      status: 'ACTIVE',
      unitOfMeasure: 'pares',
      itemType: 'PRODUCT',
      currentQuantity: 75,
      totalInventoryValue: 9750,
      weightedAverageCost: 130,
    },
  })

  const zapatoDeportivo = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Zapato Deportivo Running' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Zapato Deportivo Running',
      category: 'Calzado Deportivo',
      status: 'ACTIVE',
      unitOfMeasure: 'pares',
      itemType: 'PRODUCT',
      currentQuantity: 45,
      totalInventoryValue: 7200,
      weightedAverageCost: 160,
    },
  })

  const botaTrabajo = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Bota de Trabajo Seguridad' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Bota de Trabajo Seguridad',
      category: 'Calzado Industrial',
      status: 'ACTIVE',
      unitOfMeasure: 'pares',
      itemType: 'PRODUCT',
      currentQuantity: 30,
      totalInventoryValue: 5700,
      weightedAverageCost: 190,
    },
  })

  const sandaliaVerano = await prisma.inventory.upsert({
    where: { companyId_name: { companyId: companyPrueba.id, name: 'Sandalia Verano Mujer' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      name: 'Sandalia Verano Mujer',
      category: 'Calzado Estacional',
      status: 'ACTIVE',
      unitOfMeasure: 'pares',
      itemType: 'PRODUCT',
      currentQuantity: 60,
      totalInventoryValue: 4800,
      weightedAverageCost: 80,
    },
  })

  // Crear detalles de productos
  await prisma.productDetails.upsert({
    where: { inventoryId: zapatoProducto.id },
    update: {},
    create: {
      inventoryId: zapatoProducto.id,
      description: 'Zapato casual de cuero natural premium con suela de goma',
      salePrice: 250,
      productionCost: 130,
      status: 'ACTIVE',
    },
  })

  await prisma.productDetails.upsert({
    where: { inventoryId: zapatoDeportivo.id },
    update: {},
    create: {
      inventoryId: zapatoDeportivo.id,
      description: 'Zapato deportivo running con tecnología de amortiguación avanzada',
      salePrice: 320,
      productionCost: 160,
      status: 'ACTIVE',
    },
  })

  await prisma.productDetails.upsert({
    where: { inventoryId: botaTrabajo.id },
    update: {},
    create: {
      inventoryId: botaTrabajo.id,
      description: 'Bota de trabajo con protección de seguridad y suela antideslizante',
      salePrice: 380,
      productionCost: 190,
      status: 'ACTIVE',
    },
  })

  await prisma.productDetails.upsert({
    where: { inventoryId: sandaliaVerano.id },
    update: {},
    create: {
      inventoryId: sandaliaVerano.id,
      description: 'Sandalia veraniega para mujer con diseño elegante y comodidad',
      salePrice: 160,
      productionCost: 80,
      status: 'ACTIVE',
    },
  })

  // Crear detalles de materiales
  await prisma.materialDetails.upsert({
    where: { inventoryId: cueroMaterial.id },
    update: {},
    create: {
      inventoryId: cueroMaterial.id,
      unitPrice: 45.45,
    },
  })

  await prisma.materialDetails.upsert({
    where: { inventoryId: hiloMaterial.id },
    update: {},
    create: {
      inventoryId: hiloMaterial.id,
      unitPrice: 0.12,
    },
  })

  await prisma.materialDetails.upsert({
    where: { inventoryId: suelaMaterial.id },
    update: {},
    create: {
      inventoryId: suelaMaterial.id,
      unitPrice: 12.75,
    },
  })

  await prisma.materialDetails.upsert({
    where: { inventoryId: ojetesMaterial.id },
    update: {},
    create: {
      inventoryId: ojetesMaterial.id,
      unitPrice: 0.25,
    },
  })

  await prisma.materialDetails.upsert({
    where: { inventoryId: cueroSintetico.id },
    update: {},
    create: {
      inventoryId: cueroSintetico.id,
      unitPrice: 30.10,
    },
  })

  await prisma.materialDetails.upsert({
    where: { inventoryId: hebillasMetal.id },
    update: {},
    create: {
      inventoryId: hebillasMetal.id,
      unitPrice: 0.70,
    },
  })

  await prisma.materialDetails.upsert({
    where: { inventoryId: plantillaInterior.id },
    update: {},
    create: {
      inventoryId: plantillaInterior.id,
      unitPrice: 7.00,
    },
  })

  await prisma.materialDetails.upsert({
    where: { inventoryId: cordonesAlgodon.id },
    update: {},
    create: {
      inventoryId: cordonesAlgodon.id,
      unitPrice: 1.50,
    },
  })

  // Crear Bill of Materials (BOM) para Zapato Casual Cuero
  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: zapatoProducto.id, materialId: cueroMaterial.id } },
    update: {},
    create: {
      productId: zapatoProducto.id,
      materialId: cueroMaterial.id,
      quantity: 2.5,
      unitOfMeasure: 'm²',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: zapatoProducto.id, materialId: hiloMaterial.id } },
    update: {},
    create: {
      productId: zapatoProducto.id,
      materialId: hiloMaterial.id,
      quantity: 150,
      unitOfMeasure: 'm',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: zapatoProducto.id, materialId: suelaMaterial.id } },
    update: {},
    create: {
      productId: zapatoProducto.id,
      materialId: suelaMaterial.id,
      quantity: 2,
      unitOfMeasure: 'pares',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: zapatoProducto.id, materialId: ojetesMaterial.id } },
    update: {},
    create: {
      productId: zapatoProducto.id,
      materialId: ojetesMaterial.id,
      quantity: 12,
      unitOfMeasure: 'unidades',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: zapatoProducto.id, materialId: cordonesAlgodon.id } },
    update: {},
    create: {
      productId: zapatoProducto.id,
      materialId: cordonesAlgodon.id,
      quantity: 2,
      unitOfMeasure: 'pares',
    },
  })

  // BOM para Zapato Deportivo Running
  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: zapatoDeportivo.id, materialId: cueroSintetico.id } },
    update: {},
    create: {
      productId: zapatoDeportivo.id,
      materialId: cueroSintetico.id,
      quantity: 1.8,
      unitOfMeasure: 'm²',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: zapatoDeportivo.id, materialId: hiloMaterial.id } },
    update: {},
    create: {
      productId: zapatoDeportivo.id,
      materialId: hiloMaterial.id,
      quantity: 120,
      unitOfMeasure: 'm',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: zapatoDeportivo.id, materialId: suelaMaterial.id } },
    update: {},
    create: {
      productId: zapatoDeportivo.id,
      materialId: suelaMaterial.id,
      quantity: 2,
      unitOfMeasure: 'pares',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: zapatoDeportivo.id, materialId: plantillaInterior.id } },
    update: {},
    create: {
      productId: zapatoDeportivo.id,
      materialId: plantillaInterior.id,
      quantity: 2,
      unitOfMeasure: 'pares',
    },
  })

  // BOM para Bota de Trabajo Seguridad
  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: botaTrabajo.id, materialId: cueroMaterial.id } },
    update: {},
    create: {
      productId: botaTrabajo.id,
      materialId: cueroMaterial.id,
      quantity: 3.2,
      unitOfMeasure: 'm²',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: botaTrabajo.id, materialId: hiloMaterial.id } },
    update: {},
    create: {
      productId: botaTrabajo.id,
      materialId: hiloMaterial.id,
      quantity: 200,
      unitOfMeasure: 'm',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: botaTrabajo.id, materialId: suelaMaterial.id } },
    update: {},
    create: {
      productId: botaTrabajo.id,
      materialId: suelaMaterial.id,
      quantity: 2,
      unitOfMeasure: 'pares',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: botaTrabajo.id, materialId: hebillasMetal.id } },
    update: {},
    create: {
      productId: botaTrabajo.id,
      materialId: hebillasMetal.id,
      quantity: 4,
      unitOfMeasure: 'unidades',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: botaTrabajo.id, materialId: plantillaInterior.id } },
    update: {},
    create: {
      productId: botaTrabajo.id,
      materialId: plantillaInterior.id,
      quantity: 2,
      unitOfMeasure: 'pares',
    },
  })

  // BOM para Sandalia Verano Mujer
  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: sandaliaVerano.id, materialId: cueroSintetico.id } },
    update: {},
    create: {
      productId: sandaliaVerano.id,
      materialId: cueroSintetico.id,
      quantity: 1.2,
      unitOfMeasure: 'm²',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: sandaliaVerano.id, materialId: hiloMaterial.id } },
    update: {},
    create: {
      productId: sandaliaVerano.id,
      materialId: hiloMaterial.id,
      quantity: 80,
      unitOfMeasure: 'm',
    },
  })

  await prisma.productMaterial.upsert({
    where: { productId_materialId: { productId: sandaliaVerano.id, materialId: hebillasMetal.id } },
    update: {},
    create: {
      productId: sandaliaVerano.id,
      materialId: hebillasMetal.id,
      quantity: 2,
      unitOfMeasure: 'unidades',
    },
  })

  // Crear lotes de producción de prueba con diferentes estados
  const loteProduccion1 = await prisma.productionLot.upsert({
    where: { companyId_productId_lotCode: { companyId: companyPrueba.id, productId: zapatoProducto.id, lotCode: 'LOT-2024-001' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      productId: zapatoProducto.id,
      lotCode: 'LOT-2024-001',
      plannedQuantity: 100,
      producedQuantity: 0,
      status: 'PLANNED',
    },
  })

  const loteProduccion2 = await prisma.productionLot.upsert({
    where: { companyId_productId_lotCode: { companyId: companyPrueba.id, productId: zapatoDeportivo.id, lotCode: 'LOT-2024-002' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      productId: zapatoDeportivo.id,
      lotCode: 'LOT-2024-002',
      plannedQuantity: 80,
      producedQuantity: 45,
      status: 'IN_PROGRESS',
      startDate: new Date('2024-01-15'),
    },
  })

  const loteProduccion3 = await prisma.productionLot.upsert({
    where: { companyId_productId_lotCode: { companyId: companyPrueba.id, productId: botaTrabajo.id, lotCode: 'LOT-2024-003' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      productId: botaTrabajo.id,
      lotCode: 'LOT-2024-003',
      plannedQuantity: 50,
      producedQuantity: 50,
      unitCost: 185,
      totalCost: 9250,
      status: 'COMPLETED',
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-01-18'),
    },
  })

  const loteProduccion4 = await prisma.productionLot.upsert({
    where: { companyId_productId_lotCode: { companyId: companyPrueba.id, productId: sandaliaVerano.id, lotCode: 'LOT-2024-004' } },
    update: {},
    create: {
      companyId: companyPrueba.id,
      productId: sandaliaVerano.id,
      lotCode: 'LOT-2024-004',
      plannedQuantity: 120,
      producedQuantity: 85,
      status: 'IN_PROGRESS',
      startDate: new Date('2024-01-20'),
    },
  })

  console.log('✅ Seed completado exitosamente!')
  console.log('👤 Usuario de prueba:')
  console.log('   Email: admin@ledgic.com')
  console.log('   Contraseña: admin123')
  console.log('🏢 Compañía de prueba:')
  console.log('   Nombre: Ledgic Demo')
  console.log('   Email: empresa@ledgic.com')
  console.log('📦 Materiales creados:')
  console.log('   - Cuero Natural Premium: 150.75 m²')
  console.log('   - Hilo Poliéster 40/2: 8500 m')
  console.log('   - Suela de Goma: 350 pares')
  console.log('   - Ojetes Metálicos: 7500 unidades')
  console.log('   - Cuero Sintético Premium: 200.25 m²')
  console.log('   - Hebillas Metálicas: 1200 unidades')
  console.log('   - Plantilla Interior: 180 pares')
  console.log('   - Cordones de Algodón: 300 pares')
  console.log('👟 Productos creados:')
  console.log('   - Zapato Casual Cuero: BOM configurado (4 materiales)')
  console.log('   - Zapato Deportivo Running: BOM configurado (4 materiales)')
  console.log('   - Bota de Trabajo Seguridad: BOM configurado (5 materiales)')
  console.log('   - Sandalia Verano Mujer: BOM configurado (3 materiales)')
  console.log('🏭 Lotes de producción:')
  console.log('   - LOT-2024-001: 100 pares planeados (PLANNED)')
  console.log('   - LOT-2024-002: 80 pares en progreso (IN_PROGRESS)')
  console.log('   - LOT-2024-003: 50 pares completados (COMPLETED)')
  console.log('   - LOT-2024-004: 120 pares en progreso (IN_PROGRESS)')
}

main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })