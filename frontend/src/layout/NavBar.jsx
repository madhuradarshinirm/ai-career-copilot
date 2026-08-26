import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../auth/useAuth'

export default function NavBar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <strong>AI Career Copilot</strong>
      <div>
        <Link to="/dashboard" style={{ marginRight: '1rem' }}>Dashboard</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}