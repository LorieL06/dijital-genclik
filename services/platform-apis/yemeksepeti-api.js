const https = require('https');
const crypto = require('crypto');

class YemekSepetiAPI {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.baseURL = 'https://api.yemeksepeti.com'; //vermiyor kapatılacak
  }

  getAuthorizationURL(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'profile order_history',
      state: state || crypto.randomBytes(16).toString('hex')
    });
    return `https://www.yemeksepeti.com/oauth/authorize?${params.toString()}`;
  }

  async getAccessToken(code) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          access_token: 'ys_token_' + Date.now(),
          refresh_token: 'ys_refresh_' + Date.now(),
          expires_in: 3600
        });
      }, 300);
    });
  }

  async getUserInfo(accessToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'ys_' + Date.now(),
          email: 'kullanici' + Math.floor(Math.random() * 1000) + '@yemeksepeti.com',
          name: 'Yemek Sepeti Kullanıcısı',
          phone: '+90' + Math.floor(5000000000 + Math.random() * 999999999)
        });
      }, 200);
    });
  }

  async getOrderHistory(accessToken) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orders: [
            {
              id: 'order_' + Date.now(),
              restaurant: 'Örnek Restoran',
              amount: Math.floor(Math.random() * 200) + 50,
              date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'completed'
            }
          ]
        });
      }, 200);
    });
  }
}

module.exports = YemekSepetiAPI;

