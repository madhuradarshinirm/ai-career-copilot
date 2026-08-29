import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to AI Career Copilot 👋</h1>
      <p>Logged in as: {user?.email ?? 'Loading...'}</p>
      <Link to="/resume-upload">
        <button style={{ padding: '0.75rem 1.5rem', marginTop: '1rem' }}>
          + Start New Analysis
        </button>
      </Link>
      <p style={{ marginTop: '2rem', color: '#666' }}>
        Full history view coming Day 7.
      </p>
    </div>
  )
}