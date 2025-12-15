// Constants
const TILE_SIZE = 40;
const GRAVITY = 0.55;
const FRICTION = 0.82;
const MOVE_ACCEL = 0.6;
const MAX_SPEED = 7.5;
const JUMP_FORCE = -13.5;
const BOUNCE_FORCE = -7;

// Enums as objects
const TileType = {
  EMPTY: 0,
  GROUND: 1,
  BRICK: 2,
  QUESTION_BLOCK: 3,
  PIPE_LEFT: 4,
  PIPE_RIGHT: 5,
  PLATFORM: 6,
  USED_BLOCK: 7,
  GOAL: 99
};

const EntityType = {
  PLAYER: 'PLAYER',
  GOOMBA: 'GOOMBA',
  COIN: 'COIN'
};

const GameState = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
  GAME_WON: 'GAME_WON',
  VICTORY: 'VICTORY'
};

// Level Generator
function generateLevel(levelIndex) {
  const createLevel = (width, height, theme) => {
    const tiles = Array(height).fill(0).map(() => Array(width).fill(TileType.EMPTY));
    const entities = [];
    
    const setTile = (x, y, type) => {
      if (x < width && y < height && x >= 0 && y >= 0) tiles[y][x] = type;
    };

    const addPipe = (x, h) => {
      for (let i = 0; i < h; i++) {
        setTile(x, 12 - i, TileType.PIPE_LEFT);
        setTile(x + 1, 12 - i, TileType.PIPE_RIGHT);
      }
    };

    const addQBlock = (x, y) => setTile(x, y, TileType.QUESTION_BLOCK);
    const addBrick = (x, y) => setTile(x, y, TileType.BRICK);
    const addGoomba = (x, y = 12) => {
      entities.push({
        id: `goomba_${x}_${Math.random()}`,
        type: EntityType.GOOMBA,
        pos: { x: x * TILE_SIZE, y: y * TILE_SIZE },
        vel: { x: -1, y: 0 },
        size: { x: TILE_SIZE, y: TILE_SIZE },
        dead: false,
        grounded: false
      });
    };
    const addCoin = (x, y) => {
      entities.push({
        id: `c_${x}_${y}`,
        type: EntityType.COIN,
        pos: { x: x * TILE_SIZE + 10, y: y * TILE_SIZE },
        vel: { x: 0, y: 0 },
        size: { x: 20, y: 20 },
        dead: false
      });
    };

    return { tiles, entities, setTile, addPipe, addQBlock, addBrick, addGoomba, addCoin };
  };

  if (levelIndex === 2) {
    // Level 1-2: UNDERGROUND
    const width = 180;
    const height = 15;
    const theme = {
      name: "World 1-2",
      background: "#000000",
      skyColor: "#000000",
      groundColor: "#003366",
      brickColor: "#0055AA"
    };
    
    const { tiles, entities, setTile, addBrick, addQBlock, addGoomba, addCoin, addPipe } = createLevel(width, height, theme);

    // Ceiling and Floor
    for (let x = 0; x < width; x++) {
      tiles[0][x] = TileType.BRICK;
      if (x < 15 || x > 165 || (x > 25 && x < 60) || (x > 80 && x < 140)) {
        tiles[13][x] = TileType.GROUND;
        tiles[14][x] = TileType.GROUND;
      }
    }

    addQBlock(10, 9);
    addPipe(20, 2);
    addGoomba(22);
    addPipe(28, 3);
    addGoomba(30);

    addBrick(35, 8);
    addBrick(36, 8);
    addQBlock(37, 8);
    addBrick(38, 8);
    addGoomba(36, 7);

    for (let i = 0; i < 5; i++) {
      setTile(45 + i, 9 + i, TileType.BRICK);
    }
    
    addBrick(65, 10);
    addBrick(66, 10);
    addBrick(70, 7);
    addQBlock(71, 7);
    addGoomba(70, 6);

    for (let x = 80; x < 120; x++) {
      if (x % 4 !== 0) setTile(x, 10, TileType.BRICK);
    }
    addGoomba(90, 9);
    addGoomba(100, 9);

    addCoin(37, 5);
    addCoin(71, 4);
    addCoin(95, 7);
    addCoin(96, 7);
    addCoin(97, 7);

    addPipe(160, 4);
    tiles[12][170] = TileType.GOAL;

    return { width, height, tiles, entities, theme, startPos: { x: 100, y: 100 } };

  } else {
    // Level 1-1: OVERWORLD
    const width = 220;
    const height = 15;
    const theme = {
      name: "World 1-1",
      background: "#5c94fc",
      skyColor: "#5c94fc",
      groundColor: "#e52521",
      brickColor: "#b73300"
    };

    const { tiles, entities, setTile, addBrick, addQBlock, addGoomba, addCoin, addPipe } = createLevel(width, height, theme);

    for (let x = 0; x < width; x++) {
      if ((x >= 69 && x <= 71) || (x >= 86 && x <= 88) || (x >= 153 && x <= 155)) continue;
      tiles[13][x] = TileType.GROUND;
      tiles[14][x] = TileType.GROUND;
    }

    addQBlock(16, 9);
    addBrick(20, 9);
    addQBlock(21, 9);
    addBrick(22, 9);
    addQBlock(23, 9);
    addBrick(24, 9);
    addQBlock(22, 5);
    addGoomba(22);

    addPipe(28, 2);
    addPipe(38, 3);
    addPipe(46, 4);
    addGoomba(40);
    addGoomba(42);
    addPipe(57, 4);

    addBrick(77, 9);
    addQBlock(78, 9);
    addBrick(79, 9);
    addBrick(80, 5);
    addBrick(81, 5);
    addBrick(82, 5);
    addBrick(83, 5);
    addBrick(84, 5);
    addBrick(85, 5);
    addBrick(91, 5);
    addBrick(92, 5);
    addBrick(93, 5);
    addQBlock(94, 5);
    addBrick(94, 9);
    addGoomba(80);
    addGoomba(97);

    addBrick(100, 9);
    addBrick(101, 9);
    addQBlock(102, 9);
    addBrick(103, 9);
    addQBlock(109, 9);
    addQBlock(109, 5);
    addQBlock(112, 9);
    addBrick(118, 9);
    
    for (let i = 0; i < 4; i++) {
      for (let h = 0; h <= i; h++) setTile(134 + i, 12 - h, TileType.BRICK);
    }
    for (let i = 0; i < 4; i++) {
      for (let h = 0; h <= i; h++) setTile(140 + 3 - i, 12 - h, TileType.BRICK);
    }
    for (let i = 0; i < 8; i++) {
      for (let h = 0; h <= i; h++) setTile(181 + i, 12 - h, TileType.BRICK);
    }
    setTile(189, 12, TileType.BRICK);

    tiles[12][198] = TileType.GOAL;

    setTile(202, 12, TileType.BRICK);
    setTile(203, 12, TileType.BRICK);
    setTile(204, 12, TileType.BRICK);
    setTile(202, 11, TileType.BRICK);
    setTile(203, 11, TileType.BRICK);
    setTile(204, 11, TileType.BRICK);
    setTile(203, 10, TileType.BRICK);

    addCoin(21, 5);
    addCoin(22, 7);
    addCoin(23, 5);
    addCoin(78, 4);
    addCoin(80, 4);
    addCoin(82, 4);

    return { width, height, tiles, entities, theme, startPos: { x: 100, y: 100 } };
  }
}

