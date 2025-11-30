const https = require('https');
const crypto = require('crypto');

class TikTokAPI {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.baseURL = 'https://open-api.tiktok.com';
  }

  getAuthorizationURL(state) {
    const params = new URLSearchParams({
      client_key: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'user.info.basic',
      state: state || crypto.randomBytes(16).toString('hex')
    });
    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;
  }

  async getAccessToken(code) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        client_key: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      });
      const options = {
        hostname: 'open-api.tiktok.com',
        path: '/oauth/access_token/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              reject(new Error(json.error_description || 'Token alınamadı'));
            } else {
              resolve(json.data);
            }
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
      req.write(params.toString());
      req.end();
    });
  }

  async getUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        access_token: accessToken,
        fields: 'open_id,union_id,avatar_url,display_name'
      });
      const options = {
        hostname: 'open-api.tiktok.com',
        path: `/user/info/?${params.toString()}`,
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
              resolve(json.data.user);
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
}

module.exports = TikTokAPI;

