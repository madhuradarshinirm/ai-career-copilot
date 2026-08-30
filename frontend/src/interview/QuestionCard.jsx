const MAX_ANSWER_LENGTH = 3000

export default function QuestionCard({ question, index, total, answer, onAnswerChange, onSubmit, submitting }) {
  const charsLeft = MAX_ANSWER_LENGTH - answer.length
  const overLimit = charsLeft < 0

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '2rem' }}>
      <p style={{ color: '#9a9fa8' }}>
        Question {index + 1} of {total} — {question.topic} ({question.type === 'coding_review' ? 'Coding' : 'Conceptual'})
      </p>
      <div style={{ background: '#2e323a', height: '8px', borderRadius: '4px', marginBottom: '1.5rem' }}>
        <div
          style={{
            width: `${((index + 1) / total) * 100}%`,
            background: '#4f8cff',
            height: '8px',
            borderRadius: '4px',
          }}
        />
      </div>

      <h2>{question.prompt}</h2>

      <label htmlFor="answer-textarea" style={{ display: 'block', marginBottom: '0.25rem', color: '#9a9fa8' }}>
        Your answer
      </label>
      <textarea
        id="answer-textarea"
        value={answer}
        onChange={(e) => onAnswerChange(e.target.value.slice(0, MAX_ANSWER_LENGTH))}
        placeholder="Type your answer here..."
        rows={10}
        maxLength={MAX_ANSWER_LENGTH}
        style={{ width: '100%', padding: '0.75rem' }}
      />
      <p style={{ color: overLimit ? '#e05252' : '#9a9fa8', fontSize: '0.85rem', marginTop: '0.25rem' }}>
        {charsLeft} characters remaining
      </p>

      <button
        onClick={onSubmit}
        disabled={submitting || !answer.trim() || overLimit}
        style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
      >
        {submitting ? 'AI is reviewing your answer...' : 'Submit Answer'}
      </button>
    </div>
  )
}