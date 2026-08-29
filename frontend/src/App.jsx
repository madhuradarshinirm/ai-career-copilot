import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/useAuth'
import ProtectedRoute from './auth/ProtectedRoute'
import NavBar from './layout/NavBar'
import Login from './auth/Login'
import SignUp from './auth/SignUp'
import Dashboard from './dashboard/Dashboard'
import ResumeUpload from './resume/ResumeUpload'
import AnalysisResult from './analysis/AnalysisResult'
import InterviewSession from './interview/InterviewSession'
import SessionSummary from './interview/SessionSummary'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume-upload"
            element={
              <ProtectedRoute>
                <ResumeUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <AnalysisResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview"
            element={
              <ProtectedRoute>
                <InterviewSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/interview-summary"
            element={
              <ProtectedRoute>
                <SessionSummary />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App