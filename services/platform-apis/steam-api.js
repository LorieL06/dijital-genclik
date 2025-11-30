const https = require('https');
const crypto = require('crypto');

class SteamAPI {
  constructor(apiKey, returnUrl) {
    this.apiKey = apiKey;
    this.returnUrl = returnUrl;
    this.steamOpenID = 'https://steamcommunity.com/openid/login';
  }

  getAuthorizationURL(nonce) {
    const params = new URLSearchParams({
      'openid.ns': 'http://specs.openid.net/auth/2.0',
      'openid.mode': 'checkid_setup',
      'openid.return_to': this.returnUrl,
      'openid.realm': this.returnUrl.split('/').slice(0, 3).join('/'),
      'openid.identity': 'http://specs.openid.net/auth/2.0/identifier_select',
      'openid.claimed_id': 'http://specs.openid.net/auth/2.0/identifier_select'
    });
    return `${this.steamOpenID}?${params.toString()}`;
  }

  extractSteamId(openIdResponse) {
    const match = openIdResponse.match(/\/id\/(\d+)/);
    return match ? match[1] : null;
  }

  async getUserInfo(steamId) {
    if (!this.apiKey) {
      return { steamId, name: 'Steam Kullanıcısı', error: 'API anahtarı gerekli' };
    }
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        key: this.apiKey,
        steamids: steamId
      });
      const options = {
        hostname: 'api.steampowered.com',
        path: `/ISteamUser/GetPlayerSummaries/v0002/?${params.toString()}`,
        method: 'GET'
      };
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.response && json.response.players && json.response.players.length > 0) {
              resolve(json.response.players[0]);
            } else {
              resolve({ steamId, name: 'Steam Kullanıcısı' });
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

  async getLoginHistory(steamId) {
    return { history: [] };
  }
}

module.exports = SteamAPI;
