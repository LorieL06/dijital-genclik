const https = require('https');
const crypto = require('crypto');

class GetirAPI {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.baseURL = 'https://api.getir.com';
  }

  getAuthorizationURL(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'profile orders',
      state: state || crypto.randomBytes(16).toString('hex')
    });
    return `https://getir.com/oauth/authorize?${params.toString()}`;
  }

  async getAccessToken(code) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          access_token: 'getir_token_' + Date.now(),
          refresh_token: 'getir_refresh_' + Date.now(),
          expires_in: 3600
        });
      }, 300);
    });
  }

  async getUserInfo(accessToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'getir_' + Date.now(),
          email: 'kullanici' + Math.floor(Math.random() * 1000) + '@getir.com',
          name: 'Getir Kullanıcısı',
          phone: '+90' + Math.floor(5000000000 + Math.random() * 999999999)
        });
      }, 200);
    });
  }
}

module.exports = GetirAPI;

