function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function describeIssue(issue) {
  const labels = (issue.labels || []).map(l => l.name);
  const user = issue.user?.login || 'unknown';
  const title = issue.title || '';

  if (labels.includes('type: shift-handoff')) {
    return { icon: '🔄', text: `@${user} filed a shift handoff`, color: '#4ade80' };
  }
  if (labels.includes('type: tracking-case') || title.startsWith('[TRACKING]')) {
    return { icon: '🔍', text: `@${user} opened a tracking case: ${title.replace('[TRACKING]', '').trim()}`, color: '#38bdf8' };
  }
  if (labels.includes('status: escalated-to-josh') || title.includes('ESCALAT')) {
    return { icon: '🚨', text: `@${user} escalated to SOC Lead`, color: '#ef4444' };
  }
  if (labels.includes('type: tool-issue') || title.startsWith('[TOOL ISSUE]')) {
    return { icon: '🔧', text: `@${user} reported a tool issue: ${title.replace('[TOOL ISSUE]', '').trim()}`, color: '#f59e0b' };
  }
  if (labels.includes('type: deliverable') || title.startsWith('[DELIVERABLE]')) {
    return { icon: '📦', text: `@${user} opened deliverable: ${title.replace('[DELIVERABLE]', '').trim()}`, color: '#a78bfa' };
  }
  if (title.startsWith('MISSING HANDOFF')) {
    return { icon: '⚠️', text: `Missing handoff detected — ${title}`, color: '#ef4444' };
  }
  if (title.startsWith('Weekly SOC Ops Report')) {
    return { icon: '📊', text: `Weekly SOC Ops Report generated`, color: '#4ade80' };
  }
  if (labels.some(l => l.startsWith('badge-'))) {
    const badge = labels.find(l => l.startsWith('badge-'));
    return { icon: '🏅', text: `@${user} earned badge: ${badge?.replace('badge-', '')}`, color: '#fbbf24' };
  }
  if (issue.state === 'closed') {
    return { icon: '✅', text: `@${user} closed: ${title}`, color: '#64748b' };
  }
  return { icon: '📋', text: `@${user} opened: ${title}`, color: '#94a3b8' };
}

export default function ActivityFeed({ issues, loading }) {
  if (loading) {
    return (
      <div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
            <div style={{ width: 28, height: 28, background: '#1e293b', borderRadius: '50%' }} className="skeleton" />
            <div style={{ flex: 1 }}>
              <div style={{ width: '70%', height: 12, background: '#1e293b', borderRadius: 4, marginBottom: 6 }} className="skeleton" />
              <div style={{ width: '30%', height: 10, background: '#1e293b', borderRadius: 4 }} className="skeleton" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!issues || issues.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#475569', fontFamily: 'monospace', padding: 40 }}>
        No recent activity. Make sure your repo is connected and has issues.
      </div>
    );
  }

  return (
    <div>
      <div style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 11, marginBottom: 14 }}>
        Showing last {issues.length} issue events
      </div>
      {issues.map((issue, i) => {
        const { icon, text, color } = describeIssue(issue);
        return (
          <div key={issue.id || i} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            padding: '11px 0',
            borderBottom: i < issues.length - 1 ? '1px solid #1e293b' : 'none',
          }}>
            {/* Icon bubble */}
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: `${color}22`, border: `1px solid ${color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, flexShrink: 0,
            }}>
              {icon}
            </div>

            {/* Content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: '#cbd5e1', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.5 }}>
                {text}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <span style={{ color: '#475569', fontSize: 10, fontFamily: 'monospace' }}>
                  {timeAgo(issue.created_at)}
                </span>
                {issue.state === 'closed' && (
                  <span style={{ color: '#334155', fontSize: 10, fontFamily: 'monospace' }}>• closed</span>
                )}
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#334155', fontSize: 10, fontFamily: 'monospace', textDecoration: 'none' }}
                >
                  #{issue.number} ↗
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
