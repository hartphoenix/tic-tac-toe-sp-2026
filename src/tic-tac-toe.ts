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

export const changePlayer = (player: Player): Player => {
  if (player === "X") return "O"
  if (player === "O") return "X"
}

export function makeMove(state: GameState, position: number): GameState {
  const newBoard: Board = [...state.board]
  newBoard[position] = state.currentPlayer
  const winner = getWinner({ board: newBoard, currentPlayer: state.currentPlayer })
  if (winner) {
    console.log("WINNER:", winner)
  }
  const newPlayer = changePlayer(state.currentPlayer)
  const newState: GameState = { board: newBoard, currentPlayer: newPlayer }
  return newState
}

export function getWinner(state: GameState): Player | null {
  if ((state.board[0] && state.board[0] === state.board[1] && state.board[1] === state.board[2]) // horizontal
    || (state.board[3] && state.board[3] === state.board[4] && state.board[4] === state.board[5]) // horizontal
    || (state.board[6] && state.board[6] === state.board[7] && state.board[7] === state.board[8]) // horizontal
    || (state.board[0] && state.board[0] === state.board[4] && state.board[4] === state.board[8]) // diagonal
    || (state.board[2] && state.board[2] === state.board[4] && state.board[4] === state.board[6]) // diagonal
    || (state.board[0] && state.board[0] === state.board[3] && state.board[3] === state.board[6]) // vertical
    || (state.board[1] && state.board[1] === state.board[4] && state.board[4] === state.board[7]) // vertical
    || (state.board[2] && state.board[2] === state.board[5] && state.board[5] === state.board[8]) // vertical
  ) { return state.currentPlayer }
  return null;
}
