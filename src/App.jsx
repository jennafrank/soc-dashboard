import { useState } from 'react';
import { useSOCData } from './hooks/useSOCData';
import Leaderboard from './components/Leaderboard';
import AllBadges from './components/AllBadges';
import ActivityFeed from './components/ActivityFeed';
import SettingsModal from './components/SettingsModal';
import SOCLeadPanel from './components/SOCLeadPanel';
import './App.css';

function LiveDot() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
      <span className="live-dot" />
      <span style={{ fontSize: 10, color: '#4ade80', fontFamily: 'monospace', letterSpacing: 1 }}>LIVE</span>
    </span>
  );
}

function Header({ lastUpdated, onRefresh, onSettings, onSOCLead, loading }) {
  return (
    <header className="soc-header">
      <div className="scanlines" />
      <div className="header-inner">
        <div className="header-left">
          <div className="header-title">
            <span className="header-bracket">[</span>
            <span className="header-soc">SOC</span>
            <span className="header-bracket">]</span>
            <span className="header-name"> ANALYST DASHBOARD</span>
          </div>
          <div className="header-sub">
            cyber-range-soc &middot; tracking soc &middot; not triage
          </div>
        </div>
        <div className="header-right">
          <LiveDot />
          {lastUpdated && (
            <span style={{ fontSize: 10, color: '#475569', fontFamily: 'monospace' }}>
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <button onClick={onRefresh} disabled={loading} className="header-btn" title="Refresh data">
            {loading ? '⟳' : '↻'} Refresh
          </button>
          <button onClick={onSOCLead} className="header-btn header-btn-gold" title="SOC Lead Panel">
            🔑
          </button>
          <button onClick={onSettings} className="header-btn" title="Settings">
            ⚙
          </button>
        </div>
      </div>
    </header>
  );
}

const TABS = [
  { id: 'leaderboard', label: '🏆 Leaderboard' },
  { id: 'badges', label: '🎖 All Badges' },
  { id: 'feed', label: '📡 Activity Feed' },
];

function SetupPrompt({ onOpen }) {
  return (
    <div style={{
      maxWidth: 480, margin: '80px auto', background: '#0f172a',
      border: '1px solid #1e293b', borderRadius: 12, padding: 36, textAlign: 'center'
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🛡️</div>
      <h2 style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: 18, marginBottom: 8 }}>
        Welcome to SOC Analyst Dashboard
      </h2>
      <p style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 12, lineHeight: 1.7, marginBottom: 24 }}>
        Connect your GitHub repository to start tracking analyst activity,
        earning badges, and running the live leaderboard.
      </p>
      <button
        onClick={onOpen}
        style={{
          padding: '12px 28px', background: '#14532d', border: '1px solid #4ade80',
          color: '#4ade80', borderRadius: 8, cursor: 'pointer', fontFamily: 'monospace', fontSize: 13
        }}
      >
        ⚙ Configure Settings
      </button>
    </div>
  );
}

function ExportButton({ analysts }) {
  const handleExport = () => {
    const lines = [
      '```',
      '🛡️  SOC ANALYST LEADERBOARD',
      `📅  ${new Date().toUTCString()}`,
      '─'.repeat(48),
      ...analysts.slice(0, 10).map((a, i) => {
        const medals = ['🥇', '🥈', '🥉'];
        const rank = medals[i] || `#${i + 1} `;
        return `${rank} @${a.login.padEnd(18)} ${String(a.shifts).padStart(3)} shifts  ${String(a.cases).padStart(3)} cases  [${a.tier}]`;
      }),
      '─'.repeat(48),
      '```',
    ];
    const text = lines.join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('Leaderboard copied to clipboard! Paste into Discord.');
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert('Leaderboard copied to clipboard!');
    });
  };

  return (
    <button
      onClick={handleExport}
      style={{
        padding: '6px 14px', background: '#1e293b', border: '1px solid #334155',
        color: '#94a3b8', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace', fontSize: 11
      }}
      title="Copy leaderboard to clipboard for Discord"
    >
      📋 Copy for Discord
    </button>
  );
}

export default function App() {
  const [tab, setTab] = useState('leaderboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showSOCLead, setShowSOCLead] = useState(false);
  const { analysts, recentIssues, loading, error, lastUpdated, refresh, clearCache } = useSOCData();

  const isConfigured = !!localStorage.getItem('soc_owner') && !!localStorage.getItem('soc_token');

  return (
    <div className="app">
      <Header
        lastUpdated={lastUpdated}
        onRefresh={refresh}
        onSettings={() => setShowSettings(true)}
        onSOCLead={() => setShowSOCLead(true)}
        loading={loading}
      />

      {!isConfigured && !loading ? (
        <SetupPrompt onOpen={() => setShowSettings(true)} />
      ) : (
        <main className="main">
          <div className="tab-bar">
            <div style={{ display: 'flex', gap: 4 }}>
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`tab-btn ${tab === t.id ? 'tab-btn-active' : ''}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {tab === 'leaderboard' && <ExportButton analysts={analysts} />}
              {error && (
                <span style={{ fontSize: 11, color: '#ef4444', fontFamily: 'monospace' }}>
                  ⚠ {error}
                </span>
              )}
            </div>
          </div>

          <div className="tab-content">
            {tab === 'leaderboard' && <Leaderboard analysts={analysts} loading={loading} error={error} />}
            {tab === 'badges' && <AllBadges analysts={analysts} />}
            {tab === 'feed' && <ActivityFeed issues={recentIssues} loading={loading} />}
          </div>
        </main>
      )}

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onSave={() => { clearCache(); }}
        />
      )}
      {showSOCLead && (
        <SOCLeadPanel
          analysts={analysts}
          onClose={() => setShowSOCLead(false)}
        />
      )}
    </div>
  );
}
