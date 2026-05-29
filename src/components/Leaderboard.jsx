import AnalystCard from './AnalystCard';

export default function Leaderboard({ analysts, loading, error }) {
  if (loading) {
    return (
      <div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{
            background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
            padding: 16, marginBottom: 10, display: 'flex', gap: 14, alignItems: 'center'
          }}>
            <div style={{ width: 32, height: 32, background: '#1e293b', borderRadius: 4 }} className="skeleton" />
            <div style={{ width: 56, height: 56, background: '#1e293b', borderRadius: 4 }} className="skeleton" />
            <div style={{ flex: 1 }}>
              <div style={{ width: 120, height: 14, background: '#1e293b', borderRadius: 4, marginBottom: 8 }} className="skeleton" />
              <div style={{ width: 80, height: 10, background: '#1e293b', borderRadius: 4, marginBottom: 10 }} className="skeleton" />
              <div style={{ display: 'flex', gap: 16 }}>
                {[40, 40, 60, 50].map((w, j) => (
                  <div key={j} style={{ width: w, height: 28, background: '#1e293b', borderRadius: 4 }} className="skeleton" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        background: '#7f1d1d22', border: '1px solid #7f1d1d', borderRadius: 8,
        padding: 24, textAlign: 'center', color: '#fca5a5', fontFamily: 'monospace'
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⚠</div>
        <div style={{ fontSize: 14, marginBottom: 8 }}>{error}</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>
          Check your GitHub token and repo settings. Open the settings panel (⚙) to update.
        </div>
      </div>
    );
  }

  if (analysts.length === 0) {
    return (
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
        padding: 40, textAlign: 'center', color: '#475569', fontFamily: 'monospace'
      }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
        <div style={{ fontSize: 14, marginBottom: 6 }}>No analyst data yet</div>
        <div style={{ fontSize: 11 }}>Configure your GitHub repo in settings and create some issues to get started.</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: 12 }}>
          {analysts.length} analyst{analysts.length !== 1 ? 's' : ''} tracked
        </span>
        <span style={{ color: '#334155', fontSize: 12 }}>•</span>
        <span style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 11 }}>
          Ranked by ops score (shifts × 10 + cases × 25 + escalations × 15 + detections × 20)
        </span>
      </div>
      {analysts.map((analyst, i) => (
        <AnalystCard key={analyst.login} analyst={analyst} rank={i + 1} />
      ))}
    </div>
  );
}
