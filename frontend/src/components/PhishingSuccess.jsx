import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PhishingSuccess.css'
function PhishingSuccess() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/dashboard')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])
  return (
    <div className="phishing-success">
      <div className="success-content">
        <div className="success-icon"></div>
        <h2>Şifre Değiştirme İşlemi Başlatıldı</h2>
        <p>Phishing testi başarıyla tamamlandı. Sisteminiz bu saldırıyı algıladı ve hesabınızı otomatik olarak korumaya aldı.</p>
        <p className="redirect-text">Dashboard'a yönlendiriliyorsunuz... ({countdown})</p>
        <button onClick={() => navigate('/dashboard')} className="success-btn">Dashboard'a Git</button>
      </div>
    </div>
  )
}
export default PhishingSuccess
