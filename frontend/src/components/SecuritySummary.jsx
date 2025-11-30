import './SecuritySummary.css'
function SecuritySummary({ summary }) {
  if (!summary) {
    return (
      <div className="security-summary">
        <p>Yükleniyor...</p>
      </div>
    )
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
  const getTypeName = (type) => {
    const names = { bank: 'Banka', email: 'Email', social: 'Sosyal Medya', other: 'Diğer' }
    return names[type] || type
  }
  return (
    <div className="security-summary">
      <h2>Güvenlik Özeti</h2>
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon">▣</div>
          <div className="summary-content">
            <h3>Genel Güvenlik Skoru</h3>
            <div className={`summary-score score-${getScoreColor(summary.overallSecurityScore)}`}>{summary.overallSecurityScore}/100</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">■</div>
          <div className="summary-content">
            <h3>Toplam Hesap</h3>
            <div className="summary-value">{summary.totalAccounts}</div>
          </div>
        </div>
        <div className="summary-card danger">
          <div className="summary-icon">⚠</div>
          <div className="summary-content">
            <h3>Kritik Sorunlar</h3>
            <div className="summary-value">{summary.criticalIssues}</div>
          </div>
        </div>
        <div className="summary-card warning">
          <div className="summary-icon">◆</div>
          <div className="summary-content">
            <h3>Yüksek Öncelikli</h3>
            <div className="summary-value">{summary.highPriorityIssues}</div>
          </div>
        </div>
      </div>
      {Object.keys(summary.accountsByType || {}).length > 0 && (
        <div className="accounts-by-type">
          <h3>Hesap Tipleri</h3>
          <div className="type-list">
            {Object.entries(summary.accountsByType).map(([type, count]) => (
              <div key={type} className="type-item">
                <span className="type-icon">{getTypeIcon(type)}</span>
                <span className="type-name">{getTypeName(type)}</span>
                <span className="type-count">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
export default SecuritySummary
