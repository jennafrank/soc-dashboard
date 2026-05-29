import { BADGES, BADGE_CATEGORIES } from '../utils/badges';

export default function AllBadges({ analysts }) {
  // For each badge, find who earned it
  const badgeMap = {};
  for (const badge of BADGES) {
    badgeMap[badge.id] = analysts.filter(a => badge.check(a));
  }

  const byCategory = Object.entries(BADGE_CATEGORIES).map(([catId, cat]) => ({
    catId,
    ...cat,
    badges: BADGES.filter(b => b.category === catId),
  }));

  return (
    <div>
      {byCategory.map(({ catId, label, color, badges }) => (
        <div key={catId} style={{ marginBottom: 32 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
            paddingBottom: 8, borderBottom: `1px solid ${color}44`
          }}>
            <span style={{ width: 3, height: 18, background: color, borderRadius: 2, display: 'inline-block' }} />
            <h3 style={{ margin: 0, color, fontFamily: 'monospace', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
              {label}
            </h3>
            <span style={{ color: '#475569', fontSize: 11, fontFamily: 'monospace' }}>
              {badges.length} badge{badges.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
            {badges.map(badge => {
              const earners = badgeMap[badge.id] || [];
              const pct = analysts.length > 0 ? Math.round((earners.length / analysts.length) * 100) : 0;
              return (
                <div key={badge.id} style={{
                  background: '#0f172a',
                  border: `1px solid ${earners.length > 0 ? badge.color + '44' : '#1e293b'}`,
                  borderRadius: 8, padding: 14,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <span style={{ fontSize: 28, lineHeight: 1 }}>{badge.emoji}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span style={{ color: badge.color, fontFamily: 'monospace', fontSize: 13, fontWeight: 700 }}>
                          {badge.name}
                        </span>
                        {badge.manual && (
                          <span style={{
                            fontSize: 9, padding: '1px 6px', borderRadius: 999,
                            background: '#1e293b', border: '1px solid #334155',
                            color: '#64748b', fontFamily: 'monospace'
                          }}>MANUAL</span>
                        )}
                      </div>
                      <div style={{ color: '#64748b', fontSize: 11, fontFamily: 'monospace', marginTop: 3, marginBottom: 10 }}>
                        {badge.description}
                      </div>

                      {/* Earner count + bar */}
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#475569', fontFamily: 'monospace', marginBottom: 4 }}>
                          <span>{earners.length} analyst{earners.length !== 1 ? 's' : ''} earned</span>
                          <span style={{ color: badge.color }}>{pct}%</span>
                        </div>
                        <div style={{ height: 3, background: '#1e293b', borderRadius: 2 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: badge.color, borderRadius: 2, transition: 'width 0.5s' }} />
                        </div>
                      </div>

                      {/* Earner avatars */}
                      {earners.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {earners.slice(0, 6).map(a => (
                            <span key={a.login} style={{
                              fontSize: 10, fontFamily: 'monospace', color: '#94a3b8',
                              background: '#1e293b', padding: '2px 6px', borderRadius: 4,
                            }}>
                              @{a.login}
                            </span>
                          ))}
                          {earners.length > 6 && (
                            <span style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace', padding: '2px 4px' }}>
                              +{earners.length - 6} more
                            </span>
                          )}
                        </div>
                      )}

                      {earners.length === 0 && (
                        <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace' }}>
                          No one has earned this yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
