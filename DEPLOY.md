# 部署到 Vercel：一步一步來

網站需要三樣東西才能在 Vercel 上正常運作：

| 名稱 | 用途 | 從哪裡來 |
|---|---|---|
| `PAYLOAD_SECRET` | 後台登入加密用的一串密碼 | 自己產生（第 2 步） |
| `DATABASE_URL` | 雲端資料庫（存聲音名稱、作者、審核狀態） | Vercel 串接 Neon 後自動產生 |
| `BLOB_READ_WRITE_TOKEN` | 雲端檔案空間（存音檔） | 建立 Vercel Blob 後自動產生 |

> Vercel 後台的按鈕名稱偶爾會改版，如果找不到一模一樣的字，找意思相近的就可以。

---

## 1. 把程式推上 GitHub

1. 用最新的專案檔案覆蓋你電腦上的專案資料夾（保留 `.git` 資料夾）。
2. 如果資料夾裡有 `package-lock.json` 或 `payload.db`，**刪掉**。
3. 在 VS Code 終端機執行 `pnpm install`（會更新 `pnpm-lock.yaml`）。
4. 確認 `.gitignore` 檔案存在，然後 commit 並 push 到 GitHub。
   - **`.env.local` 絕對不能上傳**，`.gitignore` 已經幫你擋掉了。

## 2. 產生 PAYLOAD_SECRET

在 Mac 的終端機輸入：

```
openssl rand -hex 32
```

會得到一串 64 個字的英數字，複製起來，等一下要用。

## 3. 在 Vercel 匯入專案

1. 到 [vercel.com](https://vercel.com) 登入（用 GitHub 帳號登入最方便）。
2. **Add New… → Project**，選你的 GitHub 專案，按 **Import**。
3. Framework 應該會自動顯示 **Next.js**，其他設定不用動。
4. 展開 **Environment Variables**，新增一筆：
   - Key：`PAYLOAD_SECRET`
   - Value：第 2 步複製的那串字
5. 按 **Deploy**。

> ⚠️ 這次部署**會失敗**，畫面會出現「缺少 DATABASE_URL」——這是正常的，因為資料庫還沒建立。繼續下一步。

## 4. 建立雲端資料庫（Neon）

1. 進入專案頁面，點上方的 **Storage**。
2. **Create Database** → 選 **Neon**（Serverless Postgres）→ 選免費方案。
3. 區域（Region）建議選 **Singapore**，離台灣最近；或保持預設也可以。
4. 建立後，按 **Connect Project**，選這個專案，三個環境（Production、Preview、Development）都勾選。
5. 完成後到 **Settings → Environment Variables**，確認多了一個 `DATABASE_URL`。

## 5. 建立雲端檔案空間（Vercel Blob）

1. 一樣在 **Storage** → **Create** → 選 **Blob**。
2. 如果有問存取權限（Access），選 **Public**。
3. 建立後按 **Connect Project** 連到這個專案（三個環境都勾）。
4. 確認環境變數多了 `BLOB_READ_WRITE_TOKEN`。

## 6. 重新部署

1. 點上方 **Deployments**，找到最新那一筆，按右邊 **⋯ → Redeploy**。
2. 等 2～4 分鐘。建置過程會自動在資料庫建立需要的資料表。
3. 看到 **Ready** 就成功了，點網址打開網站。

## 7. 立刻建立管理員帳號（很重要）

1. 打開 `你的網址/admin`。
2. 第一次進去會要你建立帳號，輸入你的 email 和密碼。
3. **上線後請馬上做這一步**：第一個註冊的人就是管理員，拖太久可能被別人搶先。

之後審核使用者上傳的聲音：`/admin` → **ASMR Tracks** → 點進那一筆 → 右側 **Status** 改成 **Approved** → 存檔。網站會自動更新。

---

## 之後在自己電腦開發

現在本機也是連到雲端資料庫，所以要在專案資料夾建立 `.env.local`：

1. 複製 `.env.example`，改名為 `.env.local`。
2. 到 Vercel 專案 **Settings → Environment Variables**，把三個值複製進去。
3. 執行 `pnpm dev`。

> 注意：本機開發和正式網站用的是**同一個資料庫**，在本機後台刪掉的東西，正式網站也會不見。

## 目前的限制

- **上傳音檔最大 4 MB**（約 4 分鐘的 MP3）。這是 Vercel 對每次請求的限制。之後可以改成「瀏覽器直接上傳到 Blob」來突破。
- 免費方案的額度對課堂專題綽綽有餘；如果流量很大，Vercel 後台的 Usage 頁面可以看用量。

## Google Search Console（SEO）

網站已經自動產生 `/sitemap.xml`（網站地圖）和 `/robots.txt`，網址會跟著環境變數 `NEXT_PUBLIC_SITE_URL` 走。

### 第一次登記

1. 確認 Vercel 的 **Settings → Environment Variables** 有 `NEXT_PUBLIC_SITE_URL`，值是網站網址（例如 `https://checkout-asmr.vercel.app`，結尾不要加 `/`）。
2. 到 [Google Search Console](https://search.google.com/search-console)，**新增資源** → 選右邊的 **網址前置字元**，貼上網站網址。
3. 驗證方式選 **HTML 標記**，會看到 `<meta name="google-site-verification" content="一串字" />`，只複製 `content="..."` 引號裡那串字。
4. 到 Vercel 新增環境變數：Key `GOOGLE_SITE_VERIFICATION`、Value 那串字 → 到 **Deployments** 重新部署（Redeploy）。
5. 部署完成後回到 Search Console 按 **驗證**。
6. 左側 **Sitemap** → 輸入 `sitemap.xml` → 提交。

### 之後換成自訂網域

1. Vercel 專案 **Settings → Domains** 加入新網域，照畫面設定 DNS。
2. 在同一頁把 `checkout-asmr.vercel.app` 設成 **Redirect to** 新網域（308/301 永久轉址）。
3. 把 `NEXT_PUBLIC_SITE_URL` 改成新網址 → 重新部署。
4. Search Console 新增新網域的資源（這次可以選「網域」並用 DNS 驗證）→ 再提交一次 `sitemap.xml`。
5. 舊的 vercel.app 資源先留著幾個月，觀察流量是否順利轉到新網域。
