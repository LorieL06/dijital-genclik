const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const InstagramAPI = require('../services/platform-apis/instagram-api');
const TwitterAPI = require('../services/platform-apis/twitter-api');
const GoogleAPI = require('../services/platform-apis/google-api');
const FacebookAPI = require('../services/platform-apis/facebook-api');
const SteamAPI = require('../services/platform-apis/steam-api');
const RiotAPI = require('../services/platform-apis/riot-api');
const DiscordAPI = require('../services/platform-apis/discord-api');
const TikTokAPI = require('../services/platform-apis/tiktok-api');
const TwitchAPI = require('../services/platform-apis/twitch-api');
const RedditAPI = require('../services/platform-apis/reddit-api');
const YemekSepetiAPI = require('../services/platform-apis/yemeksepeti-api');
const GetirAPI = require('../services/platform-apis/getir-api');
const TrendyolAPI = require('../services/platform-apis/trendyol-api');
const {
  recordLoginAttempt,
  calculateRiskScore,
  detectSuspiciousActivity,
  getLocationFromIP
} = require('../services/login-monitoring');

const PLATFORM_CREDENTIALS = {
  instagram: {
    clientId: process.env.INSTAGRAM_CLIENT_ID || '',
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET || '',
    redirectUri: process.env.INSTAGRAM_REDIRECT_URI || 'http://localhost:3000/auth/instagram/callback'
  },
  twitter: {
    clientId: process.env.TWITTER_CLIENT_ID || '',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
    redirectUri: process.env.TWITTER_REDIRECT_URI || 'http://localhost:3000/auth/twitter/callback'
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
    redirectUri: process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/facebook/callback'
  },
  steam: {
    apiKey: process.env.STEAM_API_KEY || '',
    returnUrl: process.env.STEAM_RETURN_URI || 'http://localhost:3000/auth/steam/callback'
  },
  riot: {
    apiKey: process.env.RIOT_API_KEY || '',
    redirectUri: process.env.RIOT_REDIRECT_URI || 'http://localhost:3000/auth/riot/callback'
  },
  discord: {
    clientId: process.env.DISCORD_CLIENT_ID || '',
    clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    redirectUri: process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/auth/discord/callback'
  },
  tiktok: {
    clientId: process.env.TIKTOK_CLIENT_ID || '',
    clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
    redirectUri: process.env.TIKTOK_REDIRECT_URI || 'http://localhost:3000/auth/tiktok/callback'
  },
  twitch: {
    clientId: process.env.TWITCH_CLIENT_ID || '',
    clientSecret: process.env.TWITCH_CLIENT_SECRET || '',
    redirectUri: process.env.TWITCH_REDIRECT_URI || 'http://localhost:3000/auth/twitch/callback'
  },
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID || '',
    clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
    redirectUri: process.env.REDDIT_REDIRECT_URI || 'http://localhost:3000/auth/reddit/callback'
  },
  yemeksepeti: {
    clientId: process.env.YEMEKSEPETI_CLIENT_ID || '',
    clientSecret: process.env.YEMEKSEPETI_CLIENT_SECRET || '',
    redirectUri: process.env.YEMEKSEPETI_REDIRECT_URI || 'http://localhost:3000/auth/yemeksepeti/callback'
  },
  getir: {
    clientId: process.env.GETIR_CLIENT_ID || '',
    clientSecret: process.env.GETIR_CLIENT_SECRET || '',
    redirectUri: process.env.GETIR_REDIRECT_URI || 'http://localhost:3000/auth/getir/callback'
  },
  trendyol: {
    apiKey: process.env.TRENDYOL_API_KEY || '',
    apiSecret: process.env.TRENDYOL_API_SECRET || '',
    supplierId: process.env.TRENDYOL_SUPPLIER_ID || ''
  }
};

function auth(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-token'];
  req.userId = token || 'user_' + Date.now();
  next();
}

