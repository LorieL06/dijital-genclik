import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AccountList from './AccountList'
import AddAccountModal from './AddAccountModal'
import SecurityScan from './SecurityScan'
import SecuritySummary from './SecuritySummary'
import PhishingTestModal from './PhishingTestModal'
import { getAccounts, getSecuritySummary, getPhishingAlerts } from '../services/api'
import './Dashboard.css'
function Dashboard({ onLogout }) {
  const [accounts, setAccounts] = useState([])
  const [summary, setSummary] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPhishingModal, setShowPhishingModal] = useState(false)
  const [phishingAlerts, setPhishingAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('accounts')
  const [error, setError] = useState(null)
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [accountsData, summaryData] = await Promise.all([getAccounts(), getSecuritySummary()])
      setAccounts(accountsData.accounts || [])
      setSummary(summaryData)
    } catch (error) {
      setError('Veriler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }
  const handleAccountAdded = () => {
    setShowAddModal(false)
    loadData()
  }
  const handleAccountDeleted = () => {
    loadData()
  }
  const loadPhishingAlerts = async () => {
    try {
      const data = await getPhishingAlerts()
      if (data.ok && data.alerts) {
        setPhishingAlerts(data.alerts)
      }
    } catch (error) {}
  }
  useEffect(() => {
    loadData()
    loadPhishingAlerts()
    const interval = setInterval(() => {
      loadPhishingAlerts()
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    const handleOpenPhishingModal = () => {
      setShowPhishingModal(true)
    }
    window.addEventListener('openPhishingModal', handleOpenPhishingModal)
    return () => window.removeEventListener('openPhishingModal', handleOpenPhishingModal)
  }, [])
  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading"></div>
        <p>Yükleniyor...</p>
      </div>
    )
  }
  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {error && <div className="error-banner">{error}</div>}
        <div className="dashboard-tabs">
          <button
            className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            Hesaplarım ({accounts.length})
          </button>
          <button
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Güvenlik Taraması
          </button>
        </div>
        {activeTab === 'accounts' && (
          <div className="dashboard-content">
            <div className="content-header">
              <h2>Hesaplarım</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                + Yeni Hesap Ekle
              </button>
            </div>
            {accounts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"></div>
                <h3>Henüz hesap eklenmemiş</h3>
                <p>Güvenlik kontrolü için hesaplarınızı ekleyin</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  İlk Hesabınızı Ekleyin
                </button>
              </div>
            ) : (
              <AccountList
                accounts={accounts}
                onDelete={handleAccountDeleted}
                onRefresh={loadData}
              />
            )}
          </div>
        )}
        {activeTab === 'security' && (
          <div className="dashboard-content">
            <SecuritySummary summary={summary} />
            <SecurityScan
              accounts={accounts}
              onScanComplete={loadData}
            />
          </div>
        )}
      </div>
      {showAddModal && (
        <AddAccountModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAccountAdded}
        />
      )}
      {showPhishingModal && (
        <PhishingTestModal
          onClose={() => setShowPhishingModal(false)}
          onTestCreated={() => {
            loadPhishingAlerts()
            loadData()
          }}
        />
      )}
      {phishingAlerts.length > 0 && (
        <div className="phishing-alert-banner">
          <div className="alert-content">
            <div>
              <strong>Phishing Saldırısı Tespit Edildi!</strong>
              <p>{phishingAlerts[0].message}</p>
            </div>
            <button 
              className="alert-close"
              onClick={() => setPhishingAlerts([])}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default Dashboard
