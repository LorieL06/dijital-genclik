import { Link } from 'react-router-dom'
import './LandingPage.css'
function LandingPage() {
  return (
    <div className="landing-page">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Hesap Güvenliğiniz<br />
            <span className="gradient-text">Bizim Önceliğimiz</span>
          </h1>
          <p className="hero-subtitle">
            Steam, Instagram, Facebook, Twitter, Google ve daha fazlası.
            Tüm hesaplarınızı tek bir güvenli platformda yönetin.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary btn-large">
              Ücretsiz Başla
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Giriş Yap
            </Link>
          </div>
          <p className="hero-note">Ücret talep edilmez • Verileriniz sadece sizde kalır</p>
        </div>
      </section>
      <section className="features">
        <div className="container">
          <h2 className="section-title">Neden Bizi Seçmelisiniz?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">●</div>
              <h3>Güvenlik Öncelikli</h3>
              <p>
                Veri sızıntısını imkansız seviyede tutuyoruz.
                Tüm verileriniz end-to-end şifreleme ile korunur.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">■</div>
              <h3>Hesap Geri Teslimi</h3>
              <p>
                Hesabınız çalınırsa, gerekli doğrulamalar sonrasında
                sistem tarafından size geri teslim edilir.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">▲</div>
              <h3>Tam Gizlilik</h3>
              <p>
                Verileriniz hiçbir kimseyle paylaşılmaz.
                Sadece siz ve sistem arasında kalır.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">◆</div>
              <h3>Tamamen Ücretsiz</h3>
              <p>
                Herhangi bir ücret talep etmiyoruz.
                Güvenliğiniz için ücretsiz hizmet sunuyoruz.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">→</div>
              <h3>7/24 İzleme</h3>
              <p>
                Hesaplarınızı sürekli izler, şüpheli aktiviteleri
                anında tespit eder ve sizi uyarırız.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">▣</div>
              <h3>Detaylı Raporlama</h3>
              <p>
                Tüm giriş denemelerini, güvenlik skorlarınızı
                ve önerilerinizi görüntüleyin.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="platforms">
        <div className="container">
          <h2 className="section-title">Desteklenen Platformlar</h2>
          <div className="platforms-grid">
            <div className="platform-item">
              <span>Yemek Sepeti</span>
            </div>
            <div className="platform-item">
              <span>Getir</span>
            </div>
            <div className="platform-item">
              <span>Trendyol</span>
            </div>
            <div className="platform-item">
              <span>Steam</span>
            </div>
            <div className="platform-item">
              <span>Riot Games</span>
            </div>
            <div className="platform-item">
              <span>Instagram</span>
            </div>
            <div className="platform-item">
              <span>Facebook</span>
            </div>
            <div className="platform-item">
              <span>Twitter</span>
            </div>
            <div className="platform-item">
              <span>Google</span>
            </div>
            <div className="platform-item">
              <span>Discord</span>
            </div>
            <div className="platform-item">
              <span>TikTok</span>
            </div>
            <div className="platform-item">
              <span>Twitch</span>
            </div>
          </div>
        </div>
      </section>
      <section className="gsb-section-landing">
        <div className="container">
          <div className="gsb-content-landing">
            <div className="gsb-text">
              <h2>GSB İş Birliği</h2>
              <p>
                Öğrenciler ve gençler için güvenlik çözümleri sunuyoruz. 
                Burs başvuruları ve spor kulüpleri için güvenlik kontrolleri yapıyoruz.
              </p>
              <div className="gsb-features">
                <div className="gsb-feature-item">Öğrenci bilgileri güvenliği</div>
                <div className="gsb-feature-item">Burs başvuruları için raporlar</div>
                <div className="gsb-feature-item">Spor kulüpleri veri güvenliği</div>
                <div className="gsb-feature-item">GSB puan sistemi</div>
                <div className="gsb-feature-item">Gençlik programları</div>
              </div>
              <Link to="/gsb" className="btn btn-primary" style={{ marginTop: '24px' }}>
                GSB Merkezi
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="security">
        <div className="container">
          <div className="security-content">
            <div className="security-text">
              <h2>Veri Güvenliği</h2>
              <p style={{ marginBottom: '20px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                Verileriniz güvende. End-to-end şifreleme kullanıyoruz ve verileriniz 
                hiçbir üçüncü taraf ile paylaşılmaz.
              </p>
              <div className="security-list">
                <div className="security-item">End-to-end şifreleme</div>
                <div className="security-item">Üçüncü taraf paylaşımı yok</div>
                <div className="security-item">Veri sızıntısı koruması</div>
                <div className="security-item">GDPR ve KVKK uyumlu</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="cta">
        <div className="container">
          <h2>Hesap Güvenliğinizi Artırın</h2>
          <p>Ücretsiz başlayın, hesaplarınızı güvence altına alın</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Hemen Başla
          </Link>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Platform</h3>
            <ul>
              <li><Link to="/">Ana Sayfa</Link></li>
              <li><Link to="/register">Kayıt Ol</Link></li>
              <li><Link to="/login">Giriş Yap</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Güvenlik</h3>
            <ul>
              <li><Link to="/connect">Hesap Bağla</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/education">Eğitim Merkezi</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>GSB</h3>
            <ul>
              <li><Link to="/gsb">GSB Merkezi</Link></li>
              <li><a href="#gsb">İş Birliği</a></li>
              <li><a href="#gsb">Öğrenci Programları</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Yasal</h3>
            <ul>
              <li><a href="#privacy">Gizlilik Politikası</a></li>
              <li><a href="#terms">Kullanım Şartları</a></li>
              <li><a href="#kvkk">KVKK</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Dijital Gençlik. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
export default LandingPage
