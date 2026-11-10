function requiredValue(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getBaseUrl() {
  const baseUrl = requiredValue('BASE_URL');
  let parsedUrl;

  try {
    parsedUrl = new URL(baseUrl);
  } catch {
    throw new Error('BASE_URL must be a valid absolute URL.');
  }

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
    throw new Error('BASE_URL must use HTTP or HTTPS.');
  }

  return baseUrl;
}

function getCredentials() {
  return {
    username: requiredValue('USERNAME'),
    password: requiredValue('PASSWORD')
  };
}

function getNumericOtp(name) {
  const otp = requiredValue(name);
  if (!/^\d+$/.test(otp)) {
    throw new Error(`${name} must contain only digits.`);
  }

  return otp;
}

function hasConfiguredValue(name) {
  return Boolean(process.env[name]?.trim());
}

module.exports = { getBaseUrl, getCredentials, getNumericOtp, hasConfiguredValue };
