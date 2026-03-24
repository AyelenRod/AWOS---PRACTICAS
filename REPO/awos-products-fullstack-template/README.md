# AWOS – Products (Full-Stack Template)
Este repositorio es una práctica **mínima y funcional** para implementar una **AWOS** (Aplicación Web Orientada a Servicios) basada en un contrato **API Spec (JSON)** para el recurso **Products**, y consumirla desde un cliente web.

## ¿Qué incluye?
- **API (backend)** con endpoints REST para Products
- **Cliente (frontend)** en Next.js que consume la API y muestra el listado
- **Postman** (colección + environment) para pruebas de endpoints

## Stack
- Backend: **Node.js + TypeScript + Express**
- Frontend: **Next.js + TypeScript**
- Pruebas: **Postman**
- Contrato: **JSON** (API Spec, sin YAML)

---

## Estructura del repositorio
- `api/` → API REST (Express + TS)
- `web/` → Cliente Next.js (consume la API)
- `postman/` → Colección y environment para pruebas

---

## Requisitos
- Node.js 18+ (recomendado LTS)
- NPM
- Git
- Postman (recomendado)

---

## Ejecución local (Windows / Git Bash)

### 1) Clonar el repositorio
```bash
git clone https://github.com/VivianaRojo12/awos-products-fullstack-template
cd awos-products-fullstack-template
---

2) Levantar Backend (API)
cd api
npm install
npm run dev

API corriendo en:

http://localhost:3001

Prueba rápida:

http://localhost:3001/api/products?page=1&limit=10

Nota: si visitas http://localhost:3001/
 puede aparecer “Cannot GET /”. Es normal: la API se prueba con rutas /api/....

3) Levantar Frontend (Next.js) en otra terminal

Abre otra terminal y ejecuta:

cd web
npm install
echo NEXT_PUBLIC_API_BASE_URL=http://localhost:3001 > .env.local
npm run dev


Frontend:

http://localhost:3000/products

Contrato (API Spec) aplicado al recurso Products

La implementación sigue el contrato del recurso Products (JSON) respetando:

nombres de campos (ej. inStock, price)

tipos de datos

formato de respuestas

formato de errores

Formato esperado de Product
{
  "id": "p1",
  "name": "Mouse",
  "price": 299,
  "inStock": true
}

Formato esperado de listado (paginado)
{
  "data": [
    { "id": "p1", "name": "Mouse", "price": 299, "inStock": true }
  ],
  "meta": { "page": 1, "limit": 10, "total": 3 }
}

Endpoints principales
GET /api/products

Query params:

page (mín 1)

limit (1–100)

search (opcional)

Ejemplo:

GET http://localhost:3001/api/products?page=1&limit=10

GET /api/products/:id

Ejemplo:

GET http://localhost:3001/api/products/p1

POST /api/products

Body:

{
  "name": "Monitor",
  "price": 2499,
  "inStock": true
}

Estándar de errores

La API responde con:

{
  "code": "INVALID_PRICE",
  "message": "Validacion fallida",
  "details": { "field": "price" }
}


Casos típicos:

404: PRODUCT_NOT_FOUND

409: DUPLICATE_PRODUCT

422: INVALID_NAME, INVALID_PRICE

Pruebas con Postman (IMPORTANTE)
1) Importar archivos

En Postman → Import → File. Importa:

postman/AWOS_Products.postman_collection.json

postman/AWOS_Local.postman_environment.json

2) Activar environment

Arriba a la derecha selecciona: AWOS Local

Este environment define:

BASE_URL = http://localhost:3001

3) Ejecutar requests de la colección

Dentro de la colección ejecuta:

GET list products (200)

GET product by id (200)

GET product by id (404)

POST create product (201)

POST invalid (422)

POST duplicate (409)
