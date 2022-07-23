import chromeWebstoreUpload from 'chrome-webstore-upload';
import { EdgeAddonsAPI } from '@plasmohq/edge-addons-api';
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
const EDGE_PRODUCT_ID = process.env.EDGE_PRODUCT_ID;
const EDGE_CLIENT_ID = process.env.EDGE_CLIENT_ID;
const EDGE_CLIENT_SECRET = process.env.EDGE_CLIENT_SECRET;
const EDGE_ACCESS_TOKEN_URL = process.env.EDGE_ACCESS_TOKEN_URL;

const deployToChrome = async () => {
  const chromeStore = chromeWebstoreUpload({
    extensionId: CHROME_EXTENSION_ID,
    clientId: CHROME_CLIENT_ID,
    clientSecret: CHROME_CLIENT_SECRET,
    refreshToken: CHROME_REFRESH_TOKEN,
  });

  const zipFile = fs.createReadStream(ZIP_PATH);

  const token = await chromeStore.fetchToken();

  const uploadRes = await chromeStore.uploadExisting(zipFile, token);
  console.log({ uploadRes });

  if (uploadRes.uploadState !== 'FAILURE') {
    const publishRes = await chromeStore.publish('default', token);
    console.log({ publishRes });
  }
};

const deployToEdge = async () => {
  const edgeStore = new EdgeAddonsAPI({
    productId: EDGE_PRODUCT_ID,
    clientId: EDGE_CLIENT_ID,
    clientSecret: EDGE_CLIENT_SECRET,
    accessTokenUrl: EDGE_ACCESS_TOKEN_URL,
  });

  const publishResp = await edgeStore.submit({
    filePath: ZIP_PATH,
    notes: 'Updating extension.',
  });

  console.log('publishResp: ', publishResp);
};

(async () => {
  console.log('Start deploying to chrome webstore...');
  await deployToChrome();

  console.log('Start deploying to edge add-on store...');
  await deployToEdge();
})();
