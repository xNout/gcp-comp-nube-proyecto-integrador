# Aplicación Node.js - Plataforma de Evidencias Académicas

## Requisitos

- Node.js LTS
- npm
- Bucket de Cloud Storage
- Cuenta de servicio en GCP

## Instalación

```bash
npm install
```

## Variables de entorno

Copiar `.env.example` a `.env` y configurar:

- `PORT` - Puerto de la aplicación (default: 3000)
- `GCP_BUCKET_NAME` - Nombre del bucket de Cloud Storage
- `MAX_FILE_SIZE_MB` - Tamaño máximo de archivo en MB (default: 10)
- `GCS_PREFIX` - Prefijo para organizar archivos en el bucket (default: evidencias)

## Ejecutar en desarrollo

```bash
npm run dev
```

Para compilar CSS con Tailwind en paralelo:

```bash
npm run watch:css
```

## Ejecutar en producción

1. Compilar TypeScript:
```bash
npm run build
```

2. Generar CSS:
```bash
npm run build:css
```

3. Iniciar:
```bash
npm start
```

## Rutas

- `GET /` - Página principal
- `GET /upload` - Formulario de carga
- `POST /upload` - Cargar archivo a Cloud Storage
- `GET /evidences` - Listar archivos almacenados
- `GET /evidences/:encodedName/download` - Descargar archivo
- `GET /health` - Verificar estado de la aplicación

## Estructura del proyecto

```
src/
  config/         - Configuración centralizada
  routes/         - Definición de rutas
  services/       - Lógica de negocio (Cloud Storage)
  middlewares/    - Middlewares (upload, errores)
  utils/          - Utilidades (nombres de archivo, formato)
  views/          - Plantillas EJS
  types/          - Tipos TypeScript
public/
  css/            - Estilos Tailwind
  js/             - Scripts cliente
```

## Configuración

Toda la configuración está centralizada en `src/config/`:

- `env.ts` - Variables de entorno validadas
- `app.config.ts` - Configuración de la aplicación
- `messages.config.ts` - Textos y mensajes de la interfaz
- `theme.config.ts` - Colores, fuentes y estilos del tema

## Seguridad

- No subir `.env` ni claves JSON al repositorio
- En Compute Engine, usar la cuenta de servicio asociada a la VM
- El bucket debe permanecer privado
- Helmet para cabeceras de seguridad
- Validación de tipo y tamaño de archivos
- Sanitización de nombres de archivo
- Prevención de path traversal

## Despliegue en Compute Engine

1. Subir código a la VM
2. Instalar dependencias: `npm install`
3. Configurar `.env` con el nombre real del bucket
4. Compilar: `npm run build && npm run build:css`
5. Iniciar con PM2 o systemd: `npm start`
6. Configurar firewall para permitir tráfico en el puerto configurado

## Notas

- La aplicación usa autenticación implícita de GCP (cuenta de servicio de la VM)
- No se requiere archivo de claves JSON en producción
- Los archivos se almacenan en memoria temporal durante la carga (no en disco)
