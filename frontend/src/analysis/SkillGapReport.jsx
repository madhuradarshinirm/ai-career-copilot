export default function SkillGapReport({ strengths, gaps }) {
  const priorityColor = { high: '#c0392b', medium: '#e67e22', low: '#7f8c8d' }

  return (
    <div>
      <h2>Skill Gap Report</h2>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '250px', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h3>✓ Strengths</h3>
          <ul>
            {strengths.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: '250px', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h3>⚠ Gaps</h3>
          <ul>
            {gaps.map((g, i) => (
              <li key={i}>
                <strong>{g.topic}</strong>{' '}
                <span style={{ color: priorityColor[g.priority] || '#333', fontSize: '0.85rem' }}>
                  [{g.priority}]
                </span>
                <br />
                <span style={{ color: '#666', fontSize: '0.9rem' }}>{g.why}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}