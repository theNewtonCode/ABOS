const WIDTHS = ['60%', '80%', '45%', '70%', '55%']

interface Props {
  rows?: number
}

export default function SkeletonLoader({ rows = 5 }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '4px 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton-bar"
          style={{ height: 12, width: WIDTHS[i % WIDTHS.length], background: '#00ff4610', borderRadius: 2 }}
        />
      ))}
    </div>
  )
}
