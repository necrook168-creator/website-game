"use client";

import { useEffect, useRef, useState } from "react";
import cardStyles from "./GameCard.module.css";
import styles from "./GuessNumberGame.module.css";

function createTarget() {
  return Math.floor(Math.random() * 100) + 1;
}

export function GuessNumberGame() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [target, setTarget] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("输入一个 1 到 100 的数字开始挑战。");

  useEffect(() => {
    setTarget(createTarget());
    setStatus("新数字已经准备好了，试着一次猜中。");
  }, []);

  const resetGame = () => {
    setTarget(createTarget());
    setAttempts(0);
    setHistory([]);
    setInputValue("");
    setStatus("新数字已经准备好了，试着一次猜中。");
  };

  const submitGuess = () => {
    const value = Number(inputValue);
    if (!Number.isInteger(value) || value < 1 || value > 100) {
      setStatus("请输入 1 到 100 的整数。");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (value === target) {
      setHistory((current) => [`第 ${nextAttempts} 次猜中 ${value}`, ...current].slice(0, 6));
      setStatus(`猜中了。总共用了 ${nextAttempts} 次。`);
      return;
    }

    if (value < target) {
      setHistory((current) => [`${value} 太小`, ...current].slice(0, 6));
      setStatus("还不够大，继续往上猜。");
    } else {
      setHistory((current) => [`${value} 太大`, ...current].slice(0, 6));
      setStatus("有点高了，往下收一点。");
    }

    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <article className={cardStyles.card}>
      <h2>猜数字</h2>
      <p className={cardStyles.copy}>
        系统会随机生成 1 到 100 的数字。每次输入后会提示偏大还是偏小，尽量用更少次数把它抓出来。
      </p>
      <div className={cardStyles.status}>{status}</div>
      <div className={styles.panel}>
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            className={styles.input}
            max="100"
            min="1"
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitGuess();
              }
            }}
            placeholder="输入 1 - 100"
            type="number"
            value={inputValue}
          />
          <button className={cardStyles.button} onClick={submitGuess} type="button">
            猜一下
          </button>
          <button
            className={`${cardStyles.button} ${cardStyles.secondary}`}
            onClick={resetGame}
            type="button"
          >
            换新数字
          </button>
        </div>
        <div className={styles.log}>
          <strong>历史记录</strong>
          {history.length === 0 ? "暂时还没有猜测。" : history.join(" ，")}
        </div>
      </div>
    </article>
  );
}
