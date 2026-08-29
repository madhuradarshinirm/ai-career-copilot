export default function QuestionCard({ question, index, total, answer, onAnswerChange, onSubmit, submitting }) {
  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '2rem' }}>
      <p style={{ color: '#666' }}>
        Question {index + 1} of {total} — {question.topic} ({question.type === 'coding_review' ? 'Coding' : 'Conceptual'})
      </p>
      <div style={{ background: '#eee', height: '8px', borderRadius: '4px', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: `${((index + 1) / total) * 100}%`,
            background: '#333',
            height: '8px',
            borderRadius: '4px',
          }}
        />
      </div>

      <h2>{question.prompt}</h2>

      <textarea
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value)}
        placeholder="Type your answer here..."
        rows={10}
        style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}
      />

      <button
        onClick={onSubmit}
        disabled={submitting || !answer.trim()}
        style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }}
      >
        {submitting ? 'AI is reviewing your answer...' : 'Submit Answer'}
      </button>
    </div>
  )
}