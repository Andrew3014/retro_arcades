# Diagramas C4

Esta carpeta contiene los diagramas C4 para el proyecto Retro Arcade en formato PlantUML (.puml).

Archivos:

- `context.puml` – Diagrama de contexto (nivel 1)
- `container.puml` – Diagrama de contenedores (nivel 2)
- `component.puml` – Diagrama de componentes (nivel 3)
- `code.puml` – Diagrama de código / implementación sugerida (nivel 4)

Cómo renderizar:

1. Instala la extensión PlantUML en VSCode y Graphviz si quieres render localmente.
2. Abre cualquier `.puml` y usa la vista previa para exportar a PNG/SVG.
3. Alternativamente, usa el servidor online de PlantUML: https://www.plantuml.com/plantuml - copia el contenido del `.puml` y pégalo en el servidor para obtener la imagen.

Uso con IA:

Si quieres acelerar, puedes pedir a la IA que genere variantes de estos `.puml` incluyendo más detalles (endpoints, props, o cambios en la arquitectura). Revisa siempre los resultados y corrige los nombres y relaciones.

Quick commands (Windows PowerShell):

```powershell
# Render con PlantUML CLI (requiere Java + plantuml.jar descargado)
# Descarga plantuml.jar desde https://plantuml.com/download
java -jar plantuml.jar -tpng .\docs\diagrams\*.puml

# O renderizar uno por uno y generar SVG
java -jar plantuml.jar -tsvg .\docs\diagrams\context.puml

# Alternativa: usar la extensión PlantUML de VSCode y el preview para exportar
```

Si quieres, puedo también generar SVG/PNG directamente aquí (si me confirmas), o generar variantes con más detalle por cada diagrama.
