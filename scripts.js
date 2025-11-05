// 5 juegos clásicos

document.addEventListener('DOMContentLoaded', ()=>{
  initParticles();
  // enlazar botones "Jugar"
  document.querySelectorAll('.play-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const game = b.dataset.start;
      // usar GameController para asegurar control central
      if(window.GameController && typeof window.GameController.start === 'function') window.GameController.start(game);
      else startGame(game);
    });
  });
  // botones detener
  document.querySelectorAll('.stop-btn').forEach(b=>{
    b.addEventListener('click', ()=>{
      const game = b.dataset.stop;
      if(window.GameController && typeof window.GameController.stop === 'function') window.GameController.stop(game);
      else {
        // fallback: intentar llamar al stop expuesto si existe
        const s = window['__'+game+'_stop']; if(typeof s==='function') s();
      }
    });
  });
  // configurar toggle de tema (oscuro/claro)
  const themeBtn = document.getElementById('theme-toggle');
  function applyTheme(t){
    if(t==='light'){ document.documentElement.classList.add('light'); themeBtn.textContent='Claro'; }
    else { document.documentElement.classList.remove('light'); themeBtn.textContent='Oscuro'; }
  }
  const saved = localStorage.getItem('retro-theme') || 'dark';
  applyTheme(saved);
  themeBtn.addEventListener('click', ()=>{
    const cur = document.documentElement.classList.contains('light') ? 'light' : 'dark';
    const next = cur==='light' ? 'dark' : 'light';
    localStorage.setItem('retro-theme', next);
    applyTheme(next);
  });
});

function startGame(name){
  // Dispatcher: inicia el juego indicado por nombre (usado por los botones de la UI)
  if(name==='snake') initSnake();
  if(name==='pong') initPong();
  if(name==='breakout') initBreakout();
  if(name==='flappy') initFlappy();
  if(name==='simon') initSimon();
}

/* -------------------- PARTÍCULAS -------------------- */
function initParticles(){
  const c = document.createElement('canvas');
  c.className='particle-canvas';
  document.body.appendChild(c);
  const ctx = c.getContext('2d');
  function resize(){ c.width = innerWidth; c.height = innerHeight; }
  addEventListener('resize', resize); resize();
  const particles = [];
  // más partículas, ligeramente más grandes y brillantes para mayor visibilidad
  for(let i=0;i<220;i++) particles.push({x:Math.random()*c.width,y:Math.random()*c.height,vx:(Math.random()-0.5)*0.6,vy:(Math.random()-0.5)*0.6,size:Math.random()*3+1.2, hue: Math.random()*360, a: 0.85});
  function loop(){
    ctx.clearRect(0,0,c.width,c.height);
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x=c.width; if(p.x>c.width) p.x=0;
      if(p.y<0) p.y=c.height; if(p.y>c.height) p.y=0;
  // usar HSLA con alfa para que destaquen
  ctx.fillStyle = `hsla(${p.hue}, 85%, 60%, ${p.a})`;
  // dibujar cuadrados de píxel ligeramente más grandes
  ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.ceil(p.size), Math.ceil(p.size));
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* -------------------- SERPIENTE (SNAKE) -------------------- */
function initSnake(){
  const canvas = document.getElementById('canvas-snake');
  const ctx = canvas.getContext('2d');
  const grid = 20; // tamaño de celda
  const cols = Math.floor(canvas.width / grid);
  const rows = Math.floor(canvas.height / grid);
  let interval = null;
  let snake, dir, apple, score;

  function randPos(){ return {x:Math.floor(Math.random()*cols), y:Math.floor(Math.random()*rows)} }

  function start(){
    snake = [{x:5,y:5}]; dir={x:1,y:0}; apple = randPos(); score=0; updateScore();
    document.addEventListener('keydown', keyHandler);
    if(interval) clearInterval(interval);
    interval = setInterval(loop,100);
  }
  function stop(){ document.removeEventListener('keydown', keyHandler); if(interval) clearInterval(interval); }
  // exponer stop para control externo
  window.__snake_stop = stop;

  function keyHandler(e){
    if(e.key==='ArrowUp' || e.key==='w') dir={x:0,y:-1};
    if(e.key==='ArrowDown' || e.key==='s') dir={x:0,y:1};
    if(e.key==='ArrowLeft' || e.key==='a') dir={x:-1,y:0};
    if(e.key==='ArrowRight' || e.key==='d') dir={x:1,y:0};
  }

  function updateScore(){ const el = document.getElementById('score-snake'); if(el) el.textContent = 'Puntaje: '+score }

  function loop(){
    const head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};
    head.x = (head.x+cols)%cols; head.y = (head.y+rows)%rows;
    if(snake.some(s=>s.x===head.x && s.y===head.y)){
      // fin de la partida: reiniciar
      stop(); setTimeout(start,700); return;
    } else {
      snake.unshift(head);
      if(head.x===apple.x && head.y===apple.y){ apple=randPos(); score+=10; updateScore(); }
      else snake.pop();
    }
  // dibujar
    ctx.fillStyle='#001216'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#ff4d4d'; ctx.fillRect(apple.x*grid, apple.y*grid, grid, grid);
    ctx.fillStyle='#4de6ff';
    snake.forEach((s,i)=>{ ctx.fillRect(s.x*grid, s.y*grid, grid-2, grid-2); if(i===0){ ctx.strokeStyle='#ff4da6'; ctx.strokeRect(s.x*grid, s.y*grid, grid-2, grid-2); } });
  }

  
  window.__snake_start = start;
  // boton de start
  start();
}

