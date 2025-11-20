# Importar schema.sql a una base MySQL (Railway) desde PowerShell
# Uso: Ejecuta este script desde la raíz del repo en PowerShell (no en ISE)
# Ejemplo: .\scripts\import_schema.ps1

param(
    [string]$Host = "shinkansen.proxy.rlwy.net",
    [int]$Port = 15275,
    [string]$User = "root",
    [string]$Database = "railway",
    [string]$SchemaPath = "server/sql/schema.sql"
)

Write-Host "Archivo de esquema: $SchemaPath"
if (-not (Test-Path $SchemaPath)) {
    Write-Error "No se encontró el archivo: $SchemaPath"
    exit 2
}

# Pedir contraseña de forma segura
$securePwd = Read-Host -Prompt "Contraseña para $User@$Host (se pedirá además si usa Docker)" -AsSecureString
# Convertir a texto para pasar al comando (solo en este proceso local)
$ptr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePwd)
$plainPwd = [Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)

# Comprobar si hay cliente mysql en PATH
$mysqlCmd = Get-Command mysql -ErrorAction SilentlyContinue
if ($mysqlCmd) {
    Write-Host "Se encontró cliente 'mysql' en PATH: $($mysqlCmd.Path)"
    $escapedPath = $SchemaPath -replace '"','\"'
    $cmd = "mysql -h $Host -P $Port -u $User -p$plainPwd $Database < \"$escapedPath\""
    Write-Host "Ejecutando importación con cliente local..."
    # Ejecutar vía cmd.exe para que la redirección '<' funcione correctamente
    $processInfo = & cmd.exe /c $cmd
    $exit = $LASTEXITCODE
    if ($exit -eq 0) {
        Write-Host "Importación completada con éxito."
        exit 0
    } else {
        Write-Warning "El cliente mysql devolvió código de salida $exit. Salida: $processInfo"
        Write-Warning "Intentaremos la vía Docker (fallback)."
    }
} else {
    Write-Host "No se encontró el cliente 'mysql' en PATH. Intentaremos Docker como fallback."
}

# Fallback: usar Docker (requiere Docker instalado y en ejecución)
$dockerCmd = Get-Command docker -ErrorAction SilentlyContinue
if (-not $dockerCmd) {
    Write-Error "Docker no está instalado o no está en PATH. Instala MySQL client o Docker y vuelve a intentarlo."
    exit 3
}

# Normalizar rutas para montar en Docker
$schemaFull = (Resolve-Path $SchemaPath).Path
$schemaDir = Split-Path $schemaFull -Parent
$schemaBase = Split-Path $schemaFull -Leaf

Write-Host "Usando Docker para ejecutar cliente mysql (se abrirá prompt para la contraseña dentro del contenedor)."
Write-Host "Montando: $schemaDir -> /sql"

# Construir comando Docker (interactive) - el contenedor pedirá la contraseña
$dockerRun = @(
    'run','-it','--rm',
    '-v',"$schemaDir:/sql",
    'mysql:8.0',
    'sh','-c',"mysql -h $Host -P $Port -u $User -p $Database < /sql/$schemaBase"
)

# Ejecutar Docker
$proc = Start-Process -FilePath docker -ArgumentList $dockerRun -NoNewWindow -Wait -PassThru
if ($proc.ExitCode -eq 0) {
    Write-Host "Importación (Docker) completada con éxito."
    exit 0
} else {
    Write-Error "La importación con Docker falló (exit $($proc.ExitCode)). Revisa network/credenciales y vuelve a intentarlo."
    exit $proc.ExitCode
}
