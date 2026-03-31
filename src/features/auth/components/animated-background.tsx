export function AnimatedBackground() {
  return (
    <div className="auth-bg fixed inset-0 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="auth-neon-layer absolute mix-blend-screen" />
        <div className="auth-bloom absolute mix-blend-screen" />

        <div className="auth-streak absolute mix-blend-screen" style={{ top: '25%', height: 2, rotate: '-8deg' }} />
        <div className="auth-streak absolute mix-blend-screen" style={{ top: '50%', height: 3, rotate: '0deg', animationDuration: '18s' }} />
        <div className="auth-streak absolute mix-blend-screen" style={{ top: '75%', height: 4, rotate: '8deg', animationDuration: '22s' }} />

        <div className="auth-frost absolute inset-0" />
      </div>
    </div>
  )
}

