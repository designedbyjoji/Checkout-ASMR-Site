"use client";

import Link from "next/link";
import { Icon, Section, SectionHeading } from "../shared";
import { gateways } from "../site-content";
import { Mission } from "./about-page";
import { MissionStory, Scene, ease, mix, range } from "./about-mission-story";

/**
 * 首頁（網址 /）：主視覺 Hero ＋ 捲動故事 ＋ 三個入口卡片
 */

// ─────────────── 首頁段落順序 ───────────────

/**
 * 首頁內容。想調整首頁段落順序，請改這個檔案。
 *   Hero（大標題）→ 往下滑的捲動故事（5 幕，跟「創立初衷」同一套）→ 三個入口卡片
 */
export default function HomePage() {
  return (
    <div className="page-home contents">
      <Hero />
      <MissionStory fallback={<Mission />} />
      <Gateways />
    </div>
  );
}

// ─────────────── 首頁主視覺 Hero ───────────────

/** 首屏：只有大標題和兩行敘述；往下滑時慢慢淡出、縮小，接著進入捲動故事。 */
export function Hero() {
  return (
    <div id="top">
      <Scene screens={1.3}>
        {(p) => {
          const out = ease(range(p, 0.1, 1)); // 不完全消失，留一點點讓它自然被捲走，避免出現一整個空白畫面
          return (
            <>
              {/* 往下滑提示：畫面底部一個慢慢上下飄的小箭頭，一開始捲動就淡出 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-[calc(2rem+env(safe-area-inset-bottom))] flex justify-center text-[#e6efee99]"
                style={{ opacity: 1 - range(p, 0, 0.12) }}
              >
                <Icon name="down" className="mission-hint size-6" />
              </div>
              <div
                className="mx-auto w-full max-w-4xl text-center"
                style={{
                  opacity: 1 - out * 0.75,
                  transform: `translateY(${-out * 40}px) scale(${mix(1, 0.94, out)})`,
                  filter: `blur(${out * 4}px)`,
                }}
              >
                <h1 className="text-[clamp(2.6rem,9vw,6.2rem)] leading-[1.08] font-[700] tracking-[0.04em]">
                  把世界
                  <br className="sm:hidden" />
                  <span className="aurora-text font-[700]">調小聲</span>一點
                </h1>
                <p className="mx-auto mt-8 max-w-xl text-[clamp(1rem,2.4vw,1.25rem)] leading-relaxed font-[700] text-[#e6efeeb2]">
                  這裡沒有演算法，只有頭皮發麻。
                  <br />
                  一個收藏、理解與分享 ASMR 的聲音角落。
                </p>
              </div>
            </>
          );
        }}
      </Scene>
    </div>
  );
}

// ─────────────── 首頁入口卡片 Gateways ───────────────

/** 首頁：三個入口卡片 */
export function Gateways() {
  return (
    <Section id="start">
      <SectionHeading weight={{ title: 900 }} title="今天想從哪裡開始？" />
      <div className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-20">
        {gateways.map((g, i) => (
          <Link
            key={g.href}
            href={g.href}
            className="glass reveal group flex min-h-56 flex-col rounded-3xl p-7 transition-transform duration-700 hover:-translate-y-1 sm:p-8"
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <p className="font-serif text-xl font-[400] text-[#6ff5c8e6] italic">
              {g.en}
            </p>
            <h3 className="mt-2 text-2xl font-[700] tracking-wide">
              {g.title}
            </h3>
            <p className="mt-4 text-sm leading-7 font-[400] text-[#e6efee99]">
              {g.body}
            </p>
            <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-[700] text-[#e6efeeb2] transition-colors group-hover:text-[#6ff5c8]">
              前往{" "}
              <Icon
                name="arrow"
                className="size-4 transition-transform duration-500 group-hover:translate-x-1"
              />
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
