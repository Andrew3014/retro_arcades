# 🎬 GUÍA RÁPIDA - Capturas Necesarias para el Informe

**Ubicación:** Carpeta `capturas/` del proyecto  
**Formato:** PNG o JPG  
**Tamaño:** Sin compresión (máximo calidad)  

---

## 📋 Capturas del Informe (17 Total)

### SECCIÓN 1: DESPLIEGUE TÉCNICO (Capturas 1-5)

#### 📸 **CAPTURA 1** - Build Exitoso
```
Comando: npm run build
Qué mostrar:
  ✓ 1702 modules transformed
  ✓ built in 4.13s
  
Terminal PowerShell:
C:\Desarrollo...> npm run build
...
✓ 1702 modules transformed
✓ built in 4.13s
```
**Guarda como:** `01_build_exitoso.png`

---

#### 📸 **CAPTURA 2** - GitHub Conectado a Vercel
```
Sitio: https://vercel.com
Ir a: Tu Proyecto → Settings
Buscar: "Git Connections"

Mostrar línea que diga:
"Connected to GitHub - Andrew3014/retro_arcades"
```
**Guarda como:** `02_github_conectado.png`

---

#### 📸 **CAPTURA 3** - Variables de Entorno
```
Sitio: https://vercel.com
Ir a: Tu Proyecto → Settings → Environment Variables

Mostrar:
VITE_API_URL = https://...railway.app
```
**Guarda como:** `03_variables_entorno.png`

---

#### 📸 **CAPTURA 4** - Commit que Trigger Deploy
```
Opción A - GitHub:
https://github.com/Andrew3014/retro_arcades
Mostrar: Último commit en la rama main

Opción B - Vercel:
https://vercel.com
Ir a: Tu Proyecto → Deployments
Mostrar: Deploy trigger desde commit
```
**Guarda como:** `04_commit_trigger_deploy.png`

---

#### 📸 **CAPTURA 5** - Vercel Dashboard
```
Sitio: https://vercel.com
Ir a: Tu Proyecto → Deployments
Mostrar: Último deployment con status "Ready"
```
**Guarda como:** `05_vercel_analytics.png`

---

### SECCIÓN 2: FUNCIONAMIENTO (Capturas 6-12)

#### 📸 **CAPTURA 6** - App Live en Navegador
```
URL: https://retro-arcades.vercel.app
Qué mostrar:
  - Página de inicio cargada
  - Navbar superior
  - Botones principales visibles
  - URL en barra de direcciones
```
**Guarda como:** `06_app_live.png`

---

#### 📸 **CAPTURA 7** - Registro Exitoso ✅
```
En la app:
1. Click "Registrarse"
2. Llenar con datos nuevos (email, contraseña, usuario)
3. Click "Registrarse"
4. Capturar el mensaje VERDE con ✅

Debería mostrar:
"✅ ¡Registro exitoso! Bienvenido [nombre]"
```
**Guarda como:** `07_registro_exitoso.png`

---

#### 📸 **CAPTURA 8** - Validación Error ❌
```
En la app:
1. Click "Registrarse"
2. Llenar algo incorrecto:
   - Email sin @ 
   - Contraseña < 6 caracteres
   - Username < 3 caracteres
3. Click "Registrarse"
4. Capturar el mensaje ROJO con ❌

Debería mostrar:
"❌ La contraseña debe tener 6+ caracteres"
```
**Guarda como:** `08_validacion_error.png`

---

#### 📸 **CAPTURA 9** - Juego Funcionando
```
En la app:
1. Si no estás logueado, hazlo primero
2. Click en "SNAKE" (o PONG o TETRIS)
3. Juega 10-15 segundos
4. Capturar mientras el juego está en progreso

Debería mostrar:
  - Canvas con el juego
  - Serpiente/Pelota/Piezas visible
  - Puntuación actual
  - Botones de control (móvil) o instrucciones (PC)
```
**Guarda como:** `09_snake_jugando.png`

