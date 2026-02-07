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
  rowsClaimed: Map<string, Player>
  endState: WinState
  id: string
}