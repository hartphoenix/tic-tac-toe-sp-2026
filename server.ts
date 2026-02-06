import type { Express, Request, Response } from 'express';
import express from 'express';
import ViteExpress from 'vite-express';
import { createGame, makeMove, games } from './gameStore'
import type { Player } from './src/tic-tac-toe'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
app.use(express.json());

const isProduction = process.env.NODE_ENV === 'production';

// In production, serve static files from dist
if (isProduction) {
    app.use(express.static(path.join(__dirname, 'dist')));
} else {
    // Configure vite-express to not intercept API routes in development
    ViteExpress.config({ ignorePaths: /^\/api/ });
}

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

// In production, serve index.html for all non-API routes (SPA fallback)
if (isProduction) {
    app.use((req: Request, res: Response) => {
        // Only serve index.html for GET requests that aren't API routes
        if (req.method === 'GET' && !req.path.startsWith('/api')) {
            res.sendFile(path.join(__dirname, 'dist', 'index.html'));
        }
    });
}

const port = process.env.PORT || 3000;

if (isProduction) {
    app.listen(port, () => {
        console.log(`Production server listening on port ${port}`);
    });
} else {
    ViteExpress.listen(app, port as number, () => {
        console.log(`Development server listening on port ${port}`);
    });
}

export default app