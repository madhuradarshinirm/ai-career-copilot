import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1>Page not found</h1>
      <p style={{ color: '#9a9fa8', marginBottom: '1.5rem' }}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/dashboard">
        <button>Back to Dashboard</button>
      </Link>
    </div>
  )
}