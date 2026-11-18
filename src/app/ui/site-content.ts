import type { StaticImageData } from 'next/image'
import avatar1 from '@/imports/Website Avatar 1.svg'
import avatar2 from '@/imports/Website Avatar 2.svg'
import avatar3 from '@/imports/Website Avatar 3.svg'
import avatar4 from '@/imports/Website Avatar 4.svg'
import avatar5 from '@/imports/Website Avatar 5.svg'

/**
 * ================================================================
 * 網站文案集中放在這裡：改字只要改這個檔案，不用動到版面程式。
 * ================================================================
 */

export type Track = {
  id: string
  title: string
  creatorName: string
  category: string
  origin: string
  description: string
  url: string
}

/* ---------------------------------------------------------------
   網站資訊（Footer 會用到）
   --------------------------------------------------------------- */

export const site = {
  name: 'Checkout.',
  tagline: '國立臺灣大學圖書資訊學系 ASMR 推廣團體。致力於讓為生活而奔波的人們好好休息放鬆。',
  instagram: 'https://www.instagram.com/checkout_asmr/',
  threads: 'https://www.threads.com/@checkout_asmr',
  copyright: '© 2026 Checkout. All rights reserved.',
}

/* ---------------------------------------------------------------
   導覽選單（Header 與 Footer 共用）
   - label：Header 顯示的文字（滑鼠移上去會出現下拉選單）
   - footerTitle：Footer 欄位標題
   - href：大分類網址，點了會自動跳到第一個子分頁
   - children：子分頁，每一個都是獨立的一頁
   --------------------------------------------------------------- */

export const siteNav = [
  {
    label: '關於我們',
    footerTitle: 'ABOUT 關於我們',
    href: '/about',
    children: [
      { label: '創立初衷', href: '/about/mission' },
      { label: '團隊成員名單', href: '/about/team' },
    ],
  },
  {
    label: 'ASMR 檔案',
    footerTitle: 'ASMR 檔案',
    href: '/archive',
    children: [
      { label: '核心用詞解密', href: '/archive/glossary' },
      { label: '歷史發展', href: '/archive/history' },
      { label: '社會學洞察', href: '/archive/sociology' },
    ],
  },
  {
    label: '感官體驗',
    footerTitle: '感官體驗',
    href: '/experience',
    children: [
      { label: '最適合你的 ASMR', href: '/experience/match' },
      { label: '聲音實驗室', href: '/experience/lab' },
      { label: '聲音資料庫', href: '/experience/library' },
    ],
  },
] as const

/* ---------------------------------------------------------------
   首頁：三個入口卡片
   --------------------------------------------------------------- */

export const gateways = [
  {
    href: '/archive/glossary',
    en: 'Archive',
    title: 'ASMR 檔案',
    body: '酥麻感是什麼？它從哪裡來？為什麼會變成一種全球性的消費文化？',
  },
  {
    href: '/experience/match',
    en: 'Experience',
    title: '感官體驗',
    body: '戴上耳機，找出最適合你的觸發音，再到聲音資料庫慢慢待著。',
  },
  {
    href: '/about/mission',
    en: 'About',
    title: '關於我們',
    body: '一群想讓大家好好休息的大學生，和這個網站誕生的理由。',
  },
]

/* ---------------------------------------------------------------
   關於我們（範例文字，請改成你們自己的）
   --------------------------------------------------------------- */

export const mission = {
  title: '在什麼都要\n更快的時代，\n練習把聲音放慢',
  paragraphs: [
    'Checkout. 是國立臺灣大學圖書資訊學系「資訊文化與消費」課程的長期專題。我們選擇 ASMR 作為觀察對象，因為它很特別：人們打開手機，不是為了得到更多資訊，而是為了讓自己安靜下來。',
    '比起再開一個社群帳號，我們更想讓你「親耳」體驗。所以這裡有可以互動的 3D 聲音、可以自己調配的混音台，以及一個收集世界各地聲音的資料庫——你也可以把自己錄的聲音放進來。',
    'Checkout 是「結帳」，也是「離開一下」。希望你在這裡，能從忙碌的一天暫時登出。',
  ],
}

/**
 * 團隊成員：photo 是頭像圖片（放在 src/imports/），換掉同名檔案就會更新。
 * photo 可以留空（刪掉那一項），會自動改成顯示名字的第一個字。
 */
