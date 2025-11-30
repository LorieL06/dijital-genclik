import { useState, useEffect } from 'react'
import { getAccounts, getSecuritySummary } from '../services/api'
import './Profile.css'
function Profile({ onLogout }) {
  const [accounts, setAccounts] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    loadData()
  }, [])
  const loadData = async () => {
    try {
      const [accountsData, summaryData] = await Promise.all([getAccounts(), getSecuritySummary()])
      setAccounts(accountsData.accounts || [])
      setSummary(summaryData)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="profile-loading">
        <div className="loading loading-large"></div>
      </div>
    )
  }
  return (
    <div className="profile">
      <header className="profile-header">
        <div className="container">
          <div className="header-content">
            <div>
              <h1>Profil</h1>
              <p className="header-subtitle">Hesap bilgileriniz ve güvenlik durumunuz</p>
            </div>
            <button className="btn btn-secondary" onClick={onLogout}>Çıkış Yap</button>
          </div>
        </div>
      </header>
      <div className="container">
        <div className="profile-content">
          <div className="profile-section">
            <h2>Güvenlik Özeti</h2>
            <div className="summary-cards">
              <div className="summary-card">
                <div className="summary-label">Genel Güvenlik Skoru</div>
                <div className="summary-value large">{summary?.overallSecurityScore || 0}/100</div>
              </div>
              <div className="summary-card">
                <div className="summary-label">Toplam Hesap</div>
                <div className="summary-value">{summary?.totalAccounts || 0}</div>
              </div>
              <div className="summary-card danger">
                <div className="summary-label">Kritik Sorunlar</div>
                <div className="summary-value">{summary?.criticalIssues || 0}</div>
              </div>
            </div>
          </div>
          <div className="profile-section">
            <h2>Bağlı Hesaplar</h2>
            {accounts.length === 0 ? (
              <div className="empty-state">
                <p>Henüz hesap bağlanmamış</p>
                <a href="/connect" className="btn btn-primary">Hesap Bağla</a>
              </div>
            ) : (
              <div className="accounts-list">
                {accounts.map(account => (
                  <div key={account.id} className="account-item">
                    <div className="account-info">
                      <h3>{account.name}</h3>
                      <span className="account-type">{account.type}</span>
                    </div>
                    <div className="account-score">
                      <span className={`score-badge score-${account.securityScore?.level || 'poor'}`}>
                        {account.securityScore?.score || 0}/100
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="profile-section privacy-section">
            <h2>Gizlilik ve Güvenlik</h2>
            <div className="privacy-info">
              <div className="privacy-item">
                <span className="privacy-icon">→</span>
                <div>
                  <strong>Verileriniz Güvende</strong>
                  <p>End-to-end şifreleme ile korunur</p>
                </div>
              </div>
              <div className="privacy-item">
                <span className="privacy-icon">→</span>
                <div>
                  <strong>Hiçbir Kimseyle Paylaşılmaz</strong>
                  <p>Verileriniz sadece siz ve sistem arasında kalır</p>
                </div>
              </div>
              <div className="privacy-item">
                <span className="privacy-icon">→</span>
                <div>
                  <strong>Veri Sızıntısı İmkansız</strong>
                  <p>En yüksek güvenlik standartları</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Profile
