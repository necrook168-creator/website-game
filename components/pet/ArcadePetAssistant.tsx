"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import styles from "./ArcadePetAssistant.module.css";

type PetState =
  | "idle"
  | "running-right"
  | "running-left"
  | "waving"
  | "jumping"
  | "failed"
  | "waiting"
  | "running"
  | "review";

type Message = {
  id: number;
  role: "pet" | "user";
  text: string;
};

type ReplyPlan = {
  text: string;
  state: PetState;
};

const PET_ROWS: Record<PetState, number> = {
  idle: 0,
  "running-right": 1,
  "running-left": 2,
  waving: 3,
  jumping: 4,
  failed: 5,
  waiting: 6,
  running: 7,
  review: 8
};

const PET_FRAMES: Record<PetState, number> = {
  idle: 6,
  "running-right": 8,
  "running-left": 8,
  waving: 4,
  jumping: 5,
  failed: 8,
  waiting: 6,
  running: 6,
  review: 6
};

const PET_SPEED: Record<PetState, number> = {
  idle: 240,
  "running-right": 110,
  "running-left": 110,
  waving: 180,
  jumping: 150,
  failed: 180,
  waiting: 220,
  running: 180,
  review: 170
};

const QUICK_QUESTIONS = ["推荐一个小游戏", "这个网站是做什么的？", "怎么联系你们？"];

const BUBBLE_LINES = ["点我聊天", "我会推荐游戏", "也能帮你找公司资料"];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: "pet",
    text: "你好呀，我叫小焰，是这个游戏站的小向导。你可以问我推荐玩哪个小游戏，或者直接问公司资料。"
  }
];

function buildReply(input: string): ReplyPlan {
  const normalized = input.trim().toLowerCase();

  if (!normalized) {
    return {
      text: "你发的是空白消息，我先陪你站一会儿。想聊的话，可以直接问我“推荐一个小游戏”。",
      state: "waiting"
    };
  }

  if (normalized.includes("你好") || normalized.includes("hello") || normalized.includes("hi")) {
    return {
      text: "你好呀，欢迎来到 Arcade Sextet。你想找轻松一点的小游戏，还是想看看适合亲子一起玩的内容？",
      state: "waving"
    };
  }

  if (
    normalized.includes("推荐") ||
    normalized.includes("玩什么") ||
    normalized.includes("小游戏") ||
    normalized.includes("game")
  ) {
    return {
      text: "如果你想马上上手，我推荐先玩“反应测速”，规则最简单，点开就能玩。要是想两个人一起玩，“石头剪刀布”和“三子棋”更适合边玩边互动。",
      state: "jumping"
    };
  }

  if (
    normalized.includes("数学") ||
    normalized.includes("心算") ||
    normalized.includes("算数") ||
    normalized.includes("math")
  ) {
    return {
      text: "那就试试“心算冲刺”。页面感觉会更像一轮快节奏抢答，数字一出来就得马上算，比较适合想练专注和反应的时候玩。",
      state: "running"
    };
  }

  if (
    normalized.includes("记忆") ||
    normalized.includes("配对") ||
    normalized.includes("memory")
  ) {
    return {
      text: "“记忆配对”会比较温和一点，画面上是一张张卡片慢慢翻开，适合小朋友或者想轻松玩一会儿的时候。",
      state: "review"
    };
  }

  if (
    normalized.includes("公司") ||
    normalized.includes("网站") ||
    normalized.includes("做什么") ||
    normalized.includes("介绍")
  ) {
    return {
      text: "这个网站主打亲子和儿童互动小游戏展示，既能当活动页，也能当品牌展示页。页面上方是能直接玩的游戏区，下面还有完整的公司资料和联系方式。",
      state: "review"
    };
  }

  if (
    normalized.includes("联系") ||
    normalized.includes("电话") ||
    normalized.includes("邮箱") ||
    normalized.includes("地址")
  ) {
    return {
      text: "可以这样联系：电话是 400-800-2026，邮箱是 contact@stargame-demo.com，地址在深圳市南山区科技园创意大道 88 号。",
      state: "waving"
    };
  }

  if (
    normalized.includes("谢谢") ||
    normalized.includes("thx") ||
    normalized.includes("thanks")
  ) {
    return {
      text: "不客气，我就在右下角待命。你想继续的话，也可以让我按心情帮你挑一个小游戏。",
      state: "waving"
    };
  }

  if (
    normalized.includes("不会") ||
    normalized.includes("难") ||
    normalized.includes("help")
  ) {
    return {
      text: "没关系，我们可以从最简单的开始。先玩“猜数字”或者“反应测速”最轻松，规则少，打开就能明白。",
      state: "waiting"
    };
  }

  return {
    text: "我先按“陪玩小助手”模式理解你这句话：如果你想快速开始，先玩反应测速；如果你想慢一点、适合亲子互动，就试试记忆配对。你也可以直接问我“怎么联系你们”。",
    state: "idle"
  };
}