export const team: { name: string; role: string; note: string; photo?: StaticImageData }[] = [
  { name: '曾柏翰', role: '網站設計與架設', note: '負責把想法變成畫面', photo: avatar1 },
  { name: '徐緯軒', role: '網站設計與架設', note: '負責把想法變成畫面', photo: avatar2 },
  { name: '張瑋庭', role: '聲音採集', note: '到處錄下好聽的聲音', photo: avatar3 },
  { name: '陳亮昕', role: '社群推廣', note: '讓更多人知道這裡', photo: avatar4 },
  { name: '許采芝', role: '文案編輯', note: '把每一句話寫得更溫柔', photo: avatar5 },
]

/* ---------------------------------------------------------------
   ASMR 檔案
   --------------------------------------------------------------- */

export const categoryLabels: Record<string, string> = {
  whisper: '輕聲耳語',
  tapping: '規律敲擊',
  texture: '聲音紋理',
  nature: '自然環境',
  roleplay: '情境扮演',
}

export const glossary = [
  {
    term: 'Tingles',
    zh: '酥麻感',
    description: '從頭皮延伸到後頸、肩膀的細微酥麻，是多數人形容 ASMR 時第一個想到的詞。',
  },
  {
    term: 'Trigger',
    zh: '觸發音',
    description: '會引起放鬆或酥麻感的聲音與情境，例如耳語、輕敲、翻書。每個人的觸發點都不同。',
  },
  {
    term: 'Binaural',
    zh: '雙耳錄音',
    description: '用兩支像耳朵一樣分開擺放的麥克風收音，戴上耳機時聲音會有方向與距離感。',
  },
  {
    term: 'Roleplay',
    zh: '情境扮演',
    description: '以剪髮、看診、化妝等日常服務為劇本，營造「被專注照顧」的聽覺體驗。',
  },
]

export const triggers = ['耳語', '輕敲', '翻書', '刷子', '剪刀', '雨聲', '咀嚼', '打字', '摺紙', '慢動作']

/** 史實已查證（SteadyHealth、Rolling Stone、PeerJ、ArkDes 等） */
export const timeline = [
  {
    year: '2007',
    title: '一個沒有名字的感覺',
    body: '健康論壇 SteadyHealth 上出現一篇名為「Weird sensation feels good」的討論串，許多人第一次發現：原來不只自己會因為某些聲音頭皮發麻。',
  },
  {
    year: '2009',
    title: '第一支「耳語」影片',
    body: 'YouTube 頻道 WhisperingLife 上傳輕聲說話的影片，成為日後 ASMR 影片的原型，也吸引其他創作者跟進。',
  },
  {
    year: '2010',
    title: 'ASMR 正式被命名',
    body: 'Jennifer Allen 提出「Autonomous Sensory Meridian Response」這個刻意中性、像醫學名詞的名字，並成立 Facebook 社團，讓社群有了共同語言。',
  },
  {
    year: '2015',
    title: '第一篇學術研究',
    body: '英國斯旺西大學的 Barratt 與 Davis 在期刊 PeerJ 發表第一篇同儕審查論文，調查了 475 位受試者，最常見的觸發包括耳語、個人關注、清脆聲與緩慢動作。',
  },
  {
    year: '2019',
    title: '登上超級盃',
    body: '啤酒品牌 Michelob Ultra 在超級盃播出由 Zoë Kravitz 主演的 ASMR 廣告，讓許多人第一次聽說這個網路文化。',
  },
  {
    year: '2020',
    title: '走進博物館',
    body: '瑞典 ArkDes 推出第一個以 ASMR 為主題的博物館展覽《Weird Sensation Feels Good》，2022 年再移展至倫敦設計博物館。',
  },
  {
    year: 'Now',
    title: '輪到你了',
    body: '從論壇裡的一句「好奇怪但好舒服」，到一種全球性的聲音文化。到「感官體驗」的聲音資料庫，留下屬於你的那一段。',
  },
]