// Game Engine Class
class GameEngine {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    
    this.state = GameState.MENU;
    this.levelData = null;
    this.currentLevelIndex = 1;
    this.maxLevels = 2;
    
    this.player = this.createPlayer();
    this.entities = [];
    this.particles = [];
    this.bgObjects = [];
    
    this.camera = { x: 0, y: 0 };
    this.keys = {};
    this.score = 0;
    
    this.lastTime = 0;
    this.frameCount = 0;
    
    // DOM Elements
    this.elMenu = document.getElementById('menu-screen');
    this.elHud = document.getElementById('hud-screen');
    this.elGameOver = document.getElementById('game-over-screen');
    this.elGameOverTitle = document.getElementById('game-over-title');
    this.elBtnStart = document.getElementById('btn-start');
    this.elBtnRestart = document.getElementById('btn-restart');
    this.elScore = document.getElementById('score-display');
    this.elLevel = document.getElementById('level-display');
    this.elMobileControls = document.getElementById('mobile-controls');
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.bindInput();
    
    this.elBtnStart.addEventListener('click', () => this.startGame());
    this.elBtnRestart.addEventListener('click', () => this.restartLevel());

    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      this.elMobileControls.classList.remove('hidden');
      this.elMobileControls.classList.add('flex');
    }

    this.loop(0);
  }

  createPlayer() {
    return {
      id: 'player',
      type: EntityType.PLAYER,
      pos: { x: 0, y: 0 },
      vel: { x: 0, y: 0 },
      size: { x: TILE_SIZE * 0.8, y: TILE_SIZE * 0.9 },
      dead: false,
      grounded: false,
      facingRight: true,
      state: 'idle',
      frameTimer: 0
    };
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  bindInput() {
    window.addEventListener('keydown', (e) => this.keys[e.code] = true);
    window.addEventListener('keyup', (e) => this.keys[e.code] = false);

    const bindTouch = (id, code) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.keys[code] = true;
      });
      el.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.keys[code] = false;
      });
    };
    bindTouch('btn-left', 'ArrowLeft');
    bindTouch('btn-right', 'ArrowRight');
    bindTouch('btn-jump', 'Space');
  }

  startGame() {
    this.currentLevelIndex = 1;
    this.score = 0;
    this.loadLevel(this.currentLevelIndex);
    this.setState(GameState.PLAYING);
  }

  restartLevel() {
    if (this.state === GameState.GAME_WON) {
      this.startGame();
    } else {
      this.loadLevel(this.currentLevelIndex);
      this.setState(GameState.PLAYING);
    }
  }

  nextLevel() {
    if (this.currentLevelIndex < this.maxLevels) {
      this.currentLevelIndex++;
      this.loadLevel(this.currentLevelIndex);
    } else {
      this.setState(GameState.GAME_WON);
    }
  }

  loadLevel(index) {
    const data = generateLevel(index);
    this.levelData = data;
    
    this.player = this.createPlayer();
    this.player.pos = { ...data.startPos };
    
    this.entities = JSON.parse(JSON.stringify(data.entities));
    this.particles = [];
    this.camera = { x: 0, y: 0 };
    
    this.bgObjects = [];
    if (data.theme.skyColor !== "#000000") {
      const w = data.width * TILE_SIZE;
      for (let i = 0; i < w; i += Math.random() * 400 + 100) {
        this.bgObjects.push({ type: 'cloud', x: i, y: Math.random() * 200 + 30, size: Math.random() * 0.5 + 0.8 });
      }
      for (let i = 0; i < w; i += Math.random() * 800 + 400) {
        this.bgObjects.push({ type: 'hill', x: i, y: data.height * TILE_SIZE - 20, size: 1 });
      }
      for (let i = 200; i < w; i += Math.random() * 600 + 200) {
        this.bgObjects.push({ type: 'bush', x: i, y: (data.height - 2) * TILE_SIZE, size: 1 });
      }
    }

    this.updateHud();
  }

  setState(newState) {
    this.state = newState;
    
    this.elMenu.classList.add('hidden');
    this.elHud.classList.add('hidden');
    this.elGameOver.classList.add('hidden');

    if (newState === GameState.MENU) {
      this.elMenu.classList.remove('hidden');
    } else if (newState === GameState.PLAYING) {
      this.elHud.classList.remove('hidden');
    } else if (newState === GameState.GAME_OVER) {
      this.elGameOver.classList.remove('hidden');
      this.elGameOverTitle.innerText = "GAME OVER";
      this.elGameOverTitle.className = "text-6xl font-black mb-8 text-red-500 drop-shadow-xl text-center text-stroke";
      this.elBtnRestart.innerText = "TRY AGAIN";
    } else if (newState === GameState.GAME_WON) {
      this.elGameOver.classList.remove('hidden');
      this.elGameOverTitle.innerText = "YOU WIN!";
      this.elGameOverTitle.className = "text-6xl font-black mb-8 text-[#39FF14] drop-shadow-xl text-center text-stroke";
      this.elBtnRestart.innerText = "PLAY AGAIN";
    } else if (newState === GameState.VICTORY) {
      this.nextLevel();
    }
  }

  updateHud() {
    this.elScore.innerText = this.score.toString();
    if (this.levelData) this.elLevel.innerText = this.levelData.theme.name.replace("World ", "");
  }

  createParticle(x, y, color, speed = 1, type = 'dust') {
    this.particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 3 * speed,
      vy: (Math.random() - 1) * 3 * speed,
      life: 1.0,
      maxLife: 1.0,
      size: type === 'sparkle' ? 5 : Math.random() * 4 + 2,
      color
    });
  }

  loop(time) {
    const dt = time - this.lastTime;
    this.lastTime = time;
    this.frameCount++;

    if (this.state === GameState.PLAYING || this.state === GameState.VICTORY || this.state === GameState.GAME_OVER) {
      this.update(dt);
      this.draw();
    }
    
    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    if (!this.levelData || this.state !== GameState.PLAYING) return;
    
    const p = this.player;
    const wasGrounded = p.grounded;

    // INPUT
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      p.vel.x += MOVE_ACCEL;
      p.facingRight = true;
      if (p.vel.x < 0 && p.grounded) {
        p.state = 'skid';
        if (Math.random() > 0.7) this.createParticle(p.pos.x + p.size.x / 2, p.pos.y + p.size.y, "#ccc");
      } else {
        p.state = 'run';
        if (p.grounded && Math.random() > 0.8) this.createParticle(p.pos.x, p.pos.y + p.size.y, "rgba(255,255,255,0.5)");
      }
    } else if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      p.vel.x -= MOVE_ACCEL;
      p.facingRight = false;
      if (p.vel.x > 0 && p.grounded) {
        p.state = 'skid';
        if (Math.random() > 0.7) this.createParticle(p.pos.x + p.size.x / 2, p.pos.y + p.size.y, "#ccc");
      } else {
        p.state = 'run';
        if (p.grounded && Math.random() > 0.8) this.createParticle(p.pos.x + p.size.x, p.pos.y + p.size.y, "rgba(255,255,255,0.5)");
      }
    } else {
      p.vel.x *= FRICTION;
      if (Math.abs(p.vel.x) < 0.2) p.state = 'idle';
      else p.state = 'run';
    }

    p.vel.x = Math.max(Math.min(p.vel.x, MAX_SPEED), -MAX_SPEED);
    if (Math.abs(p.vel.x) < 0.1) p.vel.x = 0;

    // Jump
    if ((this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW']) && p.grounded) {
      p.vel.y = JUMP_FORCE;
      p.grounded = false;
      p.state = 'jump';
      for (let i = 0; i < 5; i++) this.createParticle(p.pos.x + p.size.x / 2, p.pos.y + p.size.y, "white");
    }
    if (!p.grounded) p.state = p.vel.y > 0 ? 'fall' : 'jump';

    p.vel.y += GRAVITY;

    // Integration
    p.pos.x += p.vel.x;
    this.resolveCollision(p, 'x');
    p.pos.y += p.vel.y;
    this.resolveCollision(p, 'y');

    // Landed
    if (!wasGrounded && p.grounded) {
      for (let i = 0; i < 3; i++) this.createParticle(p.pos.x + p.size.x / 2, p.pos.y + p.size.y, "white", 0.5);
    }

    // Pit Death
    if (p.pos.y > this.levelData.height * TILE_SIZE + 200) this.handleDeath();

    // Entity Logic
    this.entities.forEach(ent => {
      if (ent.dead) return;
      if (ent.type === EntityType.GOOMBA) {
        if (ent.grounded && ent.vel.x === 0) ent.vel.x = -1;
        ent.vel.y += GRAVITY;
        ent.pos.x += ent.vel.x;
        this.resolveCollision(ent, 'x');
        ent.pos.y += ent.vel.y;
        this.resolveCollision(ent, 'y');
      }
    });

    // Interactions
    const pRect = { x: p.pos.x + 6, y: p.pos.y + 6, w: p.size.x - 12, h: p.size.y - 6 };
    this.entities.forEach(ent => {
      if (ent.dead) return;
      const eRect = { x: ent.pos.x, y: ent.pos.y, w: ent.size.x, h: ent.size.y };
      if (this.checkRectCollision(pRect, eRect)) {
        if (ent.type === EntityType.COIN) {
          ent.dead = true;
          this.score += 100;
          this.updateHud();
          for (let i = 0; i < 5; i++) this.createParticle(ent.pos.x + 10, ent.pos.y + 10, "#FFD700", 2, 'sparkle');
        } else if (ent.type === EntityType.GOOMBA) {
          const hitFromAbove = p.vel.y > 0 && (p.pos.y + p.size.y) < (ent.pos.y + ent.size.y * 0.8);
          if (hitFromAbove) {
            ent.dead = true;
            p.vel.y = BOUNCE_FORCE;
            this.score += 200;
            this.updateHud();
            for (let i = 0; i < 8; i++) this.createParticle(ent.pos.x + 20, ent.pos.y + 20, "#795548");
          } else {
            this.handleDeath();
          }
        }
      }
    });

    // Particles
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= 0.05;
      p.size *= 0.95;
    });

    // Camera
    const targetCamX = p.pos.x - window.innerWidth / 3;
    const maxCamX = (this.levelData.width * TILE_SIZE) - window.innerWidth;
    this.camera.x += (Math.max(0, Math.min(targetCamX, maxCamX)) - this.camera.x) * 0.1;
  }

  handleDeath() {
    if (!this.player.dead) {
      this.player.dead = true;
      this.player.vel.y = -12;
      setTimeout(() => this.setState(GameState.GAME_OVER), 2000);
    }
  }

  checkRectCollision(r1, r2) {
    return r1.x < r2.x + r2.w && r1.x + r1.w > r2.x && r1.y < r2.y + r2.h && r1.y + r1.h > r2.y;
  }

  resolveCollision(ent, axis) {
    if (!this.levelData) return;
    const margin = axis === 'x' ? 4 : 0;
    const startX = Math.floor((ent.pos.x + margin) / TILE_SIZE);
    const endX = Math.floor((ent.pos.x + ent.size.x - margin - 0.01) / TILE_SIZE);
    const startY = Math.floor(ent.pos.y / TILE_SIZE);
    const endY = Math.floor((ent.pos.y + ent.size.y - 0.01) / TILE_SIZE);

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        if (y < 0 || y >= this.levelData.height || x < 0 || x >= this.levelData.width) continue;
        const tile = this.levelData.tiles[y][x];
        
        if (tile === TileType.GOAL) {
          if (ent.type === EntityType.PLAYER && this.checkRectCollision(
            { x: ent.pos.x, y: ent.pos.y, w: ent.size.x, h: ent.size.y },
            { x: x * TILE_SIZE + 18, y: y * TILE_SIZE, w: 4, h: TILE_SIZE }
          )) {
            this.setState(GameState.VICTORY);
          }
          continue;
        }

        if (tile !== TileType.EMPTY && tile !== TileType.GOAL && tile !== TileType.USED_BLOCK) {
          // solid
        } else if (tile === TileType.USED_BLOCK) {
          // solid
        } else {
          continue;
        }
        
        if (axis === 'x') {
          if (ent.vel.x > 0) {
            ent.pos.x = x * TILE_SIZE - ent.size.x;
            if (ent.type === EntityType.GOOMBA) ent.vel.x *= -1;
            else ent.vel.x = 0;
          } else if (ent.vel.x < 0) {
            ent.pos.x = (x + 1) * TILE_SIZE;
            if (ent.type === EntityType.GOOMBA) ent.vel.x *= -1;
            else ent.vel.x = 0;
          }
        } else {
          if (ent.vel.y > 0) {
            ent.pos.y = y * TILE_SIZE - ent.size.y;
            ent.vel.y = 0;
            ent.grounded = true;
          } else if (ent.vel.y < 0) {
            ent.pos.y = (y + 1) * TILE_SIZE;
            ent.vel.y = 0;
            if (ent.type === EntityType.PLAYER && tile === TileType.QUESTION_BLOCK) {
              this.levelData.tiles[y][x] = TileType.USED_BLOCK;
              this.score += 200;
              this.updateHud();
              for (let i = 0; i < 10; i++) this.createParticle(x * TILE_SIZE + TILE_SIZE / 2, y * TILE_SIZE, "#FFD700", 2, 'sparkle');
            }
          }
        }
        return;
      }
    }
    if (axis === 'y' && ent.vel.y !== 0) ent.grounded = false;
  }

  draw() {
    if (!this.levelData) return;
    const ctx = this.ctx;
    const cam = this.camera;
    const theme = this.levelData.theme;

    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    if (theme.skyColor === "#000000") {
      skyGrad.addColorStop(0, "#000");
      skyGrad.addColorStop(1, "#111");
    } else {
      skyGrad.addColorStop(0, "#29B6F6");
      skyGrad.addColorStop(1, "#E1F5FE");
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (theme.skyColor !== "#000000") {
      ctx.fillStyle = "rgba(255, 255, 200, 0.2)";
      ctx.beginPath();
      ctx.arc(this.canvas.width - 100, 50, 150, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.save();
    // BG Objects (Parallax)
    this.bgObjects.forEach(obj => {
      let px = 0;
      if (obj.type === 'hill') {
        px = obj.x - cam.x * 0.3;
        const hillGrad = ctx.createLinearGradient(px, obj.y - 150, px, obj.y);
        hillGrad.addColorStop(0, "#66BB6A");
        hillGrad.addColorStop(1, "#33691E");
        ctx.fillStyle = hillGrad;
        ctx.beginPath();
        ctx.ellipse(px, obj.y, 200, 150, 0, Math.PI, 0);
        ctx.fill();
        ctx.strokeStyle = "#1B5E20";
        ctx.lineWidth = 4;
        ctx.stroke();
      } else if (obj.type === 'cloud') {
        px = (obj.x - cam.x * 0.1) % (this.levelData.width * TILE_SIZE);
        if (px < -100) px += this.levelData.width * TILE_SIZE;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        const s = obj.size * 25;
        ctx.beginPath();
        ctx.arc(px, obj.y, s, 0, Math.PI * 2);
        ctx.arc(px + s, obj.y + 5, s * 0.8, 0, Math.PI * 2);
        ctx.arc(px - s, obj.y + 5, s * 0.8, 0, Math.PI * 2);
        ctx.fill();
      } else if (obj.type === 'bush') {
        px = obj.x - cam.x * 0.5;
        ctx.fillStyle = "#43A047";
        ctx.beginPath();
        ctx.arc(px, obj.y, 30, 0, Math.PI * 2);
        ctx.arc(px + 40, obj.y, 30, 0, Math.PI * 2);
        ctx.arc(px + 20, obj.y - 20, 30, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.restore();

    ctx.save();
    ctx.translate(-Math.floor(cam.x), 0);

    const startCol = Math.floor(cam.x / TILE_SIZE);
    const endCol = startCol + (this.canvas.width / TILE_SIZE) + 2;

    // Tiles
    for (let y = 0; y < this.levelData.height; y++) {
      for (let x = startCol; x <= endCol; x++) {
        if (x < 0 || x >= this.levelData.width) continue;
        const tile = this.levelData.tiles[y][x];
        const px = x * TILE_SIZE;
        const py = y * TILE_SIZE;

        if (tile === TileType.GROUND) this.drawGround(ctx, px, py, theme.groundColor);
        else if (tile === TileType.BRICK) this.drawBrick(ctx, px, py, theme.brickColor);
        else if (tile === TileType.QUESTION_BLOCK) this.drawQuestion(ctx, px, py);
        else if (tile === TileType.USED_BLOCK) this.drawUsed(ctx, px, py);
        else if (tile === TileType.PIPE_LEFT) this.drawPipe(ctx, px, py, true);
        else if (tile === TileType.PIPE_RIGHT) this.drawPipe(ctx, px, py, false);
        else if (tile === TileType.GOAL) this.drawGoal(ctx, px, py, x, y);
      }
    }

    // Particles
    this.particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });

    // Entities
    this.entities.forEach(ent => {
      if (ent.dead) return;
      if (ent.type === EntityType.COIN) this.drawCoin(ctx, ent);
      else if (ent.type === EntityType.GOOMBA) this.drawGoomba(ctx, ent);
    });

    // Player
    if (!this.player.dead || (this.player.dead && Math.floor(Date.now() / 100) % 2 === 0)) {
      this.drawPlayer(ctx, this.player);
    }

    ctx.restore();
  }

  drawGround(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(x, y + 10, TILE_SIZE, TILE_SIZE - 10);
  }

  drawBrick(ctx, x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(x, y + 10, TILE_SIZE, 3);
    ctx.fillRect(x, y + 27, TILE_SIZE, 3);
    ctx.fillRect(x + 18, y, 3, 10);
    ctx.fillRect(x + 10, y + 13, 3, 14);
    ctx.fillRect(x + 28, y + 13, 3, 14);
    ctx.fillRect(x + 18, y + 30, 3, 10);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    ctx.fillRect(x, y, TILE_SIZE, 2);
  }

  drawQuestion(ctx, x, y) {
    const g = ctx.createLinearGradient(x, y, x, y + TILE_SIZE);
    g.addColorStop(0, "#FFEC00");
    g.addColorStop(1, "#FFB300");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "#FF8F00";
    ctx.fillRect(x + 4, y + 4, 4, 4);
    ctx.fillRect(x + 32, y + 4, 4, 4);
    ctx.fillRect(x + 4, y + 32, 4, 4);
    ctx.fillRect(x + 32, y + 32, 4, 4);
    const bob = Math.sin(this.frameCount * 0.15) * 2;
    ctx.fillStyle = "#FFF9C4";
    ctx.font = "900 28px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("?", x + 20, y + 32 + bob);
  }

  drawUsed(ctx, x, y) {
    ctx.fillStyle = "#795548";
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(x + 4, y + 4, 4, 4);
    ctx.fillRect(x + 32, y + 4, 4, 4);
    ctx.fillRect(x + 4, y + 32, 4, 4);
    ctx.fillRect(x + 32, y + 32, 4, 4);
    ctx.strokeStyle = "#4E342E";
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 2, y + 2, TILE_SIZE - 4, TILE_SIZE - 4);
  }

  drawPipe(ctx, x, y, isLeft) {
    const g = ctx.createLinearGradient(x, y, x + TILE_SIZE, y);
    g.addColorStop(0, "#1B5E20");
    g.addColorStop(0.5, "#2E7D32");
    g.addColorStop(1, "#1B5E20");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = "#1B5E20";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
  }

  drawGoal(ctx, px, py, x, y) {
    ctx.fillStyle = "#424242";
    ctx.fillRect(px + 18, py, 4, TILE_SIZE);
    if (this.levelData.tiles[y - 1]?.[x] !== TileType.GOAL) {
      ctx.fillStyle = "#76FF03";
      ctx.beginPath();
      ctx.arc(px + 20, py, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FF3D00";
      ctx.beginPath();
      ctx.moveTo(px + 22, py);
      ctx.lineTo(px + 60, py + 15);
      ctx.lineTo(px + 22, py + 30);
      ctx.fill();
    }
  }

  drawCoin(ctx, ent) {
    const cx = ent.pos.x + 10;
    const cy = ent.pos.y + 10;
    const w = 14 * Math.abs(Math.cos(this.frameCount * 0.15));
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.ellipse(cx, cy, w, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFF59D";
    ctx.beginPath();
    ctx.ellipse(cx, cy, w * 0.6, 10, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGoomba(ctx, e) {
    ctx.save();
    ctx.translate(e.pos.x + e.size.x / 2, e.pos.y + e.size.y);
    const waddle = Math.sin(this.frameCount * 0.25) * 4;
    ctx.rotate(waddle * 0.05);
    ctx.fillStyle = "#212121";
    ctx.beginPath();
    ctx.ellipse(-8, -3, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -3, 6, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFCC80";
    ctx.beginPath();
    ctx.roundRect(-9, -16, 18, 14, 5);
    ctx.fill();
    const grad = ctx.createRadialGradient(-4, -30, 2, 0, -25, 22);
    grad.addColorStop(0, "#8D6E63");
    grad.addColorStop(1, "#5D4037");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(-18, -14);
    ctx.quadraticCurveTo(0, -50, 18, -14);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(-6, -24, 5, 7, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(6, -24, 5, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(-5, -24, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(5, -24, 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#3E2723";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, -32);
    ctx.lineTo(-2, -26);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12, -32);
    ctx.lineTo(2, -26);
    ctx.stroke();
    ctx.restore();
  }

  drawPlayer(ctx, p) {
    ctx.save();
    const cx = p.pos.x + p.size.x / 2;
    const cy = p.pos.y + p.size.y;
    ctx.translate(cx, cy);
    if (!p.facingRight) ctx.scale(-1, 1);
    
    const runSpeed = Math.abs(p.vel.x) * 0.2;
    const walkCycle = Math.sin(this.frameCount * 0.8) * Math.min(1, runSpeed);
    let lean = p.vel.x * 2;
    if (p.state === 'skid') lean = -15;
    ctx.rotate(lean * Math.PI / 180);
    const bob = Math.abs(Math.sin(this.frameCount * 0.8)) * (p.state === 'run' ? 2 : 0);
    ctx.translate(0, -bob);

    const drawLeg = (isBack) => {
      let angle = 0;
      let lift = 0;
      if (p.state === 'jump' || p.state === 'fall') {
        angle = isBack ? 0.5 : -0.8;
        lift = -4;
      } else if (p.state === 'skid') {
        angle = isBack ? 0.3 : -0.3;
      } else if (p.state === 'run') {
        angle = isBack ? -walkCycle : walkCycle;
      }
      ctx.save();
      ctx.translate(0, -10);
      ctx.rotate(angle);
      ctx.fillStyle = "#0D47A1";
      ctx.beginPath();
      ctx.roundRect(-4, 0, 8, 12 + lift, 3);
      ctx.fill();
      ctx.translate(0, 10 + lift);
      ctx.fillStyle = "#5D4037";
      ctx.beginPath();
      ctx.roundRect(-5, 0, 11, 5, 2);
      ctx.fill();
      ctx.restore();
    };

    drawLeg(true);
    
    ctx.fillStyle = "#D50000";
    ctx.beginPath();
    ctx.roundRect(-9, -28, 18, 18, 4);
    ctx.fill();
    ctx.fillStyle = "#0D47A1";
    ctx.beginPath();
    ctx.roundRect(-9, -20, 18, 10, 2);
    ctx.fill();
    ctx.fillStyle = "#FFD600";
    ctx.beginPath();
    ctx.arc(-5, -18, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(5, -18, 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.save();
    ctx.translate(0, -30);
    if (p.state === 'run') ctx.rotate(0.1);
    ctx.fillStyle = "#FFCCBC";
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(9, 2, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#D50000";
    ctx.beginPath();
    ctx.moveTo(-9, -2);
    ctx.bezierCurveTo(-12, -12, 10, -14, 12, -2);
    ctx.lineTo(15, 1);
    ctx.lineTo(-9, -2);
    ctx.fill();
    ctx.fillStyle = "#212121";
    ctx.beginPath();
    ctx.ellipse(6, 6, 5, 2.5, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.ellipse(4, -3, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.ellipse(5, -3, 1.5, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    const armAngle = p.state === 'run' ? -walkCycle * 1.5 : (p.state === 'jump' ? -2.5 : 0);
    ctx.save();
    ctx.translate(4, -24);
    ctx.rotate(armAngle);
    ctx.fillStyle = "#D50000";
    ctx.beginPath();
    ctx.roundRect(-3, 0, 6, 12, 3);
    ctx.fill();
    ctx.translate(0, 11);
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(0, 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    drawLeg(false);
    ctx.restore();
  }
}

// Initialize game when DOM is loaded
new GameEngine();
