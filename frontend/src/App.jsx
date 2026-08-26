import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/useAuth'
import ProtectedRoute from './auth/ProtectedRoute'
import NavBar from './layout/NavBar'
import Login from './auth/Login'
import Dashboard from './dashboard/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
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