/** 社會學洞察（範例文字：可依課堂討論與參考文獻改寫） */
export const sociology = [
  {
    keyword: 'Attention',
    title: '把「休息」變成可以消費的東西',
    body: '在注意力被各種通知切碎的年代，ASMR 提供的是一種反向的商品：不是更多刺激，而是安靜。人們花時間、甚至花錢，購買的是「被允許什麼都不做」的十幾分鐘。',
  },
  {
    keyword: 'Intimacy',
    title: '隔著螢幕的陪伴',
    body: '情境扮演裡的剪髮師、護理師，總是只對「你」說話。這種刻意營造的近距離關注，回應了現代生活中的孤獨感，也讓人思考：被演出來的親密，算不算一種真正的照顧？',
  },
  {
    keyword: 'Platform',
    title: '演算法與創作者經濟',
    body: 'ASMR 隨著 YouTube 等平台成長，創作者靠流量與廣告維生，品牌也開始用 ASMR 拍廣告。原本來自網友自發分享的感受，逐漸成為一個有市場、有產業鏈的內容類型。',
  },
  {
    keyword: 'Senses',
    title: '身體感的商品化',
    body: '麥克風、收音技巧、觸發道具……「酥麻感」被拆解、標準化，變成可以重複生產的聲音配方。ASMR 讓我們看見：連最私密的身體感受，也能被設計、包裝與交換。',
  },
]

/* ---------------------------------------------------------------
   感官體驗：最適合你的 ASMR（小測驗）
   每個選項會替對應的聲音類型加分，最高分的就是結果。
   --------------------------------------------------------------- */

export type Category = 'whisper' | 'tapping' | 'texture' | 'nature' | 'roleplay'

export const quiz: { question: string; options: { label: string; scores: Partial<Record<Category, number>> }[] }[] = [
  {
    question: '你通常在什麼時候最需要放鬆？',
    options: [
      { label: '睡前躺在床上', scores: { whisper: 2, nature: 1 } },
      { label: '讀書、工作的時候', scores: { tapping: 2, texture: 1 } },
      { label: '通勤、移動的路上', scores: { nature: 2, texture: 1 } },
      { label: '覺得孤單、壓力很大時', scores: { roleplay: 2, whisper: 1 } },
    ],
  },
  {
    question: '哪一種感覺最吸引你？',
    options: [
      { label: '有人在身邊陪著', scores: { roleplay: 2, whisper: 1 } },
      { label: '規律、可以預期的節奏', scores: { tapping: 2 } },
      { label: '開闊的空間感', scores: { nature: 2 } },
      { label: '細碎、清脆的質地', scores: { texture: 2, tapping: 1 } },
    ],
  },
  {
    question: '你對「人聲」的接受度是？',
    options: [
      { label: '很喜歡輕聲細語', scores: { whisper: 2, roleplay: 1 } },
      { label: '有劇情的對話也可以', scores: { roleplay: 2 } },
      { label: '偶爾一點點就好', scores: { texture: 1, tapping: 1 } },
      { label: '完全不要人聲', scores: { nature: 2, tapping: 1 } },
    ],
  },
]

export const quizResults: Record<Category, { title: string; body: string; tryIt: string; mix: string }> = {
  whisper: {
    title: '輕聲耳語',
    body: '你適合貼近耳邊的輕柔人聲。不用聽懂內容，聲音本身的溫度就足以讓你慢下來。',
    tryIt: '試試 3D 聲音實驗室裡的「噓聲」，讓它繞著你的頭慢慢轉。',
    mix: '雨夜讀書',
  },
  tapping: {
    title: '規律敲擊',
    body: '可預期的節奏能讓你的大腦安心。指尖敲木桌、敲玻璃罐，都是你的專屬白噪音。',
    tryIt: '到混音台選「專注模式」，敲擊聲會陪你一起專心。',
    mix: '專注模式',
  },
  texture: {
    title: '聲音紋理',
    body: '你對細節很敏感：翻書、摺紙、刷子的沙沙聲，這些清脆的質地最能讓你頭皮發麻。',
    tryIt: '在 3D 聲音實驗室選「刷刷」，感受聲音從耳邊掃過。',
    mix: '海邊午睡',
  },
  nature: {
    title: '自然環境',
    body: '你需要的是空間感。雨聲、海浪與營火，能把你從擁擠的城市暫時帶走。',
    tryIt: '到混音台調一杯「海邊午睡」或「壁爐旁」。',
    mix: '海邊午睡',
  },
  roleplay: {
    title: '情境扮演',
    body: '被專注照顧的感覺最能讓你放鬆。剪髮、看診、化妝……像有人只為你一個人服務。',
    tryIt: '到聲音資料庫找找看「情境扮演」，或上傳你想聽的情境。',
    mix: '雨夜讀書',
  },
}
