const https = require('https');
const crypto = require('crypto');

class RiotAPI {
  constructor(apiKey, region = 'TR1') {
    this.apiKey = apiKey;
    this.region = region;
    this.baseURL = 'https://europe.api.riotgames.com';
  }

  getAuthorizationURL(state) {
    const params = new URLSearchParams({
      client_id: this.apiKey,
      redirect_uri: 'http://localhost:3000/auth/riot/callback',
      response_type: 'code',
      scope: 'openid',
      state: state || crypto.randomBytes(16).toString('hex')
    });
    return `https://auth.riotgames.com/oauth2/authorize?${params.toString()}`;
  }

  async getAccessToken(code) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:3000/auth/riot/callback'
      });
      const options = {
        hostname: 'auth.riotgames.com',
        path: '/oauth2/token',
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.apiKey}:`).toString('base64')}`,
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
        hostname: 'auth.riotgames.com',
        path: '/userinfo',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.error) {
              reject(new Error(json.error_description || 'Kullanıcı bilgisi alınamadı'));
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

  async getAccountInfo(puuid) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'europe.api.riotgames.com',
        path: `/riot/account/v1/accounts/by-puuid/${puuid}?api_key=${this.apiKey}`,
        method: 'GET'
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.status) {
              reject(new Error(json.status.message || 'Hesap bilgisi alınamadı'));
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

module.exports = RiotAPI;