router.get('/instagram/authorize', auth, (req, res) => {
  const state = uuidv4();
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=demo&redirect_uri=http://localhost:3000/auth/instagram/callback&scope=user_profile,user_media&response_type=code&state=${state}`;
  res.json({ authUrl, state });
});

router.get('/instagram/callback', async (req, res) => {
  const userId = uuidv4();
  res.redirect(`http://localhost:3000/auth/success?platform=instagram&token=token_${Date.now()}&userId=${userId}`);
});

router.post('/instagram/connect', auth, async (req, res) => {
  const userInfo = {
    id: uuidv4(),
    username: 'kullanici_' + Math.random().toString(36).substring(7),
    account_type: 'BUSINESS'
  };
  res.json({
    ok: true,
    platform: 'instagram',
    userInfo,
    message: 'Instagram hesabı başarıyla bağlandı'
  });
});

router.get('/twitter/authorize', auth, (req, res) => {
  const state = uuidv4();
  const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=demo&redirect_uri=http://localhost:3000/auth/twitter/callback&scope=tweet.read%20users.read&state=${state}`;
  res.json({ authUrl, state });
});

router.get('/twitter/callback', async (req, res) => {
  const userId = uuidv4();
  res.redirect(`http://localhost:3000/auth/success?platform=twitter&token=token_${Date.now()}&userId=${userId}`);
});

router.post('/twitter/connect', auth, async (req, res) => {
  const userInfo = {
    id: uuidv4(),
    name: 'Kullanıcı ' + Math.random().toString(36).substring(7),
    username: 'kullanici_' + Math.random().toString(36).substring(7),
    profile_image_url: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png'
  };
  res.json({
    ok: true,
    platform: 'twitter',
    userInfo,
    message: 'Twitter hesabı başarıyla bağlandı'
  });
});

router.get('/google/authorize', auth, (req, res) => {
  const state = uuidv4();
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=demo&redirect_uri=http://localhost:3000/auth/google/callback&response_type=code&scope=openid%20email%20profile&state=${state}`;
  res.json({ authUrl, state });
});

router.get('/google/callback', async (req, res) => {
  const userId = uuidv4();
  res.redirect(`http://localhost:3000/auth/success?platform=google&token=token_${Date.now()}&refreshToken=refresh_${Date.now()}&userId=${userId}`);
});

router.post('/google/connect', auth, async (req, res) => {
  const userInfo = {
    sub: uuidv4(),
    email: 'kullanici' + Math.random().toString(36).substring(7) + '@gmail.com',
    name: 'Kullanıcı ' + Math.random().toString(36).substring(7),
    picture: 'https://lh3.googleusercontent.com/a/default-user'
  };
  res.json({
    ok: true,
    platform: 'google',
    userInfo,
    message: 'Google hesabı başarıyla bağlandı'
  });
});

router.get('/facebook/authorize', auth, (req, res) => {
  const state = uuidv4();
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=demo&redirect_uri=http://localhost:3000/auth/facebook/callback&scope=email,public_profile&response_type=code&state=${state}`;
  res.json({ authUrl, state });
});

router.get('/facebook/callback', async (req, res) => {
  const userId = uuidv4();
  res.redirect(`http://localhost:3000/auth/success?platform=facebook&token=token_${Date.now()}&userId=${userId}`);
});

router.post('/facebook/connect', auth, async (req, res) => {
  const userInfo = {
    id: uuidv4(),
    name: 'Kullanıcı ' + Math.random().toString(36).substring(7),
    email: 'kullanici' + Math.random().toString(36).substring(7) + '@facebook.com'
  };
  res.json({
    ok: true,
    platform: 'facebook',
    userInfo,
    message: 'Facebook hesabı başarıyla bağlandı'
  });
});

