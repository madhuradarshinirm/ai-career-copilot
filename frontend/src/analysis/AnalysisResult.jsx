import { useLocation, useNavigate, Link } from 'react-router-dom'
import SkillGapReport from './SkillGapReport'
import PrepPlan from './PrepPlan'

export default function AnalysisResult() {
  const location = useLocation()
  const navigate = useNavigate()
  const analysis = location.state

  if (!analysis) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>No analysis data found. Please start from your Dashboard.</p>
        <Link to="/dashboard">Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <SkillGapReport strengths={analysis.strengths} gaps={analysis.gaps} />
      <PrepPlan prepPlan={analysis.prep_plan} />

      <button
        disabled
        title="Coming Day 6"
        style={{ width: '100%', padding: '0.75rem', marginTop: '2rem', opacity: 0.6 }}
      >
        Start Mock Interview → (coming Day 6)
      </button>

      <p style={{ marginTop: '1rem' }}>
        <Link to="/dashboard">Back to Dashboard</Link>
      </p>
    </div>
  )
}