const https = require('https');
const crypto = require('crypto');

class RedditAPI {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.baseURL = 'https://oauth.reddit.com';
  }

  getAuthorizationURL(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'code',
      state: state || crypto.randomBytes(16).toString('hex'),
      redirect_uri: this.redirectUri,
      duration: 'permanent',
      scope: 'identity'
    });
    return `https://www.reddit.com/api/v1/authorize?${params.toString()}`;
  }

  async getAccessToken(code) {
    return new Promise((resolve, reject) => {
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: this.redirectUri
      });
      const options = {
        hostname: 'www.reddit.com',
        path: '/api/v1/access_token',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'AccountSecurityManager/1.0'
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
              resolve(json);
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
      const options = {
        hostname: 'oauth.reddit.com',
        path: '/api/v1/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'AccountSecurityManager/1.0'
        }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              reject(new Error(json.message || 'Kullanıcı bilgisi alınamadı'));
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
}

module.exports = RedditAPI;

