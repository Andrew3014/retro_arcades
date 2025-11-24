# Script de Verificación del Despliegue

Este script valida que backend y base de datos estén funcionando correctamente.

## Uso

```powershell
# Reemplaza <URL> con tu dominio Railway
$backendUrl = "https://<tu-backend>.railway.app"

# Luego ejecuta:
.\scripts\verificacion.ps1 -BackendUrl $backendUrl
```

## Pasos Incluidos

1. Prueba conexión a `/health`.
2. Obtiene listado de juegos.
3. Verifica estructura de datos.
4. Reporta errores específicos.

---

## Alternativa: Verificación Manual (PowerShell)

```powershell
$url = "https://<tu-backend>.railway.app"

# Test 1: Health check
Write-Host "Test 1: Health Check..."
Invoke-RestMethod -Uri "$url/health" -Method Get
Write-Host "✓ Backend está en línea`n"

# Test 2: Listar juegos
Write-Host "Test 2: Listar Juegos..."
$games = Invoke-RestMethod -Uri "$url/games" -Method Get
Write-Host "✓ Se encontraron $($games.Count) juegos:"
$games | ForEach-Object { Write-Host "  - $($_.title) ($($_.slug))" }
Write-Host ""

# Test 3: Rankings (si hay datos)
Write-Host "Test 3: Rankings de Snake..."
$rankings = Invoke-RestMethod -Uri "$url/games/snake/rankings" -Method Get
Write-Host "✓ Se encontraron $($rankings.Count) puntajes en el ranking"
Write-Host ""

Write-Host "✅ Backend verificado correctamente!"
```

## Verificación desde Navegador

1. Abre DevTools (F12).
2. Ve a pestaña Network.
3. Recarga la página.
4. Busca request a `/games` → debe devolver status 200 y un JSON con juegos.

Si ves errores de CORS o 500, revisar logs en Railway.
