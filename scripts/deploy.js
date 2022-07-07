import chromeWebstoreUpload from 'chrome-webstore-upload';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ZIP_PATH = path.join(__dirname, '..', '/release/hypercrx.zip');

// getting all the credentials and IDs from environment
const CHROME_EXTENSION_ID = process.env.CHROME_EXTENSION_ID;
const CHROME_CLIENT_ID = process.env.CHROME_CLIENT_ID;
const CHROME_CLIENT_SECRET = process.env.CHROME_CLIENT_SECRET;
const CHROME_REFRESH_TOKEN = process.env.CHROME_REFRESH_TOKEN;

const store = chromeWebstoreUpload({
  extensionId: CHROME_EXTENSION_ID,
  clientId: CHROME_CLIENT_ID,
  clientSecret: CHROME_CLIENT_SECRET,
  refreshToken: CHROME_REFRESH_TOKEN,
});

const zipFile = fs.createReadStream(ZIP_PATH);

(async () => {
  const token = await store.fetchToken();

  const uploadRes = await store.uploadExisting(zipFile, token);
  console.log({ uploadRes });

  const publishRes = await store.publish('default', token);
  console.log({ publishRes });
})();
