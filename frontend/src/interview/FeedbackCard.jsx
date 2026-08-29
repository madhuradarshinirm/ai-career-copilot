export default function FeedbackCard({ feedback, onNext, isLastQuestion }) {
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Score: {feedback.score} / 10</h2>

      <h3>Strengths</h3>
      <ul>
        {feedback.strengths.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>

      <h3>Areas to Improve</h3>
      <ul>
        {feedback.improvements.map((imp, i) => (
          <li key={i}>{imp}</li>
        ))}
      </ul>

      <button onClick={onNext} style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}>
        {isLastQuestion ? 'Finish Interview →' : 'Next Question →'}
      </button>
    </div>
  )
}