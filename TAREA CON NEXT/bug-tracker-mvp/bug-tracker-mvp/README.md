# Bug Tracker MVP

Sistema minimalista para reportar y visualizar bugs del equipo de desarrollo.

## Descripción del Proyecto

Bug Tracker MVP es una aplicación web desarrollada con Next.js 15 que permite a equipos de desarrollo reportar bugs de manera rápida y sencilla. El sistema destaca visualmente los bugs de prioridad alta y no requiere autenticación, ideal para uso interno de equipos ágiles.

### Características Principales

- Reporte rápido de bugs con descripción y prioridad
- Visualización de bugs activos con destacado de prioridad alta
- Ordenamiento automático por prioridad (Alta → Media → Baja)
- Interfaz simple y eficiente
- Sin requerimiento de login o autenticación

## Equipo de Desarrollo

| Nombre | Rol | Responsabilidad |
|--------|-----|-----------------|
| Moisés | Backend & Lógica | TypeScript, Server Actions, Persistencia |
| Ayelen | Frontend & UI | CSS, Estilos, Diseño Visual |
| Fernando | Estructura | HTML, Componentes, Documentación |

## Instalación y Ejecución

### Prerrequisitos

- Node.js 18.x o superior
- npm, yarn, pnpm o bun

### Pasos para Ejecutar el Proyecto

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/moissdev/bug-tracker-mvp.git
   cd bug-tracker-mvp
   ```

2. **Navegar a la carpeta del proyecto**
   ```bash
   cd bug-tracker-mvp
   ```

3. **Instalar dependencias**
   ```bash
   npm install
   # o
   yarn install
   # o
   pnpm install
   ```

4. **Ejecutar el servidor de desarrollo**
   ```bash
   npm run dev
   # o
   yarn dev
   # o
   pnpm dev
   ```

5. **Abrir en el navegador**
   
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Verificación de Funcionalidad

Para verificar que todo funciona correctamente:

1. Deberías ver el formulario de reporte de bugs en el lado izquierdo
2. A la derecha verás la lista de bugs reportados
3. Intenta reportar un nuevo bug:
   - Ingresa una descripción (mínimo 5 caracteres)
   - Selecciona una prioridad (Alta, Media o Baja)
   - Haz clic en "Reportar Bug"
4. El nuevo bug debe aparecer en la lista inmediatamente
5. Los bugs de prioridad "Alta" deben estar resaltados visualmente

## Estructura del Proyecto

```
bug-tracker-mvp/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Página principal
│   │   ├── layout.tsx         # Layout de la app
│   │   └── globals.css        # Estilos globales
│   ├── components/
│   │   ├── BugCard.tsx        # Tarjeta individual de bug
│   │   ├── BugList.tsx        # Lista de bugs
│   │   └── BugForm.tsx        # Formulario de reporte
│   └── actions/
│       └── bugActions.ts      # Server Actions (Moisés)
├── spec/
│   └── bugs.actions-contract.json  # Contrato de API
├── data/
│   └── bugs.json              # Persistencia de datos
└── README.md
```

## Tecnologías Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: CSS / Tailwind CSS
- **Arquitectura**: Server Actions (No REST API)
- **Persistencia**: Archivo JSON

## Decisión de Arquitectura: Server Actions

### ¿Por qué Server Actions en lugar de REST API?

1. **Velocidad de desarrollo**: No requiere configurar rutas API separadas
2. **Uso interno**: Solo el equipo de desarrollo usa la herramienta
3. **Simplicidad**: Integración directa entre formulario y servidor
4. **Revalidación automática**: Next.js actualiza la UI automáticamente

### Justificación Técnica

Para un MVP interno con las siguientes características:
- Equipo pequeño (devs + QA)
- Sin necesidad de API externa
- Requerimientos simples (crear y leer bugs)
- Necesidad de desarrollo rápido

**Server Actions es la solución óptima** porque:
- Reduce el boilerplate de código
- Elimina la necesidad de endpoints REST
- Integración nativa con formularios HTML
- Type-safety completo con TypeScript
- Revalidación automática de datos

## Requerimientos Cumplidos

### Funcionales
- Lista compacta con descripción y prioridad
- Formulario con input de descripción y select de prioridad
- Lectura correcta del FormData
- Render condicional para prioridad "Alta"
- Validación en servidor (descripción ≥ 5 caracteres)
- Validación de prioridad (Alta/Media/Baja)

### Técnicos
- Server Actions implementado
- Persistencia de datos
- TypeScript con tipos estrictos
- Componentes modulares

## Capturas de Pantalla

Las capturas de pantalla se incluyen en el reporte PDF individual de cada integrante.

## Enlaces Importantes

- Repositorio: [https://github.com/moissdev/bug-tracker-mvp](https://github.com/moissdev/bug-tracker-mvp)
- Spec JSON: `spec/bugs.actions-contract.json`
- Documentación Next.js: [https://nextjs.org/docs](https://nextjs.org/docs)

## Licencia

Proyecto académico - Universidad [Nombre] - 2026

---

**Nota**: Este proyecto fue desarrollado como parte de la Actividad 8 - Checkpoint 1 del curso de Desarrollo Web.
