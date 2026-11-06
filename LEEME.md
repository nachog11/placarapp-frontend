# PlacarApp front - versión de Marcos A (Valentina + carrito/pedidos)

Es el proyecto completo: `feature/catalogo` (Valentina) + todo lo de Marcos A, ya integrado y corregido.
NO incluye el layout/Navbar/home de Marcos F (se mergea aparte, ver abajo).

## Para correrlo
1. Descomprimir y entrar a `placarapp-frontend/`
2. `npm install`
3. Crear `.env.local` con:  NEXT_PUBLIC_API_URL=http://localhost:8000   (SIN /api)
4. `npm run dev`  /  `npm test`  /  `npm run build`

## Al mergear con Marcos F
- `layout.tsx`: que quede su layout con `<CartProvider>` envolviendo (Navbar + main + Footer), dentro de su `<ThemeProvider>`.
- `page.tsx` (home), `not-found.tsx`: quedarse con los de él.
- `package-lock.json`: quedarse con uno y correr `npm install`.

## Datos para probar
En /admin del back: un usuario con su Cliente vinculado, una Sucursal y productos con stock.

## Qué cambió respecto a tu versión anterior
- CartItemType unificado en utils/cartUtils.ts; CartContext sin fetch ni localStorage.
- Pedidos y checkout leen el token de la cookie (Server Components + Server Action en src/app/pedidos/actions.ts).
- Con el back sin cambios, la Server Action valida stock y precio contra el catálogo, crea pedido + detalles y hace rollback si falla.
- /pedidos y /pedidos/[id] muestran solo los pedidos del cliente logueado.
- Botón "Agregar al carrito" en /productos/[id]; estilos con la paleta de Valentina.

## Limitaciones conocidas del back
- Devuelve los pedidos de todos los usuarios (el front filtra por pantalla).
- Sin transacción ni control/descuento de stock.
