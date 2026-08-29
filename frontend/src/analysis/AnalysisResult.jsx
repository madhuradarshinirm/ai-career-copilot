import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import SkillGapReport from './SkillGapReport'
import PrepPlan from './PrepPlan'
import { apiPost } from '../lib/apiClient'

export default function AnalysisResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const analysis = location.state
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState('')

  if (!analysis) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No analysis data found. Please start from your Dashboard.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    )
  }

  async function handleStartInterview() {
    setError('')
    setStarting(true)
    try {
      const result = await apiPost('/api/start-interview', {
        skill_report_id: analysis.skill_report_id,
      })
      // Day 6 will build the actual interview-taking screen at /interview.
      // For today, we confirm the session + questions were created correctly.
      console.log('Interview session created:', result)
      alert(
        `Session created with ${result.questions.length} questions. Full interview UI comes Day 6. Check the browser console for the question set.`
      )
    } catch (err) {
      setError('Failed to start interview. Please try again.')
    } finally {
      setStarting(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <SkillGapReport strengths={analysis.strengths} gaps={analysis.gaps} />
      <PrepPlan prepPlan={analysis.prep_plan} />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={handleStartInterview}
        disabled={starting}
        style={{ width: '100%', padding: '0.75rem', marginTop: '2rem' }}
      >
        {starting ? 'Starting interview...' : 'Start Mock Interview →'}
      </button>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/dashboard">Back to Dashboard</Link>
      </p>
    </div>
  )
}