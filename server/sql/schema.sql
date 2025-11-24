-- Usar la base `railway` (esta versión crea tablas en la base ya provista por Railway)
-- Nota: No utilizar USE <db>; Railway ya conecta a la base asignada.
-- Si ejecutas localmente contra otra base, precede manualmente con: USE nombre_base;

-- Tablas
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100) NOT NULL,
  year VARCHAR(10) NOT NULL,
  history TEXT NOT NULL,
  creator_name VARCHAR(100),
  creator_photo_url VARCHAR(500),
  company_name VARCHAR(100),
  company_photo_url VARCHAR(500),
  cover_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_games (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  ranking_name VARCHAR(50),
  UNIQUE KEY uniq_user_game (user_id, game_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS scores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  score INT NOT NULL,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  INDEX idx_game_user (game_id, user_id),
  INDEX idx_game_score (game_id, score)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  content VARCHAR(500) NOT NULL,
  is_deleted TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  INDEX idx_game_date (game_id, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_id INT NOT NULL,
  content VARCHAR(500) NOT NULL,
  status ENUM('open','reviewed','closed') NOT NULL DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Seeds mínimos (5+ registros)
-- Seed usuario admin (solo para entornos de prueba). Cambia el correo y contraseña.
-- Contraseña utilizada: ChangeMe123!  (DEBES cambiarla en producción)
INSERT INTO users (email, username, password_hash, role) VALUES
  ('admin@retro.com','admin', '$2a$10$YxROJrkbd6y3.pbLy9p71es0DWzrk.4Et2/f5ynZH4eY4sgSskfvu', 'admin')
ON DUPLICATE KEY UPDATE email = email;
-- Para producción considera eliminar este seed y crear el admin manualmente.

INSERT INTO games (slug, title, year, history, creator_name, creator_photo_url, company_name, company_photo_url, cover_url) VALUES
 ('snake','Snake','1976','Origen en Blockade (1976), popularizado por Nokia en 1998.','Gremlin/Concepto','https://upload.wikimedia.org/wikipedia/commons/3/3a/Gremlin_Industries_logo.png','Nokia','https://upload.wikimedia.org/wikipedia/commons/3/32/Nokia_wordmark.svg',''),
 ('pong','Pong','1972','Desarrollado por Atari; éxito arcade pionero.','Allan Alcorn','https://upload.wikimedia.org/wikipedia/commons/0/07/Allan_Alcorn.jpg','Atari','https://upload.wikimedia.org/wikipedia/commons/3/3f/Atari_Official_2012_Logo.svg',''),
 ('tetris','Tetris','1984','Creado por Alexey Pajitnov en 1984.','Alexey Pajitnov','https://upload.wikimedia.org/wikipedia/commons/0/05/Alexey_Pajitnov_2016.jpg','Academy of Sciences','https://upload.wikimedia.org/wikipedia/commons/5/5e/Russian_Academy_of_Sciences.jpg','')
ON DUPLICATE KEY UPDATE slug = slug;

-- Crear algunos puntajes (si existiera usuario id 1)
INSERT INTO scores (user_id, game_id, score)
SELECT 1, g.id, 120 FROM games g WHERE g.slug = 'snake' ON DUPLICATE KEY UPDATE score = score;
INSERT INTO scores (user_id, game_id, score)
SELECT 1, g.id, 15 FROM games g WHERE g.slug = 'pong' ON DUPLICATE KEY UPDATE score = score;
INSERT INTO scores (user_id, game_id, score)
SELECT 1, g.id, 800 FROM games g WHERE g.slug = 'tetris' ON DUPLICATE KEY UPDATE score = score;

-- Ranking_name para admin en snake
INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT 1, g.id, 'AdminPlayer' FROM games g WHERE g.slug = 'snake'
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);
