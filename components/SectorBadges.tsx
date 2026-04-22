'use client';

const SECTORS = [
  { key: 'construction', label: 'Construction', icon: '🏗️', className: 'badge-construction' },
  { key: 'mechanical',   label: 'Mechanical',   icon: '⚙️', className: 'badge-mechanical' },
  { key: 'electrical',   label: 'Electrical',   icon: '⚡', className: 'badge-electrical' },
];

export default function SectorBadges() {
  return (
    <div className="sector-badges">
      {SECTORS.map(s => (
        <span key={s.key} className={`sector-badge ${s.className}`}>
          <span className="badge-icon">{s.icon}</span>
          {s.label}
        </span>
      ))}
    </div>
  );
}