router.get('/steam/authorize', auth, (req, res) => {
  const nonce = uuidv4();
  const authUrl = `https://steamcommunity.com/openid/login?openid.ns=http://specs.openid.net/auth/2.0&openid.mode=checkid_setup&openid.return_to=http://localhost:3000/auth/steam/callback&openid.realm=http://localhost:3000&openid.identity=http://specs.openid.net/auth/2.0/identifier_select&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select`;
  res.json({ authUrl, nonce });
});

router.get('/steam/callback', async (req, res) => {
  const steamId = Math.random().toString().substring(2, 17);
  const username = 'Steam Kullanıcısı ' + Math.random().toString(36).substring(7);
  res.redirect(`http://localhost:3000/auth/success?platform=steam&steamId=${steamId}&username=${encodeURIComponent(username)}`);
});

router.post('/steam/connect', auth, async (req, res) => {
  const steamId = req.body.steamId || Math.random().toString().substring(2, 17);
  const userInfo = {
    steamId: steamId,
    name: 'Steam Kullanıcısı ' + Math.random().toString(36).substring(7),
    avatar: 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/default_avatar.jpg'
  };
  res.json({
    ok: true,
    platform: 'steam',
    userInfo,
    message: 'Steam hesabı başarıyla bağlandı'
  });
});

router.post('/monitoring/login-attempt', auth, async (req, res) => {
  const { accountId, ipAddress, userAgent, device, success } = req.body;
  const location = await getLocationFromIP(ipAddress || req.ip || '185.123.45.67');
  const attempt = recordLoginAttempt(req.userId, accountId || 'default', {
    ipAddress: ipAddress || req.ip || '185.123.45.67',
    userAgent: userAgent || req.headers['user-agent'] || 'Mozilla/5.0',
    device: device || 'Bilinmeyen Cihaz',
    location,
    success: success !== undefined ? success : true,
    platform: 'bilinmiyor'
  });
  const userProfile = {
    knownIPs: [],
    knownLocations: [],
    knownDevices: [],
    normalActivityHours: [6, 23]
  };
  attempt.riskScore = calculateRiskScore(attempt, userProfile);
  res.json({
    ok: true,
    attempt,
    message: 'Giriş denemesi kaydedildi'
  });
});

router.get('/monitoring/login-attempts', auth, (req, res) => {
  res.json({
    attempts: [],
    count: 0
  });
});

router.post('/monitoring/sync/:platform', auth, async (req, res) => {
  const { platform } = req.params;
  res.json({
    ok: true,
    platform,
    events: [],
    message: 'Platform olayları senkronize edildi'
  });
});

router.get('/instagram/activity', auth, async (req, res) => {
  const userId = req.userId;
  const instagramAPI = new InstagramAPI('', '', '');
  const activityData = await instagramAPI.getActivityDetails('token', userId);
  res.json({
    ok: true,
    platform: 'instagram',
    activity: activityData
  });
});

router.get('/riot/authorize', auth, (req, res) => {
  const state = uuidv4();
  const authUrl = `https://auth.riotgames.com/oauth2/authorize?client_id=demo&redirect_uri=http://localhost:3000/auth/riot/callback&response_type=code&scope=openid&state=${state}`;
  res.json({ authUrl, state });
});

router.get('/riot/callback', async (req, res) => {
  res.redirect(`http://localhost:3000/auth/success?platform=riot&token=token_${Date.now()}&userId=${uuidv4()}`);
});

router.post('/riot/connect', auth, async (req, res) => {
  const userInfo = {
    sub: uuidv4(),
    name: 'Riot Kullanıcısı ' + Math.random().toString(36).substring(7),
    email: 'kullanici' + Math.random().toString(36).substring(7) + '@riotgames.com'
  };
  res.json({
    ok: true,
    platform: 'riot',
    userInfo,
    message: 'Riot Games hesabı başarıyla bağlandı'
  });
});

router.get('/discord/authorize', auth, (req, res) => {
  const state = uuidv4();
  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=demo&redirect_uri=http://localhost:3000/auth/discord/callback&response_type=code&scope=identify%20email&state=${state}`;
  res.json({ authUrl, state });
});

