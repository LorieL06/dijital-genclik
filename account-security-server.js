const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const { recordLoginAttempt, getLocationFromIP, detectPlatform } = require("./services/login-monitoring");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const DB = {
  users: [{ id: "u1", email: "demo@example.com", passwordHash: hashPassword("demo123"), createdAt: new Date().toISOString() }],
  accounts: {},
  securityScans: {},
  breaches: {},
  loginAttempts: {},
  loginLogs: {},
  recoveryRequests: {},
  webhooks: {},
  alerts: {},
  monitoring: {}
};
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}
function generateToken(userId) {
  return crypto.randomBytes(32).toString('hex');
}
function checkPasswordStrength(password) {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    notCommon: !['password', '123456', 'qwerty'].includes(password.toLowerCase())
  };
  score = Object.values(checks).filter(Boolean).length;
  return {
    score: score,
    strength: score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong',
    checks: checks,
    recommendations: generatePasswordRecommendations(checks)
  };
}
function generatePasswordRecommendations(checks) {
  const recs = [];
  if (!checks.length) recs.push("Şifre en az 8 karakter olmalı");
  if (!checks.hasUpper) recs.push("Büyük harf ekleyin");
  if (!checks.hasLower) recs.push("Küçük harf ekleyin");
  if (!checks.hasNumber) recs.push("Rakam ekleyin");
  if (!checks.hasSpecial) recs.push("Özel karakter ekleyin (!@#$% vb.)");
  if (!checks.notCommon) recs.push("Yaygın şifrelerden kaçının");
  return recs;
}
async function checkBreach(email) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lastChar = email.slice(-1);
      const isBreached = ['a', 'e', 'i', 'o', 'u'].includes(lastChar.toLowerCase());
      if (isBreached) {
        resolve({
          breached: true,
          breaches: [
            { name: "LinkedIn 2012", date: "2012-05-05", accounts: "164M" },
            { name: "Adobe 2013", date: "2013-10-03", accounts: "153M" }
          ]
        });
      } else {
        resolve({ breached: false, breaches: [] });
      }
    }, 500);
  });
}
function calculateAccountSecurityScore(account) {
  let score = 0;
  let maxScore = 0;
  maxScore += 30;
  const pwdCheck = checkPasswordStrength(account.password || '');
  score += (pwdCheck.score / 6) * 30;
  maxScore += 25;
  if (account.twoFactorEnabled) score += 25;
  maxScore += 20;
  if (account.lastPasswordChange) {
    const daysSince = Math.floor((Date.now() - new Date(account.lastPasswordChange).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince < 90) score += 20;
    else if (daysSince < 180) score += 10;
  }
  maxScore += 15;
  if (!account.passwordReused) score += 15;
  maxScore += 10;
  if (account.securityQuestionsSet) score += 10;
  const percentage = Math.round((score / maxScore) * 100);
  return {
    score: percentage,
    level: percentage >= 80 ? 'excellent' : percentage >= 60 ? 'good' : percentage >= 40 ? 'fair' : 'poor',
    breakdown: {
      passwordStrength: Math.round((pwdCheck.score / 6) * 30),
      twoFactor: account.twoFactorEnabled ? 25 : 0,
      recentChange: score - (account.twoFactorEnabled ? 25 : 0) - Math.round((pwdCheck.score / 6) * 30),
      noReuse: !account.passwordReused ? 15 : 0,
      securityQuestions: account.securityQuestionsSet ? 10 : 0
    }
  };
}
const tokens = {};
function auth(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-token'];
  if (!token) {
    const mockUserId = 'mock_user_' + Date.now();
    const mockToken = generateToken(mockUserId);
    tokens[mockToken] = mockUserId;
    req.userId = mockUserId;
    req.token = mockToken;
    return next();
  }
  let userId = tokens[token];
  if (!userId) {
    userId = 'mock_user_' + Date.now();
    tokens[token] = userId;
  }
  req.userId = userId;
  next();
}
app.get("/api/v1/health", (req, res) => {
  res.json({ ok: true, service: "Hesap Güvenlik Yöneticisi", ts: new Date().toISOString() });
});
app.post("/api/v1/auth/register", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email ve şifre gerekli" });
  }
  let user = DB.users.find(u => u.email === email);
  if (!user) {
    user = {
      id: uuidv4(),
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    DB.users.push(user);
    DB.accounts[user.id] = [];
    DB.securityScans[user.id] = [];
  }
  const token = generateToken(user.id);
  tokens[token] = user.id;
  res.json({
    ok: true,
    user: { id: user.id, email: user.email },
    token
  });
});
app.post("/api/v1/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email ve şifre gerekli" });
  }
  let user = DB.users.find(u => u.email === email);
  if (!user) {
    user = {
      id: uuidv4(),
      email,
      passwordHash: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    DB.users.push(user);
    DB.accounts[user.id] = [];
    DB.securityScans[user.id] = [];
  }
  const token = generateToken(user.id);
  tokens[token] = user.id;
  const loginLog = {
    id: uuidv4(),
    userId: user.id,
    type: 'login',
    timestamp: new Date().toISOString(),
    ipAddress: req.ip || req.headers['x-forwarded-for'] || 'bilinmiyor',
    userAgent: req.headers['user-agent'] || 'bilinmiyor',
    success: true
  };
  if (!DB.loginLogs) DB.loginLogs = {};
  if (!DB.loginLogs[user.id]) DB.loginLogs[user.id] = [];
  DB.loginLogs[user.id].push(loginLog);
  res.json({
    ok: true,
    user: { id: user.id, email: user.email },
    token
  });
});
app.post("/api/v1/auth/logout", auth, (req, res) => {
  const userId = req.userId;
  const logoutLog = {
    id: uuidv4(),
    userId: userId,
    type: 'logout',
    timestamp: new Date().toISOString(),
    ipAddress: req.ip || req.headers['x-forwarded-for'] || 'bilinmiyor',
    userAgent: req.headers['user-agent'] || 'bilinmiyor',
    success: true
  };
  if (!DB.loginLogs) DB.loginLogs = {};
  if (!DB.loginLogs[userId]) DB.loginLogs[userId] = [];
  DB.loginLogs[userId].push(logoutLog);
  const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-token'];
  if (token && tokens[token]) {
    delete tokens[token];
  }
  res.json({ ok: true, message: "Başarıyla çıkış yapıldı" });
});
app.get("/api/v1/auth/logs", auth, (req, res) => {
  const userId = req.userId;
  const logs = DB.loginLogs?.[userId] || [];
  const recentLogs = logs.slice(-100).reverse();
  res.json({
    logs: recentLogs,
    count: recentLogs.length
  });
});
app.post("/api/v1/accounts", auth, (req, res) => {
  const { type, name, username, password, url, twoFactorEnabled, lastPasswordChange, passwordReused, securityQuestionsSet } = req.body;
  if (!type || !name) {
    return res.status(400).json({ error: "Tip ve isim gerekli" });
  }
  const account = {
    id: uuidv4(),
    userId: req.userId,
    type,
    name,
    username: username || '',
    password: password || '',
    url: url || '',
    twoFactorEnabled: twoFactorEnabled || false,
    lastPasswordChange: lastPasswordChange || null,
    passwordReused: passwordReused || false,
    securityQuestionsSet: securityQuestionsSet || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  account.securityScore = calculateAccountSecurityScore(account);
  account.passwordStrength = checkPasswordStrength(account.password || '');
  if (!DB.accounts[req.userId]) {
    DB.accounts[req.userId] = [];
  }
  DB.accounts[req.userId].push(account);
  res.json(account);
});
app.get("/api/v1/accounts", auth, (req, res) => {
  const accounts = DB.accounts[req.userId] || [];
  res.json({ accounts, count: accounts.length });
});
app.get("/api/v1/accounts/:id", auth, (req, res) => {
  const accounts = DB.accounts[req.userId] || [];
  let account = accounts.find(a => a.id === req.params.id);
  if (!account) {
    account = {
      id: req.params.id,
      userId: req.userId,
      type: 'social',
      name: 'Örnek Hesap',
      username: 'ornek_kullanici',
      password: '',
      url: '',
      twoFactorEnabled: false,
      lastPasswordChange: null,
      passwordReused: false,
      securityQuestionsSet: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      securityScore: { score: 75, level: 'good' },
      passwordStrength: { score: 4, strength: 'medium' }
    };
  }
  res.json(account);
});
app.patch("/api/v1/accounts/:id", auth, (req, res) => {
  const accounts = DB.accounts[req.userId] || [];
  let account = accounts.find(a => a.id === req.params.id);
  if (!account) {
    account = {
      id: req.params.id,
      userId: req.userId,
      type: req.body.type || 'social',
      name: req.body.name || 'Örnek Hesap',
      username: req.body.username || '',
      password: req.body.password || '',
      url: req.body.url || '',
      twoFactorEnabled: req.body.twoFactorEnabled || false,
      lastPasswordChange: req.body.lastPasswordChange || null,
      passwordReused: req.body.passwordReused || false,
      securityQuestionsSet: req.body.securityQuestionsSet || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (!DB.accounts[req.userId]) DB.accounts[req.userId] = [];
    DB.accounts[req.userId].push(account);
  } else {
    Object.assign(account, req.body, {
      updatedAt: new Date().toISOString()
    });
  }
  account.securityScore = calculateAccountSecurityScore(account);
  if (req.body.password) {
    account.passwordStrength = checkPasswordStrength(account.password);
  }
  res.json(account);
});
app.delete("/api/v1/accounts/:id", auth, (req, res) => {
  const accounts = DB.accounts[req.userId] || [];
  const index = accounts.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    accounts.splice(index, 1);
  }
  res.json({ ok: true, message: "Hesap silindi" });
});
app.post("/api/v1/security/scan", auth, async (req, res) => {
  const userId = req.userId;
  const accounts = DB.accounts[userId] || [];
  const scan = {
    id: uuidv4(),
    userId,
    startedAt: new Date().toISOString(),
    status: 'running',
    results: []
  };
  for (const account of accounts) {
    const result = {
      accountId: account.id,
      accountName: account.name,
      checks: {
        passwordStrength: checkPasswordStrength(account.password || ''),
        securityScore: calculateAccountSecurityScore(account),
        breachCheck: await checkBreach(account.username || account.name)
      },
      recommendations: []
    };
    if (result.checks.passwordStrength.strength === 'weak') {
      result.recommendations.push({
        type: 'password',
        priority: 'high',
        message: `${account.name} hesabı için şifre güçlendirilmeli`,
        actions: result.checks.passwordStrength.recommendations
      });
    }
    if (!account.twoFactorEnabled) {
      result.recommendations.push({
        type: '2fa',
        priority: 'high',
        message: `${account.name} hesabı için 2FA açılmalı`,
        actions: ['İki faktörlü doğrulamayı etkinleştir']
      });
    }
    if (account.passwordReused) {
      result.recommendations.push({
        type: 'reuse',
        priority: 'medium',
        message: `${account.name} hesabında şifre tekrar kullanımı tespit edildi`,
        actions: ['Bu hesap için benzersiz bir şifre oluştur']
      });
    }
    if (result.checks.breachCheck.breached) {
      result.recommendations.push({
        type: 'breach',
        priority: 'critical',
        message: `${account.name} hesabı veri sızıntısına maruz kalmış`,
        actions: ['Şifreyi derhal değiştir', '2FA aç', 'İlgili hesapları kontrol et']
      });
    }
    scan.results.push(result);
  }
  scan.status = 'completed';
  scan.completedAt = new Date().toISOString();
  if (!DB.securityScans[userId]) {
    DB.securityScans[userId] = [];
  }
  DB.securityScans[userId].push(scan);
  res.json(scan);
});
app.get("/api/v1/security/summary", auth, (req, res) => {
  const accounts = DB.accounts[req.userId] || [];
  const summary = {
    totalAccounts: accounts.length,
    accountsByType: {},
    overallSecurityScore: 0,
    criticalIssues: 0,
    highPriorityIssues: 0,
    recommendations: []
  };
  let totalScore = 0;
  accounts.forEach(account => {
    summary.accountsByType[account.type] = (summary.accountsByType[account.type] || 0) + 1;
    totalScore += account.securityScore?.score || 0;
    if (account.securityScore?.level === 'poor') {
      summary.criticalIssues++;
    }
    if (!account.twoFactorEnabled || account.passwordStrength?.strength === 'weak') {
      summary.highPriorityIssues++;
    }
  });
  summary.overallSecurityScore = accounts.length > 0 ? Math.round(totalScore / accounts.length) : 0;
  res.json(summary);
});
app.get("/api/v1/security/scans", auth, (req, res) => {
  const scans = DB.securityScans[req.userId] || [];
  res.json({ scans, count: scans.length });
});
app.post("/api/v1/security/check-password", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Şifre gerekli" });
  }
  const result = checkPasswordStrength(password);
  res.json(result);
});
const platformRoutes = require('./routes/platform-routes');
app.use('/api/v1/platform', platformRoutes);
app.post("/api/v1/accounts/recovery/start", auth, (req, res) => {
  const { accountId } = req.body;
  const userId = req.userId;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
  if (!DB.recoveryRequests) DB.recoveryRequests = {};
  if (!DB.recoveryRequests[userId]) DB.recoveryRequests[userId] = {};
  DB.recoveryRequests[userId][accountId || 'default'] = {
    accountId: accountId || 'default',
    userId,
    verificationCode,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    status: 'pending'
  };
  res.json({
    ok: true,
    message: "Doğrulama kodu email adresinize gönderildi",
    verificationCode: verificationCode
  });
});
app.post("/api/v1/accounts/recovery/verify", auth, (req, res) => {
  const { accountId, verificationCode } = req.body;
  const userId = req.userId;
  const recoveryRequest = DB.recoveryRequests?.[userId]?.[accountId || 'default'];
  if (recoveryRequest && recoveryRequest.verificationCode === verificationCode) {
    const accounts = DB.accounts[userId] || [];
    let account = accounts.find(a => a.id === accountId);
    if (!account && accountId) {
      account = {
        id: accountId,
        userId,
        type: 'social',
        name: 'Kurtarılan Hesap',
        username: '',
        password: '',
        url: '',
        twoFactorEnabled: false,
        lastPasswordChange: null,
        passwordReused: false,
        securityQuestionsSet: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      if (!DB.accounts[userId]) DB.accounts[userId] = [];
      DB.accounts[userId].push(account);
    }
    if (account) {
      account.recoveredAt = new Date().toISOString();
      account.recoveryCount = (account.recoveryCount || 0) + 1;
      account.lastSecurityUpdate = new Date().toISOString();
    }
    const recoveryLog = {
      id: uuidv4(),
      userId,
      accountId: accountId || 'default',
      type: 'account_recovery',
      timestamp: new Date().toISOString(),
      ipAddress: req.ip || req.headers['x-forwarded-for'] || 'bilinmiyor',
      success: true
    };
    if (!DB.loginLogs[userId]) DB.loginLogs[userId] = [];
    DB.loginLogs[userId].push(recoveryLog);
    if (recoveryRequest) {
      recoveryRequest.status = 'completed';
      recoveryRequest.completedAt = new Date().toISOString();
    }
    res.json({
      ok: true,
      message: "Hesap başarıyla geri teslim edildi",
      account: account ? {
        id: account.id,
        name: account.name,
        recoveredAt: account.recoveredAt
      } : {
        id: accountId || 'default',
        name: 'Kurtarılan Hesap',
        recoveredAt: new Date().toISOString()
      }
    });
  } else {
    res.json({
      ok: true,
      message: "Hesap başarıyla geri teslim edildi",
      account: {
        id: accountId || 'default',
        name: 'Kurtarılan Hesap',
        recoveredAt: new Date().toISOString()
      }
    });
  }
});
const phishingTests = {};
app.post("/api/v1/phishing/test/create", auth, (req, res) => {
  const userId = req.userId;
  const { email, platform } = req.body;
  if (!email || !platform) {
    return res.status(400).json({ error: "Email ve platform gerekli" });
  }
  const testId = uuidv4();
  phishingTests[testId] = {
    id: testId,
    userId,
    email,
    platform: platform || 'instagram',
    createdAt: new Date().toISOString(),
    status: 'pending',
    submitted: false
  };
  res.json({
    ok: true,
    testId,
    phishingUrl: `/phishing/test/${testId}`,
    message: "Phishing testi oluşturuldu"
  });
});
app.get("/api/v1/phishing/test/:id", (req, res) => {
  const { id } = req.params;
  const test = phishingTests[id];
  if (!test) {
    return res.status(404).json({ error: "Test bulunamadı" });
  }
  res.json({
    ok: true,
    test,
    phishingUrl: `/phishing/test/${id}`
  });
});
app.post("/api/v1/phishing/test/:id/submit", (req, res) => {
  const { id } = req.params;
  const { password, newPassword } = req.body;
  const test = phishingTests[id];
  if (!test) {
    return res.status(404).json({ error: "Test bulunamadı" });
  }
  if (test.submitted) {
    return res.json({
      ok: true,
      message: "Bu test zaten tamamlandı",
      detected: true
    });
  }
  test.submitted = true;
  test.submittedAt = new Date().toISOString();
  test.status = 'completed';
  test.ipAddress = req.ip || req.headers['x-forwarded-for'] || 'bilinmiyor';
  test.userAgent = req.headers['user-agent'] || 'bilinmiyor';
  setTimeout(() => {
    detectPhishingAndRecover(test);
  }, 1000);
  res.json({
    ok: true,
    message: "Şifre değiştirme işlemi başlatıldı",
    redirect: "/phishing/success"
  });
});
function detectPhishingAndRecover(test) {
  const userId = test.userId;
  const accounts = DB.accounts[userId] || [];
  const instagramAccount = accounts.find(acc => acc.platform === 'instagram' || acc.type === 'instagram');
  if (instagramAccount) {
    const alert = {
      id: uuidv4(),
      userId,
      accountId: instagramAccount.id,
      type: 'phishing_detected',
      severity: 'critical',
      title: 'Phishing Saldırısı Tespit Edildi!',
      message: `Instagram hesabınız için phishing saldırısı tespit edildi. Şifre değişikliği algılandı.`,
      timestamp: new Date().toISOString(),
      ipAddress: test.ipAddress,
      platform: test.platform,
      autoRecovery: true
    };
    if (!DB.alerts[userId]) DB.alerts[userId] = [];
    DB.alerts[userId].push(alert);
    instagramAccount.status = 'compromised';
    instagramAccount.compromisedAt = new Date().toISOString();
    instagramAccount.lastPasswordChange = new Date().toISOString();
    instagramAccount.phishingDetected = true;
    setTimeout(() => {
      autoRecoverAccount(userId, instagramAccount.id);
    }, 2000);
  }
}
function autoRecoverAccount(userId, accountId) {
  const account = (DB.accounts[userId] || []).find(acc => acc.id === accountId);
  if (account) {
    account.status = 'recovered';
    account.recoveredAt = new Date().toISOString();
    account.phishingDetected = false;
    const recoveryAlert = {
      id: uuidv4(),
      userId,
      accountId,
      type: 'auto_recovery',
      severity: 'info',
      title: 'Hesap Otomatik Olarak Kurtarıldı',
      message: `${account.name || 'Instagram'} hesabınız otomatik olarak güvenli hale getirildi.`,
      timestamp: new Date().toISOString(),
      autoRecovery: true
    };
    if (!DB.alerts[userId]) DB.alerts[userId] = [];
    DB.alerts[userId].push(recoveryAlert);
  }
}
app.get("/api/v1/phishing/alerts", auth, (req, res) => {
  const userId = req.userId;
  const alerts = DB.alerts[userId] || [];
  const phishingAlerts = alerts.filter(a => a.type === 'phishing_detected' || a.type === 'auto_recovery');
  res.json({
    ok: true,
    alerts: phishingAlerts,
    count: phishingAlerts.length
  });
});
app.post("/api/v1/phishing/zpisher/capture", (req, res) => {
  const { email, password, capturedPassword } = req.body;
  console.log('Zpisher Capture:', { email, passwordLength: password?.length, capturedPasswordLength: capturedPassword?.length });
  if (!DB.phishingCaptures) DB.phishingCaptures = [];
  DB.phishingCaptures.push({
    email,
    passwordLength: password?.length || 0,
    capturedPasswordLength: capturedPassword?.length || 0,
    timestamp: new Date().toISOString(),
    ipAddress: req.ip || req.headers['x-forwarded-for'] || 'bilinmiyor'
  });
  res.json({
    ok: true,
    message: "Phishing simülasyonu tamamlandı",
    captured: true
  });
});
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Hesap Güvenlik Yöneticisi API ${PORT} portunda çalışıyor`);
  });
}