/* -------------------- PONG -------------------- */
function initPong(){
  const canvas = document.getElementById('canvas-pong');
  const ctx = canvas.getContext('2d');
  const paddleH=60, paddleW=8;
  let leftY, rightY, ball, interval, scoreLeft, scoreRight;

  function start(){
    leftY = canvas.height/2 - paddleH/2; rightY = leftY;
    ball = {x:canvas.width/2,y:canvas.height/2, vx:3, vy:2, r:6}; scoreLeft=0; scoreRight=0; updateScore();
    document.addEventListener('keydown', keyHandler);
    interval = setInterval(loop,16);
  }
  function stop(){ document.removeEventListener('keydown', keyHandler); if(interval) clearInterval(interval); }
  window.__pong_stop = stop;
  // keyHandler actualizado: W/S controlan la paleta izquierda;
  // ahora las teclas '8' y '2' (incluyendo Numpad8/Numpad2) controlan la paleta derecha.
  function keyHandler(e){
    // paleta izquierda: W/S (minúsculas o mayúsculas)
    if(e.key==='w' || e.key==='W') leftY-=12;
    if(e.key==='s' || e.key==='S') leftY+=12;
    // paleta derecha: teclas numéricas 8 (arriba) y 2 (abajo) o sus códigos Numpad
    if(e.key==='8' || e.code==='Numpad8') rightY-=12;
    if(e.key==='2' || e.code==='Numpad2') rightY+=12;
  }
  function updateScore(){ const el = document.getElementById('score-pong'); if(el) el.textContent = 'Puntaje: '+(scoreLeft+scoreRight); }

  function loop(){
    ball.x += ball.vx; ball.y += ball.vy;
    if(ball.y<ball.r || ball.y>canvas.height-ball.r) ball.vy *= -1;
    if(ball.x - ball.r < paddleW){ if(ball.y > leftY && ball.y < leftY + paddleH) ball.vx *= -1; else { scoreRight++; updateScore(); reset(); } }
    if(ball.x + ball.r > canvas.width - paddleW){ if(ball.y > rightY && ball.y < rightY + paddleH) ball.vx *= -1; else { scoreLeft++; updateScore(); reset(); } }
    ctx.fillStyle='#001216'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#4de6ff'; ctx.fillRect(0,leftY,paddleW,paddleH); ctx.fillRect(canvas.width-paddleW,rightY,paddleW,paddleH);
    ctx.fillStyle='#ff4d4d'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
  }
  function reset(){ ball.x=canvas.width/2; ball.y=canvas.height/2; ball.vx = -ball.vx; ball.vy = (Math.random()*4-2); }

  window.__pong_start = start; start();
}

