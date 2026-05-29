// GitHub REST API service — all client-side, no backend needed

const BASE = 'https://api.github.com';

function getConfig() {
  return {
    owner: localStorage.getItem('soc_owner') || '',
    repo: localStorage.getItem('soc_repo') || 'cyber-range-soc',
    token: localStorage.getItem('soc_token') || '',
  };
}

function headers() {
  const { token } = getConfig();
  return {
    Accept: 'application/vnd.github+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function ghFetch(path, params = {}) {
  const { owner, repo } = getConfig();
  const url = new URL(`${BASE}${path.replace('{owner}', owner).replace('{repo}', repo)}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { headers: headers() });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error ${res.status}`);
  }
  return res.json();
}

// Paginate through all results
async function ghFetchAll(path, params = {}) {
  const { owner, repo } = getConfig();
  let page = 1;
  let all = [];
  while (true) {
    const url = new URL(`${BASE}${path.replace('{owner}', owner).replace('{repo}', repo)}`);
    Object.entries({ ...params, per_page: 100, page }).forEach(([k, v]) =>
      url.searchParams.set(k, v)
    );
    const res = await fetch(url.toString(), { headers: headers() });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `GitHub API error ${res.status}`);
    }
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) break;
    all = all.concat(data);
    if (data.length < 100) break;
    page++;
  }
  return all;
}

export async function testConnection() {
  const { owner, repo } = getConfig();
  if (!owner || !repo) throw new Error('Owner and repo are required');
  return ghFetch(`/repos/{owner}/{repo}`);
}

export async function fetchAllIssues() {
  return ghFetchAll(`/repos/{owner}/{repo}/issues`, { state: 'all' });
}

export async function fetchRecentEvents() {
  return ghFetchAll(`/repos/{owner}/{repo}/issues`, {
    state: 'all',
    sort: 'created',
    direction: 'desc',
  }).then(issues => issues.slice(0, 50));
}

export async function fetchRepoInfo() {
  return ghFetch(`/repos/{owner}/{repo}`);
}

// Build per-analyst stats from issues array
export function computeAnalystStats(issues) {
  const analysts = {};

  function ensure(login, avatarUrl, displayName) {
    if (!analysts[login]) {
      analysts[login] = {
        login,
        displayName: displayName || login,
        avatarUrl,
        shifts: 0,
        cases: 0,
        escalations: 0,
        detections: 0,
        honeypotHits: 0,
        geoIdentified: 0,
        chainTraced: 0,
        killChains: 0,
        mentored: 0,
        nightOwlShifts: 0,
        missingHandoffs: 0,
        smoothHandoffShifts: 0,
        labelBadges: new Set(),
        totalIssues: 0,
        tier: 'T1 Analyst',
      };
    }
  }

  for (const issue of issues) {
    if (!issue.user) continue;
    const { login, avatar_url } = issue.user;
    const displayName = issue.user.name || login;
    ensure(login, avatar_url, displayName);
    const a = analysts[login];
    const labelNames = (issue.labels || []).map(l => l.name);

    a.totalIssues++;

    // Shifts
    if (labelNames.includes('type: shift-handoff')) {
      a.shifts++;
      if (labelNames.includes('shift: 1') || labelNames.includes('phase: 1')) {
        a.nightOwlShifts++;
      }
    }

    // Missing handoff flag
    if (issue.title && issue.title.startsWith('MISSING HANDOFF')) {
      // find who was supposed to file it — tag outgoing analyst
      // best effort: we just track it globally
    }

    // Tracking cases
    if (labelNames.includes('type: tracking-case')) a.cases++;

    // Escalations
    if (labelNames.includes('status: escalated-to-josh') ||
        labelNames.some(l => l.includes('escalated-to-t2'))) {
      a.escalations++;
    }

    // Detections
    if (labelNames.includes('detection-gap') ||
        labelNames.includes('type: detection-gap') ||
        labelNames.includes('new-rule')) {
      a.detections++;
    }

    // Special labels
    if (labelNames.includes('honeypot-hit')) a.honeypotHits++;
    if (labelNames.includes('geo-identified')) a.geoIdentified++;
    if (labelNames.includes('chain-traced')) a.chainTraced++;
    if (labelNames.includes('kill-chain-complete')) a.killChains++;
    if (labelNames.includes('mentored')) a.mentored++;

    // Manual badge labels
    const manualBadges = [
      'badge-speed-demon', 'badge-unicorn', 'badge-zero-day', 'badge-hype'
    ];
    for (const b of manualBadges) {
      if (labelNames.includes(b)) a.labelBadges.add(b);
    }

    // Tier overrides from profile issues
    if (labelNames.includes('tier-shift-lead')) a.tier = 'Shift Lead';
    else if (labelNames.includes('tier-t2')) a.tier = 'T2 Analyst';
  }

  // Compute smooth handoffs (shifts with no MISSING HANDOFF in same period)
  // Simplified: if shifts >= 5, assume smooth unless flagged
  for (const a of Object.values(analysts)) {
    a.smoothHandoffShifts = a.shifts;
    a.labelBadges = Array.from(a.labelBadges);

    // Tier promotion logic
    if (a.tier === 'T1 Analyst') {
      if (a.shifts >= 10 && a.cases >= 3) a.t2Eligible = true;
    }
    if (a.tier === 'T2 Analyst') {
      if (a.shifts >= 20) a.specializationEligible = true;
    }
  }

  return Object.values(analysts);
}

// Score for leaderboard ranking
export function scoreAnalyst(a) {
  return (
    a.shifts * 10 +
    a.cases * 25 +
    a.escalations * 15 +
    a.detections * 20 +
    a.honeypotHits * 10 +
    a.killChains * 50 +
    a.mentored * 20 +
    (a.tier === 'Shift Lead' ? 200 : a.tier === 'T2 Analyst' ? 100 : 0)
  );
}
