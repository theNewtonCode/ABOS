import { useBlogPosts } from '../../hooks/data/useBlogPosts'
import SkeletonLoader from '../admin/SkeletonLoader'

export default function BlogWindow() {
  const { posts, loading } = useBlogPosts()

  return (
    <div>
      <div style={{ color: '#00ff4699', marginBottom: 12, fontSize: 11 }}>// blog posts — ls -la</div>
      {loading ? <SkeletonLoader rows={4} /> : posts.map(post => (
        <a
          key={post.id}
          href={post.external_url ?? '#'}
          target={post.external_url ? '_blank' : '_self'}
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            color: '#00ff46', textDecoration: 'none', fontSize: 12,
            padding: '6px 0', borderBottom: '1px solid #00ff4633', transition: 'color 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#00ff46')}
        >
          <span style={{ color: '#00ff4699', fontSize: 10, flexShrink: 0 }}>-rw-r--r--</span>
          <span>{post.title}</span>
        </a>
      ))}
    </div>
  )
}
