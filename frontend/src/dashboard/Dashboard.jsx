import { useAuth } from '../auth/useAuth'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to AI Career Copilot 👋</h1>
      <p>Foundation is working. Logged in as: {user?.email ?? 'Loading...'}</p>
      <p>Real dashboard content coming Day 7.</p>
    </div>
  )
}