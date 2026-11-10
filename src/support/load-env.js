const { config } = require('dotenv');

const loaded = config();

if (process.platform === 'win32' && loaded.parsed?.USERNAME) {
  process.env.USERNAME = loaded.parsed.USERNAME;
}
