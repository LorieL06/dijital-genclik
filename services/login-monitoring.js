const crypto = require('crypto');

function getLocationFromIP(ip) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lastOctet = parseInt(ip.split('.').pop()) || 1;
      const locations = [
        { country: 'TR', city: 'İstanbul', timezone: 'Europe/Istanbul' },
        { country: 'TR', city: 'Ankara', timezone: 'Europe/Istanbul' },
        { country: 'US', city: 'New York', timezone: 'America/New_York' },
        { country: 'DE', city: 'Berlin', timezone: 'Europe/Berlin' },
        { country: 'GB', city: 'London', timezone: 'Europe/London' }
      ];
      resolve(locations[lastOctet % locations.length]);
    }, 100);
  });
}

function detectPlatform(service, url) {
  const platformMap = {
    'instagram': 'instagram',
    'facebook': 'facebook',
    'twitter': 'twitter',
    'linkedin': 'linkedin',
    'gmail': 'google',
    'google': 'google',
    'discord': 'discord',
    'ziraat': 'bank',
    'isbank': 'bank',
    'garanti': 'bank',
    'akbank': 'bank'
  };
  const serviceLower = service.toLowerCase();
  for (const [key, platform] of Object.entries(platformMap)) {
    if (serviceLower.includes(key)) {
      return platform;
    }
  }
  return 'other';
}

function recordLoginAttempt(userId, accountId, eventData) {
  const attempt = {
    id: crypto.randomBytes(16).toString('hex'),
    userId,
    accountId,
    timestamp: new Date().toISOString(),
    ipAddress: eventData.ipAddress || 'bilinmiyor',
    userAgent: eventData.userAgent || 'bilinmiyor',
    device: eventData.device || 'bilinmiyor',
    location: eventData.location || null,
    success: eventData.success || false,
    platform: eventData.platform || 'bilinmiyor',
    riskScore: eventData.riskScore || 0,
    metadata: eventData.metadata || {}
  };
  return attempt;
}

function calculateRiskScore(attempt, userProfile) {
  let riskScore = 0;
  if (userProfile.knownIPs && !userProfile.knownIPs.includes(attempt.ipAddress)) {
    riskScore += 30;
  }
  if (userProfile.knownLocations && attempt.location) {
    const isKnownLocation = userProfile.knownLocations.some(loc =>
      loc.country === attempt.location.country && loc.city === attempt.location.city
    );
    if (!isKnownLocation) {
      riskScore += 25;
    }
  }
  if (userProfile.knownDevices && !userProfile.knownDevices.includes(attempt.device)) {
    riskScore += 20;
  }
  if (!attempt.success) {
    riskScore += 15;
  }
  const hour = new Date(attempt.timestamp).getHours();
  if (userProfile.normalActivityHours) {
    const [start, end] = userProfile.normalActivityHours;
    if (hour < start || hour > end) {
      riskScore += 10;
    }
  }
  return Math.min(100, riskScore);
}

function detectSuspiciousActivity(attempts, userProfile) {
  const suspicious = [];
  const recentFailures = attempts.filter(a =>
    !a.success &&
    new Date(a.timestamp) > new Date(Date.now() - 3600000)
  );
  if (recentFailures.length >= 5) {
    suspicious.push({
      type: 'multiple_failures',
      severity: 'high',
      message: `${recentFailures.length} başarısız giriş denemesi tespit edildi`,
      attempts: recentFailures.length
    });
  }
  if (attempts.length >= 2) {
    const sorted = attempts.sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i];
      const previous = sorted[i + 1];
      if (current.location && previous.location) {
        const timeDiff = new Date(current.timestamp) - new Date(previous.timestamp);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        if (current.location.country !== previous.location.country && hoursDiff < 1) {
          suspicious.push({
            type: 'impossible_travel',
            severity: 'critical',
            message: `İmkansız coğrafi hareket: ${previous.location.city} → ${current.location.city} (${hoursDiff.toFixed(1)} saat)`,
            from: previous.location,
            to: current.location
          });
        }
      }
    }
  }
  const recentSuccess = attempts.find(a =>
    a.success &&
    new Date(a.timestamp) > new Date(Date.now() - 3600000) &&
    userProfile.knownLocations &&
    !userProfile.knownLocations.some(loc =>
      loc.country === a.location?.country
    )
  );
  if (recentSuccess) {
    suspicious.push({
      type: 'unknown_location_login',
      severity: 'critical',
      message: `Bilinmeyen lokasyondan başarılı giriş: ${recentSuccess.location?.city}, ${recentSuccess.location?.country}`,
      attempt: recentSuccess
    });
  }
  return suspicious;
}

module.exports = {
  getLocationFromIP,
  detectPlatform,
  recordLoginAttempt,
  calculateRiskScore,
  detectSuspiciousActivity
};
