-- Script de Seed: 10 usuarios de prueba + andrew30 como admin
-- Contraseña admin (andrew30): andrew2025
-- Todas las demás contraseñas: [nombre]2025

-- ========== USUARIOS ==========
INSERT INTO users (email, username, password_hash, role) VALUES
-- 10 usuarios de prueba
('luis@gmail.com', 'luis14', '$2a$10$ckyeTILSR6IOtC8wMbgcFejMzq0gyv5eKw2oL.3o1TBfmUh3ImZ9W', 'user'),
('maria@gmail.com', 'maria25', '$2a$10$6J9xthmYZRDSwVYWGKUZ7e6liEOAOi7zWwkoy7rgmqzzvSKzn/K6.', 'user'),
('carlos@gmail.com', 'carlos33', '$2a$10$UUN5Jj/RavUFpv7KLlP//Ob3bJSedBELw.9Z.o23fzDXwMZJ/JMum', 'user'),
('ana@gmail.com', 'ana42', '$2a$10$Bw549/02jlxh/Sw8U/xcTOBkEDGOasEPo3aCLr3/AwoAZlKhaZy6S', 'user'),
('juan@gmail.com', 'juan51', '$2a$10$ZOcqSRJwd0ktxCsdK7nATOxV5ghl8gw1p8W.Sqe82SUgDUgRopgFy', 'user'),
('sofia@gmail.com', 'sofia19', '$2a$10$hzz.ae2TJWNKUBE4NszXEOOEWx7.oSucuwi34QiNrltVznjA7qEES', 'user'),
('diego@gmail.com', 'diego77', '$2a$10$k2U25aufni1CG0q/EVcDMuihNBwSzxd06LzpsWe/pPiTbA7NJebsm', 'user'),
('laura@gmail.com', 'laura88', '$2a$10$0jVOOjZLNSrcR4mmQhBdQ.h70VgjYRqnl6z9tdtgk2TebKzmVln26', 'user'),
('pedro@gmail.com', 'pedro99', '$2a$10$14/TloCiJaNZSDfTDJqjjefZhRbIGFg5BgkM.o.FZUjOdGpYBENia', 'user'),
('isabel@gmail.com', 'isabel44', '$2a$10$/DsAkArqBkPeUZQhKx3KF.9iK5mMReQ.0QarUfeW6HKxy09wg2zK2', 'user'),
-- Usuario admin
('andrusaguila@gmail.com', 'andrew30', '$2a$10$EELnWTc19Srg8A6gjVZqT.03vqhZjPoyC790I7.useOVQkzoy0Opu', 'admin')
ON DUPLICATE KEY UPDATE email = email;

-- ========== PUNTAJES (scores < 10) ==========
-- Luis14 en Snake, Pong, Tetris
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 8 FROM users u, games g 
WHERE u.username = 'luis14' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 6 FROM users u, games g 
WHERE u.username = 'luis14' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 9 FROM users u, games g 
WHERE u.username = 'luis14' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Maria25
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 7 FROM users u, games g 
WHERE u.username = 'maria25' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 5 FROM users u, games g 
WHERE u.username = 'maria25' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 8 FROM users u, games g 
WHERE u.username = 'maria25' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Carlos33
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 9 FROM users u, games g 
WHERE u.username = 'carlos33' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 4 FROM users u, games g 
WHERE u.username = 'carlos33' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 7 FROM users u, games g 
WHERE u.username = 'carlos33' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Ana42
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 6 FROM users u, games g 
WHERE u.username = 'ana42' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 8 FROM users u, games g 
WHERE u.username = 'ana42' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 5 FROM users u, games g 
WHERE u.username = 'ana42' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Juan51
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 5 FROM users u, games g 
WHERE u.username = 'juan51' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 9 FROM users u, games g 
WHERE u.username = 'juan51' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 6 FROM users u, games g 
WHERE u.username = 'juan51' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Sofia19
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 4 FROM users u, games g 
WHERE u.username = 'sofia19' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 7 FROM users u, games g 
WHERE u.username = 'sofia19' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 9 FROM users u, games g 
WHERE u.username = 'sofia19' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Diego77
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 8 FROM users u, games g 
WHERE u.username = 'diego77' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 3 FROM users u, games g 
WHERE u.username = 'diego77' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 8 FROM users u, games g 
WHERE u.username = 'diego77' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Laura88
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 7 FROM users u, games g 
WHERE u.username = 'laura88' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 6 FROM users u, games g 
WHERE u.username = 'laura88' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 4 FROM users u, games g 
WHERE u.username = 'laura88' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Pedro99
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 9 FROM users u, games g 
WHERE u.username = 'pedro99' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 5 FROM users u, games g 
WHERE u.username = 'pedro99' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 7 FROM users u, games g 
WHERE u.username = 'pedro99' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Isabel44
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 6 FROM users u, games g 
WHERE u.username = 'isabel44' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 8 FROM users u, games g 
WHERE u.username = 'isabel44' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 3 FROM users u, games g 
WHERE u.username = 'isabel44' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- Andrew30 (admin) - puntajes más altos
INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 9 FROM users u, games g 
WHERE u.username = 'andrew30' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 9 FROM users u, games g 
WHERE u.username = 'andrew30' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE score = score;

