import type { GameState, Board, Player } from './src/tic-tac-toe'
import { winLines } from './winLogic'

export const games: Map<string, GameState> = new Map()

export function createGame(): GameState {
  const newGame: GameState = {
    board: [
      null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null
    ],
    score: { X: 0, O: 0 },
    rowsClaimed: new Map<string, Player>(),
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

export const getWinner = ({ X, O }: { X: number, O: number }): Player | null => {
  if (X >= 3) { return "X" }
  if (O >= 3) { return "O" }
  return null;
}
export const getScore = (rows: Map<string, Player>): { X: number, O: number } => {
  const X = Array.from(rows.values()).filter(val => val === "X").length
  const O = Array.from(rows.values()).filter(val => val === "O").length
  return { X, O }
}

export const getRows = (board: Board): Map<string, Player> => {
  const rows = new Map<string, Player>()
  for (const line of winLines) {
    if (board[line[0]] // all positions are occupied by the same player
      && board[line[0]] === board[line[1]]
      && board[line[1]] === board[line[2]]) {
      if (board[line[0]] === "X") {
        rows.set(JSON.stringify(line), "X")
      } else {
        rows.set(JSON.stringify(line), "O")
      }
    }
  }
  return rows
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
  const newRows = getRows(newBoard)
  const newScore = getScore(newRows)
  const winner = getWinner(newScore)
  const newState: GameState = {
    board: newBoard,
    score: newScore,
    rowsClaimed: newRows,
    currentPlayer: newPlayer,
    endState: winner,
    id: state.id
  }
  games.set(state.id, newState)
  return newState
}