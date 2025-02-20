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
const EDGE_API_KEY = process.env.EDGE_API_KEY;
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
  console.log('chrome uploadRes: ', JSON.stringify(uploadRes, null, 2));

  if (uploadRes.uploadState !== 'FAILURE') {
    const publishRes = await chromeStore.publish('default', token);
    console.log('chrome publishRes: ', JSON.stringify(publishRes, null, 2));
  } else {
    process.exit(-1);
  }
};

const deployToEdge = async () => {
  const edgeStore = new EdgeAddonsAPI({
    productId: EDGE_PRODUCT_ID,
    clientId: EDGE_CLIENT_ID,
    apiKey: EDGE_API_KEY,
  });

  try {
    const publishResp = await edgeStore.submit({
      filePath: ZIP_PATH,
      notes: 'Updating extension.',
    });
    console.log('edge publishResp:', publishResp);
    const operationId = publishResp.split('/').pop();
    const status = await edgeStore.getPublishStatus(operationId);
    console.log('Publish status:', status);
  } catch (error) {
    console.error('edge deployment failed:', error.message);
    process.exit(-1);
  }
};

(async () => {
  console.log('Start deploying to chrome webstore...');
  await deployToChrome();

  console.log('Start deploying to edge add-on store...');
  await deployToEdge();
})();
