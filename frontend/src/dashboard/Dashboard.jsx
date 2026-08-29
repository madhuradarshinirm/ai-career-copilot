import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../auth/useAuth'
import EmptyState from '../layout/EmptyState'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [reports, setReports] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    async function fetchHistory() {
      setLoading(true)
      setError('')

      const [reportsResult, sessionsResult] = await Promise.all([
        supabase
          .from('skill_reports')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('interview_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
      ])

      if (reportsResult.error || sessionsResult.error) {
        setError('Could not load your history. Please refresh the page.')
        setLoading(false)
        return
      }

      setReports(reportsResult.data)
      setSessions(sessionsResult.data)
      setLoading(false)
    }

    fetchHistory()
  }, [user])

  function sessionsForReport(reportId) {
    return sessions.filter((s) => s.skill_report_id === reportId)
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
        <p>Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem' }}>
      <h1 style={{ wordBreak: 'break-word' }}>Welcome back</h1>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>{user?.email}</p>

      <Link to="/resume-upload">
        <button style={{ padding: '0.75rem 1.5rem', marginBottom: '2rem' }}>
          + Start New Analysis
        </button>
      </Link>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reports.length === 0 ? (
        <EmptyState
          title="You haven't analyzed a resume yet."
          message="Upload your resume to get your first Skill Gap Report and Prep Plan."
          actionLabel="Upload Your Resume"
          onAction={() => navigate('/resume-upload')}
        />
      ) : (
        <div>
          <h2>Your Reports</h2>
          {reports.map((report) => {
            const relatedSessions = sessionsForReport(report.id)
            const latestSession = relatedSessions[0]

            return (
              <div
                key={report.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                  {formatDate(report.created_at)}
                  {latestSession?.status === 'completed' &&
                    ` — Last score: ${Math.round(latestSession.average_score * 10) / 10}/10`}
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>Gaps:</strong>{' '}
                  {report.gaps_json.slice(0, 3).map((g) => g.topic).join(', ')}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link
                    to="/analysis"
                    state={{
                      skill_report_id: report.id,
                      strengths: report.strengths_json,
                      gaps: report.gaps_json,
                      prep_plan: report.prep_plan_json,
                    }}
                  >
                    <button>View Report</button>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}