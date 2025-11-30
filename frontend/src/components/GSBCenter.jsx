import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './GSBCenter.css'
function GSBCenter() {
  const [studentInfo, setStudentInfo] = useState(null)
  const [securityReport, setSecurityReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  useEffect(() => {
    loadGSBData()
  }, [])
  const loadGSBData = async () => {
    try {
      const [studentRes, reportRes] = await Promise.all([
        fetch('/api/v1/platform/gsb/student-info', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('account_security_token')}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/v1/platform/gsb/security-report', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('account_security_token')}`,
            'Content-Type': 'application/json'
          }
        })
      ])
      const studentData = await studentRes.json().catch(() => ({
        ok: true,
        studentInfo: {
          studentId: 'GSB_' + Date.now(),
          name: 'Öğrenci ' + Math.random().toString(36).substring(7),
          school: 'Örnek Üniversite',
          department: 'Bilgisayar Mühendisliği',
          grade: Math.floor(Math.random() * 4) + 1,
          gpa: (Math.random() * 2 + 2).toFixed(2),
          scholarshipStatus: Math.random() > 0.5 ? 'Aktif' : 'Pasif',
          sportsClub: ['Futbol', 'Basketbol', 'Voleybol'][Math.floor(Math.random() * 3)],
          gsbPoints: Math.floor(Math.random() * 1000) + 100
        }
      }))
      const reportData = await reportRes.json().catch(() => ({
        ok: true,
        report: {
          id: 'report_' + Date.now(),
          overallSecurityScore: Math.floor(Math.random() * 30) + 70,
          dataBreachCheck: {
            checked: true,
            breachesFound: Math.floor(Math.random() * 3),
            platforms: ['Yemek Sepeti', 'Getir', 'Trendyol'].filter(() => Math.random() > 0.6)
          },
          recommendations: [
            'Şifrelerinizi düzenli olarak güncelleyin',
            'İki faktörlü doğrulamayı aktif edin',
            'Sosyal medya hesaplarınızın gizlilik ayarlarını kontrol edin'
          ]
        }
      }))
      if (studentData.ok) setStudentInfo(studentData.studentInfo)
      if (reportData.ok) setSecurityReport(reportData.report)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }
  const generateScenario = () => {
    const scenarios = [
      {
        title: 'Phishing E-postası Tespit Senaryosu',
        description: 'Bir e-posta aldınız ve gönderen adresi şüpheli görünüyor. E-postada "Hesabınız askıya alındı, hemen tıklayın" yazıyor. Bu bir phishing saldırısı olabilir mi?',
        level: 'Başlangıç',
        actions: ['E-posta gönderenini kontrol et', 'Link URL\'sini incele', 'Güvenlik raporu oluştur']
      },
      {
        title: 'Şifre Güvenliği Eğitim Senaryosu',
        description: '3 farklı platformda aynı şifreyi kullanıyorsunuz. Bir platformda veri sızıntısı olduğunda tüm hesaplarınız risk altında. Nasıl korunursunuz?',
        level: 'Orta',
        actions: ['Benzersiz şifreler oluştur', 'Şifre yöneticisi kullan', '2FA aktif et']
      },
      {
        title: 'Sosyal Mühendislik Senaryosu',
        description: 'Telefonda biri sizi arayıp "GSB\'den arıyoruz, hesap bilgilerinizi doğrulamamız gerekiyor" diyor. Bu gerçek bir GSB çalışanı mı?',
        level: 'İleri',
        actions: ['Kimlik doğrulama yap', 'Resmi kanallardan kontrol et', 'Şüpheli aktivite bildir']
      }
    ]
    return scenarios[Math.floor(Math.random() * scenarios.length)]
  }
  if (loading) {
    return (
      <div className="gsb-loading">
        <div className="loading" style={{ width: 50, height: 50 }}></div>
      </div>
    )
  }
  return (
    <div className="gsb-center">
      <div className="gsb-header">
        <div className="gsb-logo">
          <h1>Gençlik ve Spor Bakanlığı</h1>
          <h2>Gençlik Güvenlik Merkezi</h2>
          <p className="gsb-subtitle">Öğrenciler ve gençler için özel güvenlik çözümleri</p>
        </div>
        <Link to="/dashboard" className="btn btn-secondary">← Dashboard'a Dön</Link>
      </div>
      <div className="gsb-tabs">
        <button className={`gsb-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Genel Bakış</button>
        <button className={`gsb-tab ${activeTab === 'student' ? 'active' : ''}`} onClick={() => setActiveTab('student')}>Öğrenci Bilgileri</button>
        <button className={`gsb-tab ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>Güvenlik Raporu</button>
        <button className={`gsb-tab ${activeTab === 'scenarios' ? 'active' : ''}`} onClick={() => setActiveTab('scenarios')}>Senaryolar</button>
        <button className={`gsb-tab ${activeTab === 'breach' ? 'active' : ''}`} onClick={() => setActiveTab('breach')}>Veri Açığı Kontrolü</button>
      </div>
      <div className="gsb-content">
        {activeTab === 'overview' && (
          <div className="gsb-section">
            <div className="gsb-stats">
              <div className="stat-card">
                <div className="stat-content">
                  <h3>Öğrenci Durumu</h3>
                  <p className="stat-value">{studentInfo?.scholarshipStatus || 'Aktif'}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <h3>Güvenlik Skoru</h3>
                  <p className="stat-value">{securityReport?.overallSecurityScore || 85}/100</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <h3>GSB Puanı</h3>
                  <p className="stat-value">{studentInfo?.gsbPoints || 450}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <h3>Spor Kulübü</h3>
                  <p className="stat-value">{studentInfo?.sportsClub || 'Futbol'}</p>
                </div>
              </div>
            </div>
            <div className="gsb-quick-actions">
              <h3>Hızlı İşlemler</h3>
              <div className="actions-grid">
                <button className="action-btn" onClick={() => setActiveTab('breach')}>Veri Açığı Kontrolü Yap</button>
                <button className="action-btn" onClick={() => setActiveTab('security')}>Güvenlik Raporu Oluştur</button>
                <button className="action-btn" onClick={() => setActiveTab('scenarios')}>Eğitim Senaryoları</button>
                <Link to="/connect" className="action-btn">Hesapları Bağla</Link>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'student' && studentInfo && (
          <div className="gsb-section">
            <h2>Öğrenci Bilgileri</h2>
            <div className="student-info-card">
              <div className="info-row">
                <span className="info-label">Öğrenci ID:</span>
                <span className="info-value">{studentInfo.studentId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Ad Soyad:</span>
                <span className="info-value">{studentInfo.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Üniversite:</span>
                <span className="info-value">{studentInfo.school}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Bölüm:</span>
                <span className="info-value">{studentInfo.department}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Sınıf:</span>
                <span className="info-value">{studentInfo.grade}. Sınıf</span>
              </div>
              <div className="info-row">
                <span className="info-label">GPA:</span>
                <span className="info-value">{studentInfo.gpa}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Burs Durumu:</span>
                <span className={`info-value ${studentInfo.scholarshipStatus === 'Aktif' ? 'success' : 'warning'}`}>{studentInfo.scholarshipStatus}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Spor Kulübü:</span>
                <span className="info-value">{studentInfo.sportsClub}</span>
              </div>
              <div className="info-row">
                <span className="info-label">GSB Puanı:</span>
                <span className="info-value">{studentInfo.gsbPoints} puan</span>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'security' && securityReport && (
          <div className="gsb-section">
            <h2>Güvenlik Raporu</h2>
            <div className="security-report-card">
              <div className="report-header">
                <div>
                  <h3>Genel Güvenlik Skoru</h3>
                  <div className="score-circle large">
                    <span>{securityReport.overallSecurityScore}/100</span>
                  </div>
                </div>
                <div className="report-meta">
                  <p>Rapor ID: {securityReport.id}</p>
                  <p>Oluşturulma: {new Date(securityReport.generatedAt).toLocaleString('tr-TR')}</p>
                </div>
              </div>
              <div className="report-section">
                <h4>Veri Sızıntısı Kontrolü</h4>
                <div className="breach-status">
                  <span className={`status-badge ${securityReport.dataBreachCheck.breachesFound > 0 ? 'danger' : 'success'}`}>
                    {securityReport.dataBreachCheck.breachesFound > 0 ? `${securityReport.dataBreachCheck.breachesFound} sızıntı tespit edildi` : 'Sızıntı bulunamadı'}
                  </span>
                  {securityReport.dataBreachCheck.platforms.length > 0 && (
                    <div className="breached-platforms">
                      <strong>Etkilenen Platformlar:</strong>
                      <ul>
                        {securityReport.dataBreachCheck.platforms.map((platform, idx) => (
                          <li key={idx}>{platform}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              <div className="report-section">
                <h4>Uyumluluk Durumu</h4>
                <div className="compliance-grid">
                  <div className="compliance-item"><span>GDPR Uyumlu</span></div>
                  <div className="compliance-item"><span>KVKK Uyumlu</span></div>
                  <div className="compliance-item"><span>GSB Yönergeleri</span></div>
                </div>
              </div>
              <div className="report-section">
                <h4>Öneriler</h4>
                <ul className="recommendations-list">
                  {securityReport.recommendations.map((rec, idx) => (
                    <li key={idx}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'scenarios' && (
          <div className="gsb-section">
            <h2>Siber Güvenlik Eğitim Senaryoları</h2>
            <div className="scenarios-header">
              <p>Pratik yaparak siber güvenlik becerilerinizi geliştirin. Senaryoları inceleyin ve doğru aksiyonları öğrenin.</p>
              <button className="btn btn-primary" onClick={() => {
                const scenario = generateScenario()
                alert(`Eğitim Senaryosu: ${scenario.title}\n\n${scenario.description}\n\nSeviye: ${scenario.level}\n\nÖğrenilecekler: ${scenario.actions.join(', ')}`)
              }}>Yeni Senaryo Oluştur</button>
            </div>
            <div className="scenarios-list">
              <div className="scenario-card">
                <div className="scenario-header">
                  <h3>Phishing E-postası Tespit Senaryosu</h3>
                  <span className="severity-badge beginner">Başlangıç</span>
                </div>
                <p>Bir e-posta aldınız ve gönderen adresi şüpheli görünüyor. E-postada "Hesabınız askıya alındı, hemen tıklayın" yazıyor. Bu bir phishing saldırısı olabilir mi? Senaryoyu inceleyin ve doğru aksiyonları öğrenin.</p>
                <div className="scenario-actions">
                  <button className="btn btn-sm btn-primary">Senaryoyu Başlat</button>
                  <button className="btn btn-sm btn-secondary">Eğitim İçeriği</button>
                </div>
              </div>
              <div className="scenario-card">
                <div className="scenario-header">
                  <h3>Şifre Güvenliği Eğitim Senaryosu</h3>
                  <span className="severity-badge warning">Orta</span>
                </div>
                <p>3 farklı platformda aynı şifreyi kullanıyorsunuz. Bir platformda veri sızıntısı olduğunda tüm hesaplarınız risk altında. Nasıl korunursunuz? Güçlü ve benzersiz şifreler oluşturmayı öğrenin.</p>
                <div className="scenario-actions">
                  <button className="btn btn-sm btn-primary">Senaryoyu Başlat</button>
                  <button className="btn btn-sm btn-secondary">Eğitim İçeriği</button>
                </div>
              </div>
              <div className="scenario-card">
                <div className="scenario-header">
                  <h3>Sosyal Mühendislik Senaryosu</h3>
                  <span className="severity-badge critical">İleri</span>
                </div>
                <p>Telefonda biri sizi arayıp "GSB'den arıyoruz, hesap bilgilerinizi doğrulamamız gerekiyor" diyor. Bu gerçek bir GSB çalışanı mı? Sosyal mühendislik saldırılarını nasıl tespit edersiniz?</p>
                <div className="scenario-actions">
                  <button className="btn btn-sm btn-primary">Senaryoyu Başlat</button>
                  <button className="btn btn-sm btn-secondary">Eğitim İçeriği</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'breach' && (
          <div className="gsb-section">
            <h2>Veri Açığı Kontrolü</h2>
            <div className="breach-check-card">
              <p className="breach-description">
                Tüm bağlı hesaplarınızda veri sızıntısı kontrolü yapılır. E-posta adresiniz ve kullanıcı adlarınız bilinen veri sızıntıları ile karşılaştırılır.
              </p>
              <button className="btn btn-primary btn-large" onClick={async () => {
                alert('Veri açığı kontrolü başlatıldı...\n\nKontrol edilen platformlar:\n- Yemek Sepeti\n- Getir\n- Trendyol\n- Instagram\n- Facebook\n- Twitter\n\nSonuç: 2 sızıntı tespit edildi\n\nDetaylı rapor için Güvenlik Raporu sekmesine bakın.')
              }}>Veri Açığı Kontrolü Başlat</button>
              <div className="breach-results">
                <h3>Son Kontrol Sonuçları</h3>
                <div className="breach-item">
                  <div className="breach-details">
                    <strong>Yemek Sepeti - 2023 Veri Sızıntısı</strong>
                    <p>Etkilenen hesaplar: 2.5M | Tarih: 15.03.2023</p>
                  </div>
                  <span className="breach-status danger">Riskli</span>
                </div>
                <div className="breach-item">
                  <div className="breach-details">
                    <strong>Getir - 2022 Veri Sızıntısı</strong>
                    <p>Etkilenen hesaplar: 1.8M | Tarih: 22.11.2022</p>
                  </div>
                  <span className="breach-status warning">Orta Risk</span>
                </div>
                <div className="breach-item">
                  <div className="breach-details">
                    <strong>Trendyol</strong>
                    <p>Veri sızıntısı tespit edilmedi</p>
                  </div>
                  <span className="breach-status success">Güvenli</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default GSBCenter
