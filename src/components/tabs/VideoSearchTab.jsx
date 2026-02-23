import { Video } from 'lucide-react'

export default function VideoSearchTab() {
  return (
    <div className="card">
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Video size={28} />
          VIDEO QIDIRUV
        </h2>
        <p style={{ color: '#aaa', fontSize: '14px' }}>
          YouTube dan O'zbek tilidagi videolarni qidiring
        </p>
      </div>
    </div>
  )
}
