"use client";

import { useEffect, useRef, useState } from "react";
import cardStyles from "./GameCard.module.css";
import styles from "./ReactionGame.module.css";

type ReactionState = "idle" | "waiting" | "ready" | "too-soon";

const contentByState: Record<ReactionState, { title: string; subtitle: string }> = {
  idle: { title: "等待开始", subtitle: "绿色一出现就点我" },
  waiting: { title: "专注一下", subtitle: "信号会随机出现" },
  ready: { title: "现在点击", subtitle: "就是这一瞬间" },
  "too-soon": { title: "抢跑了", subtitle: "再来一次会更稳" }
};

export function ReactionGame() {
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef(0);
  const [best, setBest] = useState<number | null>(null);
  const [status, setStatus] = useState("按下“开始挑战”，等待信号出现。");
  const [reactionState, setReactionState] = useState<ReactionState>("idle");

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startGame = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setReactionState("waiting");
    setStatus("等待绿色信号，别提前点。");

    timerRef.current = window.setTimeout(() => {
      startTimeRef.current = performance.now();
      setReactionState("ready");
      setStatus("点测试区。越快越好。");
    }, 1200 + Math.random() * 2400);
  };

  const resetGame = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    setBest(null);
    setReactionState("idle");
    setStatus("成绩已清空，随时可以重新开始。");
  };

  const handlePadClick = () => {
    if (reactionState === "waiting") {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      setReactionState("too-soon");
      setStatus("抢跑，重新点击“开始挑战”试试。");
      return;
    }

    if (reactionState !== "ready") {
      return;
    }

    const elapsed = Math.round(performance.now() - startTimeRef.current);
    const nextBest = best === null ? elapsed : Math.min(best, elapsed);
    setBest(nextBest);
    setReactionState("idle");
    setStatus(`本次 ${elapsed} ms，最佳 ${nextBest} ms。`);
  };

  const content = contentByState[reactionState];

  return (
    <article className={cardStyles.card}>
      <h2>反应测速</h2>
      <p className={cardStyles.copy}>
        点击开始后等待颜色变绿，再立刻点击测试区。点早了会判定抢跑，点准了就会记录你的反应时间。
      </p>
      <div className={cardStyles.status}>{status}</div>
      <div className={cardStyles.buttonRow}>
        <button className={cardStyles.button} onClick={startGame} type="button">
          开始挑战
        </button>
        <button
          className={`${cardStyles.button} ${cardStyles.secondary}`}
          onClick={resetGame}
          type="button"
        >
          重置成绩
        </button>
      </div>
      <button
        className={[
          styles.pad,
          reactionState === "ready" ? styles.ready : "",
          reactionState === "too-soon" ? styles.tooSoon : ""
        ].join(" ")}
        onClick={handlePadClick}
        type="button"
      >
        <span>
          <strong>{content.title}</strong>
          <span>{content.subtitle}</span>
        </span>
      </button>
    </article>
  );
}
