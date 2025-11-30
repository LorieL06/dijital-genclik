import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'
import './Login.css'
function Register({ onLogin }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor')
      return
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı')
      return
    }
    setLoading(true)
    try {
      const response = await register(email, password)
      if (response && response.token) {
        onLogin(response.token)
        navigate('/dashboard', { replace: true })
      } else {
        setError('Kayıt başarısız. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      setError(err.message || 'Kayıt sırasında bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Hesap Oluştur</h1>
          <p>Ücretsiz başlayın, hesaplarınızı güvence altına alın</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="input" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="form-group">
            <label>Şifre Tekrar</label>
            <input type="password" className="input" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <>
                <span className="loading"></span>
                Kayıt olunuyor...
              </>
            ) : (
              'Hesap Oluştur'
            )}
          </button>
        </form>
        <div className="login-footer">
          <p className="privacy-note">
            Kayıt olarak <Link to="/" className="privacy-link">Gizlilik Politikamızı</Link> kabul etmiş olursunuz. Verileriniz sadece siz ve sistem arasında kalır.
          </p>
          <button type="button" className="btn-link" onClick={() => navigate('/login')}>
            Zaten hesabınız var mı? Giriş yapın
          </button>
        </div>
      </div>
    </div>
  )
}
export default Register
