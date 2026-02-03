
import { makeMove, getWinner } from "./tic-tac-toe"
import type { GameState, Cell } from "./tic-tac-toe"
import type { JSX } from "react"
type BoardProps = {
  gameState: GameState
  setGameState: (state: GameState) => void
}
export const Board = (props: BoardProps) => {

  const handleClick = (position: number): void => {
    props.setGameState(makeMove(props.gameState, position))
  }
  const buttons: JSX.Element[] = props.gameState.board.map((pos: Cell, ind: number) => (
    <button
      disabled={pos !== null || getWinner(props.gameState) !== null ? true : false}
      onClick={() => handleClick(ind)}>{props.gameState.board[ind]
        ? props.gameState.board[ind]
        : "_"
      }</button>
  ))
  return (
    <table>
      <tbody>
        <tr>
          <td>{buttons[0]}</td>
          <td>{buttons[1]}</td>
          <td>{buttons[2]}</td>
        </tr>
        <tr>
          <td>{buttons[3]}</td>
          <td>{buttons[4]}</td>
          <td>{buttons[5]}</td>
        </tr>
        <tr>
          <td>{buttons[6]}</td>
          <td>{buttons[7]}</td>
          <td>{buttons[8]}</td>
        </tr>
      </tbody>
    </table>
  )
}