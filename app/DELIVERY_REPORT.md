# Reporte de Entrega - Aplicación Node.js

## 9.1 Resumen de Implementación

### Qué se implementó

Se desarrolló una aplicación web completa en **Node.js + TypeScript + Express** para la gestión de evidencias académicas en la nube. La aplicación permite:

- Visualizar una página principal informativa con navegación clara.
- Cargar archivos académicos (PDF, PNG, JPG, DOCX) mediante un formulario web.
- Validar tamaño y tipo de archivo antes de almacenarlos.
- Almacenar archivos en Google Cloud Storage usando Application Default Credentials.
- Listar evidencias almacenadas con metadatos básicos.
- Descargar archivos individualmente desde la aplicación sin exponer URLs públicas del bucket.
- Verificar el estado de la aplicación mediante un endpoint de salud.

### Tecnologías utilizadas

| Componente | Tecnología | Versión |
|---|---|---|
| Runtime | Node.js | LTS (v24.x) |
| Framework web | Express.js | ^4.21.2 |
| Lenguaje | TypeScript | ^5.8.3 |
| Motor de plantillas | EJS | ^3.1.10 |
| Framework CSS | Tailwind CSS | ^4.1.4 |
| Carga de archivos | Multer | ^1.4.5-lts.1 |
| Almacenamiento cloud | @google-cloud/storage | ^7.15.2 |
| Seguridad HTTP | Helmet | ^8.0.0 |
| Logging HTTP | Morgan | ^1.10.1 |
| Variables de entorno | dotenv | ^16.4.7 |
| Layouts EJS | express-ejs-layouts | ^2.5.1 |

### Rutas disponibles

| Método | Ruta | Propósito |
|---|---|---|
| GET | `/` | Página principal |
| GET | `/upload` | Formulario de carga de evidencias |
| POST | `/upload` | Procesar carga de archivo a Cloud Storage |
| GET | `/evidences` | Listar evidencias almacenadas |
| GET | `/evidences/:encodedName/download` | Descargar archivo específico |
| GET | `/health` | Verificar estado de la aplicación |

### Qué quedó fuera del alcance

- Autenticación de usuarios (no se requirió).
- Base de datos relacional o NoSQL (los metadatos viven en Cloud Storage).
- Frontend separado con React/Vite (se usó SSR con EJS según requerimientos).
- Paginación compleja en el listado (limitado a 50 objetos como máximo).
- Docker y orquestación de contenedores.
- HTTPS productivo (se recomienda Nginx o proxy inverso en la VM).

---

## 9.2 Archivos creados o modificados

### Archivos de configuración del proyecto

```text
app/
├── package.json
├── package-lock.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

### Código fuente (TypeScript)

```text
src/
├── server.ts                          ← Punto de entrada del servidor
├── app.ts                             ← Configuración de Express
├── config/
│   ├── env.ts                         ← Validación de variables de entorno
│   ├── app.config.ts                  ← Configuración centralizada de la app
│   ├── messages.config.ts             ← Textos y mensajes de la interfaz
│   └── theme.config.ts                ← Paleta de colores y estilos
├── routes/
│   ├── page.routes.ts                 ← Rutas de páginas estáticas
│   └── evidence.routes.ts             ← Rutas de evidencias y health
├── services/
│   └── storage.service.ts             ← Integración con Cloud Storage
├── middlewares/
│   ├── upload.middleware.ts           ← Multer + validaciones
│   └── error.middleware.ts            ← Manejo global de errores
├── utils/
│   ├── file-name.util.ts              ← Generación de nombres seguros
│   └── format.util.ts                 ← Formateo de fechas y tamaños
├── types/
│   └── dotenv.d.ts                    ← Tipos para dotenv
└── views/
    ├── layout.ejs                     ← Layout base
    ├── index.ejs                      ← Página principal
    ├── upload.ejs                     ← Formulario de carga
    ├── evidences.ejs                  ← Listado de evidencias
    └── error.ejs                      ← Página de error
```

### Assets públicos

```text
public/
├── css/
│   ├── input.css                      ← Tailwind source
│   └── output.css                     ← CSS compilado (generado)
└── js/
    └── main.js                        ← Scripts del cliente