export function ArcadePetAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [petState, setPetState] = useState<PetState>("idle");
  const [frameIndex, setFrameIndex] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [bubbleIndex, setBubbleIndex] = useState(0);
  const resetTimerRef = useRef<number | null>(null);
  const nextMessageIdRef = useRef(2);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const currentBubble = useMemo(() => {
    if (isOpen) {
      return "小焰在线";
    }

    return BUBBLE_LINES[bubbleIndex % BUBBLE_LINES.length];
  }, [bubbleIndex, isOpen]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % PET_FRAMES[petState]);
    }, PET_SPEED[petState]);

    return () => window.clearInterval(interval);
  }, [petState]);

  useEffect(() => {
    setFrameIndex(0);
  }, [petState]);

  useEffect(() => {
    if (isOpen) {
      return;
    }

    const interval = window.setInterval(() => {
      setBubbleIndex((current) => current + 1);
    }, 2800);

    return () => window.clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!messagesRef.current) {
      return;
    }

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [isThinking, messages]);

  const playPetState = (nextState: PetState, duration = 1800) => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    setPetState(nextState);
    resetTimerRef.current = window.setTimeout(() => {
      setPetState("idle");
      resetTimerRef.current = null;
    }, duration);
  };

  const appendPetReply = (plan: ReplyPlan) => {
    setMessages((current) => [
      ...current,
      { id: nextMessageIdRef.current++, role: "pet", text: plan.text }
    ]);
    setIsThinking(false);
    playPetState(plan.state);
  };

  const sendMessage = (rawText: string) => {
    const text = rawText.trim();

    if (!text) {
      return;
    }

    setMessages((current) => [
      ...current,
      { id: nextMessageIdRef.current++, role: "user", text }
    ]);
    setInput("");
    setIsThinking(true);
    playPetState("running", 1400);

    const replyPlan = buildReply(text);
    window.setTimeout(() => {
      appendPetReply(replyPlan);
    }, 720);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  const currentRow = PET_ROWS[petState];
  const spriteStyle = {
    backgroundImage: 'url("/pets/ember-ninja.webp")',
    backgroundPosition: `${-frameIndex * 96}px ${-currentRow * 104}px`
  };

  return (
    <div className={styles.shell}>
      {!isOpen ? (
        <button
          className={styles.closedBubble}
          type="button"
          onClick={() => {
            setIsOpen(true);
            playPetState("waving", 2200);
          }}
          aria-label="打开宠物聊天助手"
        >
          <span>{currentBubble}</span>
        </button>
      ) : null}

      <div className={styles.petDock}>
        <button
          className={styles.petButton}
          type="button"
          onClick={() => {
            setIsOpen((current) => !current);
            playPetState(isOpen ? "jumping" : "waving", 1800);
          }}
          aria-label={isOpen ? "收起宠物聊天助手" : "打开宠物聊天助手"}
          aria-expanded={isOpen}
        >
          <span className={styles.petStage}>
            <span className={styles.petSprite} style={spriteStyle} />
          </span>
          <span className={styles.petBadge}>{isThinking ? "思考中" : "小焰"}</span>
        </button>

        {isOpen ? (
          <section className={styles.panel} aria-label="宠物聊天面板">
            <div className={styles.panelHeader}>
              <div>
                <strong>小焰陪玩助手</strong>
                <p>能推荐小游戏，也能帮你快速看网站资料。</p>
              </div>
              <button
                className={styles.closeButton}
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  playPetState("jumping", 1400);
                }}
                aria-label="关闭聊天面板"
              >
                收起
              </button>
            </div>

            <div className={styles.quickRow}>
              {QUICK_QUESTIONS.map((question) => (
                <button
                  key={question}
                  className={styles.quickChip}
                  type="button"
                  onClick={() => sendMessage(question)}
                >
                  {question}
                </button>
              ))}
            </div>

            <div className={styles.messages} aria-live="polite" ref={messagesRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === "pet" ? styles.petMessage : styles.userMessage}
                >
                  {message.text}
                </div>
              ))}
              {isThinking ? <div className={styles.petMessage}>我在帮你整理一句好懂的话...</div> : null}
            </div>

            <form className={styles.composer} onSubmit={handleSubmit}>
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onFocus={() => playPetState("review", 1800)}
                placeholder="比如：推荐一个适合小朋友的小游戏"
                aria-label="输入你想和宠物说的话"
              />
              <button type="submit">发送</button>
            </form>
          </section>
        ) : null}
      </div>
    </div>
  );
}
