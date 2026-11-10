const assert = require('node:assert/strict');
const { afterEach, test } = require('node:test');
const {
  getBaseUrl,
  getCredentials,
  getNumericOtp,
  hasConfiguredValue
} = require('../src/utils/test-data');

const environmentKeys = ['BASE_URL', 'USERNAME', 'PASSWORD', 'MFA_TEST_OTP'];
const originalEnvironment = Object.fromEntries(
  environmentKeys.map(key => [key, process.env[key]])
);

afterEach(() => {
  for (const key of environmentKeys) {
    if (originalEnvironment[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = originalEnvironment[key];
    }
  }
});

test('getBaseUrl accepts an absolute HTTP URL', () => {
  process.env.BASE_URL = 'https://example.test/owa';
  assert.equal(getBaseUrl(), 'https://example.test/owa');
});

test('getBaseUrl rejects a non-HTTP protocol', () => {
  process.env.BASE_URL = 'file:///tmp/owa';
  assert.throws(() => getBaseUrl(), /BASE_URL must use HTTP or HTTPS/);
});

test('getBaseUrl reports a missing value without echoing configuration', () => {
  delete process.env.BASE_URL;
  assert.throws(() => getBaseUrl(), /Missing required environment variable: BASE_URL/);
});

test('getCredentials returns configured values without logging them', () => {
  process.env.USERNAME = 'test-user';
  process.env.PASSWORD = 'not-a-real-password';
  assert.deepEqual(getCredentials(), {
    username: 'test-user',
    password: 'not-a-real-password'
  });
});

test('getNumericOtp preserves leading zeros', () => {
  process.env.MFA_TEST_OTP = '001234';
  assert.equal(getNumericOtp('MFA_TEST_OTP'), '001234');
});

test('getNumericOtp rejects non-numeric values', () => {
  process.env.MFA_TEST_OTP = '12ab';
  assert.throws(() => getNumericOtp('MFA_TEST_OTP'), /MFA_TEST_OTP must contain only digits/);
});

test('hasConfiguredValue supports manual OTP entry when the setting is blank', () => {
  process.env.MFA_TEST_OTP = ' ';
  assert.equal(hasConfiguredValue('MFA_TEST_OTP'), false);
});

test('hasConfiguredValue detects configured OTP without returning it', () => {
  process.env.MFA_TEST_OTP = '001234';
  assert.equal(hasConfiguredValue('MFA_TEST_OTP'), true);
});