```

### Archivos generados (no en Git)

```text
dist/                                  ← Código JavaScript compilado por tsc
```

---

## 9.3 Variables de Entorno Requeridas

Copiar `.env.example` a `.env` y configurar los valores reales.

| Variable | Descripción | Valor por defecto | Ejemplo |
|---|---|---|---|
| `NODE_ENV` | Entorno de ejecución | `development` | `production` |
| `PORT` | Puerto del servidor HTTP | `3000` | `3000` |
| `GCP_BUCKET_NAME` | Nombre del bucket de Cloud Storage | **Requerido** | `evidencias-academicas-gcp-sion01-savg` |
| `MAX_FILE_SIZE_MB` | Tamaño máximo de archivo en MB | `10` | `10` |
| `GCS_PREFIX` | Prefijo para organizar objetos en el bucket | `evidencias` | `evidencias` |

> **Importante:** `GCP_BUCKET_NAME` no tiene valor por defecto y debe configurarse obligatoriamente para que la aplicación funcione.

---

## 9.4 Comandos de Instalación y Ejecución

### Instalación de dependencias

```bash
npm install
```

### Desarrollo (con recarga automática)

```bash
npm run dev
```

Esto ejecuta `tsx watch src/server.ts`, que compila TypeScript en memoria y reinicia el servidor ante cambios.

### Compilación de CSS (desarrollo con watch)

```bash
npm run watch:css
```

### Construcción para producción

```bash
npm run build
npm run build:css
```

Esto genera:
- `dist/` con el código JavaScript compilado.
- `public/css/output.css` con los estilos finales.

### Ejecución en producción

```bash
npm start
```

Esto ejecuta `node dist/server.js`.

---

## 9.5 Comandos de Verificación

### Verificar endpoint de salud

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "service": "cloud-evidence-app",
  "timestamp": "2026-04-26T00:00:00.000Z"
}
```

### Pruebas manuales sugeridas

1. **Página principal**
   - Abrir `http://localhost:3000/` en el navegador.
   - Verificar que se muestra el título, descripción y tarjetas de servicios.
   - Verificar que los botones de navegación funcionan.

2. **Formulario de carga**
   - Abrir `http://localhost:3000/upload`.
   - Intentar cargar un archivo sin seleccionar nada (debe mostrar error).
   - Intentar cargar un archivo mayor a 10 MB (debe mostrar error de tamaño).
   - Intentar cargar un archivo `.exe` (debe mostrar error de tipo).
   - Cargar un PDF, PNG, JPG o DOCX válido (debe mostrar éxito).

3. **Listado de evidencias**
   - Abrir `http://localhost:3000/evidences`.
   - Verificar que aparece el archivo recién cargado.
   - Verificar que se muestran nombre, tamaño, tipo y fecha.

4. **Descarga de archivo**
   - En el listado, hacer clic en el botón "Descargar".
   - Verificar que el archivo se descarga con su nombre original.

---

## 9.6 Validaciones Implementadas

### Tamaño máximo de archivo

- Se lee desde la variable de entorno `MAX_FILE_SIZE_MB`.
- El valor se convierte a bytes y se pasa a Multer (`limits.fileSize`).
- Si se excede, se muestra un mensaje controlado al usuario.

### Tipos MIME permitidos

Se permite únicamente:

- `application/pdf`
- `image/png`
- `image/jpeg`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

Si el archivo no coincide, Multer rechaza la carga y se muestra mensaje de error.

### Sanitización de nombres de archivo

