"use client";

import { useEffect, useState } from "react";
import cardStyles from "./GameCard.module.css";
import styles from "./QuickMathGame.module.css";

type Challenge = {
  left: number;
  right: number;
  operator: "+" | "-";
};

function createChallenge(): Challenge {
  const operator = Math.random() > 0.45 ? "+" : "-";
  const left = Math.floor(Math.random() * 20) + 1;
  const right = Math.floor(Math.random() * 20) + 1;

  if (operator === "-") {
    return {
      left: Math.max(left, right),
      right: Math.min(left, right),
      operator
    };
  }

  return { left, right, operator };
}

function getAnswer(challenge: Challenge) {
  return challenge.operator === "+"
    ? challenge.left + challenge.right
    : challenge.left - challenge.right;
}

const initialChallenge: Challenge = {
  left: 8,
  right: 6,
  operator: "+"
};

export function QuickMathGame() {
  const [challenge, setChallenge] = useState<Challenge>(initialChallenge);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState({ correct: 0, streak: 0 });
  const [status, setStatus] = useState("输入答案，看看你能不能把连对数叠起来。");

  useEffect(() => {
    setChallenge(createChallenge());
  }, []);

  const submitAnswer = () => {
    const value = Number(answer);
    if (!Number.isFinite(value)) {
      setStatus("先输入一个数字答案。");
      return;
    }

    const expected = getAnswer(challenge);

    if (value === expected) {
      setScore((current) => ({
        correct: current.correct + 1,
        streak: current.streak + 1
      }));
      setStatus(`答对了，${challenge.left} ${challenge.operator} ${challenge.right} = ${expected}。`);
    } else {
      setScore((current) => ({
        correct: current.correct,
        streak: 0
      }));
      setStatus(`这题答案是 ${expected}，连对数已重置。`);
    }

    setAnswer("");
    setChallenge(createChallenge());
  };

  const resetGame = () => {
    setScore({ correct: 0, streak: 0 });
    setAnswer("");
    setChallenge(createChallenge());
    setStatus("成绩已清空，重新热身。");
  };

  return (
    <article className={cardStyles.card}>
      <h2>心算冲刺</h2>
      <p className={cardStyles.copy}>
        快速做加减法，小题连着来。它不复杂，但很适合放在一堆轻量小游戏里当作节奏切换。
      </p>
      <div className={cardStyles.status}>{status}</div>
      <div className={styles.panel}>
        <div className={styles.score}>
          <div className={cardStyles.pill}>答对 {score.correct}</div>
          <div className={cardStyles.pill}>连对 {score.streak}</div>
        </div>
        <div className={styles.row}>
          <div className={styles.prompt}>
            {challenge.left} {challenge.operator} {challenge.right} = ?
          </div>
          <input
            className={styles.input}
            onChange={(event) => setAnswer(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitAnswer();
              }
            }}
            placeholder="输入答案"
            type="number"
            value={answer}
          />
        </div>
        <div className={styles.board}>
          <div className={cardStyles.buttonRow} style={{ marginTop: 0 }}>
            <button className={cardStyles.button} onClick={submitAnswer} type="button">
              提交答案
            </button>
            <button
              className={`${cardStyles.button} ${cardStyles.secondary}`}
              onClick={resetGame}
              type="button"
            >
              重置成绩
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
