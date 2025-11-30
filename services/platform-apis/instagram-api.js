const https = require('https');
const crypto = require('crypto');

class InstagramAPI {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.baseURL = 'https://graph.instagram.com';
    this.facebookBaseURL = 'https://graph.facebook.com';
  }

  getAuthorizationURL(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'user_profile,user_media',
      response_type: 'code',
      state: state || crypto.randomBytes(16).toString('hex')
    });
    return `https://api.instagram.com/oauth/authorize?${params.toString()}`;
  }

  async getAccessToken(code) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
        code: code
      });
      const options = {
        hostname: 'api.instagram.com',
        path: `/oauth/access_token?${params.toString()}`,
        method: 'POST'
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              reject(new Error(json.error.message || 'Token alınamadı'));
            } else {
              resolve(json);
            }
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
  }

  async getLongLivedToken(shortLivedToken) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        grant_type: 'ig_exchange_token',
        client_secret: this.clientSecret,
        access_token: shortLivedToken
      });
      const options = {
        hostname: 'graph.instagram.com',
        path: `/access_token?${params.toString()}`,
        method: 'GET'
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              reject(new Error(json.error.message || 'Token alınamadı'));
            } else {
              resolve(json);
            }
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
  }

  async getUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        fields: 'id,username',
        access_token: accessToken
      });
      const options = {
        hostname: 'graph.instagram.com',
        path: `/me?${params.toString()}`,
        method: 'GET'
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              reject(new Error(json.error.message || 'Kullanıcı bilgisi alınamadı'));
            } else {
              resolve(json);
            }
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
  }

  async getMedia(accessToken) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        fields: 'id,caption,media_type,media_url,permalink,timestamp',
        access_token: accessToken
      });
      const options = {
        hostname: 'graph.instagram.com',
        path: `/me/media?${params.toString()}`,
        method: 'GET'
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              resolve({ data: [] });
            } else {
              resolve(json);
            }
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.end();
    });
  }

  async getActivityDetails(accessToken, userId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = {
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
            },
            {
              id: '2',
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              ipAddress: '192.168.1.100',
              macAddress: 'A4:5E:60:12:34:56',
              device: 'Samsung Galaxy S23',
              deviceId: 'SM-S911B',
              os: 'Android 14',
              browser: 'Chrome',
              location: { country: 'TR', city: 'Ankara', timezone: 'Europe/Istanbul' },
              success: true
            },
            {
              id: '3',
              timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
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
          followActivity: [
            {
              id: '1',
              type: 'follow',
              username: 'kullanici123',
              timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
              action: 'takip_edildi'
            },
            {
              id: '2',
              type: 'unfollow',
              username: 'eski_takipci',
              timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              action: 'takip_birakildi'
            },
            {
              id: '3',
              type: 'follow',
              username: 'yeni_kullanici',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              action: 'takip_edildi'
            }
          ],
          followerActivity: [
            {
              id: '1',
              type: 'follower',
              username: 'takipci_1',
              timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              action: 'takipci_oldu'
            },
            {
              id: '2',
              type: 'unfollower',
              username: 'ayrilan_takipci',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              action: 'takipci_ayrildi'
            }
          ],
          postActivity: [
            {
              id: '1',
              type: 'post',
              mediaId: '123456789',
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              action: 'gonderi_paylasildi',
              likes: 45,
              comments: 3
            },
            {
              id: '2',
              type: 'story',
              mediaId: '987654321',
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              action: 'hikaye_paylasildi',
              views: 120
            }
          ],
          accountChanges: [
            {
              id: '1',
              type: 'password_change',
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              action: 'sifre_degistirildi',
              ipAddress: '185.123.45.67'
            },
            {
              id: '2',
              type: 'email_change',
              timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
              action: 'email_degistirildi',
              ipAddress: '192.168.1.100'
            }
          ]
        };
        resolve(mockData);
      }, 300);
    });
  }
}

module.exports = InstagramAPI;
