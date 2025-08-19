# Módulo de Clientes — Documentación Técnica

Este módulo implementa la gestión de clientes bajo principios de **Arquitectura Limpia** y **Inyección de Dependencias**, permitiendo su uso y extensión de forma aislada y robusta.

---

## Diagrama de Arquitectura (Vista Técnica)

```
[ UI (Next.js Page) ]
        ↓
[ Casos de Uso (Application) ]
        ↓
[ Entidades y Repositorios (Domain) ]
        ↓
[ Implementaciones técnicas (Infrastructure: Prisma, DTOs, Mappers) ]
        ↓
[ Base de Datos (SQLite/Prisma) ]
```

---

## Flujo de Ejecución

1. **UI**: El usuario interactúa con la página Next.js (`/ui/pages/index.tsx`), que consume la API REST (`/api/clients`).
2. **API**: El endpoint recibe la petición y resuelve el caso de uso adecuado mediante el contenedor de dependencias.
3. **Application**: El caso de uso (por ejemplo, `CreateClientUseCase`) orquesta la lógica, validando y manipulando entidades del dominio.
4. **Domain**: Las entidades (`Client`) encapsulan reglas de negocio y validaciones. Los repositorios son interfaces.
5. **Infrastructure**: Implementaciones concretas (ej. `PrismaClientRepository`) cumplen los contratos de repositorio, usando mapeadores y DTOs para transformar datos.
6. **DB**: Prisma ejecuta la operación en la base de datos.
7. **Respuesta**: El flujo retorna hacia la UI, mostrando el resultado o el error correspondiente.

---

## Capas y Responsabilidades

### 1. Dominio (`/domain`)
- **Propósito:** Define el modelo de negocio y las reglas puras.
- **Elementos:**
  - `entities/Client.ts`: Entidad con validaciones y lógica de negocio.
  - `repositories/ClientRepository.ts`: Contrato de persistencia.
- **Ventaja:** Independiente de frameworks y tecnología.

### 2. Aplicación (`/application`)
- **Propósito:** Orquesta los casos de uso del sistema.
- **Elementos:**
  - `use-cases/*.ts`: Cada archivo implementa un caso de uso atómico (crear, obtener, actualizar, eliminar, listar clientes).
- **Ventaja:** No contiene lógica de infraestructura, solo coordina operaciones.

### 3. Infraestructura (`/infrastructure`)
- **Propósito:** Implementa detalles técnicos y de persistencia.
- **Elementos:**
  - `repositories/PrismaClientRepository.ts`: Implementa el contrato usando Prisma ORM.
  - `dtos/ClientDTO.ts`: Define la forma de los datos en tránsito.
  - `mappers/ClientMapper.ts`: Traduce entre entidades y DTOs.
- **Ventaja:** Permite cambiar la tecnología de persistencia sin afectar el dominio ni la aplicación.

### 4. Interfaz de Usuario (`/ui`)
- **Propósito:** Presenta la información y recibe acciones del usuario.
- **Elementos:**
  - `pages/index.tsx`: Página principal de clientes, consume la API y muestra el estado.
  - `components/`: Componentes reutilizables de UI.
- **Ventaja:** Desacoplada de la lógica de negocio y persistencia.

---

## Inyección de Dependencias y Configuración
- **Contenedor:** Se usa `tsyringe` para la inversión de control.
- **Tokens:** Los contratos (repositorios) se resuelven mediante tokens tipados, evitando acoplamientos.
- **Configuración:** El archivo `src/shared/container.ts` registra las implementaciones concretas.
- **Ventaja:** Permite testear y extender el módulo fácilmente, cambiando implementaciones sin modificar el resto del sistema.

---

## Robustez y Buenas Prácticas
- **Validaciones estrictas** en entidades y casos de uso.
- **Manejo de errores** centralizado y consistente (mensajes claros para la UI).
- **DTOs y mapeadores** para evitar fugas de detalles de infraestructura.
- **Separación de capas**: cada una con una única responsabilidad.
- **Barrel exports** para importaciones limpias.

---

## Casos de Uso Disponibles
- Crear cliente (`CreateClientUseCase`)
- Obtener todos los clientes (`GetAllClientsUseCase`)
- Obtener cliente por ID (`GetClientUseCase`)
- Actualizar cliente (`UpdateClientUseCase`)
- Eliminar cliente (`DeleteClientUseCase`)

---

## API REST

### POST `/api/clients`
Crea un nuevo cliente.

**Body:**
```json
{
  "nombre": "string",
  "apellido": "string",
  "cedula": "string",
  "numero": "string | null",
  "correo": "string",
  "direccion": "string",
  "sexo": "MASCULINO | FEMENINO | OTRO"
}
```

### GET `/api/clients`
Lista todos los clientes.

### GET `/api/clients/[id]`
Obtiene un cliente por ID.

### PUT `/api/clients/[id]`
Actualiza un cliente existente.

### DELETE `/api/clients/[id]`
Elimina un cliente por ID.

---

## Extensión y Testeo
- Para cambiar la base de datos, solo implementa un nuevo repositorio y regístralo en el contenedor.
- Los casos de uso pueden testearse inyectando repositorios mock.
- La UI puede evolucionar sin tocar la lógica de negocio.

---

## Resumen
Este módulo es autocontenible, desacoplado y preparado para escalar o migrar de tecnología, siguiendo los principios de Clean Architecture y buenas prácticas de ingeniería de software.
