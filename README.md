# Financiera-Personal

## Gestión de finanzas personales con Clean Architecture

Aplicación web local para administrar ingresos, gastos y metas de ahorro con arquitectura modular, persistencia en el navegador y despliegue en Docker.

## Objetivo

Crear una solución financiera 100% local que mantenga una separación estricta entre:

- **Dominio**: reglas de negocio y entidades puras
- **Aplicación**: casos de uso y estrategias
- **Adaptadores**: controladores, repositorios y puentes entre capas
- **Frameworks**: implementación concreta de persistencia y UI

## Estructura del proyecto

- `src/domain`: entidades puras de negocio (`Transaction`, `Account`, `SavingGoal`, `Salary`)
- `src/application`: casos de uso y estrategia financiera
- `src/adapters`: controladores y repositorios que unen dominio y frameworks
- `src/frameworks`: implementaciones concretas de persistencia y UI

## Cómo ejecutar

Instala dependencias:

```bash
npm install
```

Ejecuta la aplicación localmente:

```bash
npm start
```

Abre en el navegador:

```text
http://localhost:8080
```

## Docker

Construye y levanta el contenedor:

```bash
docker compose build
docker compose up -d
```

Abre en el navegador:

```text
http://localhost:8080
```

Para ver los diagramas UML en un puerto separado:

```text
http://localhost:8081
```

La página UML se sirve desde un servicio independiente y no se muestra en la aplicación principal.

El visor UML incluye:
- Diagrama de clases
- Diagrama de secuencia
- Diagrama de componentes
- Diagrama de casos de uso

## Testing

```bash
npm test
```

## Funcionalidades implementadas

- Login local para proteger el acceso al dashboard
- Registro de ingresos y gastos
- Creación y eliminación de metas de ahorro
- Actualización de salario y análisis de ratios financieros
- Exportación e importación de datos en JSON
- Persistencia local usando `localStorage`
- Dashboard con balance, ahorro y ratios financieros
- Validación de formularios y mensajes de confirmación
- Docker multi-stage para despliegue ligero

## Credenciales de acceso

- Usuario: `admin`
- Contraseña: `financiera123`

## Conexiones principales

- `index.html` → `FinanceApp`: inicialización de la UI y orquestación
- `FinanceApp` → `FinanceController`: coordinación de flujos y validaciones
- `FinanceController` → `RegisterExpenseUseCase`, `RegisterGoalUseCase`, `UpdateTransactionUseCase`, `UpdateGoalUseCase`, `CalculateSavingsUseCase`
- `UseCases` → `FinanceRepository`: abstracción de acceso a datos
- `FinanceRepository` → `LocalStorageFinanceDriver`: implementación concreta de almacenamiento
- `FinanceRepository` → `Account`: actualiza balance y aplica transacciones
- `AnalyzeFinancialRelationsStrategy` → `Salary`: cálculos de ahorro y ratios financieros

## Criterios de aceptación

- El usuario puede registrar un ahorro o gasto localmente
- El sistema guarda los datos en `localStorage`
- El balance y el porcentaje de ahorro se recalculan automáticamente
- Las validaciones impiden montos negativos o datos inválidos
- El usuario puede exportar e importar la base de datos en JSON
