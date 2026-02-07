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
  score: { X: number, O: number }
  endState: WinState
  id: string
}

export const getScore = (board: Board): { X: number, O: number } => {
  let xScore = 0
  let oScore = 0
  for (const line of winLines) {
    if (board[line[0]] // all positions are occupied by the same player
      && board[line[0]] === board[line[1]]
      && board[line[1]] === board[line[2]]) {
      if (board[line[0]] === "X") { xScore++ } else { oScore++ }
    }
  }
  console.log("score returned:", { X: xScore, O: oScore })
  return { X: xScore, O: oScore }
}

export const getWinner = (score: { X: number, O: number }): Player | null => {
  if (score.X === 3) { return "X" }
  if (score.O === 3) { return "O" }
  return null;
}