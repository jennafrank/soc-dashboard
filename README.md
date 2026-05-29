# SOC Analyst Dashboard

A live, gamified analyst dashboard for the Cyber Range SOC. Connects to your GitHub repository via the REST API and tracks analyst activity, awards badges, and runs a real-time leaderboard — all client-side, no backend required.

---

## What It Does

- **Leaderboard** — ranked analyst cards with pixel-art avatars, tier badges, stats, and expandable badge panels
- **All Badges** — full badge catalog showing who earned what and completion rates
- **Activity Feed** — last 50 issue events formatted as SOC activity log
- **Live data** — reads directly from GitHub Issues, auto-refreshes on a configurable interval
- **Gamification** — 19 badges, tier progression (T1 → T2 → Shift Lead), score ranking
- **Avatar customizer** — pixel-art avatars with 6 hair styles, 5 skin tones, 5 outfits, 5 accessories, 8 backgrounds

---

## Quick Start

```bash
git clone https://github.com/jennafrank/soc-dashboard
cd soc-dashboard
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

On first load you will see the setup prompt. Click **Configure Settings** and enter:

1. **GitHub Owner** — your GitHub username (e.g. `jennafrank`)
2. **Repository Name** — `cyber-range-soc`
3. **Personal Access Token** — see below

---

## Creating a GitHub Personal Access Token

The dashboard needs read access to Issues in your repo.

1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens**
2. Click **Generate new token**
3. Set expiration (90 days recommended)
4. Under **Repository access** → select **Only select repositories** → choose `cyber-range-soc`
5. Under **Permissions → Repository permissions**:
   - **Issues** → Read-only
   - **Metadata** → Read-only (required)
6. Click **Generate token** and copy it

Paste it into the Settings modal in the dashboard. It is stored in `localStorage` on your machine only.

---

## How the Dashboard Reads Data

The dashboard pulls all Issues from the repo and calculates per-analyst stats by reading labels:

| What it counts | Label it looks for |
|----------------|--------------------|
| Shifts filed | `type: shift-handoff` |
| Tracking cases | `type: tracking-case` |
| Escalations | `status: escalated-to-josh` |
| Detections | `type: detection-gap` |
| Honeypot hits | `honeypot-hit` |
| Geo IDs | `geo-identified` |
| Kill chains | `kill-chain-complete` |
| Manual badges | `badge-speed-demon`, `badge-unicorn`, `badge-zero-day`, `badge-hype` |
| Tier (T2) | `tier-t2` |
| Tier (Shift Lead) | `tier-shift-lead` |

---

## Awarding Manual Badges

Four badges are manually awarded by the SOC Lead (⚡ Speed Demon, 🦄 Unicorn, 💥 Zero Day Vibes, 🔥 Hype):

1. Click 🔑 in the header → enter SOC Lead PIN (default: `1234` — change this immediately)
2. Find the analyst and click the badge
3. Also add the corresponding label (`badge-speed-demon` etc.) to any GitHub issue associated with that analyst — this makes it permanent

---

## Deploying to GitHub Pages

### Step 1 — Push this repo to GitHub

```bash
git init
git add .
git commit -m "Initial commit — SOC Analyst Dashboard"
gh repo create soc-dashboard --public --source=. --remote=origin --push
```

### Step 2 — Enable GitHub Pages

1. Go to your repo → **Settings → Pages**
2. Under **Source**, select **GitHub Actions**
3. Save

### Step 3 — Push to deploy

```bash
git push
```

Your dashboard will be live at:
```
https://your-username.github.io/soc-dashboard/
```

Every push to `main` auto-redeploys. Share the URL in Discord.

---

## Customizing Your Avatar

Click your own avatar on the leaderboard to open the customizer. Set your GitHub username in **Settings → Your GitHub Username** first so the dashboard knows which card is yours.

---

## File Structure

```
soc-dashboard/
├── src/
│   ├── components/
│   │   ├── ActivityFeed.jsx
│   │   ├── AllBadges.jsx
│   │   ├── AnalystCard.jsx
│   │   ├── Avatar.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── SettingsModal.jsx
│   │   └── SOCLeadPanel.jsx
│   ├── hooks/
│   │   └── useSOCData.js
│   ├── services/
│   │   └── github.js
│   ├── utils/
│   │   ├── avatar.js
│   │   └── badges.js
│   ├── App.jsx
│   ├── App.css
│   └── index.css
├── .github/workflows/
│   └── deploy.yml
├── vite.config.js
└── package.json
```

---

## Local Development

```bash
npm install          # Install dependencies
npm run dev          # Dev server at localhost:5173
npm run build        # Production build (local path)
npm run build:pages  # Build for GitHub Pages
npm run preview      # Preview production build
```
