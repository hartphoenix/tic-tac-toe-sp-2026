# Triple-Tac-Toe

A 3D multiplayer tic-tac-toe variant played on a 3x3x3 cube. Two players compete to claim three lines across 49 possible win conditions — horizontal, vertical, diagonal, and body-diagonal lines spanning all three layers. Real-time moves broadcast over WebSockets; multiple games run concurrently from a shared lobby.

**[Play it live](https://tic-tac-toe-3d-p3ar.onrender.com/)**

## Why this project

Triple-Tac-Toe started as a bootcamp exercise and became a design problem I couldn't put down. A 2D tic-tac-toe board is easily solved — the 3D cube is not. 49 overlapping win conditions with a 3-line victory threshold create a game where spatial reasoning, not memorized strategy, determines the outcome. Building it meant solving the same kind of problem across every layer of the stack: how do you make a complex state space legible and interactive in real time?

## What it does

- **3D board** rendered with Three.js / React Three Fiber — orbit to rotate, pinch or scroll to expand/collapse the cube layers
- **49 win lines** computed across three 3x3 layers: rows, columns, diagonals, tunnels through the z-axis, and four body diagonals
- **First to three lines wins** — scoring tracked per player with a live scoreboard
- **Claimed-line glow** — cells that complete a line emit their player's color
- **Lobby** — create or join games; each shows current score and turn at a glance
- **WebSocket sync** — server-authoritative game state broadcast to all connected clients on every move

## Architecture

```
Client (React 19 + TypeScript)          Server (Express 5 + express-ws)
├── App.tsx          view routing,       ├── server.ts         HTTP + WS routes
│                    socket connection   ├── gameStore.ts      game logic, state
├── LobbyView.tsx    game browser        ├── socket-handlers.ts  move validation,
├── GameView.tsx     active game UI      │                       broadcast
├── Board3D.tsx      Three.js renderer   └── winLogic.ts       49 win-line defs
├── Header.tsx       turn/status
└── tic-tac-toe.ts   shared types
```

Moves flow: client sends via WebSocket → server validates and updates state → broadcasts to all clients. Game state lives in an in-memory Map (no database — games are ephemeral). The client rebuilds its `rowsClaimed` map from the board on every update as a consistency checkpoint.

## Stack

React 19, TypeScript, Three.js, React Three Fiber, React Spring (animations), Express 5, express-ws, Vite, Vitest + Supertest

## Run locally

```bash
bun install
bun run dev        # dev server with HMR on :3000
bun run test       # integration tests (API + game logic)
```

## Build history

Built across 14 PRs over 1 week. Key milestones in order:

1. Game logic + tests for a standard 3x3 board
2. Extended to 3x3x3 cube with 49 win conditions and Three.js rendering
3. Express server for state management
4. TDD cycle: wrote server tests first, then fulfilled them
5. Multi-game lobby with persistent server-side games
6. WebSocket migration — replaced HTTP polling with real-time broadcast
7. Scoring system (3-line victory threshold, claimed-line glow)
8. Deployed to Render
