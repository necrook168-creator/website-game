"use client";

import { useState } from "react";
import cardStyles from "./GameCard.module.css";
import styles from "./TicTacToeGame.module.css";

type Cell = "X" | "O" | null;
type Score = { player: number; draw: number; computer: number };

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
] as const;

function getWinner(board: Cell[]) {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function getComputerMove(board: Cell[]) {
  const emptyIndexes = board
    .map((cell, index) => (cell === null ? index : -1))
    .filter((index) => index !== -1);

  if (emptyIndexes.length === 0) {
    return null;
  }

  return emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
}

export function TicTacToeGame() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [score, setScore] = useState<Score>({ player: 0, draw: 0, computer: 0 });
  const [status, setStatus] = useState("你先手，用 X 落子，试着抢到三连。");

  const resetRound = (message = "新一轮开始，你先手。") => {
    setBoard(Array(9).fill(null));
    setStatus(message);
  };

  const handleWinState = (nextBoard: Cell[], winner: "X" | "O") => {
    setBoard(nextBoard);

    if (winner === "X") {
      setScore((current) => ({ ...current, player: current.player + 1 }));
      setStatus("你赢了，这一局拿下。");
      return true;
    }

    setScore((current) => ({ ...current, computer: current.computer + 1 }));
    setStatus("电脑连成了三子，再来一局。");
    return true;
  };

  const handleCellClick = (index: number) => {
    if (board[index] || getWinner(board)) {
      return;
    }

    const playerBoard = board.map((cell, cellIndex) => (cellIndex === index ? "X" : cell));
    const playerWinner = getWinner(playerBoard);

    if (playerWinner) {
      handleWinState(playerBoard, playerWinner);
      return;
    }

    if (playerBoard.every(Boolean)) {
      setBoard(playerBoard);
      setScore((current) => ({ ...current, draw: current.draw + 1 }));
      setStatus("平局，这盘谁都没让步。");
      return;
    }

    const computerMove = getComputerMove(playerBoard);
    if (computerMove === null) {
      return;
    }

    const computerBoard = playerBoard.map((cell, cellIndex) =>
      cellIndex === computerMove ? "O" : cell
    );
    const computerWinner = getWinner(computerBoard);

    if (computerWinner) {
      handleWinState(computerBoard, computerWinner);
      return;
    }

    if (computerBoard.every(Boolean)) {
      setBoard(computerBoard);
      setScore((current) => ({ ...current, draw: current.draw + 1 }));
      setStatus("平局，电脑也没找到突破口。");
      return;
    }

    setBoard(computerBoard);
    setStatus(`你下在 ${index + 1} 号格，轮到下一手了。`);
  };

  return (
    <article className={cardStyles.card}>
      <h2>三子棋</h2>
      <p className={cardStyles.copy}>
        你用 X，电脑用 O。每回合在 3x3 棋盘里抢三连，节奏比大型棋类更轻，但也很容易上头。
      </p>
      <div className={styles.panel}>
        <div className={styles.score}>
          <div className={cardStyles.pill}>你 {score.player}</div>
          <div className={cardStyles.pill}>平 {score.draw}</div>
          <div className={cardStyles.pill}>电脑 {score.computer}</div>
        </div>
        <div className={styles.grid}>
          {board.map((cell, index) => (
            <button
              key={index}
              aria-label={`棋盘格 ${index + 1}`}
              className={styles.cell}
              onClick={() => handleCellClick(index)}
              type="button"
            >
              {cell}
            </button>
          ))}
        </div>
        <div className={styles.board}>
          <div className={styles.result}>{status}</div>
          <div className={cardStyles.buttonRow} style={{ marginTop: 0 }}>
            <button
              className={`${cardStyles.button} ${cardStyles.secondary}`}
              onClick={() => resetRound()}
              type="button"
            >
              重新开局
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
