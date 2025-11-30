import { useState } from 'react'
import { runSecurityScan } from '../services/api'
import './SecurityScan.css'
function SecurityScan({ accounts, onScanComplete }) {
  const [scanResult, setScanResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const handleScan = async () => {
    if (accounts.length === 0) {
      alert('Önce hesap eklemelisiniz!')
      return
    }
    setError('')
    setLoading(true)
    setScanResult(null)
    try {
      const result = await runSecurityScan()
      setScanResult(result)
      if (onScanComplete) onScanComplete()
    } catch (err) {
      setError(err.message || 'Tarama sırasında bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'danger'
      case 'high': return 'warning'
      case 'medium': return 'info'
      default: return 'info'
    }
  }
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical': return 'Kritik'
      case 'high': return 'Yüksek'
      case 'medium': return 'Orta'
      default: return 'Düşük'
    }
  }
  const getScoreLabel = (level) => {
    if (level === 'excellent') return 'Mükemmel'
    if (level === 'good') return 'İyi'
    if (level === 'fair') return 'Orta'
    return 'Zayıf'
  }
  const getStrengthLabel = (strength) => {
    if (strength === 'strong') return 'Güçlü'
    if (strength === 'medium') return 'Orta'
    return 'Zayıf'
  }
  return (
    <div className="security-scan">
      <div className="scan-header">
        <div>
          <h2>Güvenlik Taraması</h2>
          <p>Tüm hesaplarınızı tarayın ve güvenlik sorunlarını tespit edin</p>
        </div>
        <button className="btn btn-primary" onClick={handleScan} disabled={loading || accounts.length === 0}>
          {loading ? (
            <>
              <span className="loading"></span>
              Taranıyor...
            </>
          ) : (
            'Taramayı Başlat'
          )}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
      {scanResult && (
        <div className="scan-results">
          <div className="results-header">
            <h3>Tarama Sonuçları</h3>
            <span className="results-count">{scanResult.results.length} hesap kontrol edildi</span>
          </div>
          {scanResult.results.map((result, idx) => (
            <div key={idx} className="result-card">
              <div className="result-header">
                <h4>{result.accountName}</h4>
                <div className={`badge badge-${getPriorityColor(result.checks.securityScore.level)}`}>
                  Skor: {result.checks.securityScore.score}/100 - {getScoreLabel(result.checks.securityScore.level)}
                </div>
              </div>
              <div className="result-details">
                <div className="detail-item">
                  <span className="detail-label">Şifre Gücü:</span>
                  <span className={`badge badge-${result.checks.passwordStrength.strength === 'strong' ? 'success' : result.checks.passwordStrength.strength === 'medium' ? 'warning' : 'danger'}`}>
                    {getStrengthLabel(result.checks.passwordStrength.strength)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Veri Sızıntısı:</span>
                  {result.checks.breachCheck.breached ? (
                    <span className="badge badge-danger">⚠ {result.checks.breachCheck.breaches.length} sızıntı tespit edildi</span>
                  ) : (
                    <span className="badge badge-success">✓ Temiz</span>
                  )}
                </div>
                {result.checks.breachCheck.breached && result.checks.breachCheck.breaches.length > 0 && (
                  <div className="breach-list">
                    <strong>Sızıntılar:</strong>
                    <ul>
                      {result.checks.breachCheck.breaches.map((breach, bIdx) => (
                        <li key={bIdx}>{breach.name} ({breach.date}) - {breach.accounts} hesap etkilendi</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {result.recommendations.length > 0 && (
                <div className="recommendations">
                  <h5>Öneriler ({result.recommendations.length})</h5>
                  {result.recommendations.map((rec, rIdx) => (
                    <div key={rIdx} className={`recommendation recommendation-${getPriorityColor(rec.priority)}`}>
                      <div className="recommendation-header">
                        <span className={`badge badge-${getPriorityColor(rec.priority)}`}>{getPriorityLabel(rec.priority)}</span>
                        <span className="recommendation-type">{rec.type}</span>
                      </div>
                      <p className="recommendation-message">{rec.message}</p>
                      {rec.actions && rec.actions.length > 0 && (
                        <ul className="recommendation-actions">
                          {rec.actions.map((action, aIdx) => (
                            <li key={aIdx}>{action}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {accounts.length === 0 && (
        <div className="empty-scan">
          <p>Güvenlik taraması için önce hesap eklemelisiniz.</p>
        </div>
      )}
    </div>
  )
}
export default SecurityScan
