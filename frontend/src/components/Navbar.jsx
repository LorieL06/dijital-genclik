import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getToken, removeToken } from '../services/auth'
import { getPhishingAlerts } from '../services/api'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'
function Navbar({ onLogout, isAuthenticated: propIsAuthenticated }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [phishingAlerts, setPhishingAlerts] = useState([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  useEffect(() => {
    const token = getToken()
    const authState = propIsAuthenticated !== undefined ? propIsAuthenticated : !!token
    setIsAuthenticated(authState)
    if (authState && token) {
      loadPhishingAlerts()
      const interval = setInterval(() => {
        loadPhishingAlerts()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [location, propIsAuthenticated])
  const loadPhishingAlerts = async () => {
    try {
      const data = await getPhishingAlerts()
      if (data.ok && data.alerts) {
        setPhishingAlerts(data.alerts)
      }
    } catch (error) {}
  }
  const handleLogout = () => {
    removeToken()
    setIsAuthenticated(false)
    if (onLogout) onLogout()
    navigate('/')
  }
  const isActive = (path) => {
    return location.pathname === path
  }
  if (!isAuthenticated && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register') {
    return null
  }
  if (location.pathname.startsWith('/phishing/test/')) {
    return null
  }
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? "/dashboard" : "/"} className="navbar-logo">
          <img src="/OIP.jpg" alt="GSB Logo" className="logo-icon" />
          <span className="logo-text">Dijital Gençlik</span>
        </Link>
        <button className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menü">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
              <Link to="/connect" className={`navbar-link ${isActive('/connect') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Hesap Bağla</Link>
              <Link to="/gsb" className={`navbar-link ${isActive('/gsb') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>GSB</Link>
              <Link to="/education" className={`navbar-link ${isActive('/education') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Eğitim</Link>
              <Link to="/profile" className={`navbar-link ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Profil</Link>
              <Link to="/recovery" className={`navbar-link ${isActive('/recovery') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Geri Teslim</Link>
              <button className={`navbar-link phishing-link ${phishingAlerts.length > 0 ? 'has-alerts' : ''}`} onClick={() => {
                navigate('/dashboard')
                setMobileMenuOpen(false)
                setTimeout(() => window.dispatchEvent(new CustomEvent('openPhishingModal')), 100)
              }}>Phishing {phishingAlerts.length > 0 && `(${phishingAlerts.length})`}</button>
              <button className="navbar-link logout-link" onClick={handleLogout}>Çıkış</button>
            </>
          ) : (
            <>
              <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Ana Sayfa</Link>
              <Link to="/login" className={`navbar-link ${isActive('/login') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Giriş Yap</Link>
              <Link to="/register" className={`navbar-link ${isActive('/register') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
export default Navbar
