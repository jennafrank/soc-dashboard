import { useState } from 'react';
import { renderAvatarSVG, getAvatar, saveAvatar, AVATAR_OPTIONS, randomAvatar } from '../utils/avatar';

function AvatarDisplay({ login, size = 64, onClick }) {
  const config = getAvatar(login);
  const svg = renderAvatarSVG(config, size);
  return (
    <div
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', display: 'inline-block', lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: svg }}
      title={onClick ? 'Click to customize avatar' : login}
    />
  );
}

function AvatarCustomizer({ login, onClose }) {
  const [config, setConfig] = useState(getAvatar(login));

  const update = (key, val) => setConfig(c => ({ ...c, [key]: val }));
  const save = () => { saveAvatar(login, config); onClose(); window.location.reload(); };
  const randomize = () => setConfig(randomAvatar());

  const svg = renderAvatarSVG(config, 128);

  const sectionStyle = { marginBottom: 16 };
  const labelStyle = { color: '#94a3b8', fontSize: 11, fontFamily: 'monospace', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 1 };
  const optRow = { display: 'flex', gap: 6, flexWrap: 'wrap' };
  const optBtn = (active) => ({
    padding: '4px 10px',
    borderRadius: 4,
    border: `1px solid ${active ? '#4ade80' : '#334155'}`,
    background: active ? '#14532d' : '#1e293b',
    color: active ? '#4ade80' : '#94a3b8',
    fontSize: 11,
    cursor: 'pointer',
    fontFamily: 'monospace',
  });

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8,
        padding: 28, maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: '#4ade80', fontFamily: 'monospace', margin: 0, fontSize: 16 }}>
            ⚙ Customize Avatar — {login}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <div dangerouslySetInnerHTML={{ __html: svg }} style={{ lineHeight: 0 }} />
        </div>

        {[
          { key: 'hair', label: 'Hair Style' },
          { key: 'outfit', label: 'Outfit' },
          { key: 'accessory', label: 'Accessory' },
        ].map(({ key, label }) => (
          <div key={key} style={sectionStyle}>
            <span style={labelStyle}>{label}</span>
            <div style={optRow}>
              {AVATAR_OPTIONS[key].map(opt => (
                <button key={opt.id} style={optBtn(config[key] === opt.id)} onClick={() => update(key, opt.id)}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div style={sectionStyle}>
          <span style={labelStyle}>Skin Tone</span>
          <div style={optRow}>
            {AVATAR_OPTIONS.skin.map(opt => (
              <button key={opt.id} onClick={() => update('skin', opt.id)}
                style={{ ...optBtn(config.skin === opt.id), borderColor: opt.color }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: opt.color, marginRight: 4, verticalAlign: 'middle' }} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={sectionStyle}>
          <span style={labelStyle}>Background</span>
          <div style={optRow}>
            {AVATAR_OPTIONS.bg.map(opt => (
              <button key={opt.id} onClick={() => update('bg', opt.id)}
                style={{ ...optBtn(config.bg === opt.id), borderColor: opt.color }}>
                <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 2, background: opt.color, marginRight: 4, verticalAlign: 'middle' }} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={save} style={{
            flex: 1, padding: '10px 0', background: '#14532d', border: '1px solid #4ade80',
            color: '#4ade80', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace', fontSize: 13
          }}>Save Avatar</button>
          <button onClick={randomize} style={{
            padding: '10px 16px', background: '#1e293b', border: '1px solid #334155',
            color: '#94a3b8', borderRadius: 6, cursor: 'pointer', fontFamily: 'monospace', fontSize: 13
          }}>🎲 Random</button>
        </div>
      </div>
    </div>
  );
}

export default function Avatar({ login, size = 64, editable = false }) {
  const [editing, setEditing] = useState(false);
  const currentUser = localStorage.getItem('soc_me') || '';
  const canEdit = editable && (login === currentUser || !currentUser);

  return (
    <>
      <AvatarDisplay login={login} size={size} onClick={canEdit ? () => setEditing(true) : null} />
      {editing && <AvatarCustomizer login={login} onClose={() => setEditing(false)} />}
    </>
  );
}
