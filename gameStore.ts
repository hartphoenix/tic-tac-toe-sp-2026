import type { GameState, Board, Player } from './src/tic-tac-toe'
import { getWinner } from './src/tic-tac-toe'

export const games: Map<string, GameState> = new Map()

export function createGame(): GameState {
  const newGame: GameState = {
    board: [
      null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null
    ],
    currentPlayer: "X",
    endState: null,
    id: crypto.randomUUID()
  }
  games.set(newGame.id, newGame)
  return newGame
}

export const changePlayer = (player: Player): Player => {
  if (player === "X") return "O"
  else return "X"
}

export function makeMove(state: GameState, position: number): GameState {
  if (position < 0 || position > 26) {
    throw new Error("Position must be between 0 and 26")
  }
  if (position % 1 !== 0) {
    throw new Error("Position must be an integer")
  }
  if (state.board[position] !== null) {
    throw new Error("Position is already occupied")
  }
  if (state.endState !== null) {
    throw new Error("Game is already over")
  }

  const newBoard: Board = [...state.board]
  newBoard[position] = state.currentPlayer
  const newPlayer = changePlayer(state.currentPlayer)
  const winner = getWinner({
    board: newBoard,
    currentPlayer: state.currentPlayer,
    endState: state.endState,
    id: state.id
  })
  const newState: GameState = {
    board: newBoard,
    currentPlayer: newPlayer,
    endState: winner,
    id: state.id
  }
  games.set(state.id, newState)
  return newState
}