INSERT INTO scores (user_id, game_id, score) 
SELECT u.id, g.id, 9 FROM users u, games g 
WHERE u.username = 'andrew30' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE score = score;

-- ========== USER_GAMES (ranking_name) ==========
INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'Luis_Snake' FROM users u, games g 
WHERE u.username = 'luis14' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'Maria_Gamer' FROM users u, games g 
WHERE u.username = 'maria25' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'CarlosT' FROM users u, games g 
WHERE u.username = 'carlos33' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'AnaSnake' FROM users u, games g 
WHERE u.username = 'ana42' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'JuanPong' FROM users u, games g 
WHERE u.username = 'juan51' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'SofiaRetro' FROM users u, games g 
WHERE u.username = 'sofia19' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'Diego_Master' FROM users u, games g 
WHERE u.username = 'diego77' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'LauraGamer' FROM users u, games g 
WHERE u.username = 'laura88' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'PedroTetris' FROM users u, games g 
WHERE u.username = 'pedro99' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'IsabelSnake' FROM users u, games g 
WHERE u.username = 'isabel44' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

INSERT INTO user_games (user_id, game_id, ranking_name)
SELECT u.id, g.id, 'Andrew_Admin' FROM users u, games g 
WHERE u.username = 'andrew30' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE ranking_name = VALUES(ranking_name);

-- ========== COMENTARIOS ==========
INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, '¡Snake es muy divertido! Me encanta este juego clásico.' 
FROM users u, games g 
WHERE u.username = 'luis14' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, 'Pong sigue siendo adictivo después de todos estos años.' 
FROM users u, games g 
WHERE u.username = 'maria25' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, 'Tetris es el mejor juego de puzzles de todos los tiempos.' 
FROM users u, games g 
WHERE u.username = 'carlos33' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, 'Me encanta la nostalgia de estos juegos retro.' 
FROM users u, games g 
WHERE u.username = 'ana42' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, '¿Alguien más tiene problemas para pasar del nivel 3 en Pong?' 
FROM users u, games g 
WHERE u.username = 'juan51' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, 'Tetris me recuerda a mi infancia. Qué recuerdos tan bellos.' 
FROM users u, games g 
WHERE u.username = 'sofia19' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, 'Snake sigue siendo un reto incluso con su simplicidad.' 
FROM users u, games g 
WHERE u.username = 'diego77' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, 'Pong es perfecto para jugar con amigos en el sofá.' 
FROM users u, games g 
WHERE u.username = 'laura88' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, 'Tetris tiene la mejor música de todos los juegos.' 
FROM users u, games g 
WHERE u.username = 'pedro99' AND g.slug = 'tetris' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, 'Estos juegos son arte puro. ¡Qué increíble!' 
FROM users u, games g 
WHERE u.username = 'isabel44' AND g.slug = 'snake' 
ON DUPLICATE KEY UPDATE content = content;

INSERT INTO comments (user_id, game_id, content)
SELECT u.id, g.id, 'Bienvenidos al servidor. Que disfruten los juegos retro.' 
FROM users u, games g 
WHERE u.username = 'andrew30' AND g.slug = 'pong' 
ON DUPLICATE KEY UPDATE content = content;
