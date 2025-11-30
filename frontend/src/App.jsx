import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import AccountConnectionCenter from './components/AccountConnectionCenter'
import Profile from './components/Profile'
import LoginLogs from './components/LoginLogs'
import AccountRecovery from './components/AccountRecovery'
import InstagramActivity from './components/InstagramActivity'
import GSBCenter from './components/GSBCenter'
import EducationCenter from './components/EducationCenter'
import PhishingTest from './components/PhishingTest'
import PhishingSuccess from './components/PhishingSuccess'
import Zpisher from './components/Zpisher'
import Navbar from './components/Navbar'
import { getToken, setToken, removeToken } from './services/auth'
import './App.css'

function ProtectedRoute({ children }) {
  const token = getToken()
  return token ? children : <Navigate to="/login" replace />
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const token = getToken()
    setIsAuthenticated(!!token)
    setLoading(false)
  }, [])
  const handleLogin = (token) => {
    setToken(token)
    setIsAuthenticated(true)
  }
  const handleLogout = () => {
    removeToken()
    setIsAuthenticated(false)
  }
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading" style={{ width: 40, height: 40 }}></div>
      </div>
    )
  }
  return (
    <Router>
      <div className="App">
        <Navbar onLogout={handleLogout} isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register onLogin={handleLogin} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/connect" element={<ProtectedRoute><AccountConnectionCenter /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile onLogout={handleLogout} /></ProtectedRoute>} />
          <Route path="/logs" element={<ProtectedRoute><LoginLogs /></ProtectedRoute>} />
          <Route path="/recovery" element={<ProtectedRoute><AccountRecovery /></ProtectedRoute>} />
          <Route path="/account/:accountId/activity" element={<ProtectedRoute><InstagramActivity /></ProtectedRoute>} />
          <Route path="/gsb" element={<ProtectedRoute><GSBCenter /></ProtectedRoute>} />
          <Route path="/education" element={<ProtectedRoute><EducationCenter /></ProtectedRoute>} />
          <Route path="/phishing/test/:id" element={<PhishingTest />} />
          <Route path="/phishing/zpisher" element={<Zpisher />} />
          <Route path="/phishing/success" element={<ProtectedRoute><PhishingSuccess /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
