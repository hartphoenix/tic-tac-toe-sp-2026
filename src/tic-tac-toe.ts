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