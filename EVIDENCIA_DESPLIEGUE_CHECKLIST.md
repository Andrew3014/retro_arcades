# 📸 Checklist de Evidencia - Despliegue CI/CD

Este documento te ayuda a organizar todas las capturas de pantalla necesarias para completar el informe `PLAN_PRUEBAS_DESPLIEGUE_CICD.md`.

---

## 📋 Sección 6: Despliegue en Vercel

### ✅ CAPTURA 1: Build Exitoso
**Ubicación en Informe:** Sección 6.1 - Preparación del Código

**Qué capturar:**
- Terminal con salida de `npm run build`
- Mostrar líneas finales con:
  - ✓ 1702 modules transformed
  - ✓ built in 4.13s
  - Tamaño: 112.25 kB (gzip)

**Comando a ejecutar:**
```bash
npm run build
```

**Dónde guardar:** `capturas/01_build_exitoso.png`

---

### ✅ CAPTURA 2: Repositorio GitHub Conectado a Vercel
**Ubicación en Informe:** Sección 6.2 - Conexión con GitHub

**Qué capturar:**
- Dashboard de Vercel mostrando proyecto "retro-arcades"
- Línea que diga "Connected to GitHub - Andrew3014/retro_arcades"
- Mostrar rama main

**Pasos:**
1. Ir a https://vercel.com
2. Click en tu proyecto "retro-arcades"
3. Ir a pestaña "Settings"
4. Buscar "Git Connections"

**Dónde guardar:** `capturas/02_github_conectado.png`

---

### ✅ CAPTURA 3: Variables de Entorno en Vercel
**Ubicación en Informe:** Sección 6.3 - Configuración en Vercel

**Qué capturar:**
- Dashboard Vercel → Settings → Environment Variables
- Mostrar:
  - VITE_API_URL: [valor]
  - Las variables están activas

**Pasos:**
1. https://vercel.com
2. Proyecto "retro-arcades"
3. Settings → Environment Variables
4. Capturar pantalla (puedes ocultar valores sensibles con pixelate)

**Dónde guardar:** `capturas/03_variables_entorno.png`

---

### ✅ CAPTURA 4: Commit que Trigger Deploy
**Ubicación en Informe:** Sección 6.4 - Despliegue Automático

**Qué capturar:**
- GitHub mostrando último commit en main
- Vercel mostrado el deploy en progreso o completado
- Línea de tiempo mostrando: "Commit triggered deploy"

**Pasos:**
1. https://github.com/Andrew3014/retro_arcades
2. Ver últimos commits (debe mostrar "Vite" o último commit)
3. En Vercel, ver pestaña "Deployments" mostrando que se trigger

**Dónde guardar:** `capturas/04_commit_trigger_deploy.png`

---

### ✅ CAPTURA 5: Vercel Analytics Dashboard
**Ubicación en Informe:** Sección 6.6 - Monitoreo Post-Deploy

**Qué capturar:**
- Vercel dashboard mostrando:
  - Status: ✅ Ready
  - Build time: 45 segundos
  - Build logs: "Successfully deployed"
  - Performance metrics visible

**Pasos:**
1. https://vercel.com
2. Proyecto "retro-arcades"
3. Pestaña "Deployments"
4. Click en último deployment
5. Capturar resumen

**Dónde guardar:** `capturas/05_vercel_analytics.png`

---

## 📋 Sección 7: Validación Post-Despliegue

### ✅ CAPTURA 6: URL Live en Navegador
**Ubicación en Informe:** Sección 7.1 - Pruebas en URL Live

**Qué capturar:**
- Navegador mostrando https://retro-arcades.vercel.app
- Página de inicio completa cargada
- Mostrar navbar, footer, botones visibles
- URL visible en barra de direcciones

**Pasos:**
1. Abrir Chrome/Firefox
2. Navegar a https://retro-arcades.vercel.app
3. Esperar a que cargue completamente
4. Capturar pantalla completa

**Dónde guardar:** `capturas/06_app_live.png`

---

### ✅ CAPTURA 7: Registro Exitoso - Mensaje Verde
**Ubicación en Informe:** Sección 7.2.1 - Autenticación

**Qué capturar:**
- Modal de registro con mensaje de éxito en VERDE
- Texto: "✅ Registro exitoso! Bienvenido [nombre_usuario]"
- O pantalla redirigida mostrando usuario logueado

**Pasos:**
1. https://retro-arcades.vercel.app
2. Click "Registrarse"
3. Llenar formulario con datos nuevos
4. Click "Registrarse"
5. Capturar mensaje de éxito verde

**Dónde guardar:** `capturas/07_registro_exitoso.png`

---

### ✅ CAPTURA 8: Error de Validación - Mensaje Rojo
**Ubicación en Informe:** Sección 7.2.1 - Autenticación (Validación)

