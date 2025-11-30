import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register, login } from '../services/api'
import './Login.css'
function Login({ onLogin }) {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = isLogin ? await login(email, password) : await register(email, password)
      if (response && response.token) {
        onLogin(response.token)
        navigate('/dashboard', { replace: true })
      } else {
        setError('Giriş başarısız. Lütfen tekrar deneyin.')
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Dijital Gençlik</h1>
          <p>Hesaplarınızın güvenliğini kontrol edin ve koruyun</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="input" placeholder="ornek@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <>
                <span className="loading"></span>
                {isLogin ? 'Giriş yapılıyor...' : 'Kayıt olunuyor...'}
              </>
            ) : (
              isLogin ? 'Giriş Yap' : 'Kayıt Ol'
            )}
          </button>
        </form>
        <div className="login-footer">
          <button type="button" className="btn-link" onClick={() => {
            setIsLogin(!isLogin)
            setError('')
          }}>
            {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
          </button>
          <div className="footer-link">
            <a href="/" className="btn-link btn-link-small">← Ana Sayfaya Dön</a>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Login
