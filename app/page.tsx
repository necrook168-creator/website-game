import styles from "./page.module.css";
import { GuessNumberGame } from "@/components/games/GuessNumberGame";
import { McdonaldsBattleGame } from "@/components/games/McdonaldsBattleGame";
import { MemoryMatchGame } from "@/components/games/MemoryMatchGame";
import { ArcadePetAssistant } from "@/components/pet/ArcadePetAssistant";
import { QuickMathGame } from "@/components/games/QuickMathGame";
import { ReactionGame } from "@/components/games/ReactionGame";
import { RockPaperScissorsGame } from "@/components/games/RockPaperScissorsGame";
import { TicTacToeGame } from "@/components/games/TicTacToeGame";

const companyInfo = [
  ["公司名称", "星跃互动科技有限公司"],
  ["公司地址", "广东省深圳市南山区科技园创意大道 88 号"],
  ["联系电话", "400-800-2026"],
  ["商务邮箱", "contact@stargame-demo.com"],
  [
    "公司简介",
    "专注儿童互动内容、轻量网页游戏与亲子娱乐体验设计，提供创意策划、页面开发与活动展示服务。"
  ],
  ["服务时间", "周一至周五 09:00 - 18:00"]
] as const;

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Playful Digital Atelier</span>
          <h1>Arcade Sextet</h1>
          <p>
            像走进一间带霓虹余温的小型互动工作室。这里不是一张普通的游戏目录，而是一组节奏各异的微型表演:
            反应、记忆、判断、心算、棋盘博弈和一点点运气，轮流上场，把页面变成可以直接参与的轻盈展览。
          </p>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <strong>7</strong>
            <span>内置小游戏</span>
          </div>
          <div className={styles.stat}>
            <strong>Next.js</strong>
            <span>应用框架</span>
          </div>
          <div className={styles.stat}>
            <strong>14:30</strong>
            <span>预约时间</span>
          </div>
        </div>
      </section>

      <section className={styles.games}>
        <McdonaldsBattleGame />
        <ReactionGame />
        <MemoryMatchGame />
        <GuessNumberGame />
        <RockPaperScissorsGame />
        <TicTacToeGame />
        <QuickMathGame />
      </section>

      <section className={styles.infoSection} aria-labelledby="companyInfoTitle">
        <h2 className={styles.sectionHeading} id="companyInfoTitle">
          公司资料
        </h2>
        <p className={styles.sectionCopy}>
          如果你想进一步了解品牌背景或预约合作，可以直接看这里。公司介绍、联系方法和服务时间都已经整理好，适合直接给家长、合作方或活动主办方查看。
        </p>
        <div className={styles.companyGrid}>
          {companyInfo.map(([label, value]) => (
            <div className={styles.companyItem} key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.footerNote}>Arcade Sextet 以轻巧、明快的互动体验，为亲子与儿童场景提供网页游戏灵感。</div>
      <ArcadePetAssistant />
    </main>
  );
}
