import type { Express, Request, Response } from 'express';
import express from 'express';
import ViteExpress from 'vite-express';
import expressWs from 'express-ws';
import { createGame, makeMove, games } from './gameStore'
import type { Player } from './src/tic-tac-toe'

const { app, getWss } = expressWs(express());
app.use(express.json());

// Configure vite-express to not intercept API routes
ViteExpress.config({ ignorePaths: /^\/api|^\/ws/ });

app.get('/api/create', (req: Request, res: Response): void => {
  const newGame = createGame()
  res.json(newGame)
})

app.get('/api/list', (req: Request, res: Response): void => {
  res.json([...games.values()])
})

app.get('/api/game/:id', (req: Request<{ id: string }>, res: Response): void => {
  const id = req.params.id
  const game = games.get(id)
  if (!game) {
    res.status(404).json({ error: "Game ID not found" })
    return
  }
  res.json(game)
})

app.post('/api/move/:id', (req: Request<{ id: string }>, res: Response): void => {
  const id = req.params.id
  const game = games.get(id)
  if (!game) {
    res.status(404).json({ error: "Game ID not found" })
    return
  }
  const { player, position }: { player: Player, position: number } = req.body
  if (player === undefined) {
    res.status(400).json({ error: "Player field missing" })
    return
  }
  if (position === undefined) {
    res.status(400).json({ error: "Position field missing" })
    return
  }
  if (player !== game.currentPlayer) {
    res.status(400).json(
      { error: `It's ${game.currentPlayer}'s turn` }
    )
    return
  }
  try {
    const newState = makeMove(game, position)
    res.json(newState)
  } catch (err) {
    res.status(400).json({ error: (err as Error).message })
    return
  }
})
app.ws('/ws', (ws, _req) => {
  console.log('[server] client connected');

  ws.on('message', (msg) => {
    const message = msg.toString();
    console.log('[server] received:', message)
    getWss().clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(message)
      }
    })
  });

  ws.on('close', () => {
    console.log('[server] client disconnected');
  });
});

ViteExpress.listen(app as unknown as Express, 3000, () => console.log('Server is listening...'))
export default app