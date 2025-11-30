const https = require('https');
const crypto = require('crypto');

class FacebookAPI {
  constructor(clientId, clientSecret, redirectUri) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
    this.baseURL = 'https://graph.facebook.com';
  }

  getAuthorizationURL(state) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'email,public_profile,user_security_events',
      response_type: 'code',
      state: state || crypto.randomBytes(16).toString('hex')
    });
    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
  }

  async getAccessToken(code) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: this.redirectUri,
        code: code
      });
      const options = {
        hostname: 'graph.facebook.com',
        path: `/v18.0/oauth/access_token?${params.toString()}`,
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

  async getLongLivedToken(shortLivedToken) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: this.clientId,
        client_secret: this.clientSecret,
        fb_exchange_token: shortLivedToken
      });
      const options = {
        hostname: 'graph.facebook.com',
        path: `/v18.0/oauth/access_token?${params.toString()}`,
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
        fields: 'id,name,email',
        access_token: accessToken
      });
      const options = {
        hostname: 'graph.facebook.com',
        path: `/v18.0/me?${params.toString()}`,
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

  async getSecurityEvents(accessToken) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        access_token: accessToken
      });
      const options = {
        hostname: 'graph.facebook.com',
        path: `/v18.0/me/security_events?${params.toString()}`,
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

  async getActiveSessions(accessToken) {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        access_token: accessToken
      });
      const options = {
        hostname: 'graph.facebook.com',
        path: `/v18.0/me/sessions?${params.toString()}`,
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
}

module.exports = FacebookAPI;
