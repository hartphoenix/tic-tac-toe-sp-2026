import type { Express, Request, Response } from 'express';
import express from 'express';
import ViteExpress from 'vite-express';
import { createGame, makeMove, games } from './gameStore'
import type { Player } from './src/tic-tac-toe'

const app: Express = express();
app.use(express.json());

// Configure vite-express to not intercept API routes
ViteExpress.config({ ignorePaths: /^\/api/ });

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

ViteExpress.listen(app, 3000, () => console.log('Server is listening...'))
export default app