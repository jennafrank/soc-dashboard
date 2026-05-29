// Pixel-art avatar system — all inline SVG, 64x64 grid

export const AVATAR_OPTIONS = {
  hair: [
    { id: 'mohawk', label: 'Mohawk' },
    { id: 'long', label: 'Long' },
    { id: 'short', label: 'Short' },
    { id: 'bun', label: 'Bun' },
    { id: 'cap', label: 'Cap' },
    { id: 'hood', label: 'Hood' },
  ],
  skin: [
    { id: 'light', label: 'Light', color: '#fde68a' },
    { id: 'medium-light', label: 'Medium Light', color: '#f5c18a' },
    { id: 'medium', label: 'Medium', color: '#d4915a' },
    { id: 'medium-dark', label: 'Medium Dark', color: '#9c6040' },
    { id: 'dark', label: 'Dark', color: '#5c3320' },
  ],
  outfit: [
    { id: 'hoodie', label: 'Hoodie' },
    { id: 'jacket', label: 'Jacket' },
    { id: 'tactical', label: 'Tactical' },
    { id: 'casual', label: 'Casual' },
    { id: 'suit', label: 'Suit' },
  ],
  accessory: [
    { id: 'none', label: 'None' },
    { id: 'glasses', label: 'Glasses' },
    { id: 'headphones', label: 'Headphones' },
    { id: 'eyepatch', label: 'Eyepatch' },
    { id: 'mask', label: 'Mask' },
  ],
  bg: [
    { id: 'navy', label: 'Navy', color: '#0f172a' },
    { id: 'green', label: 'Green', color: '#14532d' },
    { id: 'purple', label: 'Purple', color: '#3b0764' },
    { id: 'red', label: 'Red', color: '#7f1d1d' },
    { id: 'teal', label: 'Teal', color: '#134e4a' },
    { id: 'gray', label: 'Gray', color: '#1f2937' },
    { id: 'amber', label: 'Amber', color: '#78350f' },
    { id: 'slate', label: 'Slate', color: '#0f172a' },
  ],
};

const SKIN_COLORS = {
  light: '#fde68a',
  'medium-light': '#f5c18a',
  medium: '#d4915a',
  'medium-dark': '#9c6040',
  dark: '#5c3320',
};

const BG_COLORS = {
  navy: '#0f172a', green: '#14532d', purple: '#3b0764',
  red: '#7f1d1d', teal: '#134e4a', gray: '#1f2937',
  amber: '#78350f', slate: '#1e293b',
};

function px(x, y, color, size = 4) {
  return `<rect x="${x * size}" y="${y * size}" width="${size}" height="${size}" fill="${color}"/>`;
}

function renderHair(hair, skin) {
  const c = '#1a1a1a';
  const h = skin;
  switch (hair) {
    case 'mohawk':
      return [px(7,2,c), px(8,1,c), px(7,3,c), px(8,2,c)].join('');
    case 'long':
      return [3,4,5,6,7,8,9,10,11,12].map(x =>
        [px(x,3,c), (x<=4||x>=11)?px(x,7,c):'', (x<=4||x>=11)?px(x,8,c):''].join('')
      ).join('');
    case 'short':
      return [4,5,6,7,8,9,10,11].map(x => px(x,3,c)).join('');
    case 'bun':
      return [px(7,2,c), px(8,2,c), px(7,3,c), px(8,3,c),
              ...[4,5,6,7,8,9,10,11].map(x=>px(x,4,c))].join('');
    case 'cap':
      return `<rect x="12" y="8" width="40" height="8" rx="2" fill="#1e3a5f"/>
              <rect x="8" y="14" width="48" height="6" rx="1" fill="#1e3a5f"/>`;
    case 'hood':
      return `<rect x="8" y="8" width="48" height="20" rx="4" fill="#1e293b"/>
              <ellipse cx="32" cy="22" rx="16" ry="12" fill="${skin}"/>`;
    default:
      return '';
  }
}

function renderAccessory(accessory) {
  switch (accessory) {
    case 'glasses':
      return `<rect x="14" y="28" width="14" height="8" rx="3" fill="none" stroke="#38bdf8" stroke-width="2"/>
              <rect x="36" y="28" width="14" height="8" rx="3" fill="none" stroke="#38bdf8" stroke-width="2"/>
              <line x1="28" y1="32" x2="36" y2="32" stroke="#38bdf8" stroke-width="2"/>`;
    case 'headphones':
      return `<path d="M14 26 Q14 14 32 14 Q50 14 50 26" fill="none" stroke="#334155" stroke-width="4"/>
              <rect x="10" y="26" width="8" height="12" rx="3" fill="#334155"/>
              <rect x="46" y="26" width="8" height="12" rx="3" fill="#334155"/>`;
    case 'eyepatch':
      return `<ellipse cx="22" cy="30" rx="8" ry="6" fill="#0f172a" stroke="#475569" stroke-width="1.5"/>
              <line x1="10" y1="25" x2="38" y2="27" stroke="#475569" stroke-width="1.5"/>`;
    case 'mask':
      return `<rect x="14" y="32" width="36" height="18" rx="4" fill="#1e293b"/>
              <line x1="16" y1="40" x2="48" y2="40" stroke="#334155" stroke-width="1"/>
              <line x1="16" y1="44" x2="48" y2="44" stroke="#334155" stroke-width="1"/>`;
    default:
      return '';
  }
}

