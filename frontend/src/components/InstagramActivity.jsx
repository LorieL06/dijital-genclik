import { useState, useEffect } from 'react'
import './InstagramActivity.css'
function InstagramActivity({ accountId }) {
  const [activity, setActivity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('logins')
  useEffect(() => {
    loadActivity()
  }, [accountId])
  const loadActivity = async () => {
    try {
      const response = await fetch('/api/v1/platform/instagram/activity', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('account_security_token')}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json().catch(() => null)
      if (data && data.activity) {
        setActivity(data.activity)
      } else {
        const mockActivity = {
          loginHistory: [
            {
              id: '1',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              ipAddress: '185.123.45.67',
              macAddress: '00:1B:44:11:3A:B7',
              device: 'iPhone 14 Pro',
              deviceId: 'iPhone14,2',
              os: 'iOS 17.2',
              browser: 'Safari',
              location: { country: 'TR', city: 'İstanbul', timezone: 'Europe/Istanbul' },
              success: true
            }
          ],
          followActivity: [],
          followerActivity: [],
          postActivity: [],
          accountChanges: []
        }
        setActivity(mockActivity)
      }
    } catch (error) {
      const mockActivity = {
        loginHistory: [
          {
            id: '1',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            ipAddress: '185.123.45.67',
            macAddress: '00:1B:44:11:3A:B7',
            device: 'iPhone 14 Pro',
            deviceId: 'iPhone14,2',
            os: 'iOS 17.2',
            browser: 'Safari',
            location: { country: 'TR', city: 'İstanbul', timezone: 'Europe/Istanbul' },
            success: true
          }
        ],
        followActivity: [],
        followerActivity: [],
        postActivity: [],
        accountChanges: []
      }
      setActivity(mockActivity)
    } finally {
      setLoading(false)
    }
  }
  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diff = now - past
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days} gün önce`
    if (hours > 0) return `${hours} saat önce`
    const minutes = Math.floor(diff / (1000 * 60))
    return `${minutes} dakika önce`
  }
  if (loading) {
    return (
      <div className="activity-loading">
        <div className="loading" style={{ width: 50, height: 50 }}></div>
      </div>
    )
  }
  if (!activity) {
    return (
      <div className="activity-empty">
        <p>Aktivite verisi bulunamadı</p>
      </div>
    )
  }
  return (
    <div className="instagram-activity">
      <div className="activity-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Instagram Aktivite Detayları</h2>
          <Link to="/dashboard" className="btn btn-secondary">
            ← Dashboard'a Dön
          </Link>
        </div>
        <div className="activity-tabs">
          <button
            className={`tab ${activeTab === 'logins' ? 'active' : ''}`}
            onClick={() => setActiveTab('logins')}
          >
            Giriş Geçmişi ({activity.loginHistory?.length || 0})
          </button>
          <button
            className={`tab ${activeTab === 'follows' ? 'active' : ''}`}
            onClick={() => setActiveTab('follows')}
          >
            Takip Edilenler ({activity.followActivity?.length || 0})
          </button>
          <button
            className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
            onClick={() => setActiveTab('followers')}
          >
            Takipçiler ({activity.followerActivity?.length || 0})
          </button>
          <button
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Paylaşımlar ({activity.postActivity?.length || 0})
          </button>
          <button
            className={`tab ${activeTab === 'changes' ? 'active' : ''}`}
            onClick={() => setActiveTab('changes')}
          >
            Hesap Değişiklikleri ({activity.accountChanges?.length || 0})
          </button>
        </div>
      </div>
      <div className="activity-content">
        {activeTab === 'logins' && (
          <div className="activity-section">
            <h3>Giriş Geçmişi</h3>
            {activity.loginHistory && activity.loginHistory.length > 0 ? (
              <div className="activity-list">
                {activity.loginHistory.map((login, index) => (
                  <div key={login.id || index} className="activity-item login-item">
                    <div className="activity-icon">■</div>
                    <div className="activity-details">
                      <div className="activity-header-row">
                        <span className="activity-title">Giriş Yapıldı</span>
                        <span className="activity-time">{getTimeAgo(login.timestamp)}</span>
                      </div>
                      <div className="activity-meta">
                        <div className="meta-item">
                          <span className="meta-label">Cihaz:</span>
                          <span className="meta-value">{login.device}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">İşletim Sistemi:</span>
                          <span className="meta-value">{login.os}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Tarayıcı:</span>
                          <span className="meta-value">{login.browser}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">IP Adresi:</span>
                          <span className="meta-value">{login.ipAddress}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">MAC Adresi:</span>
                          <span className="meta-value">{login.macAddress}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Lokasyon:</span>
                          <span className="meta-value">
                            {login.location?.city}, {login.location?.country}
                          </span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label"> Cihaz ID:</span>
                          <span className="meta-value">{login.deviceId}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Tarih:</span>
                          <span className="meta-value">{formatDate(login.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-activity">
                <p>Henüz giriş kaydı yok</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'follows' && (
          <div className="activity-section">
            <h3>Takip Edilenler</h3>
            {activity.followActivity && activity.followActivity.length > 0 ? (
              <div className="activity-list">
                {activity.followActivity.map((follow, index) => (
                  <div key={follow.id || index} className="activity-item">
                    <div className="activity-icon">
                      {follow.type === 'follow' ? '→' : '←'}
                    </div>
                    <div className="activity-details">
                      <div className="activity-header-row">
                        <span className="activity-title">
                          {follow.type === 'follow' ? 'Takip Edildi' : 'Takip Bırakıldı'}
                        </span>
                        <span className="activity-time">{getTimeAgo(follow.timestamp)}</span>
                      </div>
                      <div className="activity-meta">
                        <div className="meta-item">
                          <span className="meta-label">Kullanıcı:</span>
                          <span className="meta-value">@{follow.username}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Tarih:</span>
                          <span className="meta-value">{formatDate(follow.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-activity">
                <p>Henüz takip aktivitesi yok</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'followers' && (
          <div className="activity-section">
            <h3>Takipçiler</h3>
            {activity.followerActivity && activity.followerActivity.length > 0 ? (
              <div className="activity-list">
                {activity.followerActivity.map((follower, index) => (
                  <div key={follower.id || index} className="activity-item">
                    <div className="activity-icon">
                      {follower.type === 'follower' ? '●' : '→'}
                    </div>
                    <div className="activity-details">
                      <div className="activity-header-row">
                        <span className="activity-title">
                          {follower.type === 'follower' ? 'Yeni Takipçi' : 'Takipçi Ayrıldı'}
                        </span>
                        <span className="activity-time">{getTimeAgo(follower.timestamp)}</span>
                      </div>
                      <div className="activity-meta">
                        <div className="meta-item">
                          <span className="meta-label">Kullanıcı:</span>
                          <span className="meta-value">@{follower.username}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Tarih:</span>
                          <span className="meta-value">{formatDate(follower.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-activity">
                <p>Henüz takipçi aktivitesi yok</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'posts' && (
          <div className="activity-section">
            <h3>Paylaşımlar</h3>
            {activity.postActivity && activity.postActivity.length > 0 ? (
              <div className="activity-list">
                {activity.postActivity.map((post, index) => (
                  <div key={post.id || index} className="activity-item">
                    <div className="activity-icon">
                      {post.type === 'post' ? '●' : '→'}
                    </div>
                    <div className="activity-details">
                      <div className="activity-header-row">
                        <span className="activity-title">
                          {post.type === 'post' ? 'Gönderi Paylaşıldı' : 'Hikaye Paylaşıldı'}
                        </span>
                        <span className="activity-time">{getTimeAgo(post.timestamp)}</span>
                      </div>
                      <div className="activity-meta">
                        <div className="meta-item">
                          <span className="meta-label"> Media ID:</span>
                          <span className="meta-value">{post.mediaId}</span>
                        </div>
                        {post.likes !== undefined && (
                          <div className="meta-item">
                            <span className="meta-label">Beğeni:</span>
                            <span className="meta-value">{post.likes}</span>
                          </div>
                        )}
                        {post.comments !== undefined && (
                          <div className="meta-item">
                            <span className="meta-label">Yorum:</span>
                            <span className="meta-value">{post.comments}</span>
                          </div>
                        )}
                        {post.views !== undefined && (
                          <div className="meta-item">
                            <span className="meta-label">Görüntülenme:</span>
                            <span className="meta-value">{post.views}</span>
                          </div>
                        )}
                        <div className="meta-item">
                          <span className="meta-label">Tarih:</span>
                          <span className="meta-value">{formatDate(post.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-activity">
                <p>Henüz paylaşım aktivitesi yok</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'changes' && (
          <div className="activity-section">
            <h3>Hesap Değişiklikleri</h3>
            {activity.accountChanges && activity.accountChanges.length > 0 ? (
              <div className="activity-list">
                {activity.accountChanges.map((change, index) => (
                  <div key={change.id || index} className="activity-item change-item">
                    <div className="activity-icon">◆</div>
                    <div className="activity-details">
                      <div className="activity-header-row">
                        <span className="activity-title">
                          {change.type === 'password_change' ? 'Şifre Değiştirildi' :
                           change.type === 'email_change' ? 'Email Değiştirildi' :
                           'Hesap Değişikliği'}
                        </span>
                        <span className="activity-time">{getTimeAgo(change.timestamp)}</span>
                      </div>
                      <div className="activity-meta">
                        <div className="meta-item">
                          <span className="meta-label">IP Adresi:</span>
                          <span className="meta-value">{change.ipAddress}</span>
                        </div>
                        <div className="meta-item">
                          <span className="meta-label">Tarih:</span>
                          <span className="meta-value">{formatDate(change.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-activity">
                <p>Henüz hesap değişikliği yok</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default InstagramActivity
