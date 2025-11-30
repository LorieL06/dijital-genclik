const https = require('https');
const crypto = require('crypto');

class TrendyolAPI {
  constructor(apiKey, apiSecret, supplierId) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.supplierId = supplierId;
    this.baseURL = 'https://api.trendyol.com';
  }

  getAuthorizationURL(state) {
    const params = new URLSearchParams({
      client_id: this.apiKey,
      redirect_uri: 'http://localhost:3000/auth/trendyol/callback',
      response_type: 'code',
      scope: 'read',
      state: state || crypto.randomBytes(16).toString('hex')
    });
    return `https://www.trendyol.com/oauth/authorize?${params.toString()}`;
  }

  async getAccessToken(code) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          access_token: 'ty_token_' + Date.now(),
          refresh_token: 'ty_refresh_' + Date.now(),
          expires_in: 3600
        });
      }, 300);
    });
  }

  async getUserInfo(accessToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'ty_' + Date.now(),
          email: 'kullanici' + Math.floor(Math.random() * 1000) + '@trendyol.com',
          name: 'Trendyol Kullanıcısı'
        });
      }, 200);
    });
  }
}

module.exports = TrendyolAPI;

