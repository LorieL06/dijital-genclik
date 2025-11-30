import { useState } from 'react'
import { addAccount, checkPasswordStrength } from '../services/api'
import './AddAccountModal.css'
function AddAccountModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'bank', name: '', username: '', password: '', url: '',
    twoFactorEnabled: false, passwordReused: false, securityQuestionsSet: false, lastPasswordChange: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordStrength, setPasswordStrength] = useState(null)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (name === 'password' && value) {
      checkPasswordStrength(value).then(result => setPasswordStrength(result)).catch(() => setPasswordStrength(null))
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await addAccount({ ...formData, lastPasswordChange: formData.lastPasswordChange || null })
      onSuccess()
    } catch (err) {
      setError(err.message || 'Hesap eklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }
  const getStrengthLabel = (strength) => {
    if (strength === 'strong') return 'Güçlü'
    if (strength === 'medium') return 'Orta'
    return 'Zayıf'
  }
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Yeni Hesap Ekle</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label>Hesap Tipi *</label>
            <select name="type" className="input" value={formData.type} onChange={handleChange} required>
              <option value="bank">Banka</option>
              <option value="email">Email</option>
              <option value="social">Sosyal Medya</option>
              <option value="other">Diğer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Hesap Adı *</label>
            <input type="text" name="name" className="input" placeholder="Örn: Ziraat Bankası, Gmail" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Kullanıcı Adı / Email</label>
            <input type="text" name="username" className="input" placeholder="kullanici@email.com" value={formData.username} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Şifre</label>
            <input type="password" name="password" className="input" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            {passwordStrength && (
              <div className="password-strength">
                <div className={`strength-indicator strength-${passwordStrength.strength}`}>
                  <div className="strength-bar" style={{ width: `${(passwordStrength.score / 6) * 100}%` }}></div>
                </div>
                <span className="strength-text">Güç: {getStrengthLabel(passwordStrength.strength)} ({passwordStrength.score}/6)</span>
                {passwordStrength.recommendations.length > 0 && (
                  <ul className="strength-recommendations">
                    {passwordStrength.recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          <div className="form-group">
            <label>URL</label>
            <input type="url" name="url" className="input" placeholder="https://..." value={formData.url} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Son Şifre Değişikliği</label>
            <input type="date" name="lastPasswordChange" className="input" value={formData.lastPasswordChange} onChange={handleChange} />
          </div>
          <div className="form-checkboxes">
            <label className="checkbox-label">
              <input type="checkbox" name="twoFactorEnabled" checked={formData.twoFactorEnabled} onChange={handleChange} />
              <span>İki Faktörlü Doğrulama (2FA) Açık</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="passwordReused" checked={formData.passwordReused} onChange={handleChange} />
              <span>Şifre Başka Hesaplarda Kullanılıyor</span>
            </label>
            <label className="checkbox-label">
              <input type="checkbox" name="securityQuestionsSet" checked={formData.securityQuestionsSet} onChange={handleChange} />
              <span>Güvenlik Soruları Ayarlanmış</span>
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>İptal</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading"></span>
                  Ekleniyor...
                </>
              ) : (
                'Hesap Ekle'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddAccountModal
