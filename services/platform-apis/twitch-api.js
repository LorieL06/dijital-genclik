const https = require('https');
const crypto = require('crypto');

class TwitchAPI {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.baseURL = 'https://api.twitch.tv/helix';
  }

  getAuthorizationURL(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'user:read:email',
      state: state || crypto.randomBytes(16).toString('hex')
    });
    return `https://id.twitch.tv/oauth2/authorize?${params.toString()}`;
  }

  async getAccessToken(code) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri
      });
      const options = {
        hostname: 'id.twitch.tv',
        path: '/oauth2/token',
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
              reject(new Error(json.message || 'Token alınamadı'));
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
        hostname: 'api.twitch.tv',
        path: '/helix/users',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Client-Id': this.clientId
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
              resolve(json.data[0]);
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

module.exports = TwitchAPI;