- Se eliminan caracteres de control (`< > : " | ? *`).
- Se eliminan intentos de path traversal (`..`, `/`, `\`).
- Los espacios se convierten a guiones.
- Se genera un nombre único con timestamp para evitar colisiones.
- El nombre final sigue el patrón: `evidencias/YYYY/MM/timestamp-slug-nombre.ext`.

### Manejo de errores

- Errores 404: página personalizada sin exponer stack trace.
- Errores 500: en producción se oculta el stack trace; en desarrollo se muestra para facilitar debugging.
- Errores de permisos IAM: se registran en consola y se muestra mensaje genérico al usuario.
- Errores de bucket no accesible: se manejan en el listado y se muestra mensaje de estado.

### Prevención de credenciales en repositorio

- `.env` está incluido en `.gitignore`.
- No existe ninguna clave JSON de cuenta de servicio en el repositorio.
- `@google-cloud/storage` se inicializa sin ruta a clave:

```typescript
const storage = new Storage();
```

Esto fuerza el uso de Application Default Credentials del entorno (Compute Engine en producción).

---

## 9.7 Notas para Despliegue en Compute Engine

### Requisitos previos en la VM

1. **Node.js LTS** instalado.
2. **Bucket de Cloud Storage** creado y con la cuenta de servicio de la VM autorizada.
3. **Cuenta de servicio** `sa-evidencias-storage` asociada a la VM.

### Pasos de despliegue

```bash
# 1. Clonar o copiar el código a la VM
git clone <repo-url> /opt/cloud-evidence-app
cd /opt/cloud-evidence-app/app

# 2. Instalar dependencias
npm install

# 3. Compilar TypeScript y CSS
npm run build
npm run build:css

# 4. Crear archivo .env con valores reales
cat > .env << 'EOF'
NODE_ENV=production
PORT=3000
GCP_BUCKET_NAME=evidencias-academicas-gcp-sion01-savg
MAX_FILE_SIZE_MB=10
GCS_PREFIX=evidencias
EOF

# 5. Iniciar la aplicación
npm start
```

### Recomendación de proceso manager

Para producción se recomienda **PM2** o **systemd** para mantener la aplicación viva:

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar con PM2
pm2 start dist/server.js --name cloud-evidence-app
pm2 save
pm2 startup
```

### Exposición por puerto 80

La aplicación corre internamente en el puerto 3000. Para exponerla por el puerto 80 se recomienda usar **Nginx** como proxy inverso:

```nginx
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 9.8 Problemas Pendientes y Advertencias

| # | Advertencia | Impacto | Mitigación |
|---|---|---|---|
| 1 | **No hay autenticación de usuarios** | Cualquier persona con acceso a la URL puede cargar y descargar archivos. | Implementar autenticación en versiones futuras si es requerido. |
| 2 | **No hay base de datos** | Los metadatos dependen exclusivamente de Cloud Storage. No hay historial de versiones ni relaciones. | Considerar Cloud SQL o Firestore si se requiere complejidad futura. |
| 3 | **No hay HTTPS productivo** | La aplicación expone HTTP plano en el puerto 3000. | Configurar Nginx con certificado SSL o usar Cloud Load Balancer con SSL. |
| 4 | **El bucket debe existir previamente** | Si el bucket no existe o la cuenta de servicio no tiene permisos, la carga fallará. | Verificar permisos `roles/storage.objectAdmin` para la cuenta de servicio. |
| 5 | **La cuenta de servicio debe estar asociada a la VM** | Sin la cuenta de servicio correcta, `@google-cloud/storage` no podrá autenticarse. | Asegurar que la VM use `sa-evidencias-storage` como cuenta de servicio. |
| 6 | **Tamaño máximo de archivo** | Archivos muy grandes podrían saturar la memoria de una VM `e2-micro`. | Mantener el límite de 10 MB o aumentar recursos de la VM. |
| 7 | **Archivos se mantienen en memoria durante carga** | Multer usa `memoryStorage`, por lo que archivos grandes consumen RAM. | El límite de 10 MB lo hace seguro para una `e2-micro`. |
| 8 | **No hay rate limiting** | Un usuario malicioso podría saturar el endpoint de carga. | Implementar `express-rate-limit` en versiones futuras. |

---

## 10. Checklist de Revisión Final

| # | Item | Estado |
|---|---|---|
| 1 | No existe `.env` subido al repositorio | ✅ `.env` está en `.gitignore` |
| 2 | No existe clave JSON en el repositorio | ✅ No se incluye ninguna clave |
| 3 | `@google-cloud/storage` usa credenciales por defecto | ✅ `new Storage()` sin keyFilename |
| 4 | `GCP_BUCKET_NAME` es configurable | ✅ Via variable de entorno |
| 5 | Las rutas funcionan | ✅ Implementadas y probadas |
| 6 | Los errores son controlados | ✅ Middleware de errores global |
| 7 | El código no está sobreingenierizado | ✅ Arquitectura simple y directa |
| 8 | La UI es clara y suficiente para capturas | ✅ Diseño cálido y académico con Tailwind |
| 9 | El README permite desplegar en VM | ✅ Instrucciones incluidas |
| 10 | `DELIVERY_REPORT.md` está completo | ✅ Este documento |

---

*Entrega generada el 26 de abril de 2026.*
*Agente: OpenCode (OpenCode k2.6)*
