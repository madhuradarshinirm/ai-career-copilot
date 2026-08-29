import { useLocation, Link } from 'react-router-dom'

export default function SessionSummary() {
  const location = useLocation()
  const result = location.state // { session_id, status, average_score, total_questions, answered_questions, questions }

  if (!result) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No interview results found. Please start a new interview from your Analysis page.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '2rem', textAlign: 'center' }}>
      <h1>Interview Complete!</h1>
      <h2>Average Score: {result.average_score} / 10</h2>

      <div style={{ textAlign: 'left', marginTop: '2rem' }}>
        <h3>Questions Covered</h3>
        <ul>
          {result.questions.map((q, i) => (
            <li key={q.id} style={{ marginBottom: '0.5rem' }}>
              <strong>Q{i + 1}:</strong> {q.topic} ({q.type === 'coding_review' ? 'Coding' : 'Conceptual'})
            </li>
          ))}
        </ul>
      </div>

      <Link to="/dashboard">
        <button style={{ padding: '0.75rem 1.5rem', marginTop: '1.5rem' }}>Back to Dashboard</button>
      </Link>
    </div>
  )
}