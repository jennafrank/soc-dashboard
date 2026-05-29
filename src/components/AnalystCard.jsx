import { useState } from 'react';
import Avatar from './Avatar';
import { computeBadges, earnedCount } from '../utils/badges';
import { scoreAnalyst } from '../services/github';

const RANK_STYLES = {
  1: { color: '#fbbf24', label: '🥇', glow: '0 0 12px rgba(251,191,36,0.4)' },
  2: { color: '#94a3b8', label: '🥈', glow: '0 0 12px rgba(148,163,184,0.3)' },
  3: { color: '#fb923c', label: '🥉', glow: '0 0 12px rgba(251,146,60,0.3)' },
};

const TIER_COLORS = {
  'T1 Analyst': '#38bdf8',
  'T2 Analyst': '#a78bfa',
  'Shift Lead': '#fbbf24',
};

function BadgePill({ badge }) {
  const style = {
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '2px 8px', borderRadius: 999,
    fontSize: 11, fontFamily: 'monospace',
    background: badge.earned ? `${badge.color}22` : '#1e293b',
    border: `1px solid ${badge.earned ? badge.color : '#334155'}`,
    color: badge.earned ? badge.color : '#475569',
    opacity: badge.earned ? 1 : 0.5,
    transition: 'all 0.2s',
    cursor: 'default',
    whiteSpace: 'nowrap',
  };
  return (
    <span style={style} title={badge.description}>
      {badge.emoji} {badge.name}
    </span>
  );
}

function ProgressBar({ label, current, target, color = '#4ade80' }) {
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', fontFamily: 'monospace', marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ color }}>{current}/{target}</span>
      </div>
      <div style={{ height: 4, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

export default function AnalystCard({ analyst, rank }) {
  const [expanded, setExpanded] = useState(false);
  const rankStyle = RANK_STYLES[rank] || {};
  const badges = computeBadges(analyst);
  const earned = earnedCount(analyst);
  const score = scoreAnalyst(analyst);
  const tierColor = TIER_COLORS[analyst.tier] || '#38bdf8';

  const nextTierLabel = analyst.tier === 'T1 Analyst'
    ? `T2 Eligible at 10 shifts + 3 cases`
    : analyst.tier === 'T2 Analyst'
    ? `Specialization Eligible at 20 shifts`
    : null;

  const nextTierProgress = analyst.tier === 'T1 Analyst'
    ? { shifts: { current: analyst.shifts, target: 10 }, cases: { current: analyst.cases, target: 3 } }
    : analyst.tier === 'T2 Analyst'
    ? { shifts: { current: analyst.shifts, target: 20 } }
    : null;

  return (
    <div style={{
      background: '#0f172a',
      border: `1px solid ${rank <= 3 ? rankStyle.color : '#1e293b'}`,
      borderRadius: 8,
      padding: 16,
      marginBottom: 10,
      boxShadow: rank <= 3 ? rankStyle.glow : 'none',
      transition: 'all 0.2s',
    }}>
      {/* Promotion banners */}
      {analyst.t2Eligible && analyst.tier === 'T1 Analyst' && (
        <div style={{ background: '#a78bfa22', border: '1px solid #a78bfa', borderRadius: 4, padding: '6px 10px', marginBottom: 10, fontSize: 11, color: '#a78bfa', fontFamily: 'monospace' }}>
          🎉 T2 ELIGIBLE — This analyst meets the requirements for T2 promotion. Tag a Shift Lead.
        </div>
      )}
      {analyst.specializationEligible && (
        <div style={{ background: '#fbbf2422', border: '1px solid #fbbf24', borderRadius: 4, padding: '6px 10px', marginBottom: 10, fontSize: 11, color: '#fbbf24', fontFamily: 'monospace' }}>
          ⭐ SPECIALIZATION ELIGIBLE — Ready for team specialization. Tag SOC Lead.
        </div>
      )}

      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {/* Rank */}
        <div style={{ minWidth: 32, textAlign: 'center' }}>
          {rank <= 3
            ? <span style={{ fontSize: 20 }}>{rankStyle.label}</span>
            : <span style={{ fontSize: 14, color: '#475569', fontFamily: 'monospace' }}>#{rank}</span>}
        </div>

        {/* Avatar */}
        <Avatar login={analyst.login} size={56} editable={true} />

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f1f5f9', fontSize: 15 }}>
              {analyst.displayName}
            </span>
            <span style={{
              fontSize: 10, padding: '2px 8px', borderRadius: 999,
              background: `${tierColor}22`, border: `1px solid ${tierColor}`,
              color: tierColor, fontFamily: 'monospace'
            }}>{analyst.tier}</span>
          </div>
          <div style={{ color: '#64748b', fontSize: 11, fontFamily: 'monospace', marginTop: 2 }}>
            @{analyst.login}
          </div>
          {/* Stats row */}
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {[
              { label: 'SHIFTS', val: analyst.shifts, color: '#4ade80' },
              { label: 'CASES', val: analyst.cases, color: '#38bdf8' },
              { label: 'BADGES', val: `${earned}/${badges.length}`, color: '#f59e0b' },
              { label: 'SCORE', val: score, color: rankStyle.color || '#94a3b8' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontFamily: 'monospace', fontWeight: 700, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace', letterSpacing: 1 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Expand button */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'none', border: '1px solid #1e293b', color: '#475569', borderRadius: 4, padding: '4px 8px', cursor: 'pointer', fontSize: 12, fontFamily: 'monospace' }}>
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #1e293b' }}>

          {/* All stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 16 }}>
            {[
              { label: 'Shifts', val: analyst.shifts },
              { label: 'Cases', val: analyst.cases },
              { label: 'Escalations', val: analyst.escalations },
              { label: 'Detections', val: analyst.detections },
              { label: 'Honeypot Hits', val: analyst.honeypotHits },
              { label: 'Geo ID', val: analyst.geoIdentified },
              { label: 'Chain Traced', val: analyst.chainTraced },
              { label: 'Kill Chains', val: analyst.killChains },
            ].map(s => (
              <div key={s.label} style={{ background: '#1e293b', borderRadius: 4, padding: '8px 10px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontFamily: 'monospace', color: '#f1f5f9' }}>{s.val}</div>
                <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'monospace' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress to next tier */}
          {nextTierProgress && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
                Progress → {nextTierLabel}
              </div>
              {Object.entries(nextTierProgress).map(([key, { current, target }]) => (
                <ProgressBar key={key} label={key.toUpperCase()} current={current} target={target} color='#a78bfa' />
              ))}
            </div>
          )}

          {/* Badge pills */}
          <div style={{ fontSize: 10, color: '#64748b', fontFamily: 'monospace', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Badges ({earned}/{badges.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {badges.map(b => <BadgePill key={b.id} badge={b} />)}
          </div>
        </div>
      )}
    </div>
  );
}
