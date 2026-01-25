# Guía de Configuración para Producción - MiHotel SaaS

## 📋 Resumen

Esta guía explica cómo configurar correctamente las variables de entorno para desplegar la aplicación MiHotel en producción.

## 🔧 Backend (API)

### Variables de Entorno

Edita el archivo `api-mihotel/.env` con los siguientes valores:

```env
# Database
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/mihotel

# JWT
JWT_SECRET=tu_secreto_jwt_seguro_aqui
JWT_EXPIRE=7d

# Server
PORT=3000
NODE_ENV=production

# Security
BCRYPT_SALT_ROUNDS=12

# CORS - Allowed origins (comma separated)
ALLOWED_ORIGINS=https://tu-dominio-frontend.com,https://www.tu-dominio-frontend.com
```

### Configuración CORS

El backend ya está configurado para usar la variable `ALLOWED_ORIGINS`. En producción:

1. **NODE_ENV=production**: El CORS solo permitirá los orígenes listados en `ALLOWED_ORIGINS`
2. **NODE_ENV=development**: El CORS permitirá cualquier origen (útil para desarrollo local)

**Ejemplo para producción:**
```env
ALLOWED_ORIGINS=https://mihotel.com,https://www.mihotel.com,https://app.mihotel.com
```

## 🌐 Frontend (Web)

### Variables de Entorno

#### Para Desarrollo Local
Archivo: `web-mihotel/.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

#### Para Producción
Archivo: `web-mihotel/.env.production`
```env
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api
```

### Configuración en Plataformas de Hosting

#### Vercel
1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega: `NEXT_PUBLIC_API_URL` = `https://api.tu-dominio.com/api`
4. Selecciona el ambiente: Production

#### Netlify
1. Ve a tu sitio en Netlify
2. Site settings → Environment variables
3. Agrega: `NEXT_PUBLIC_API_URL` = `https://api.tu-dominio.com/api`

#### Railway / Render
1. Ve a tu proyecto
2. Variables → Add Variable
3. Agrega: `NEXT_PUBLIC_API_URL` = `https://api.tu-dominio.com/api`

## 🚀 Pasos para Desplegar

### 1. Backend (API)

```bash
cd api-mihotel

# Actualizar variables de entorno
nano .env  # o usa tu editor preferido

# Asegúrate de configurar:
# - NODE_ENV=production
# - ALLOWED_ORIGINS con tus dominios de producción
# - JWT_SECRET con un valor seguro
# - MONGODB_URI con tu base de datos de producción

# Instalar dependencias
npm install

# Iniciar en producción
npm start
```

### 2. Frontend (Web)

```bash
cd web-mihotel

# Crear archivo .env.production
echo "NEXT_PUBLIC_API_URL=https://tu-api-domain.com/api" > .env.production

# Instalar dependencias
npm install

# Build para producción
npm run build

# Iniciar en producción
npm start
```

## 🔒 Seguridad

### Variables que NUNCA deben estar hardcodeadas:

✅ **Correcto** (usando variables de entorno):
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL
```

❌ **Incorrecto** (hardcoded):
```typescript
const API_URL = 'http://localhost:3000/api'
```

### Archivos Protegidos por .gitignore

Los siguientes archivos están protegidos y NO se subirán a Git:
- `api-mihotel/.env`
- `web-mihotel/.env.local`
- `web-mihotel/.env.production`

**Solo se sube a Git:**
- `.env.example` (plantilla sin datos sensibles)

## 📝 Checklist de Despliegue

### Backend
- [ ] Configurar `MONGODB_URI` con base de datos de producción
- [ ] Cambiar `JWT_SECRET` a un valor seguro y único
- [ ] Configurar `NODE_ENV=production`
- [ ] Agregar dominios del frontend en `ALLOWED_ORIGINS`
- [ ] Verificar que el puerto esté disponible

### Frontend
- [ ] Crear archivo `.env.production`
- [ ] Configurar `NEXT_PUBLIC_API_URL` con la URL de tu API
- [ ] Verificar que la URL del API sea accesible desde el navegador
- [ ] Hacer build de producción: `npm run build`
- [ ] Probar la aplicación antes de desplegar

## 🧪 Probar la Configuración

### Backend
```bash
# Verificar que el servidor responda
curl https://tu-api-domain.com/health

# Debería retornar:
# {"success":true,"message":"API is healthy",...}
```

### Frontend
```bash
# Verificar que las variables estén cargadas
npm run build

# Buscar en los logs que use la URL correcta
# Debería mostrar: NEXT_PUBLIC_API_URL=https://tu-api-domain.com/api
```

## 🐛 Troubleshooting

### Error: "Not allowed by CORS"
**Causa:** El dominio del frontend no está en `ALLOWED_ORIGINS`

**Solución:**
```env
# En api-mihotel/.env
ALLOWED_ORIGINS=https://tu-frontend.com,https://www.tu-frontend.com
```

### Error: "Failed to fetch"
**Causa:** La URL del API es incorrecta o no está accesible

**Solución:**
1. Verifica que `NEXT_PUBLIC_API_URL` esté correcta
2. Verifica que el backend esté corriendo
3. Verifica que no haya problemas de red/firewall

### Las variables no se actualizan
**Causa:** Next.js cachea las variables en build time

**Solución:**
```bash
# Reconstruir la aplicación
npm run build
```

## 📚 Archivos Importantes

- `api-mihotel/src/middlewares/security.js` - Configuración CORS
- `web-mihotel/lib/api-config.ts` - Configuración centralizada de API
- `web-mihotel/lib/auth.ts` - Servicio de autenticación

## 🔗 URLs de Ejemplo

### Desarrollo
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:3000`

### Producción
- Frontend: `https://app.mihotel.com`
- Backend: `https://api.mihotel.com`

---

**Nota:** Recuerda actualizar todos los archivos `.env` cada vez que cambies de ambiente (desarrollo → producción).