**Qué capturar:**
- Modal mostrando error en ROJO
- Ejemplo: "❌ La contraseña debe tener al menos 6 caracteres"
- O: "❌ El correo ya está registrado"

**Pasos:**
1. https://retro-arcades.vercel.app
2. Click "Registrarse"
3. Llenar email mal formado O contraseña < 6 caracteres
4. Click "Registrarse"
5. Capturar mensaje de error rojo

**Dónde guardar:** `capturas/08_validacion_error.png`

---

### ✅ CAPTURA 9: Juego Funcionando - Snake
**Ubicación en Informe:** Sección 7.2.2 - Jugar Snake

**Qué capturar:**
- Página de Snake con:
  - Canvas del juego visible
  - Serpiente en pantalla
  - Puntuación actual
  - Botones de control (en móvil) o texto "Usa flechas"
  - Sección de rankings visible

**Pasos:**
1. Loguear si es necesario
2. Click en "SNAKE"
3. Hacer que la serpiente se mueva
4. Capturar en mitad del juego

**Dónde guardar:** `capturas/09_snake_jugando.png`

---

### ✅ CAPTURA 10: Nuevo Récord - Modal
**Ubicación en Informe:** Sección 7.2.2 - Guardar Puntaje

**Qué capturar:**
- Modal mostrando "¡NUEVO RÉCORD!"
- Puntaje mostrado
- Campo para ingresar nombre en ranking
- Botón "Guardar"

**Pasos:**
1. Jugar Snake rápidamente y perder
2. Si el puntaje entra en top 50, mostrará modal
3. Capturar modal

**Alternativa:** Si no logras nuevo récord, captura el modal de "Partida Terminada" normalmente

**Dónde guardar:** `capturas/10_nuevo_record.png`

---

### ✅ CAPTURA 11: Rankings Page
**Ubicación en Informe:** Sección 7.2.3 - Rankings

**Qué capturar:**
- Página de Rankings mostrando:
  - Top 50 por juego
  - Tabla sin desorden visual
  - Responsive (sin scroll horizontal)
  - Filtros por juego

**Pasos:**
1. https://retro-arcades.vercel.app
2. Click en "RANKINGS"
3. Seleccionar un juego (ej: Snake)
4. Capturar tabla completa

**Dónde guardar:** `capturas/11_rankings.png`

---

### ✅ CAPTURA 12: Panel Admin
**Ubicación en Informe:** Sección 7.2.4 - Panel Admin

**Qué capturar:**
- Panel Admin mostrando:
  - 🔧 PANEL ADMIN título
  - Estadísticas en tarjetas
  - Secciones: Comentarios, Reportes, Puntajes
  - Tabla de datos visible
  - Botones de acción (Editar, Eliminar)

**Pasos:**
1. Loguear como admin (andrew@gmail.com / andrew2025)
2. Click en avatar → "Panel Admin"
3. Capturar panel completo

**Dónde guardar:** `capturas/12_admin_panel.png`

---

## 📱 Sección Móvil - Responsividad

### ✅ CAPTURA 13: Aplicación en Móvil (375px)
**Ubicación en Informe:** Sección 7.3 - Pruebas en Móvil Real

**Qué capturar:**
- Pantalla de móvil real O DevTools emulado
- Navegación funcional
- Botones al 48px mínimo
- Sin scroll horizontal

**Pasos - Opción 1 (Móvil Real):**
1. Abrir https://retro-arcades.vercel.app en celular físico
2. Capturar pantalla

**Pasos - Opción 2 (DevTools):**
1. Chrome → F12 → Toggle device toolbar
2. Seleccionar iPhone SE (375px)
3. Capturar pantalla

**Dónde guardar:** `capturas/13_mobile_375px.png`

---

### ✅ CAPTURA 14: Juego en Móvil - Controles Visibles
**Ubicación en Informe:** Sección 7.3 - Pruebas en Móvil Real

**Qué capturar:**
- Juego funcionando en móvil
- Botones de control táctiles visibles
- Canvas responsive (llena ancho disponible)
- Sin solapamiento de controles

**Pasos:**
1. Móvil o DevTools 375px
2. Abrir juego (Snake/Pong/Tetris)
3. Capturar mostrando controles

**Dónde guardar:** `capturas/14_mobile_controles.png`

---

### ✅ CAPTURA 15: AdminPage en Móvil
**Ubicación en Informe:** Sección 7.3 - Responsividad

**Qué capturar:**
- Panel Admin en 375px ancho
- Elementos responsive
- Texto no se solapa
- Secciones apiladas verticalmente

**Pasos:**
1. Móvil o DevTools 375px
2. Loguear como admin
3. Abrir Panel Admin
4. Capturar sección (puede ser scroll)

**Dónde guardar:** `capturas/15_admin_mobile.png`

---

## ⚡ Sección Performance

