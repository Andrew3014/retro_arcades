# Checklist de Responsividad Móvil

## ✅ Verificación en Móvil (375px - 390px)

### Página de Inicio
- [ ] Logo y título visibles sin overflow
- [ ] Las 3 tarjetas de juegos se apilan verticalmente
- [ ] Botones navegación pequeños pero legibles
- [ ] Sección "¿CÓMO FUNCIONA?" tiene texto legible
- [ ] Iconos emojis son visibles

### Página de Juego (Snake/Pong/Tetris)
- [ ] Canvas ocupa ~90% del ancho (con padding)
- [ ] Botón "Volver a inicio" está accesible
- [ ] Score/Stats se muestran correctamente
- [ ] Canvas es cuadrado/rectangular según juego

### Controles Táctiles
- [ ] Botones de 3rem x 3rem (48px)
- [ ] Espaciado suficiente entre botones
- [ ] Se puede tocar sin equivocarse
- [ ] Feedback visual al tocar (color cambia)
- [ ] Botón de pausa visible

### Mobile Controls Específicos
**Snake:**
- [ ] Dirección arriba en su posición
- [ ] Izq-Centro-Der en fila
- [ ] Pausar es ancho completo

**Pong:**
- [ ] 2 secciones claras (J1 y J2)
- [ ] Colores diferenciados (indigo y cyan)
- [ ] Etiquetas legibles

**Tetris:**
- [ ] Controles de mover en fila
- [ ] Rotar y Caer en fila inferior
- [ ] Stats (Puntos/Nivel/Líneas) visibles

### Rankings/Leaderboard
- [ ] Tabla horizontal scrollable
- [ ] Nombres/Scores legibles
- [ ] Posiciones números visibles

### Perfil de Usuario
- [ ] Información personal legible
- [ ] Juegos jugados en lista vertical
- [ ] Botón logout accesible

### Formularios (Login/Register)
- [ ] Inputs ocupan ancho disponible
- [ ] Labels pequeños pero legibles
- [ ] Botones grandes (~48px alto)
- [ ] Error messages en lugar visible

---

## ✅ Verificación Horizontal (Landscape)

### Snake Horizontal
- [ ] Canvas se reescala correctamente
- [ ] Controles todavía accesibles
- [ ] Mejor relación ancho/alto

### Pong Horizontal
- [ ] Canvas aprovecha espacio
- [ ] Controles dos filas si necesario
- [ ] Gameplay no afectado

### Tetris Horizontal
- [ ] Canvas visible sin scroll
- [ ] Stats en la parte superior
- [ ] Controles debajo o lado

---

## ✅ Verificación en Tablets (768px+)

### Layout General
- [ ] Sidebar aparece en GamePage
- [ ] Rankings tiene más columnas
- [ ] Mejor use del espacio

### Controles
- [ ] Botones pueden ser más grandes (56px)
- [ ] Más espacio entre elementos
- [ ] No hay overflow horizontal

---

## 🎮 Testing Gameplay

### Snake
- [ ] La serpiente se mueve suave
- [ ] No hay lag en Mobile Controls
- [ ] Game Over detectable
- [ ] Score se actualiza

### Pong
- [ ] Ambos jugadores pueden jugar
- [ ] Pelota rebota correctamente
- [ ] Contador de puntos funciona
- [ ] Winner detectable

### Tetris
- [ ] Piezas caen suavemente
- [ ] Rotación funciona táctil
- [ ] Líneas eliminadas correctamente
- [ ] Level aumenta

---

## 🌐 Navegadores a Probar

### Android
- [ ] Chrome Mobile (latest)
- [ ] Firefox Mobile
- [ ] Samsung Internet
- [ ] Opera Mobile

### iOS
- [ ] Safari Mobile
- [ ] Chrome iOS
- [ ] Firefox iOS

---

## 📸 Screenshots para Informe

Capturar:
1. [ ] Snake en móvil (portrait)
2. [ ] Pong en móvil (portrait)
3. [ ] Tetris en móvil (portrait)
4. [ ] Login en móvil
5. [ ] Rankings en móvil
6. [ ] Snake en tablet (landscape)

---

## 🐛 Problemas Encontrados

Describe aquí cualquier issue:
```
Problema:
Resolución:
Screenshot:
```

---

## ✨ Notas Adicionales

- Touch delay: ¿Hay lag?
- Colores: ¿Se ven bien en pantalla de móvil?
- Fuentes: ¿Legibles a distancia normal?
- Botones: ¿Suficientemente grandes?