/* -------------------- BREAKOUT -------------------- */
function initBreakout(){
  const canvas = document.getElementById('canvas-breakout');
  const ctx = canvas.getContext('2d');
  const paddleW=70,paddleH=10; let paddleX, ball, bricks, interval, score;
  const brickRowCount=4, brickColCount=6;

  function buildBricks(){ bricks=[]; for(let c=0;c<brickColCount;c++){ bricks[c]=[]; for(let r=0;r<brickRowCount;r++) bricks[c][r]={x:0,y:0,status:1}; } }
  function start(){ paddleX = (canvas.width-paddleW)/2; ball={x:canvas.width/2,y:canvas.height-30,vx:3,vy:-3,r:6}; buildBricks(); score=0; updateScore(); document.addEventListener('keydown', keyHandler); interval=setInterval(loop,16); }
  function stop(){ document.removeEventListener('keydown', keyHandler); if(interval) clearInterval(interval); }
  window.__breakout_stop = stop;
  function keyHandler(e){ if(e.key==='ArrowLeft') paddleX-=20; if(e.key==='ArrowRight') paddleX+=20; }
  function updateScore(){ const el = document.getElementById('score-breakout'); if(el) el.textContent='Puntaje: '+score }

  function drawBricks(){ const brickW = 54, brickH=18, padding=8, offsetTop=30, offsetLeft=18; for(let c=0;c<brickColCount;c++){ for(let r=0;r<brickRowCount;r++){ const b=bricks[c][r]; if(b.status){ const bx=c*(brickW+padding)+offsetLeft; const by=r*(brickH+padding)+offsetTop; b.x=bx; b.y=by; ctx.fillStyle='#4de6ff'; ctx.fillRect(bx,by,brickW,brickH); ctx.strokeStyle='#001216'; ctx.strokeRect(bx,by,brickW,brickH); } } } }

  function loop(){ ball.x += ball.vx; ball.y += ball.vy; if(ball.x<ball.r || ball.x>canvas.width-ball.r) ball.vx*=-1; if(ball.y<ball.r) ball.vy*=-1; if(ball.y>canvas.height-ball.r){ if(ball.x > paddleX && ball.x < paddleX + paddleW) ball.vy*=-1; else { stop(); setTimeout(start,600); return; } }
    for(let c=0;c<brickColCount;c++) for(let r=0;r<brickRowCount;r++){ const b=bricks[c][r]; if(b.status){ if(ball.x > b.x && ball.x < b.x+54 && ball.y > b.y && ball.y < b.y+18){ ball.vy*=-1; b.status=0; score+=5; updateScore(); } } }
    ctx.fillStyle='#001216'; ctx.fillRect(0,0,canvas.width,canvas.height); drawBricks(); ctx.fillStyle='#39ff14'; ctx.fillRect(paddleX,canvas.height-paddleH-8,paddleW,paddleH); ctx.fillStyle='#ff4d4d'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
  }

  window.__breakout_start = start; start();
}

/* -------------------- FLAPPY (simple) -------------------- */
function initFlappy(){
  const canvas = document.getElementById('canvas-flappy');
  const ctx = canvas.getContext('2d');
  let bird, gravity, flap, pipes, tick, interval, score;

  function spawnPipe(){ const gap=90; const top = Math.random()*(canvas.height-160)+20; pipes.push({x:canvas.width,y:0,h:top}); pipes.push({x:canvas.width,y:top+gap,h:canvas.height-(top+gap)}); }
  function start(){ bird={x:80,y:150,vy:0}; gravity=0.5; flap=-8; pipes=[]; tick=0; score=0; updateScore(); canvas.addEventListener('click', clickHandler); document.addEventListener('keydown', keyHandler); interval=setInterval(loop,20); }
  function stop(){ canvas.removeEventListener('click', clickHandler); document.removeEventListener('keydown', keyHandler); if(interval) clearInterval(interval); }
  window.__flappy_stop = stop;
  function clickHandler(){ bird.vy = flap; }
  function keyHandler(e){ if(e.code==='Space') bird.vy = flap; }
  function updateScore(){ const el = document.getElementById('score-flappy'); if(el) el.textContent = 'Puntaje: '+score }

  function loop(){ tick++; bird.vy += gravity; bird.y += bird.vy; if(tick%90===0) spawnPipe(); for(let i=pipes.length-1;i>=0;i--){ pipes[i].x -=3; if(pipes[i].x+50<0) pipes.splice(i,1); }
  // comprobación simple de colisiones
  if(bird.y>canvas.height || bird.y<0){ stop(); setTimeout(start,700); return; }
    for(const p of pipes){ if(bird.x > p.x && bird.x < p.x+50 && (bird.y < p.h || bird.y > p.h && bird.y < p.y + p.h) ){} }
  // incrementar puntaje cuando las tuberías (par) pasan al pájaro
  pipes.forEach(p=>{ if(!p._scored && p.x + 50 < bird.x && p.y===0){ score++; p._scored=true; updateScore(); } });
    ctx.fillStyle='#001216'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#ff4d4d'; ctx.beginPath(); ctx.arc(bird.x,bird.y,10,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#4de6ff'; pipes.forEach(p=>ctx.fillRect(p.x,p.y,50,p.h));
  }

  window.__flappy_start = start; start();
}