---

#### 📸 **CAPTURA 10** - Modal Nuevo Récord
```
En la app:
1. Jugar hasta que termine la partida
2. Si obtiene score en top 50, mostrará modal
3. Capturar el modal

Debería mostrar:
  - "¡NUEVO RÉCORD!" (o similar)
  - Puntaje final
  - Campo para ingresar nombre
  - Botón "Guardar"

Si no logras récord, captura el modal de "Fin de Partida" normal.
```
**Guarda como:** `10_nuevo_record.png`

---

#### 📸 **CAPTURA 11** - Rankings
```
En la app:
1. Click en "RANKINGS"
2. Seleccionar un juego (Snake)
3. Capturar la tabla completa

Debería mostrar:
  - Tabla top 50
  - Posición, nombre de jugador, puntaje
  - Sin desorden visual
  - Sin scroll horizontal en pantalla normal
```
**Guarda como:** `11_rankings.png`

---

#### 📸 **CAPTURA 12** - Panel Admin
```
En la app:
1. Loguear como admin:
   Email: andrew@gmail.com
   Contraseña: andrew2025
2. Click en avatar → "Panel Admin"
3. Capturar el panel

Debería mostrar:
  - Título "🔧 PANEL ADMIN"
  - Estadísticas en tarjetas
  - Secciones: Comentarios, Reportes, Puntajes, Usuarios
  - Botones de acción
```
**Guarda como:** `12_admin_panel.png`

---

### SECCIÓN 3: RESPONSIVIDAD MÓVIL (Capturas 13-15)

#### 📸 **CAPTURA 13** - App en Móvil (375px)
```
Opción A - Móvil Real:
  - Fotografiar pantalla en celular

Opción B - Chrome DevTools:
  1. Abrir Chrome
  2. F12 (DevTools)
  3. Click ☎️ Toggle device toolbar
  4. Seleccionar: iPhone SE (375x667)
  5. Navegar a https://retro-arcades.vercel.app
  6. Capturar pantalla

Debería mostrar:
  - Interfaz completa en 375px de ancho
  - Sin scroll horizontal
  - Botones accesibles
  - Texto legible
```
**Guarda como:** `13_mobile_375px.png`

---

#### 📸 **CAPTURA 14** - Juego en Móvil
```
Con DevTools en 375px (o móvil real):
1. Abrir la app
2. Loguear si es necesario
3. Click en "SNAKE" (u otro juego)
4. Capturar mostrando los controles

Debería mostrar:
  - Canvas responsive (llena ancho disponible)
  - Botones de control táctiles visibles
  - Botones NO se solapan
  - Controles son > 48x48px
```
**Guarda como:** `14_mobile_controles.png`

---

#### 📸 **CAPTURA 15** - Panel Admin en Móvil
```
Con DevTools en 375px (o móvil real):
1. Loguear como admin
2. Abrir Panel Admin
3. Capturar (puede scrollear y mostrar secciones)

Debería mostrar:
  - Elementos responsive
  - Grillas se apilan verticalmente
  - Texto NO se corta
  - Botones accesibles
```
**Guarda como:** `15_admin_mobile.png`

---

### SECCIÓN 4: PERFORMANCE (Capturas 16-17)

#### 📸 **CAPTURA 16** - Lighthouse Metrics
```
En Chrome:
1. F12 (DevTools)
2. Click en pestaña "Lighthouse"
3. Click en "Analyze page load"
4. Esperar 30-60 segundos
5. Capturar los resultados

Debería mostrar:
  - Performance score
  - First Contentful Paint (< 1.5s)
  - Largest Contentful Paint (< 2.5s)
  - Cumulative Layout Shift (< 0.1)
  - Time to Interactive (< 3s)
```
**Guarda como:** `16_lighthouse_metrics.png`

---

