import Image from "next/image";
import styles from "./page.module.css";
import { GuessNumberGame } from "@/components/games/GuessNumberGame";
import { MemoryMatchGame } from "@/components/games/MemoryMatchGame";
import { QuickMathGame } from "@/components/games/QuickMathGame";
import { ReactionGame } from "@/components/games/ReactionGame";
import { RockPaperScissorsGame } from "@/components/games/RockPaperScissorsGame";
import { TicTacToeGame } from "@/components/games/TicTacToeGame";

const photos = [
  {
    src: "https://plus.unsplash.com/premium_photo-1744726607399-be9b8c84881d?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200",
    alt: "两个孩子在街机前一起玩游戏",
    caption: "街机场景里的对战时刻，画面颜色很亮，和页面的游戏氛围比较搭。"
  },
  {
    src: "https://images.unsplash.com/photo-1770652453111-c38e37f5e6ad?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200",
    alt: "几个孩子围坐在一起玩桌面游戏",
    caption: "桌游画面更偏轻松陪伴感，能把“玩游戏”从电子游戏扩展到互动游戏。"
  },
  {
    src: "https://images.unsplash.com/photo-1721930878634-41c6f5f0746f?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200",
    alt: "一群孩子蹲在地上一起玩寻宝游戏",
    caption: "户外合作游戏的镜头，把页面视觉从室内延伸到更自然、更活泼的场景。"
  },
  {
    src: "https://images.unsplash.com/photo-1654398957574-fcff716ab2c4?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=80&w=1200",
    alt: "小男孩在屏幕前专注地玩游戏",
    caption: "单人专注游玩的镜头，正好和上面的小游戏内容形成呼应。"
  }
] as const;

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
        <div className={styles.heroIntro}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Playful Digital Atelier</span>
            <h1>Arcade Sextet</h1>
            <p>
              像走进一间带霓虹余温的小型互动工作室。这里不是一张普通的游戏目录，而是一组节奏各异的微型表演:
              反应、记忆、判断、心算、棋盘博弈和一点点运气，轮流上场，把页面变成可以直接参与的轻盈展览。
            </p>
          </div>
          <figure className={styles.heroPortrait}>
            <Image
              src="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&fm=jpg&q=80&w=1200"
              alt="站在聚光灯下的表演艺术家剪影"
              width={1200}
              height={1400}
              className={styles.heroPortraitImage}
              priority
            />
            <figcaption>以舞台感和创作氛围打开这个小游戏首页。</figcaption>
          </figure>
        </div>
        <div className={styles.heroStats}>
          <div className={styles.stat}>
            <strong>6</strong>
            <span>内置小游戏</span>
          </div>
          <div className={styles.stat}>
            <strong>Next.js</strong>
            <span>应用框架</span>
          </div>
          <div className={styles.stat}>
            <strong>1</strong>
            <span>个首页体验</span>
          </div>
        </div>
      </section>

      <section className={styles.infoSection} aria-labelledby="kidsGalleryTitle">
        <h2 className={styles.sectionHeading} id="kidsGalleryTitle">
          孩子游戏时刻
        </h2>
        <p className={styles.sectionCopy}>
          补上一组 4 张孩子在玩游戏的现场图片，让页面更有活力，也更贴合这个小游戏网站的主题。
        </p>
        <div className={styles.photoGrid}>
          {photos.map((photo) => (
            <figure className={styles.photoCard} key={photo.src}>
              <Image
                src={photo.src}
                alt={photo.alt}
                width={1200}
                height={900}
                className={styles.photo}
              />
              <figcaption>{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.games}>
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
          这里先放一版完整的公司信息展示，适合做网站底部介绍。如果你后面给我真实资料，我也可以直接替换成正式内容。
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

      <div className={styles.footerNote}>
        现在改成了 Next.js 项目，使用开发服务器和构建命令运行。
      </div>
    </main>
  );
}