### ✅ CAPTURA 16: DevTools Performance Metrics
**Ubicación en Informe:** Sección 7.4 - Pruebas de Carga

**Qué capturar:**
- DevTools → Lighthouse
- Mostrar:
  - FCP (First Contentful Paint)
  - LCP (Largest Contentful Paint)
  - CLS (Cumulative Layout Shift)
  - TTI (Time to Interactive)

**Pasos:**
1. https://retro-arcades.vercel.app en Chrome
2. F12 → Lighthouse
3. Click "Analyze page load"
4. Esperar 30-60 segundos
5. Capturar resultados

**Dónde guardar:** `capturas/16_lighthouse_metrics.png`

---

### ✅ CAPTURA 17: Console sin Errores
**Ubicación en Informe:** Sección 7.1 - Validación

**Qué capturar:**
- DevTools → Console
- Mostrar que NO hay errores (ej: rojo warnings)
- Puede haber warnings amarillos, pero NO errores

**Pasos:**
1. https://retro-arcades.vercel.app
2. F12 → Console
3. Recargar página (F5)
4. Capturar mostrando console limpia

**Dónde guardar:** `capturas/17_console_limpia.png`

---

## 📊 Resumen de Capturas Necesarias

| # | Descripción | Sección | Archivo |
|---|---|---|---|
| 1️⃣ | npm run build exitoso | 6.1 | `01_build_exitoso.png` |
| 2️⃣ | GitHub conectado a Vercel | 6.2 | `02_github_conectado.png` |
| 3️⃣ | Variables de entorno | 6.3 | `03_variables_entorno.png` |
| 4️⃣ | Commit trigger deploy | 6.4 | `04_commit_trigger_deploy.png` |
| 5️⃣ | Vercel Analytics | 6.6 | `05_vercel_analytics.png` |
| 6️⃣ | App live en navegador | 7.1 | `06_app_live.png` |
| 7️⃣ | Registro exitoso ✅ | 7.2.1 | `07_registro_exitoso.png` |
| 8️⃣ | Error de validación ❌ | 7.2.1 | `08_validacion_error.png` |
| 9️⃣ | Juego funcionando | 7.2.2 | `09_snake_jugando.png` |
| 🔟 | Nuevo récord modal | 7.2.2 | `10_nuevo_record.png` |
| 1️⃣1️⃣ | Rankings page | 7.2.3 | `11_rankings.png` |
| 1️⃣2️⃣ | Panel Admin | 7.2.4 | `12_admin_panel.png` |
| 1️⃣3️⃣ | Móvil 375px | 7.3 | `13_mobile_375px.png` |
| 1️⃣4️⃣ | Juego en móvil | 7.3 | `14_mobile_controles.png` |
| 1️⃣5️⃣ | AdminPage móvil | 7.3 | `15_admin_mobile.png` |
| 1️⃣6️⃣ | Lighthouse metrics | 7.4 | `16_lighthouse_metrics.png` |
| 1️⃣7️⃣ | Console limpia | 7.1 | `17_console_limpia.png` |

**Total: 17 capturas**

---

## 🎯 Instrucciones Finales

### Paso 1: Crear carpeta para capturas
```bash
# En PowerShell
New-Item -ItemType Directory -Path "capturas" -Force
```

### Paso 2: Tomar las capturas en orden

1. Empezar con capturas técnicas (1-5): Build, Deploy
2. Luego validar en URL (6): App live
3. Funcionalidad (7-12): Auth, Games, Rankings, Admin
4. Responsividad (13-15): Mobile
5. Performance (16-17): Lighthouse y console

### Paso 3: Organizar capturas
- Guardar todas en carpeta `capturas/`
- Nombres descriptivos: `01_build_exitoso.png`, etc.
- Formato: PNG o JPG
- Calidad: Sin compresión excesiva

### Paso 4: Referencia en Informe

En el documento `PLAN_PRUEBAS_DESPLIEGUE_CICD.md`, buscar:
```
**CAPTURA REQUERIDA:** Screenshot de [algo]
```

Reemplazar con:
```markdown
**CAPTURA REQUERIDA:** Screenshot de [algo]
[Insertar imagen: ![](../capturas/XX_descripcion.png)]
```

---

## ✅ Verificación Final

Antes de entregar:
- [ ] Todas las 17 capturas tomadas
- [ ] Guardadas en carpeta `capturas/`
- [ ] Nombres consistentes (XX_descripcion.png)
- [ ] Calidad aceptable (legible)
- [ ] Referencias en informe
- [ ] PDF generado con imágenes incrustadas

---

**Nota:** Las capturas son evidencia de que:
1. ✅ La aplicación se compiló correctamente
2. ✅ Se deployó en Vercel con CI/CD automático
3. ✅ Funciona en producción
4. ✅ Es responsiva en móvil
5. ✅ No tiene errores
6. ✅ Tiene buen rendimiento

¡Buena suerte! 🚀
