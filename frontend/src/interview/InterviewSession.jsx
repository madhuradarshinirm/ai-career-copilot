import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { apiPost } from '../lib/apiClient'
import QuestionCard from './QuestionCard'
import FeedbackCard from './FeedbackCard'

const STORAGE_KEY = 'ai_career_copilot_active_interview'

export default function InterviewSession() {
  const location = useLocation()
  const navigate = useNavigate()

  // Source of truth is sessionStorage, not router state — router state can be lost
  // when the browser's history stack is manipulated (e.g. our own Back-button guard below).
  const [sessionData, setSessionData] = useState(null)
  const [initialized, setInitialized] = useState(false)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [finishing, setFinishing] = useState(false)

  const inProgressRef = useRef(false)

  // On mount: prefer fresh router state (just navigated here from Analysis page).
  // If router state is missing (e.g. after a Back-button remount), fall back to sessionStorage.
  useEffect(() => {
    if (location.state?.session_id && location.state?.questions) {
      const fresh = { session_id: location.state.session_id, questions: location.state.questions }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      setSessionData(fresh)
    } else {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        setSessionData(JSON.parse(stored))
      }
    }
    setInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  inProgressRef.current = Boolean(sessionData?.session_id) && !finishing

  // Warn on tab close / refresh / typing a new URL
  useEffect(() => {
    function handleBeforeUnload(e) {
      if (inProgressRef.current) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  // Warn on browser Back/Forward button.
  useEffect(() => {
    if (!sessionData?.session_id) return

    window.history.pushState({ interviewGuard: true }, '')

    function handlePopState() {
      if (!inProgressRef.current) return

      const confirmLeave = window.confirm(
        'You have an interview in progress. Your progress on the current question will be lost if you leave. Are you sure you want to leave?'
      )

      if (confirmLeave) {
        sessionStorage.removeItem(STORAGE_KEY)
        window.removeEventListener('popstate', handlePopState)
        navigate('/dashboard', { replace: true })
      } else {
        window.history.pushState({ interviewGuard: true }, '')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionData?.session_id])

  if (!initialized) {
    return null
  }

  if (!sessionData) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No active interview session found. Please start from your Analysis page.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    )
  }

  const { session_id, questions } = sessionData
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
        sessionStorage.removeItem(STORAGE_KEY)
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
      {error && <p role="alert" style={{ color: '#e05252', textAlign: 'center' }}>{error}</p>}

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