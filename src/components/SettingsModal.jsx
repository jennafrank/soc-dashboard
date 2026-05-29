import { useState } from 'react';
import { testConnection } from '../services/github';

export default function SettingsModal({ onClose, onSave }) {
  const [owner, setOwner] = useState(localStorage.getItem('soc_owner') || '');
  const [repo, setRepo] = useState(localStorage.getItem('soc_repo') || 'cyber-range-soc');
  const [token, setToken] = useState(localStorage.getItem('soc_token') || '');
  const [refresh, setRefresh] = useState(localStorage.getItem('soc_refresh') || '5');
  const [me, setMe] = useState(localStorage.getItem('soc_me') || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const input = (label, value, onChange, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontFamily: 'monospace', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', boxSizing: 'border-box',
          background: '#1e293b', border: '1px solid #334155', borderRadius: 6,
          color: '#f1f5f9', fontFamily: 'monospace', fontSize: 13, padding: '10px 12px',
          outline: 'none',
        }}
      />
    </div>
  );

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    // Temporarily set values for the test
    localStorage.setItem('soc_owner', owner);
    localStorage.setItem('soc_repo', repo);
    localStorage.setItem('soc_token', token);
    try {
      const data = await testConnection();
      setTestResult({ ok: true, msg: `✓ Connected to ${data.full_name} — ${data.open_issues_count} open issues` });
    } catch (e) {
      setTestResult({ ok: false, msg: `✗ ${e.message}` });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    localStorage.setItem('soc_owner', owner);
    localStorage.setItem('soc_repo', repo);
    localStorage.setItem('soc_token', token);
    localStorage.setItem('soc_refresh', refresh);
    localStorage.setItem('soc_me', me);
    onSave();
    onClose();
  };

  const handleClearCache = () => {
    localStorage.removeItem('soc_cache');
    localStorage.removeItem('soc_cache_ts');
    setTestResult({ ok: true, msg: '✓ Cache cleared. Data will reload on next refresh.' });
  };

  const overlay = { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const panel = { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, padding: 28, maxWidth: 480, width: '100%', maxHeight: '90vh', overflowY: 'auto' };
  const btn = (primary) => ({
    padding: '10px 18px', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace', fontSize: 12,
    background: primary ? '#14532d' : '#1e293b',
    border: `1px solid ${primary ? '#4ade80' : '#334155'}`,
    color: primary ? '#4ade80' : '#94a3b8',
  });

  return (
    <div style={overlay}>
      <div style={panel}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 style={{ color: '#4ade80', fontFamily: 'monospace', fontSize: 15, margin: 0 }}>⚙ Settings</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        <div style={{ color: '#475569', fontSize: 11, fontFamily: 'monospace', marginBottom: 20, padding: '8px 12px', background: '#1e293b', borderRadius: 6 }}>
          Your token is stored in localStorage and never sent anywhere except the GitHub API. Use a fine-grained token with read-only Issues access.
        </div>

        {input('GitHub Owner (username or org)', owner, setOwner, 'text', 'jennafrank')}
        {input('Repository Name', repo, setRepo, 'text', 'cyber-range-soc')}
        {input('Personal Access Token', token, setToken, 'password', 'ghp_...')}
        {input('Your GitHub Username (for avatar editing)', me, setMe, 'text', 'your-github-username')}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontFamily: 'monospace', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
            Auto Refresh Interval
          </label>
          <select
            value={refresh}
            onChange={e => setRefresh(e.target.value)}
            style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: 6, color: '#f1f5f9', fontFamily: 'monospace', fontSize: 13, padding: '10px 12px' }}
          >
            <option value="0">Manual only</option>
            <option value="1">Every 1 minute</option>
            <option value="5">Every 5 minutes</option>
            <option value="15">Every 15 minutes</option>
          </select>
        </div>

        {testResult && (
          <div style={{
            padding: '8px 12px', borderRadius: 6, marginBottom: 16,
            background: testResult.ok ? '#14532d44' : '#7f1d1d44',
            border: `1px solid ${testResult.ok ? '#4ade80' : '#ef4444'}`,
            color: testResult.ok ? '#4ade80' : '#fca5a5',
            fontFamily: 'monospace', fontSize: 12,
          }}>
            {testResult.msg}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={handleSave} style={btn(true)}>Save Settings</button>
          <button onClick={handleTest} disabled={testing} style={btn(false)}>
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button onClick={handleClearCache} style={btn(false)}>Clear Cache</button>
        </div>
      </div>
    </div>
  );
}
