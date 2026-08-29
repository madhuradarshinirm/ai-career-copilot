import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../auth/useAuth'
import { extractTextFromPdf } from './resumeParser'
import { apiPost } from '../lib/apiClient'

export default function ResumeUpload() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [mode, setMode] = useState('upload')
  const [pastedText, setPastedText] = useState('')
  const [fileName, setFileName] = useState('')
  const [extractedText, setExtractedText] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.')
      return
    }

    setError('')
    setFileName(file.name)
    setStatus('extracting')

    try {
      const text = await extractTextFromPdf(file)

      if (!text || text.length < 20) {
        setError(
          'Could not extract readable text from this PDF. Try the paste option instead.'
        )
        setStatus('idle')
        return
      }

      setExtractedText(text)
      setStatus('idle')
    } catch (err) {
      console.error('PDF extraction error:', err)
      setError(
        `Failed to read PDF: ${err.message || 'Unknown error'}`
      )
      setStatus('idle')
    }
  }

  async function handleSave() {
    const resumeText =
      mode === 'upload' ? extractedText : pastedText.trim()

    if (!resumeText || resumeText.length < 20) {
      setError(
        'Please provide resume text (upload a PDF or paste text) before continuing.'
      )
      return
    }

    if (!user?.id) {
      setError('User session not found. Please log in again.')
      return
    }

    setError('')
    setStatus('saving')

    const { data: savedResume, error: insertError } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        resume_text: resumeText,
        source_type: mode === 'upload' ? 'pdf' : 'paste',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Resume save error:', insertError)
      setError(`Failed to save resume: ${insertError.message}`)
      setStatus('idle')
      return
    }

    console.log('Resume saved successfully:', savedResume)

    setStatus('analyzing')

    try {
      console.log('Sending resume for AI analysis...')
      console.log('Resume ID:', savedResume.id)

      const analysis = await apiPost('/api/analyze-resume',{
        resume_id: savedResume.id,
      })

      console.log('AI analysis response:', analysis)

      navigate('/analysis', {
        state: analysis,
      })
    } catch (err) {
      console.error('AI analysis error:', err)

      setError(
        `Resume saved, but AI analysis failed: ${
          err.message || 'Unknown error'
        }`
      )

      setStatus('idle')
    }
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
      }}
    >
      <h1>Upload Your Resume</h1>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => {
            setMode('upload')
            setError('')
          }}
          disabled={mode === 'upload'}
          style={{ marginRight: '0.5rem' }}
        >
          Upload PDF
        </button>

        <button
          onClick={() => {
            setMode('paste')
            setError('')
          }}
          disabled={mode === 'paste'}
        >
          Paste Text Instead
        </button>
      </div>

      {mode === 'upload' && (
        <div
          style={{
            border: '2px dashed #999',
            padding: '1.5rem',
            textAlign: 'center',
          }}
        >
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
          />

          {status === 'extracting' && (
            <p>Extracting text...</p>
          )}

          {fileName &&
            extractedText &&
            status === 'idle' && (
              <p>
                ✅ Extracted text from: {fileName} (
                {extractedText.length} characters)
              </p>
            )}
        </div>
      )}

      {mode === 'paste' && (
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste your resume text here..."
          rows={12}
          style={{
            width: '100%',
            padding: '0.75rem',
            boxSizing: 'border-box',
          }}
        />
      )}

      {error && (
        <p
          style={{
            color: 'red',
            marginTop: '1rem',
          }}
        >
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={
          status === 'saving' ||
          status === 'extracting' ||
          status === 'analyzing'
        }
        style={{
          width: '100%',
          padding: '0.75rem',
          marginTop: '1.5rem',
        }}
      >
        {status === 'saving' && 'Saving...'}

        {status === 'analyzing' &&
          'Analyzing your resume with AI... (this can take up to 20 seconds)'}

        {status === 'idle' && 'Save Resume & Analyze'}

        {status === 'extracting' &&
          'Save Resume & Analyze'}
      </button>
    </div>
  )
}