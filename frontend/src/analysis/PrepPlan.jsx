export default function PrepPlan({ prepPlan }) {
  const priorityLabel = { high: 'High', medium: 'Med', low: 'Low' }
  const priorityColor = { high: '#c0392b', medium: '#e67e22', low: '#7f8c8d' }

  const sorted = [...prepPlan].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.priority] - order[b.priority]
  })

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Your Prep Plan</h2>
      <ol>
        {sorted.map((p, i) => (
          <li key={i} style={{ marginBottom: '0.5rem' }}>
            <span style={{ color: priorityColor[p.priority] || '#333', fontWeight: 'bold' }}>
              [{priorityLabel[p.priority] || p.priority}]
            </span>{' '}
            <strong>{p.topic}:</strong> {p.action}
          </li>
        ))}
      </ol>
    </div>
  )
}