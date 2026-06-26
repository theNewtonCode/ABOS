import { useState } from 'react'
import { IconUser } from '@tabler/icons-react'

const avatarSrc = '/assets/avatar.png'

const stats = [
  { key: 'name',   value: 'Uday Bhatnagar' },
  { key: 'role',   value: 'ServiceNow Consultant' },
  { key: 'degree', value: 'CSE Data Science, B.Tech' },
  { key: 'base',   value: 'Hyderabad, IN' },
  { key: 'exp',    value: '3+ years' },
  { key: 'stack',  value: 'SN · Python · Power BI · SQL' },
]

const channels = [
  { key: 'yt_1',    value: 'The Lazy Electron' },
  { key: 'yt_2',    value: 'That Engineer Artist' },
  { key: 'project', value: 'The Snug Project' },
  { key: 'brand',   value: 'First Principle Studio' },
]

const glitchKeyframes = `
@keyframes avatarGlitch {
  0%   { opacity: 0; transform: translateX(-3px); filter: brightness(2); }
  15%  { opacity: 1; transform: translateX(2px);  filter: brightness(1.5) hue-rotate(90deg); }
  30%  { transform: translateX(-1px); filter: brightness(1); }
  45%  { transform: translateX(1px); }
  60%  { transform: translateX(0);   filter: brightness(1); }
  100% { opacity: 1; transform: translateX(0);    filter: brightness(1); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,70,0.6); }
  50%       { box-shadow: 0 0 0 4px rgba(0,255,70,0); }
}
@media (max-width: 500px) {
  .about-panels   { flex-direction: column !important; }
  .avatar-panel   { width: 100% !important; border-right: none !important;
                    border-bottom: 1px solid #00ff4633 !important;
                    flex-direction: row !important; padding: 12px !important; gap: 12px !important; }
  .avatar-image   { max-width: 70px !important; }
  .stats-panel    { width: 100% !important; }
}
`

export default function AboutWindow() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  return (
    <>
      <style>{glitchKeyframes}</style>
      <div
        className="about-panels"
        style={{ display: 'flex', height: '100%', overflow: 'hidden' }}
      >
        {/* ── LEFT: AVATAR PANEL ── */}
        <div
          className="avatar-panel"
          style={{
            width: '40%',
            borderRight: '1px solid #00ff4633',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: '16px 12px',
            gap: 10,
            flexShrink: 0,
          }}
        >
          {/* Image wrapper with glitch + overlays */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 140,
              animation: 'avatarGlitch 0.6s ease forwards',
              animationDelay: '0.2s',
              animationIterationCount: 1,
              opacity: 0, // starts at 0, glitch brings it to 1
            }}
          >
            {/* Loading / error placeholder */}
            {(!isLoaded || hasError) && (
              <div style={{
                width: '100%',
                aspectRatio: '3/4',
                background: '#00ff4608',
                border: '1px solid #00ff4633',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}>
                <IconUser size={32} color="#00ff4633" />
                {hasError && (
                  <span style={{ fontSize: 9, color: '#00ff4633' }}>avatar.png not found</span>
                )}
              </div>
            )}

            {/* Actual image */}
            <img
              src={avatarSrc}
              alt="Uday Bhatnagar avatar"
              className="avatar-image"
              onLoad={() => setIsLoaded(true)}
              onError={() => setHasError(true)}
              style={{
                display: hasError ? 'none' : 'block',
                opacity: isLoaded ? 1 : 0,
                position: isLoaded ? 'relative' : 'absolute',
                inset: 0,
                width: '100%',
                maxWidth: 140,
                aspectRatio: '3/4',
                objectFit: 'cover',
                objectPosition: 'center top',
                border: '1px solid #00ff4666',
                borderRadius: 4,
              }}
            />

            {/* Scanline overlay */}
            {isLoaded && !hasError && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,70,0.04) 2px, rgba(0,255,70,0.04) 4px)',
                pointerEvents: 'none',
                borderRadius: 4,
              }} />
            )}

            {/* Green tint overlay */}
            {isLoaded && !hasError && (
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,255,70,0.06)',
                mixBlendMode: 'screen',
                pointerEvents: 'none',
                borderRadius: 4,
              }} />
            )}
          </div>

          {/* Status badge */}
          <div style={{
            background: '#00ff4615',
            border: '1px solid #00ff4666',
            borderRadius: 2,
            padding: '3px 10px',
            fontSize: 10,
            color: '#00ff46',
            textAlign: 'center',
            letterSpacing: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}>
            <span style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#00ff46',
              display: 'inline-block',
              animation: 'pulse-glow 2s ease-in-out infinite',
              flexShrink: 0,
            }} />
            ONLINE // AVAILABLE
          </div>

          {/* Name label */}
          <span style={{
            fontSize: 11,
            color: '#00ff4699',
            textAlign: 'center',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}>
            uday bhatnagar
          </span>
        </div>

        {/* ── RIGHT: TERMINAL STATS PANEL ── */}
        <div
          className="stats-panel"
          style={{
            width: '60%',
            padding: '14px 16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          <div style={{ color: '#00ff4644', fontSize: 11, marginBottom: 8 }}>// reading: about_me.txt</div>

          {stats.map(s => (
            <div key={s.key} style={{ display: 'flex', gap: 8, fontSize: 12, lineHeight: 1.9 }}>
              <span style={{ color: '#00ff4699', minWidth: 72 }}>{s.key}</span>
              <span style={{ color: '#00ff4633' }}>→</span>
              <span style={{ color: '#00ff46' }}>{s.value}</span>
            </div>
          ))}

          <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #00ff4622' }} />

          <div style={{ color: '#00ff4644', fontSize: 10 }}>// creative_channels/</div>

          {channels.map(c => (
            <div key={c.key} style={{ display: 'flex', gap: 8, fontSize: 12, lineHeight: 1.9 }}>
              <span style={{ color: '#00ff4699', minWidth: 72 }}>{c.key}</span>
              <span style={{ color: '#00ff4633' }}>→</span>
              <span style={{ color: '#00ff46' }}>{c.value}</span>
            </div>
          ))}

          <hr style={{ margin: '8px 0', border: 'none', borderTop: '1px solid #00ff4622' }} />

          <div style={{ fontSize: 11, color: '#00ff4666', lineHeight: 1.8, fontStyle: 'italic', marginTop: 4 }}>
            Engineer by training.<br />
            Artist by instinct.<br />
            Building at the intersection<br />
            of systems + creativity.
          </div>
        </div>
      </div>
    </>
  )
}
