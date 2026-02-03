export type Player = "X" | "O";

export type Cell = Player | null;

// Board is a 3x3 grid, represented as a 9-element array.
// Indices map to positions:
//  0 | 1 | 2
//  ---------
//  3 | 4 | 5
//  ---------
//  6 | 7 | 8
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell];

export type GameState = {
  board: Board;
  currentPlayer: Player;
};

export function createGame(): GameState {
  return {
    board: [null, null, null, null, null, null, null, null, null],
    currentPlayer: "X",
  };
}

export const changePlayer = (player: Player):Player => {
  if (player === "X") return "O"
  if (player === "O") return "X"
}

export function makeMove(state: GameState, position: number): GameState {
  const newBoard:Cell[] = [...state.board]
  newBoard[position] = state.currentPlayer
  const newPlayer = changePlayer(state.currentPlayer)
  const newState:GameState = { board: newBoard, currentPlayer: newPlayer} 
  return newState
}

export function getWinner(state: GameState): Player | null {
  return null;
}
