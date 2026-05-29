import { useState } from 'react';

const SOC_LEAD_PIN = localStorage.getItem('soc_lead_pin') || '1234';

const MANUAL_BADGES = [
  { id: 'badge-speed-demon', label: '⚡ Speed Demon', description: 'Exceptionally fast investigation' },
  { id: 'badge-unicorn', label: '🦄 Unicorn', description: 'Rare and exceptional contribution' },
  { id: 'badge-zero-day', label: '💥 Zero Day Vibes', description: 'Found something nobody expected' },
  { id: 'badge-hype', label: '🔥 Hype', description: 'Exceptional energy and contribution' },
];

export default function SOCLeadPanel({ analysts, onClose }) {
  const [pin, setPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');
  const [newPin, setNewPin] = useState('');
  const [awardLog, setAwardLog] = useState([]);

  const handleUnlock = () => {
    if (pin === SOC_LEAD_PIN) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN');
      setPin('');
    }
  };

  const handleAward = (analyst, badge) => {
    // In a real setup this would call the GitHub API to add a label
    // Here we store it locally and remind the user to apply the label in GitHub
    const key = `manual_badge_${analyst.login}_${badge.id}`;
    localStorage.setItem(key, 'true');
    const entry = `${new Date().toUTCString()} — Awarded ${badge.label} to @${analyst.login}`;
    setAwardLog(prev => [entry, ...prev]);
    alert(`To make this permanent, add the label "${badge.id}" to a GitHub issue created by or referencing @${analyst.login}. This triggers the dashboard to display the badge automatically.`);
  };

  const handleSetPin = () => {
    if (newPin.length >= 4) {
      localStorage.setItem('soc_lead_pin', newPin);
      alert('PIN updated. Remember it — there is no recovery.');
      setNewPin('');
    }
  };

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const panel = { background: '#0f172a', border: '1px solid #fbbf2444', borderRadius: 10, padding: 28, maxWidth: 560, width: '100%', maxHeight: '90vh', overflowY: 'auto' };
  const input = { background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#f1f5f9', fontFamily: 'monospace', fontSize: 13, padding: '10px 12px' };
  const btn = (color = '#fbbf24') => ({
    padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace', fontSize: 12,
    background: `${color}22`, border: `1px solid ${color}`, color,
  });

  return (
    <div style={overlay}>
      <div style={panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: 15, margin: 0 }}>🔑 SOC Lead Panel</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        {!unlocked ? (
          <div>
            <div style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 12, marginBottom: 16 }}>
              Enter SOC Lead PIN to access manual badge awards and admin controls.
              Default PIN: <span style={{ color: '#fbbf24' }}>1234</span> (change it after first login)
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="password"
                value={pin}
                onChange={e => setPin(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleUnlock()}
                placeholder="Enter PIN"
                style={{ ...input, flex: 1 }}
              />
              <button onClick={handleUnlock} style={btn()}>Unlock</button>
            </div>
            {pinError && <div style={{ color: '#ef4444', fontFamily: 'monospace', fontSize: 12, marginTop: 8 }}>{pinError}</div>}
          </div>
        ) : (
          <div>
            {/* Manual Badge Awards */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ color: '#fbbf24', fontFamily: 'monospace', fontSize: 13, marginBottom: 12, fontWeight: 700 }}>
                🏅 Award Manual Badges
              </h3>
              <div style={{ color: '#475569', fontSize: 11, fontFamily: 'monospace', marginBottom: 12, padding: '8px 10px', background: '#1e293b', borderRadius: 6 }}>
                Awarding here logs the action locally. To make it permanent and visible to the team, also add the corresponding label to a GitHub issue associated with that analyst.
              </div>

              {analysts.length === 0 ? (
                <div style={{ color: '#475569', fontFamily: 'monospace', fontSize: 12 }}>No analysts loaded. Refresh the dashboard first.</div>
              ) : (
                <div>
                  {analysts.map(analyst => (
                    <div key={analyst.login} style={{
                      background: '#1e293b', borderRadius: 6, padding: 12, marginBottom: 8
                    }}>
                      <div style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: 12, marginBottom: 8, fontWeight: 700 }}>
                        @{analyst.login}
                        <span style={{ color: '#475569', fontWeight: 400, marginLeft: 8 }}>{analyst.tier}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {MANUAL_BADGES.map(badge => {
                          const alreadyHas = (analyst.labelBadges || []).includes(badge.id);
                          return (
                            <button
                              key={badge.id}
                              onClick={() => !alreadyHas && handleAward(analyst, badge)}
                              disabled={alreadyHas}
                              title={badge.description}
                              style={{
                                ...btn(alreadyHas ? '#334155' : '#fbbf24'),
                                opacity: alreadyHas ? 0.5 : 1,
                                cursor: alreadyHas ? 'default' : 'pointer',
                                fontSize: 11,
                              }}
                            >
                              {badge.label} {alreadyHas ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Award Log */}
            {awardLog.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 12, marginBottom: 8 }}>This Session Award Log</h3>
                {awardLog.map((entry, i) => (
                  <div key={i} style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: 11, marginBottom: 4 }}>
                    {entry}
                  </div>
                ))}
              </div>
            )}

            {/* Change PIN */}
            <div style={{ borderTop: '1px solid #1e293b', paddingTop: 20 }}>
              <h3 style={{ color: '#64748b', fontFamily: 'monospace', fontSize: 12, marginBottom: 10 }}>Change PIN</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="password"
                  value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  placeholder="New PIN (min 4 digits)"
                  style={{ ...input, flex: 1 }}
                />
                <button onClick={handleSetPin} style={btn()}>Set PIN</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
