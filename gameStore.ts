import type { GameState } from './src/tic-tac-toe'

const games: Map<string, GameState> = new Map()

export function createGame(): GameState {
    return {
        board: [
            null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null,
            null, null, null, null, null, null, null, null, null
        ],
        currentPlayer: "X",
        endState: null,
        id: crypto.randomUUID()
    };
}