#### 📸 **CAPTURA 17** - Console Limpia
```
En Chrome:
1. F12 (DevTools)
2. Click en pestaña "Console"
3. Recargar página (F5)
4. Capturar la consola

Debería mostrar:
  - NO hay errores (líneas rojas)
  - Puede haber warnings amarillos (OK)
  - Puede haber logs azules (OK)
  - Consola LIMPIA de errores
```
**Guarda como:** `17_console_limpia.png`

---

## ✅ Checklist de Entrega

```
ANTES DE ENVIAR EL INFORME:

□ Captura 1:  01_build_exitoso.png
□ Captura 2:  02_github_conectado.png
□ Captura 3:  03_variables_entorno.png
□ Captura 4:  04_commit_trigger_deploy.png
□ Captura 5:  05_vercel_analytics.png
□ Captura 6:  06_app_live.png
□ Captura 7:  07_registro_exitoso.png
□ Captura 8:  08_validacion_error.png
□ Captura 9:  09_snake_jugando.png
□ Captura 10: 10_nuevo_record.png
□ Captura 11: 11_rankings.png
□ Captura 12: 12_admin_panel.png
□ Captura 13: 13_mobile_375px.png
□ Captura 14: 14_mobile_controles.png
□ Captura 15: 15_admin_mobile.png
□ Captura 16: 16_lighthouse_metrics.png
□ Captura 17: 17_console_limpia.png

TOTAL: 17 capturas en carpeta 'capturas/'
```

---

## 💡 Tips Útiles

### Para Capturas de Calidad:
- ✅ Usa **Windows + Shift + S** para captura rápida
- ✅ O usa la app "Captura de pantalla" de Windows
- ✅ Guarda en formato **PNG** (mejor calidad)
- ✅ Máxima resolución disponible

### Para DevTools Mobile:
- ✅ F12 en Chrome
- ✅ Ctrl + Shift + M (Toggle device)
- ✅ Seleccionar "iPhone SE" (375x667)
- ✅ Ctrl + Shift + P → buscar "Device" para más opciones

### Para Lighthouse:
- ✅ Asegúrate que la página está completamente cargada
- ✅ Cierra extensiones que ralenticen (ad blockers, etc)
- ✅ Ejecuta en modo incógnito para resultados limpios

---

## 📦 Estructura de Carpetas Esperada

```
Retro Gaming Web App/
├── src/
├── server/
├── capturas/
│   ├── 01_build_exitoso.png
│   ├── 02_github_conectado.png
│   ├── 03_variables_entorno.png
│   ├── 04_commit_trigger_deploy.png
│   ├── 05_vercel_analytics.png
│   ├── 06_app_live.png
│   ├── 07_registro_exitoso.png
│   ├── 08_validacion_error.png
│   ├── 09_snake_jugando.png
│   ├── 10_nuevo_record.png
│   ├── 11_rankings.png
│   ├── 12_admin_panel.png
│   ├── 13_mobile_375px.png
│   ├── 14_mobile_controles.png
│   ├── 15_admin_mobile.png
│   ├── 16_lighthouse_metrics.png
│   └── 17_console_limpia.png
├── PLAN_PRUEBAS_DESPLIEGUE_CICD.md ← INFORME PRINCIPAL
├── EVIDENCIA_DESPLIEGUE_CHECKLIST.md
└── CAPTURA_RAPIDA.md ← ESTE ARCHIVO
```

---

## 🚀 Próximos Pasos

1. **Tomar todas las capturas** en orden (1 a 17)
2. **Guardar en carpeta** `capturas/`
3. **Nombrar correctamente** (01_, 02_, etc)
4. **Insertar en informe** - Buscar "CAPTURA REQUERIDA" y reemplazar
5. **Generar PDF** con imágenes incrustadas
6. **Enviar** tanto el markdown como el PDF

---

**¡Buena suerte con tu informe!** 🎓✨
