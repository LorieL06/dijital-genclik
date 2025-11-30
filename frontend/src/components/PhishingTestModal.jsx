import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPhishingTest } from '../services/api'
import './PhishingTestModal.css'
function PhishingTestModal({ onClose, onTestCreated }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Email adresi gerekli')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await createPhishingTest(email, 'instagram')
      if (result.ok) {
        if (onTestCreated) onTestCreated(result)
        onClose()
        navigate('/phishing/zpisher')
      }
    } catch (err) {
      setError('Phishing testi oluşturulamadı')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content phishing-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Phishing Testi Oluştur</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <p className="phishing-warning">
            Bu bir güvenlik testidir. Zpisher adlı bir phishing simülasyon sayfasına yönlendirileceksiniz. Bu sayfada yazdığınız şifreler anlık olarak görüntülenecektir. Bu, gerçek bir phishing saldırısının nasıl çalıştığını anlamanız için tasarlanmış bir eğitim simülasyonudur.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Adresiniz</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="test@example.com" required className="input" />
            </div>
            {error && <div className="error-message">{error}</div>}
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>İptal</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Oluşturuluyor...' : 'Test Oluştur ve Başlat'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default PhishingTestModal
