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
  else return "X"
}

export function makeMove(state: GameState, position: number): GameState {
  if (position < 0 || position > 8) {
    throw new Error("Position must be between 0 and 8")
  }
  if (position % 1 !== 0) {
    throw new Error("Position must be an integer")
  }
  if (state.board[position] !== null) {
    throw new Error("Position is already occupied")
  }
  if (getWinner(state) !== null) {
    throw new Error("Game is already over")
  }

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

const tripleWins = (state: GameState, n: number[]): boolean => {
  if (state.board[n[0]] && state.board[n[0]] === state.board[n[1]] && state.board[n[1]] === state.board[n[2]]) {
    return true
  } else return false
}

export function getWinner(state: GameState): Player | null {
  const winLines: Array<Array<number>> = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontals
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // verticals
    [0, 4, 8], [2, 4, 6] //          diagonals
  ]
  for (const line of winLines) {
    if (tripleWins(state, line)) return state.board[line[0]]
  }
  return null;
}