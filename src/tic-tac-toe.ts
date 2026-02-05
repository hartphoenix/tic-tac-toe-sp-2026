import { winLines } from './winLogic'
export type Player = "X" | "O";

export type Cell = Player | null;

export type Board = [
  Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell,
  Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell,
  Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell,
];

type WinState = Player | 'tie' | null

export type GameState = {
  board: Board
  currentPlayer: Player
  endState: WinState
  id: string
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
  return newState
}

const tripleWins = (state: GameState, n: number[]): boolean => {
  if (state.board[n[0]] && state.board[n[0]] === state.board[n[1]] && state.board[n[1]] === state.board[n[2]]) {
    return true
  } else return false
}

export function getWinner(state: GameState): Player | null {
  for (const line of winLines) {
    if (tripleWins(state, line)) return state.board[line[0]]
  }
  return null;
}