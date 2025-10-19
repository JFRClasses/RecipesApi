# RecipeApi

API para manejar recetas, generación de recetas con OpenAI y autenticación básica.

## Resumen
Proyecto en TypeScript usando Express, TypeORM y OpenAI para generar recetas a partir de ingredientes.

Principales características:
- Autenticación (registro/login)
- CRUD mínimo para recetas
- Generación de recetas con IA (OpenAI)
- Migrations con TypeORM
- Contenedorización con Docker

## Requisitos
- Node.js 18+ / 20+
- npm
- Docker (opcional, para correr con docker-compose)

## Instalación (local)
1. Clona el repositorio
2. Instala dependencias:

```bash
npm install
```

3. Configura variables de entorno (crear un archivo `.env` en la raíz). Variables usadas en `docker-compose.yml` y por la app:

- PORT (opcional)
- DB_NAME
- DB_USER
- DB_PASSWORD
- DB_HOST
- DB_PORT
- OPENAI_API_KEY
- UNSPLASH_API_KEY (opcional)

Ejemplo `.env`:

```env
PORT=3000
DB_NAME=recipe_db
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
OPENAI_API_KEY=sk-xxx
UNSPLASH_API_KEY=xxx
```

4. Ejecuta la base de datos (localmente) o usa Docker (ver sección Docker abajo).
5. Compila y levanta la app:

```bash
npm run build
node dist/server.js
```

O en desarrollo con `ts-node` (si lo tienes instalado globalmente o mediante npx):

```bash
npx ts-node server.ts
```

## Scripts útiles
- `npm run build` — Compila TypeScript (genera `dist/`).
- `npm run migration:generate` — Genera una migración (usa TypeORM CLI configurado en package.json).
- `npm run migration:run` — Ejecuta las migraciones (construye antes y corre las migraciones sobre `dist`).

## Endpoints
Base: `/api`

Auth
- POST `/api/auth/register` — Registrar usuario.
  - Body: { /* ver controlador de auth para esquema exacto */ }
- POST `/api/auth/login` — Login.
  - Body: { /* ver controlador de auth para esquema exacto */ }

Recipes
- GET `/api/recipes?userId={id}` — Obtiene recetas del usuario.
  - Query: `userId` (requerido, number)
  - Respuesta: `RecipeDTO[]` con campos: id, title, category, minutes, ingredients, instructions, imageUrl, stars, userId, createdAt, updatedAt
- POST `/api/recipes` — Crea una receta.
  - Body: objeto `Recipe` (ver modelo `src/models/Recipe.ts`)
- POST `/api/recipes/ai-generate` — Genera una receta con IA a partir de ingredientes.
  - Body: { ingredients: string }

Además hay rutas públicas:
- GET `/users` — Lista de usuarios (solo para desarrollo)
- GET `/` — Ruta de prueba que responde `{ test: "test" }`

## Modelos principales (resumen)
- `Recipe` (entidad): id, title, category, minutes, ingredients[], instructions[], imageUrl, prompt, stars, userId, createdAt, updatedAt
- `RecipeDTO`: lo mismo que arriba salvo `prompt`.

## Docker
El proyecto incluye `Dockerfile` y `docker-compose.yml` para correr la API junto a Postgres.

Para levantar con Docker:

```bash
# construir y levantar
docker-compose up --build
```

El servicio expondrá el puerto `3000` por defecto.

## Migrations
Las migraciones están en `src/config/migrations`. Para generar una nueva migración:

```bash
npm run migration:generate
```

Para ejecutar migraciones:

```bash
npm run migration:run
```

## Notas y recomendaciones
- Asegúrate de definir `OPENAI_API_KEY` en el `.env` para usar la funcionalidad de generación de recetas.
- Las dependencias principales: Express, TypeORM, OpenAI, tsyringe para DI.
- En producción, configurar correctamente `DB_HOST` y credenciales, y asegurar que las migraciones se ejecuten durante el despliegue.