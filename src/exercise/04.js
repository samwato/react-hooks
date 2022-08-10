// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

function Board({ squares, selectSquare }) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {

  const [history, setHistory] = useLocalStorageState('history', [Array(9).fill(null)])
  const [currentStep, setCurrentStep] = useLocalStorageState('currentStep', 0)

  const currentSquares = history[currentStep]
  const nextValue = calculateNextValue(currentSquares)
  const winner = calculateWinner(currentSquares)
  const status = calculateStatus(winner, currentSquares, nextValue)

  function selectSquare(square) {
    if (currentSquares[square] || winner) {
      return
    }
    const squaresCopy = [...currentSquares]
    squaresCopy[square] = nextValue
    setHistory(prevHistory => {
      prevHistory.splice(currentStep + 1, prevHistory.length, squaresCopy)
      return prevHistory
    })
    setCurrentStep(prevStep => prevStep + 1)
  }

  function restart() {
    setHistory([Array(9).fill(null)])
    setCurrentStep(0)
  }

  const moves = history.map((move, index) => {
    let moveMessage = `Go to move #${index + 1}`
    if (index === 0) {
      moveMessage = 'Go to game start'
    }
    if (index === currentStep) {
      moveMessage += ' (current)'
    }
    return (
      <li key={index}>
        <button onClick={() => setCurrentStep(index)} disabled={index === currentStep}>
          {moveMessage}
        </button>
      </li>
    )
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={currentSquares} selectSquare={selectSquare} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
