
# Academa Admin Dashboard — Real‑Time Setup (Frontend + Mux)

Hola Big Boss 👋 — Este repo ya está listo para conectarse a:
- Tu **backend Admin** (`/api/v1` en `http://34.10.68.32:3000`)
- **Mux Data API** (vía un proxy local seguro)

## 0) Requisitos
- Node.js 18+ y npm
- Las credenciales admin (demo): `admin@academa.local / Password123!`
- Tus tokens de Mux (ID y SECRET)

## 1) Variables de entorno
Crea un `.env` en la raíz copiando `.env.example` y ajusta si necesitas:

```
VITE_API_BASE_URL=http://34.10.68.32:3000/api/v1
VITE_MUX_PROXY_URL=http://localhost:4000
# Para el proxy de Mux:
MUX_TOKEN_ID=TU_TOKEN_ID
MUX_TOKEN_SECRET=TU_TOKEN_SECRET
```

> **Importante:** Los tokens de Mux **nunca** deben ir al navegador. Por eso incluimos un proxy local en `/server` que usa estas keys en el servidor.

## 2) Instalar dependencias
```bash
npm install
```

## 3) Levantar el proxy de Mux (seguro)
En una terminal:
```bash
npm run mux-proxy
```
Esto inicia `http://localhost:4000` con endpoints:
- `GET /metrics/views?period=7d|30d`
- `GET /metrics/concurrent?period=1h|24h`
- `GET /metrics/rebuffer-percentage?period=24h|7d|30d`
- `GET /metrics/video-startup-time?period=24h|7d|30d`
- `GET /metrics/top-assets?period=7d|30d&limit=10`

## 4) Correr el frontend
En otra terminal:
```bash
npm run dev
```
Abre el navegador: `http://localhost:5173` (Vite).

## 5) Iniciar sesión
Usa las credenciales admin de demo o tu usuario real. La app guarda `accessToken`/`refreshToken` y los aplica automáticamente a cada request.

## 6) Dónde está cada cosa
- **Auth real**: `src/lib/api.ts`, `src/services/auth.ts`, `src/contexts/AuthContext.tsx`
- **Usuarios (CRUD)**: `src/pages/Users.tsx` + `src/services/users.ts` → usa `/users` de tu backend
- **Clases (Subjects)**: `src/pages/Classes.tsx` + `src/services/subjects.ts` → usa `/subjects`
- **Métricas (tiempo real)**: `src/services/metrics.ts` + `/server/index.js` (Mux proxy)
- **Variables**: `.env.example`

## 7) Flujo de datos
1. Login → `/auth/email/login` → guarda tokens
2. Requests autenticadas → header `Authorization: Bearer <token>`
3. Si expira el token → refresco automático (`/auth/refresh`)
4. Métricas → frontend llama `VITE_MUX_PROXY_URL` (proxy) → proxy llama **Mux** con Basic Auth

## 8) Pruebas rápidas
- **Usuarios**: crea un usuario teacher y cámbiale el role. Verifica aparece en la lista.
- **Clases**: crea una clase con `professorId` del teacher; debería aparecer al instante.
- **Métricas**: con el proxy encendido, los gráficos se actualizan cada ~15s.

## 9) Producción
- Monta el proxy en tu backend (o un microservicio) y apunta `VITE_MUX_PROXY_URL` al dominio interno.
- No expongas los tokens de Mux al cliente.
- Habilita HTTPS para el proxy y CORS restringido a tu dominio.

## 10) Troubleshooting
- **401** en llamadas admin → revisa que el login haya emitido `accessToken` y que `.env` apunte a `/api/v1`.
- **CORS** con el proxy → ajusta CORS en `server/index.js` o usa el mismo dominio con un `reverse proxy`.
- **Métricas vacías** → revisa que tu Mux Data tenga tráfico reciente y que el periodo (`period`) tenga datos.

¡Listo! Dashboard conectado, en tiempo real y a prueba de balas 🚀