/* -------------------- SIMON -------------------- */
function initSimon(){
  const board = document.getElementById('simon-board');
  const buttons = Array.from(board.querySelectorAll('.simon-btn'));
  let seq=[]; let idx=0; let playing=false; let round=0;

  function flash(i){ const btn = buttons[i]; const orig = btn.style.filter; btn.style.filter='brightness(1.7)'; setTimeout(()=>btn.style.filter=orig,350); }
  function updateRound(){ const el = document.getElementById('score-simon'); if(el) el.textContent='Ronda: '+round }

  function playSequence(){ playing=true; idx=0; let i=0; const t = setInterval(()=>{ if(i>=seq.length){ clearInterval(t); playing=false; return; } flash(seq[i]); i++; },600); }
  function nextRound(){ seq.push(Math.floor(Math.random()*buttons.length)); round=seq.length; updateRound(); playSequence(); }

  // attach handlers with references so we can remove them on stop
  let playTimer = null;
  function playSequence(){ playing=true; idx=0; let i=0; if(playTimer) clearInterval(playTimer); playTimer = setInterval(()=>{ if(i>=seq.length){ clearInterval(playTimer); playTimer=null; playing=false; return; } flash(seq[i]); i++; },600); }
  function handlerFactory(i){ return function onClick(){ if(playing) return; flash(i); if(i!==seq[idx]){ seq=[]; round=0; updateRound(); setTimeout(nextRound,800); return; } idx++; if(idx===seq.length) setTimeout(nextRound,600); } }
  buttons.forEach((b,i)=>{ const h = handlerFactory(i); b._simonHandler = h; b.addEventListener('click', h); });

  function stop(){ // detener Simon: limpiar secuencia y listeners
    seq=[]; round=0; updateRound(); playing=false; if(playTimer){ clearInterval(playTimer); playTimer=null; }
    buttons.forEach(b=>{ if(b._simonHandler) b.removeEventListener('click', b._simonHandler); delete b._simonHandler; });
  }

  window.__simon_start = ()=>{ seq=[]; round=0; updateRound(); setTimeout(nextRound,400); };
  window.__simon_stop = stop;
  // iniciar juego (Simon)
  window.__simon_start();
}

  /* -------------------- CONTROLADOR GLOBAL DE JUEGOS -------------------- */
  (function(){
    const games = ['snake','pong','breakout','flappy','simon'];
    let current = null;
    // Handler para prevenir el scroll de la página mientras se juega
    function preventScrollHandler(e){
      // no interferir si el foco está en un input/textarea o elemento editable
      const t = e.target;
      if(t && (t.tagName==='INPUT' || t.tagName==='TEXTAREA' || t.isContentEditable)) return;
      const k = e.key || e.code || '';
      // teclas que suelen desplazar la página: flechas y espacio
      if(k === 'ArrowUp' || k === 'ArrowDown' || k === 'ArrowLeft' || k === 'ArrowRight' || k === ' ' || k === 'Space' || k === 'Spacebar'){
        e.preventDefault();
      }
    }

    function stopGame(name){
      if(!name) name = current;
      if(!name) return Promise.resolve();
      return new Promise((resolve)=>{
        const fn = window['__'+name+'_stop'];
        if(typeof fn==='function'){
          try{ fn(); }catch(e){}
        }
        // remover handler global de prevención de scroll
        try{ document.removeEventListener('keydown', preventScrollHandler, true); }catch(e){}
        // small timeout to ensure cleanup
        setTimeout(()=>{ if(current===name) current=null; resolve(); },80);
      });
    }

    function startGameByName(name){
      return stopGame().then(()=>{
        const fn = window['__'+name+'_start'];
        // Si no existe la función de inicio expuesta (__<name>_start),
        // intentar invocar el despachador global `startGame(name)`
        // que crea/inyecta e inicia la instancia del juego.
        if(typeof fn==='function'){
          try{ fn(); current = name; }
          catch(e){ console.error('Error al iniciar',name,e); }
        } else if(typeof window.startGame === 'function'){
          try{
            // Llamar al despachador global que invoca init<game>() internamente
            window.startGame(name);
            current = name;
          } catch(e){ console.error('Error al iniciar mediante startGame dispatcher', name, e); }
        } else {
          console.warn('No existe mecanismo para iniciar el juego:', name);
        }
        // registrar handler global que evita scroll causado por teclas de juego
        try{ document.addEventListener('keydown', preventScrollHandler, true); }catch(e){ }
      });
    }

    window.GameController = {
      start(name){ if(!games.includes(name)) return Promise.reject(new Error('Juego desconocido')); return startGameByName(name); },
      stop(name){ return stopGame(name); },
      current(){ return current; }
    };
  })();
