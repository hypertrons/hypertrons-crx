import chromeWebstoreUpload from 'chrome-webstore-upload';
const fs = require('fs');

const ZIP_PATH = '../release/hypercrx.zip';

// getting all the credentials and IDs from environment
let REFRESH_TOKEN = process.env.CHROME_REFRESH_TOKEN;
let EXTENSION_ID = process.env.CHROME_EXTENSION_ID;
let CLIENT_SECRET = process.env.CHROME_CLIENT_SECRET;
let CLIENT_ID = process.env.CHROME_CLIENT_ID;

const store = chromeWebstoreUpload({
  extensionId: EXTENSION_ID,
  clientId: CLIENT_ID,
  refreshToken: REFRESH_TOKEN,
  clientSecret: CLIENT_SECRET,
});

const zipFile = fs.createReadStream(ZIP_PATH);

(async () => {
  const token = await store.fetchToken();

  const uploadRes = await store.uploadExisting(zipFile, token);
  console.log({ uploadRes });

  const publishRes = await store.publish('default', token);
  console.log({ publishRes });
})();
