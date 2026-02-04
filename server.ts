import type { Express, Request, Response } from 'express';
import express from 'express';
import ViteExpress from 'vite-express';
import { createGame, makeMove } from './src/tic-tac-toe'
import type { Player, Cell, Board, WinState, GameState } from './src/tic-tac-toe'

const app: Express = express();
app.use(express.json());

// Configure vite-express to not intercept API routes
ViteExpress.config({ ignorePaths: /^\/api/ });

let gameState: GameState = createGame()

app.get('/api/game', (req: Request, res: Response): void => {
    res.json(gameState)
})
app.get('/api/reset', (req: Request, res: Response): void => {
    gameState = createGame()
    res.json(gameState)
})

app.post('/api/move', (req: Request, res: Response): void => {
    const { player, position }: { player: Player, position: number } = req.body
    if (player !== gameState.currentPlayer) {
        res.status(500).json(
            { error: `It's ${gameState.currentPlayer}'s turn` }
        )
        return
    }
    try {
        const newState = makeMove(gameState, position)
        gameState = newState
        res.json(gameState)
    } catch (error) {
        res.status(500).send({ error: error })
        return
    }
})

ViteExpress.listen(app, 3000, () => console.log('Server is listening...'));