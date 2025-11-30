import { useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteAccount } from '../services/api'
import './AccountList.css'
function AccountList({ accounts, onDelete, onRefresh }) {
  const [deletingId, setDeletingId] = useState(null)
  const handleDelete = async (id) => {
    if (!window.confirm('Bu hesabı silmek istediğinize emin misiniz?')) return
    try {
      setDeletingId(id)
      await deleteAccount(id)
      onDelete()
    } catch (error) {
      alert('Silme hatası: ' + error.message)
    } finally {
      setDeletingId(null)
    }
  }
  const getScoreColor = (score) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'info'
    if (score >= 40) return 'warning'
    return 'danger'
  }
  const getTypeIcon = (type) => {
    const icons = { bank: '■', email: '▲', social: '●', other: '◆' }
    return icons[type] || '◆'
  }
  const getTypeLabel = (type) => {
    const labels = { bank: 'Banka', email: 'Email', social: 'Sosyal Medya', other: 'Diğer' }
    return labels[type] || type
  }
  const getLevelLabel = (level) => {
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
  if (accounts.length === 0) return null
  return (
    <div className="account-list">
      {accounts.map(account => (
        <div key={account.id} className="account-card">
          <div className="account-header">
            <div className="account-info">
              <div className="account-icon">{getTypeIcon(account.type)}</div>
              <div>
                <h3>{account.name}</h3>
                <span className="account-type">{getTypeLabel(account.type)}</span>
              </div>
            </div>
            <div className="account-score">
              <div className={`score-circle score-${getScoreColor(account.securityScore?.score || 0)}`}>
                <span className="score-value">{account.securityScore?.score || 0}</span>
              </div>
              <span className="score-label">{getLevelLabel(account.securityScore?.level)}</span>
            </div>
          </div>
          <div className="account-details">
            <div className="detail-row">
              <span className="detail-label">Şifre Gücü:</span>
              <span className={`badge badge-${account.passwordStrength?.strength === 'strong' ? 'success' : account.passwordStrength?.strength === 'medium' ? 'warning' : 'danger'}`}>
                {getStrengthLabel(account.passwordStrength?.strength)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">2FA:</span>
              <span className={`badge ${account.twoFactorEnabled ? 'badge-success' : 'badge-danger'}`}>
                {account.twoFactorEnabled ? 'Açık' : 'Kapalı'}
              </span>
            </div>
            {account.username && (
              <div className="detail-row">
                <span className="detail-label">Kullanıcı Adı:</span>
                <span className="detail-value">{account.username}</span>
              </div>
            )}
            {account.url && (
              <div className="detail-row">
                <span className="detail-label">URL:</span>
                <a href={account.url} target="_blank" rel="noopener noreferrer" className="detail-link">{account.url}</a>
              </div>
            )}
          </div>
          {account.passwordStrength?.recommendations?.length > 0 && (
            <div className="account-recommendations">
              <strong>Öneriler:</strong>
              <ul>
                {account.passwordStrength.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="account-actions">
            {(account.type === 'instagram' || account.name.toLowerCase().includes('instagram')) && (
              <Link to={`/account/${account.id}/activity`} className="btn btn-primary btn-sm">Aktivite Detayları</Link>
            )}
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(account.id)} disabled={deletingId === account.id}>
              {deletingId === account.id ? (
                <>
                  <span className="loading"></span>
                  Siliniyor...
                </>
              ) : (
                'Sil'
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
export default AccountList
