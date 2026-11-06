# PlacarApp – Frontend

PlacarApp es la aplicación web de una mueblería online. Permite consultar el catálogo de muebles, acceder a una cuenta de cliente, gestionar el carrito y realizar el flujo de pedidos. También incluye un panel para administrar productos.

Este repositorio contiene el **frontend**. La API REST se encuentra en un repositorio separado.

## Repositorios

- **Frontend:** [nachog11/placarapp-frontend](https://github.com/nachog11/placarapp-frontend)
- **Backend:** [marcosf62/placarapp-backend](https://github.com/marcosf62/placarapp-backend)

## Equipo

| Integrante | Área |
|---|---|
| Valentina Alaniz | Catálogo y productos |
| Ignacio Gaitán | Clientes y autenticación |
| Marcos Nicolás Altamirano | Ventas y pedidos |
| Marcos Funes | Logística y envíos |

## Tecnologías

### Frontend

- [Next.js 16](https://nextjs.org/) con App Router
- [React 19](https://react.dev/)
- TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- React Hook Form y Zod para formularios y validaciones
- Vitest, Testing Library y jsdom para pruebas

### Backend

- Python y Django
- Django REST Framework
- API REST con autenticación por token

La configuración, dependencias y comandos específicos del backend están documentados en su [README](https://github.com/marcosf62/placarapp-backend).

## Funcionalidades

- **Catálogo público:** listado de productos, búsqueda, filtros por categoría y ordenamiento.
- **Detalle de producto:** información, precio, categoría, materiales y disponibilidad.
- **Autenticación:** inicio y cierre de sesión mediante token almacenado en una cookie HTTP-only.
- **Perfil de cliente:** consulta de los datos del perfil y acceso a las reseñas propias.
- **Carrito:** estado centralizado, listado de artículos, eliminación, vaciado y cálculo del total.
- **Pedidos:** selección de retiro en sucursal o envío a domicilio, confirmación del pedido y consulta del historial y detalle.
- **Administración:** panel protegido para listar, crear, editar y eliminar productos.
- **Interfaz:** navegación general, pie de página y alternancia entre tema claro y oscuro.
- **Contacto:** formulario con validación de datos.

## Requisitos

- Node.js y npm, en versiones compatibles con Next.js 16.
- Backend de PlacarApp instalado y ejecutándose.
- Acceso a la API desde la URL configurada en el frontend.

## Puesta en marcha

### 1. Iniciar el backend

Cloná el repositorio del backend y seguí sus instrucciones. El flujo local documentado utiliza `uv`:

```bash
git clone https://github.com/marcosf62/placarapp-backend
cd placarapp-backend
uv sync
cd src
uv run python manage.py migrate
uv run python manage.py createsuperuser
uv run python manage.py runserver
```

Por defecto, el servidor de desarrollo queda disponible en `http://localhost:8000`.

Para otras opciones, incluida la ejecución con Docker, consultá el [README del backend](https://github.com/marcosf62/placarapp-backend).

### 2. Clonar e instalar el frontend

En otra terminal:

```bash
git clone https://github.com/nachog11/placarapp-frontend
cd placarapp-frontend
npm install
```

### 3. Configurar la URL de la API

Creá un archivo `.env.local` en la raíz del frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

La variable debe contener la URL base del backend, **sin agregar `/api` al final**, porque las rutas de la API ya se construyen en el código.

Si el backend se ejecuta en otra dirección o puerto, reemplazá el valor por la URL correspondiente.

### 4. Ejecutar la aplicación

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000).

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la compilación de producción |
| `npm run start` | Ejecuta la aplicación compilada |
| `npm run lint` | Ejecuta ESLint |
| `npm test` | Ejecuta las pruebas con Vitest |

## Rutas principales

| Ruta | Descripción | Acceso |
|---|---|---|
| `/` | Inicio | Público |
| `/productos` | Catálogo y filtros | Público |
| `/productos/[id]` | Detalle de producto | Público |
| `/nosotros` | Información del equipo y contacto | Público |
| `/login` | Inicio de sesión | Público |
| `/carrito` | Carrito de compras | Público |
| `/perfil` | Datos del cliente | Según sesión |
| `/perfil/resenas` | Reseñas del cliente | Requiere sesión |
| `/pedidos` | Historial de pedidos | Requiere sesión |
| `/pedidos/[id]` | Detalle de un pedido | Requiere sesión |
| `/pedidos/checkout` | Confirmación del pedido | Requiere sesión |
| `/dashboard` | Panel de administración | Requiere sesión |
| `/dashboard/productos` | Listado y administración de productos | Requiere sesión |
| `/dashboard/productos/nuevo` | Alta de producto | Requiere sesión |
| `/dashboard/productos/editar/[id]` | Edición de producto | Requiere sesión |

## Integración con la API

El frontend consume la API del backend utilizando la variable `NEXT_PUBLIC_API_URL`. Las solicitudes autenticadas envían el token mediante el encabezado:

```http
Authorization: Token <token>
```

Entre las rutas utilizadas se encuentran:

| Recurso | Endpoint |
|---|---|
| Autenticación | `POST /api/token/` |
| Productos | `/api/productos/` |
| Categorías | `/api/categorias/` |
| Materiales | `/api/materiales/` |
| Clientes | `/api/clientes/clientes/` |
| Direcciones | `/api/clientes/direcciones/` |
| Reseñas propias | `/api/clientes/resenas/mis_resenas/` |
| Pedidos | `/api/ventas/pedidos/` |
| Crear pedido completo | `POST /api/ventas/pedidos/crear_completo/` |
| Sucursales | `/api/logistica/sucursales/` |

## Estructura del proyecto

```text
src/
├── app/                 # Rutas, páginas, layouts y Server Actions
│   ├── api/             # Rutas internas del frontend
│   ├── carrito/
│   ├── dashboard/       # Panel y administración de productos
│   ├── login/
│   ├── nosotros/
│   ├── pedidos/
│   ├── perfil/
│   └── productos/
├── components/          # Componentes visuales y formularios
│   ├── auth/
│   ├── carrito/
│   ├── forms/
│   ├── layout/
│   ├── pedidos/
│   └── ui/
├── context/             # Contextos de autenticación, carrito y tema
├── lib/                 # API, autenticación, schemas y lógica de dominio
└── utils/               # Funciones auxiliares
```

## Consideraciones y limitaciones conocidas

- El formulario de contacto valida los datos y simula una confirmación en la interfaz. Todavía no envía la consulta a un servicio ni la almacena en el backend, porque la API no dispone de un endpoint de contacto.
- El carrito se mantiene en el estado de React Context; actualmente no se persiste en almacenamiento local, por lo que se vacía al recargar la aplicación.
- El backend devuelve el listado general de pedidos y el frontend filtra los correspondientes al cliente para mostrarlos. Para un entorno de producción, ese aislamiento también debe garantizarse desde el backend.
- Para realizar un pedido, el usuario debe iniciar sesión y contar con un perfil de cliente asociado.

## Documentación del backend

La documentación de instalación, modelos, permisos, endpoints y administración de la API se encuentra en el [repositorio del backend](https://github.com/marcosf62/placarapp-backend).
