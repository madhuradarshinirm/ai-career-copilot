import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { apiPost } from '../lib/apiClient'
import QuestionCard from './QuestionCard'
import FeedbackCard from './FeedbackCard'

export default function InterviewSession() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state // { session_id, questions }

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [finishing, setFinishing] = useState(false)

  if (!state || !state.session_id || !state.questions) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No active interview session found. Please start from your Analysis page.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    )
  }

  const { session_id, questions } = state
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1

  async function handleSubmitAnswer() {
    setError('')
    setSubmitting(true)
    try {
      const result = await apiPost('/api/evaluate-answer', {
        session_id,
        question_id: currentQuestion.id,
        user_answer: answer,
      })
      setFeedback(result)
    } catch (err) {
      setError('Failed to get AI feedback. Please try submitting again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleNext() {
    if (isLastQuestion) {
      setFinishing(true)
      try {
        const result = await apiPost('/api/complete-interview', { session_id })
        navigate('/interview-summary', { state: { ...result, questions } })
      } catch (err) {
        setError('Failed to finalize the interview. Please try again.')
        setFinishing(false)
      }
      return
    }

    setCurrentIndex((i) => i + 1)
    setAnswer('')
    setFeedback(null)
  }

  return (
    <div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      {!feedback ? (
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={questions.length}
          answer={answer}
          onAnswerChange={setAnswer}
          onSubmit={handleSubmitAnswer}
          submitting={submitting}
        />
      ) : (
        <FeedbackCard
          feedback={feedback}
          onNext={handleNext}
          isLastQuestion={isLastQuestion && !finishing}
        />
      )}

      {finishing && <p style={{ textAlign: 'center' }}>Finalizing your results...</p>}
    </div>
  )
}