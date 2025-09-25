# Aplicacion Ledgic para MyPymes

## Resumen General

Ledgic es una aplicacion pensada para pequeños negocios y su principal funcion es ser un **PLANIFICADOR DE COSTOS AVANZADO**, enfocado mas que todo en las empresas manofactureras(ej. textil, calzado), su funcionalidad principal es **automatizar la gestion de costos de produccion, inventarios y ventas**, procurado una aplicacion intuitiva y facil de usar.

## Comandos iniciales al clonar el proyecto
`npm install react` o `npm install `  Despues de clonar para poder ejecutar de manera local el proyecto, esto descargara todo los paquetes del proyecto

`npx prisma generate` Sirve para generar el cliente de prisma esto hace que podamos interactuar con la base de datos ademas de que viene con seguridad de tipos y autocompletados

## Patron de desarollo utilizado
En esta aplicacion se utilizo el patron de diseño de inyección de dependencias el cual trata del desacomplamiento. En este en lugar de que un objeto cree sus propios objetos "dependientes", estos le son suministrado desde afuera.

**Caracteristicas**

- Bastante flexible ya que facilita el intercambio de componentes en tiempo de ejecucion. Por ejemplo, en un entorno de desarrollo puedes usar una dependecia simulada mientras que en produccion usas la real
- Es mantenible esto es en especial al tener un codigo menos acomplado es mas facil de entender, depurar y modificar
- Permite hacer un objetos de prueba con facilidad para hacer pruebas
- Un desacoplamiento ya que reduce la interdependcia entre clases, haciendo que el codigo sea mas modular y reutilizable, esto quiere decir que si necesitas cambiar la implementacion de una dependencia, no tienes que modificar el codigo del cliente

## Estructura del Proyecto
```
.
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/                         # Next.js (App Router)
│   │   ├── api/                     # Route handlers (REST/RPC) → llaman casos de uso
│   │   ├── docs/
│   │   ├── inventory/
│   │   ├── materials/
│   │   │   └── page.tsx
│   │   ├── products/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── modules/                     # Módulos funcionales (DDD + DI)
│   │   ├── bom/
│   │   ├── companies/
│   │   ├── inventory/
│   │   │   ├── application/         # Casos de uso / services (orquestación)
│   │   │   ├── domain/              # Entidades, VOs, interfaces (puertos)
│   │   │   ├── infrastructure/      # Adaptadores: Prisma, HTTP, etc. (implementan puertos)
│   │   │   └── ui/                  # Componentes React/Hooks específicos del módulo
│   │   ├── ledger/
│   │   ├── materials/
│   │   ├── production/
│   │   ├── products/
│   │   └── purchasing/
│   └── shared/                      # Código transversal (errores, utils, di/, types…)
├── .env
├── .gitignore
├── diagnose_materials.js            # Script utilitario
├── eslint.config.mjs
└── style.text                       # Notas/estilos temporales
```
## Explicacion de carpetas de patron de desarollo

### **`modules`** 
Aqui vive los modulos del negocio de la aplicacion, donde cada modulo es como una aplicacion chiquita autocontenida con temas en especifico, en el caso de nuestra aplicacion esta el modulo de inventario,materiales,produccion, productos y mas, cada modulo tiene las siguientes carpetas:

### **`domain/`**
Se podria definir como el corazon del modulo aqui se guardan estas cosas:
- `entities/` -> Aqui estan las clases o tipos, que se utilizan en el modulo, un ejemplo en la aplicacion seria en `/inventory` donde el las entidades guardadas son el Inventory.ts y el Material.ts
- `value-objects/` -> tipos inmutables con reglas en este momento no se utiliza en la aplicacion, pero ejemplos de uso de este seria por ejemplo Money.ts o Quantity.ts 
- `repositories/` -> Aqui se define interfaces(puertos) que definen como se accede a los datos(InvetoryRepository.ts) en la misma carpeta `/inventory` 
- `services/` -> servicios de dominio puros(reglas que no encajan en una entidad)
- `events/` -> Eventos de dominio una carpeta algo interesante de implementar, se probara en un futuro
- `errors/` -> Errores del dominio mas que todo de tipado
  
**Reglas de la carpeta**

Reglas muy importantes a seguir para tener buenas practicas en el desarollo y **EVITAR ERRORES** son las siguientes:

- **Puro**: Puro purito debe estar todo por aca, osea estrictamente **PROHIBIDO** utilizar PRISMA aqui, HTTP y sin ningun console.log rezagado por alli
  
- Puede depender de utilizades puras (`shared/utils, zod`), pero sin efectos
  
- Expone contratos que otras capas implementan   

**Aqui no va**
- SQL/Prisma/axios/Nodemailer/Redis.

- Formateo de UI, rutas HTTP, response codes.

### **`application/`**
Aqui se definen
- `entities/` -> Aqui estan las clases o tipos, que se utilizan en el modulo, un ejemplo en la aplicacion seria en `/inventory` donde el las entidades guardadas son el Inventory.ts y el Material.ts
- `value-objects/` -> tipos inmutables con reglas en este momento no se utiliza en la aplicacion, pero ejemplos de uso de este seria por ejemplo Money.ts o Quantity.ts 
- `repositories/` -> Aqui se define interfaces(puertos) que definen como se accede a los datos(InvetoryRepository.ts) en la misma carpeta `/inventory` 
- `services/` -> servicios de dominio puros(reglas que no encajan en una entidad)
- `events/` -> Eventos de dominio una carpeta algo interesante de implementar, se probara en un futuro
- `errors/` -> Errores del dominio mas que todo de tipado

**Cómo agregar un módulo nuevo**

Crear src/modules/<nuevo>/domain con interfaces y entidades.

Crear application/ con los use cases (inyectan interfaces del Domain).

Crear infrastructure/ con adaptadores (Prisma/HTTP) que implementen esas interfaces.

Registrar en shared/di/ el “wire-up” (qué implementación va a cada interfaz).

Exponer endpoints en src/app/api/... o UI en src/modules/<nuevo>/ui/.