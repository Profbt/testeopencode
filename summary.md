# Project Summary - Jogos Web

## Overview
Repositório contendo **dois jogos web** desenvolvidos com HTML, CSS e JavaScript vanilla (sem frameworks).

---

## Jogo 1: Jogo de Damas (Checkers)

### Arquivos
| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Página principal do jogo de damas |
| `script.js` | Lógica completa do jogo (259 linhas) |
| `style.css` | Estilização visual (155 linhas) |

### Funcionalidades
- **Tabuleiro 8x8** com renderização via DOM
- **2 jogadores locais** (Vermelhas vs Pretas)
- **Movimentação**: clique para selecionar peça, clique no destino para mover
- **Capturas obrigatórias**: se há capturas disponíveis, apenas elas são permitidas
- **Multi-salto**: continuidade de captura quando disponível
- **Promoção a dama (king)**: peça chega ao lado oposto (linha 0 para vermelhas, linha 7 para pretas)
- **Damas (kings)**: movem-se para frente e trás (1 casa)
- **Indicador de turno** e **placar** (peças restantes)
- **Detecção de fim de jogo**: sem peças ou sem movimentos
- **Botão de reiniciar**

### Estado Global (`script.js`)
```
BOARD_SIZE = 8
board[][]          // matriz 8x8 com peças { color, king }
selectedPiece      // { row, col } da peça selecionada
currentTurn        // 'red' | 'black'
validMoves[]       // movimentos válidos da peça selecionada
redPieces / blackPieces  // contagem de peças (inicia em 12)
mustContinueJump   // flag para multi-salto obrigatório
```

---

## Jogo 2: Fuja do 67 (Platformer Survival)

### Arquivos
| Arquivo | Descrição |
|---------|-----------|
| `plataforma.html` | Página principal com múltiplas telas (menu, countdown, jogo, pause, jumpscare) |
| `plataforma.js` | Lógica completa do jogo (921 linhas) |
| `plataforma.css` | Estilização visual com animações (439 linhas) |
| `67.png` | Imagem do inimigo |
| `menu.mp3` | Música do menu (loop) |
| `jogo.mp3` | Música do gameplay (loop) |
| `grito.mp3` | Som de jumpscare |

### Telas
1. **Menu** (`#menu-screen`): canvas com partículas, seleção de dificuldade, botão jogar, high score
2. **Countdown** (`#countdown-screen`): contagem regressiva 3, 2, 1, FUJA!
3. **Jogo** (`#game-screen`): canvas principal com HUD
4. **Pause** (`#pause-screen`): continuar ou reiniciar
5. **Jumpscare** (`#jumpscare-screen`): tela de game over com imagem "67" e estatísticas

### Mecânicas do Jogador
- **Movimentação**: A/D ou ←/→ para mover, W/↑/Espaço para pular
- **Pulo duplo**: 2 jumps disponíveis
- **Wall slide e wall jump**: deslizar na parede e pular dela
- **Gravidade**: `GRAVITY = 0.6`, `WALL_GRAVITY = 0.25`
- **Dimensões**: 30x50px (largura x altura)

### Inimigo "67"
- **Perseguição**: segue o jogador pela direita com velocidade crescente
- **Níveis de dificuldade**: Lento → Normal → Rápido → Muito Rápido → INSANO
- **Inimigos frontais**: spawnam à frente do jogador em intervalos regulares
- **Tipos de inimigos frontais**: ground (pulável) e flying (não pulável)

### Coletáveis
| Tipo | Cor | Efeito |
|------|-----|--------|
| Orb | Dourado | +velocidade (8s), +50 pts |
| Shield | Verde | +1 escudo (absorve 1 hit), +100 pts |
| Slow | Azul | slows inimigo (5s), +200 pts |

### Dificuldades
| Config | Fácil | Médio | Difícil |
|--------|-------|-------|---------|
| Chase Speed | 0.7x | 1.0x | 1.4x |
| Spawn Interval | 14s | 10s | 6s |
| Enemy Speed | 2.2 | 3.0 | 4.0 |
| Max Enemies | 2 | 3 | 4 |
| Level Thresholds | [12, 30, 55, 85] | [10, 25, 45, 70] | [8, 18, 35, 55] |

### HUD
- Timer (sobrevivência em segundos)
- Score (pontuação acumulada)
- Barra de nível (67 Nível 1-5)
- Indicador de velocidade do jogador
- Indicador de escudos
- Buffs ativos (com timer)
- Aviso de spawn inimigo ("⚠ 67 VINDO!")

### High Scores
- Salvos em `localStorage` com chaves: `fuja67_hs_easy`, `fuja67_hs_medium`, `fuja67_hs_hard`

### Física e Constantes Principais
```
GRAVITY = 0.6
WALL_GRAVITY = 0.25
JUMP_FORCE = -13
WALL_JUMP_X = 8
WALL_JUMP_Y = -12
BASE_MOVE_SPEED = 5
MAX_JUMPS = 2
```

---

## Estrutura de Diretórios
```
testeopencode/
├── index.html              # Menu de jogos (hub principal)
├── damas.html              # Jogo de Damas
├── plataforma.html         # Fuja do 67
├── summary.md
├── damas/
│   ├── script.js
│   └── style.css
├── plataforma/
│   ├── plataforma.js
│   └── plataforma.css
├── assets/
│   ├── images/
│   │   └── 67.png
│   └── sounds/
│       ├── menu.mp3
│       ├── jogo.mp3
│       └── grito.mp3
```

---

## Convenções
- **Sem frameworks**: JavaScript vanilla, CSS puro
- **Canvas API** para renderização do Fuja do 67
- **DOM manipulation** para o Jogo de Damas
- **requestAnimationFrame** para game loop
- **localStorage** para persistência de high scores
- **Idioma**: Português (BR)
- **Créditos**: Gustavo e Leandro Carvalho
