import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './EducationCenter.css'
function EducationCenter() {
  const [activeTab, setActiveTab] = useState('overview')
  const [modules, setModules] = useState([])
  const [progress, setProgress] = useState({})
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [points, setPoints] = useState(0)
  const [level, setLevel] = useState(1)
  useEffect(() => {
    loadEducationData()
  }, [])
  const loadEducationData = async () => {
    try {
      const mockModules = [
        {
          id: 1,
          title: 'Siber Güvenliğe Giriş',
          description: 'Siber güvenliğin temellerini öğrenin',
          level: 'beginner',
          duration: 30,
          icon: '●',
          completed: false,
          progress: 0
        },
        {
          id: 2,
          title: 'Şifre Güvenliği',
          description: 'Güçlü şifre nasıl oluşturulur ve yönetilir',
          level: 'beginner',
          duration: 45,
          icon: '■',
          completed: false,
          progress: 0
        },
        {
          id: 3,
          title: 'Phishing ve Sosyal Mühendislik',
          description: 'Phishing saldırılarını nasıl tespit edersiniz?',
          level: 'beginner',
          duration: 40,
          icon: '→',
          completed: false,
          progress: 0
        },
        {
          id: 4,
          title: 'Ağ Güvenliği',
          description: 'Güvenli Wi-Fi kullanımı ve ağ koruması',
          level: 'intermediate',
          duration: 50,
          icon: '🌐',
          completed: false,
          progress: 0
        },
        {
          id: 5,
          title: 'Veri Koruması',
          description: 'Kişisel verilerinizi nasıl korursunuz?',
          level: 'beginner',
          duration: 35,
          icon: '▣',
          completed: false,
          progress: 0
        }
      ]
      setModules(mockModules)
      setPoints(150) // Mock puan
      setLevel(1)
      // Mock rozetler
      setBadges([
        { id: 1, name: 'İlk Adım', icon: '✓', earned: true, earnedAt: '2025-01-10' },
        { id: 2, name: 'Öğrenci', icon: '•', earned: false },
      ])
    } catch (error) {
      console.error('Eğitim verileri yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }
  if (loading) {
    return (
      <div className="education-loading">
        <div className="loading" style={{ width: 50, height: 50 }}></div>
      </div>
    )
  }
  return (
    <div className="education-center">
      <div className="education-header">
        <div className="education-header-content">
          <h1>GSB Siber Koruma ve Eğitim Platformu</h1>
          <p className="education-subtitle">
            Gençleri Siber Güvenlik ve Yazılım Alanında Güçlendiren Eğitim Sistemi
          </p>
        </div>
        <Link to="/dashboard" className="btn btn-secondary">← Dashboard'a Dön</Link>
      </div>
      <div className="education-stats">
        <div className="stat-card">
          <div className="stat-icon">▣</div>
          <div className="stat-content">
            <h3>Toplam Puan</h3>
            <p className="stat-value">{points}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">★</div>
          <div className="stat-content">
            <h3>Seviye</h3>
            <p className="stat-value">{level}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">▲</div>
          <div className="stat-content">
            <h3>Tamamlanan Modül</h3>
            <p className="stat-value">{modules.filter(m => m.completed).length}/{modules.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">◆</div>
          <div className="stat-content">
            <h3>Rozetler</h3>
            <p className="stat-value">{badges.filter(b => b.earned).length}</p>
          </div>
        </div>
      </div>
      <div className="education-tabs">
        <button 
          className={`education-tab ${activeTab === 'overview' ? 'active' : ''}`} 
          onClick={() => setActiveTab('overview')}
        >
          Genel Bakış
        </button>
        <button 
          className={`education-tab ${activeTab === 'modules' ? 'active' : ''}`} 
          onClick={() => setActiveTab('modules')}
        >
          Eğitim Modülleri
        </button>
        <button 
          className={`education-tab ${activeTab === 'badges' ? 'active' : ''}`} 
          onClick={() => setActiveTab('badges')}
        >
          Rozetler
        </button>
        <button 
          className={`education-tab ${activeTab === 'certificates' ? 'active' : ''}`} 
          onClick={() => setActiveTab('certificates')}
        >
          Sertifikalar
        </button>
        <button 
          className={`education-tab ${activeTab === 'certifications' ? 'active' : ''}`} 
          onClick={() => setActiveTab('certifications')}
        >
          Sertifika Hazırlık
        </button>
      </div>
      <div className="education-content">
        {activeTab === 'overview' && (
          <div className="education-section">
            <div className="welcome-card">
              <h2>Öğrenciyi Sürece Dahil Etme</h2>
              <p>
                Platforma kaydoldunuz! Artık temel eğitim modüllerini tamamlayarak siber güvenlik 
                bilginizi geliştirebilir, mini quizler ile bilginizi test edebilir ve rozetler kazanabilirsiniz.
              </p>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">•</div>
                  <h3>Temel Eğitim Modülleri</h3>
                  <p>5 temel modül ile siber güvenliğe giriş yapın</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">→</div>
                  <h3>Mini Quizler</h3>
                  <p>Her modülden sonra bilginizi test edin</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">→</div>
                  <h3>Phishing Simülasyonu</h3>
                  <p>Gerçekçi phishing saldırılarını tespit etmeyi öğrenin</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">■</div>
                  <h3>Şifre Güvenliği</h3>
                  <p>Güçlü şifre oluşturma ve test etme</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">▲</div>
                  <h3>Saldırı Senaryoları</h3>
                  <p>Simüle edilmiş saldırı senaryolarını çözün</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">★</div>
                  <h3>Puan ve Rozetler</h3>
                  <p>Görevleri tamamlayarak puan kazanın ve rozetler toplayın</p>
                </div>
              </div>
              <div className="quick-actions">
                <h3>Hızlı Başlangıç</h3>
                <div className="actions-grid">
                  <Link to="/education/modules/1" className="action-btn">
                    İlk Modüle Başla
                  </Link>
                  <Link to="/phishing" className="action-btn">
                    Phishing Testi Yap
                  </Link>
                  <Link to="/education/password" className="action-btn">
                    Şifre Eğitimi
                  </Link>
                  <Link to="/education/scenarios" className="action-btn">
                    Senaryo Çöz
                  </Link>
                </div>
              </div>
            </div>
            <div className="info-section">
              <h2>İleri Seviye Eğitim ve Profesyonel Sertifikalara Hazırlık</h2>
              <p>
                Temel eğitimleri tamamladıktan sonra, profesyonel sertifika programlarına hazırlanabilirsiniz:
              </p>
              <div className="certification-list">
                <div className="cert-item">→ MCSE - Microsoft Certified Solutions Expert</div>
                <div className="cert-item">→ ITIL - Information Technology Infrastructure Library</div>
                <div className="cert-item">→ CISM - Certified Information Security Manager</div>
                <div className="cert-item">→ PMP - Project Management Professional</div>
                <div className="cert-item">→ CISCO Sertifikaları</div>
                <div className="cert-item">→ CISSP - Certified Information Systems Security Professional</div>
                <div className="cert-item">→ CHFI - Computer Hacking Forensic Investigator</div>
                <div className="cert-item">→ Penetrasyon Test Uzmanlığı</div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'modules' && (
          <div className="education-section">
            <h2>Eğitim Modülleri</h2>
            <div className="modules-grid">
              {modules.map(module => (
                <div key={module.id} className={`module-card ${module.completed ? 'completed' : ''}`}>
                  <div className="module-header">
                    <div className="module-icon">{module.icon}</div>
                    <div className="module-info">
                      <h3>{module.title}</h3>
                      <span className={`level-badge ${module.level}`}>
                        {module.level === 'beginner' ? 'Başlangıç' : 
                         module.level === 'intermediate' ? 'Orta' : 'İleri'}
                      </span>
                    </div>
                  </div>
                  <p className="module-description">{module.description}</p>
                  <div className="module-meta">
                    <span>→ {module.duration} dakika</span>
                    {module.completed && <span className="completed-badge">✓ Tamamlandı</span>}
                  </div>
                  {module.progress > 0 && !module.completed && (
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  )}
                  <Link 
                    to={`/education/modules/${module.id}`} 
                    className="btn btn-primary module-btn"
                  >
                    {module.completed ? 'Tekrar İncele' : 'Modüle Başla'}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'badges' && (
          <div className="education-section">
            <h2>Rozetler</h2>
            <div className="badges-grid">
              {badges.map(badge => (
                <div key={badge.id} className={`badge-card ${badge.earned ? 'earned' : 'locked'}`}>
                  <div className="badge-icon">{badge.icon}</div>
                  <h3>{badge.name}</h3>
                  {badge.earned && badge.earnedAt && (
                    <p className="badge-date">Kazanıldı: {new Date(badge.earnedAt).toLocaleDateString('tr-TR')}</p>
                  )}
                  {!badge.earned && <p className="badge-locked">Kilitli</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'certificates' && (
          <div className="education-section">
            <h2>Dijital Sertifikalar</h2>
            <div className="certificates-list">
              <p className="no-certificate">
                Henüz sertifika kazanmadınız. Temel modülleri tamamlayarak ilk sertifikanızı kazanabilirsiniz!
              </p>
            </div>
          </div>
        )}
        {activeTab === 'certifications' && (
          <div className="education-section">
            <h2>Profesyonel Sertifika Hazırlık Programları</h2>
            <p className="certification-intro">
              İleri seviyeye ulaştığınızda, profesyonel sertifikalara hazırlanmak için özel hazırlık 
              modülleri erişilebilir olacaktır.
            </p>
            <div className="certifications-grid">
              <div className="certification-card locked">
                <h3>MCSE</h3>
                <p>Microsoft Certified Solutions Expert</p>
                <span className="locked-badge">Seviye 5+ gerekli</span>
              </div>
              <div className="certification-card locked">
                <h3>CISSP</h3>
                <p>Certified Information Systems Security Professional</p>
                <span className="locked-badge">Seviye 5+ gerekli</span>
              </div>
              <div className="certification-card locked">
                <h3>CISM</h3>
                <p>Certified Information Security Manager</p>
                <span className="locked-badge">Seviye 5+ gerekli</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
export default EducationCenter