function renderOutfit(outfit) {
  switch (outfit) {
    case 'hoodie':
      return `<rect x="8" y="46" width="48" height="20" rx="4" fill="#1e293b"/>
              <rect x="24" y="46" width="16" height="10" rx="2" fill="#0f172a"/>`;
    case 'jacket':
      return `<rect x="8" y="46" width="48" height="20" rx="4" fill="#1e3a5f"/>
              <rect x="28" y="46" width="8" height="18" fill="#0f172a"/>
              <rect x="10" y="48" width="6" height="3" rx="1" fill="#fbbf24"/>
              <rect x="10" y="54" width="6" height="3" rx="1" fill="#fbbf24"/>`;
    case 'tactical':
      return `<rect x="8" y="46" width="48" height="20" rx="2" fill="#374151"/>
              <rect x="16" y="48" width="10" height="6" rx="1" fill="#4b5563"/>
              <rect x="38" y="48" width="10" height="6" rx="1" fill="#4b5563"/>
              <rect x="26" y="50" width="12" height="14" rx="1" fill="#4b5563"/>`;
    case 'casual':
      return `<rect x="8" y="46" width="48" height="20" rx="4" fill="#0e7490"/>`;
    case 'suit':
      return `<rect x="8" y="46" width="48" height="20" rx="4" fill="#1e293b"/>
              <rect x="28" y="46" width="8" height="18" fill="#0f172a"/>
              <rect x="22" y="46" width="8" height="8" fill="#f8fafc"/>
              <rect x="34" y="46" width="8" height="8" fill="#f8fafc"/>
              <rect x="28" y="48" width="8" height="4" fill="#ef4444"/>`;
    default:
      return `<rect x="8" y="46" width="48" height="20" rx="4" fill="#1e293b"/>`;
  }
}

export function renderAvatarSVG(config, size = 64) {
  const { hair = 'short', skin = 'medium', outfit = 'hoodie', accessory = 'none', bg = 'navy' } = config;
  const skinColor = SKIN_COLORS[skin] || SKIN_COLORS.medium;
  const bgColor = BG_COLORS[bg] || BG_COLORS.navy;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <!-- Background -->
  <rect width="64" height="64" fill="${bgColor}"/>

  <!-- Scanline texture -->
  ${Array.from({length:32},(_,i)=>`<rect x="0" y="${i*2}" width="64" height="1" fill="rgba(0,0,0,0.15)"/>`).join('')}

  <!-- Body/outfit -->
  ${renderOutfit(outfit)}

  <!-- Neck -->
  <rect x="26" y="40" width="12" height="8" fill="${skinColor}"/>

  <!-- Head -->
  <ellipse cx="32" cy="28" rx="16" ry="18" fill="${skinColor}"/>

  <!-- Eyes -->
  <rect x="22" y="26" width="5" height="5" rx="1" fill="#0f172a"/>
  <rect x="37" y="26" width="5" height="5" rx="1" fill="#0f172a"/>
  <rect x="23" y="27" width="2" height="2" fill="#ffffff" opacity="0.7"/>
  <rect x="38" y="27" width="2" height="2" fill="#ffffff" opacity="0.7"/>

  <!-- Mouth -->
  <rect x="27" y="35" width="10" height="2" rx="1" fill="#9c6040" opacity="0.6"/>

  <!-- Hair -->
  ${renderHair(hair, skinColor)}

  <!-- Accessory -->
  ${renderAccessory(accessory)}

  <!-- Pixel border -->
  <rect x="0" y="0" width="64" height="64" fill="none" stroke="#1e293b" stroke-width="2"/>
</svg>`;
}

export function randomAvatar() {
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)].id;
  return {
    hair: pick(AVATAR_OPTIONS.hair),
    skin: pick(AVATAR_OPTIONS.skin),
    outfit: pick(AVATAR_OPTIONS.outfit),
    accessory: pick(AVATAR_OPTIONS.accessory),
    bg: pick(AVATAR_OPTIONS.bg),
  };
}

export function getAvatar(login) {
  const stored = localStorage.getItem(`avatar_${login}`);
  if (stored) return JSON.parse(stored);
  const generated = randomAvatar();
  localStorage.setItem(`avatar_${login}`, JSON.stringify(generated));
  return generated;
}

export function saveAvatar(login, config) {
  localStorage.setItem(`avatar_${login}`, JSON.stringify(config));
}