router.get('/discord/callback', async (req, res) => {
  res.redirect(`http://localhost:3000/auth/success?platform=discord&token=token_${Date.now()}&userId=${uuidv4()}`);
});

router.post('/discord/connect', auth, async (req, res) => {
  const userInfo = {
    id: uuidv4(),
    username: 'kullanici_' + Math.random().toString(36).substring(7),
    discriminator: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
    email: 'kullanici' + Math.random().toString(36).substring(7) + '@discord.com',
    avatar: null
  };
  res.json({
    ok: true,
    platform: 'discord',
    userInfo,
    message: 'Discord hesabı başarıyla bağlandı'
  });
});

router.get('/tiktok/authorize', auth, (req, res) => {
  const state = uuidv4();
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=demo&redirect_uri=http://localhost:3000/auth/tiktok/callback&response_type=code&scope=user.info.basic&state=${state}`;
  res.json({ authUrl, state });
});

router.get('/tiktok/callback', async (req, res) => {
  res.redirect(`http://localhost:3000/auth/success?platform=tiktok&token=token_${Date.now()}&userId=${uuidv4()}`);
});

router.post('/tiktok/connect', auth, async (req, res) => {
  const userInfo = {
    open_id: uuidv4(),
    union_id: uuidv4(),
    display_name: 'Kullanıcı ' + Math.random().toString(36).substring(7),
    avatar_url: 'https://p16-sign-va.tiktokcdn.com/default_avatar.jpg'
  };
  res.json({
    ok: true,
    platform: 'tiktok',
    userInfo,
    message: 'TikTok hesabı başarıyla bağlandı'
  });
});

router.get('/twitch/authorize', auth, (req, res) => {
  const state = uuidv4();
  const authUrl = `https://id.twitch.tv/oauth2/authorize?client_id=demo&redirect_uri=http://localhost:3000/auth/twitch/callback&response_type=code&scope=user:read:email&state=${state}`;
  res.json({ authUrl, state });
});

router.get('/twitch/callback', async (req, res) => {
  res.redirect(`http://localhost:3000/auth/success?platform=twitch&token=token_${Date.now()}&userId=${uuidv4()}`);
});

router.post('/twitch/connect', auth, async (req, res) => {
  const userInfo = {
    id: uuidv4(),
    login: 'kullanici_' + Math.random().toString(36).substring(7),
    display_name: 'Kullanıcı ' + Math.random().toString(36).substring(7),
    email: 'kullanici' + Math.random().toString(36).substring(7) + '@twitch.tv',
    profile_image_url: 'https://static-cdn.jtvnw.net/user-default-pictures/default_profile_image.jpg'
  };
  res.json({
    ok: true,
    platform: 'twitch',
    userInfo,
    message: 'Twitch hesabı başarıyla bağlandı'
  });
});

router.get('/reddit/authorize', auth, (req, res) => {
  const state = uuidv4();
  const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=demo&response_type=code&state=${state}&redirect_uri=http://localhost:3000/auth/reddit/callback&duration=permanent&scope=identity`;
  res.json({ authUrl, state });
});

router.get('/reddit/callback', async (req, res) => {
  res.redirect(`http://localhost:3000/auth/success?platform=reddit&token=token_${Date.now()}&userId=${uuidv4()}`);
});

router.post('/reddit/connect', auth, async (req, res) => {
  const userInfo = {
    id: uuidv4(),
    name: 'kullanici_' + Math.random().toString(36).substring(7),
    created_utc: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 31536000),
    karma: Math.floor(Math.random() * 10000),
    icon_img: 'https://www.redditstatic.com/avatars/defaults/default_avatar.png'
  };
  res.json({
    ok: true,
    platform: 'reddit',
    userInfo,
    message: 'Reddit hesabı başarıyla bağlandı'
  });
});

module.exports = router;
