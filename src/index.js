import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';


class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}


class Results extends React.Component {
  render() {
    let gameResult;

    if (this.props.finalist) {
      gameResult = 'Winner : ' + this.props.finalist;
    } else {
      gameResult = 'Draw!';
    }

    return (
      <div>
        <p>{gameResult}</p>
        <button className="restartbtn" onClick={this.props.onRestart}>Play Again</button>
      </div>
    )
  }
}


class Board extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState()

    this.props.onReady(() => {
      this.restartGame()
    })
  }

  getInitialState() {
    return {
      squares: Array(9).fill(null),
      xIsNext: true,
    }
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });

    const winner = calculateWinner(squares);
    const boardfull = isBoardFull(squares);
    const gameOver = winner || boardfull
    if (gameOver) {
      this.props.onGameOver(winner)
    }
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  restartGame() {
    this.props.onGameStart();

    const newState = this.getInitialState()
    this.setState(newState)
  }

  render() {

    const winner = calculateWinner(this.state.squares);
    const boardfull = isBoardFull(this.state.squares);
    const gameOver = winner || boardfull
    let status;

    if (gameOver) {
      status = '';
    } else {
      status = 'Next player :' + (this.state.xIsNext ? ' X' : ' O');
    }


    return (
      <div className="gametable">
        <div className="title">Tic-Tac-Toe</div>
        <div className="status">{status}</div>
        <div className="board-row" id="top-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row" id="middle-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row" id="bottom-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        {/* <button className="restart" onClick={this.restartGame.bind(this)}>Restart Game</button> */}
      </div>
    );
  }
}

class Game extends React.Component {
  boardRestartFunc = null;

  constructor(props) {
    super(props)

    this.state = {
      winner: null,
      isGameOver: false
    }
  }

  onGameOver(winner) {
    this.setState({
      winner: winner,
      isGameOver: true
    })
  }

  onGameStart() {
    const newState = { ...this.state }
    newState.isGameOver = false

    this.setState(newState)
  }

  onBoardReady(restartBoard) {
    this.boardRestartFunc = restartBoard
  }

  onRestartClicked() {
    this.boardRestartFunc()
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board
            onReady={this.onBoardReady.bind(this)}
            onGameOver={this.onGameOver.bind(this)}
            onGameStart={this.onGameStart.bind(this)}
          />
        </div>


        {this.state.isGameOver &&
          <div className="results">
            <Results
              finalist={this.state.winner}
              onRestart={this.onRestartClicked.bind(this)} />
          </div>
        }
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function isBoardFull(squares) {
  for (let i = 0; i < squares.length; i++) {
    const square = squares[i];
    if (square == null) {
      return false;
    }
  }
  return true;
}