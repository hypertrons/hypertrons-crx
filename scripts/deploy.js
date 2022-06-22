const zipFolder = require('zip-folder');
const fs = require('fs');

let folderName = '../build/';
let zipName = '../release/hypercrx.zip';

// getting all the credentials and IDs from environment
let REFRESH_TOKEN = process.env.REFRESH_TOKEN;
let EXTENSION_ID = process.env.EXTENSION_ID;
let CLIENT_SECRET = process.env.CLIENT_SECRET;
let CLIENT_ID = process.env.CLIENT_ID;

const webStore = require('chrome-webstore-upload')({
  extensionId: EXTENSION_ID,
  clientId: CLIENT_ID,
  refreshToken: REFRESH_TOKEN,
  clientSecret: CLIENT_SECRET,
});

function upload() {
  const extesnionSource = fs.createReadStream(zipName);
  webStore
    .uploadExisting(extesnionSource)
    .then((res) => {
      console.log('Successfully uploaded the ZIP');
      webStore
      .publish()
      .then((res) => {
        console.log('Successfully published the newer version');
      })
      .catch((error) => {
        console.log(`Error while publishing uploaded extension: ${error}`);
        process.exit(1);
      });
    })
    .catch((error) => {
      console.log(`Error while uploading ZIP: ${error}`);
      process.exit(1);
    });
}

zipFolder(folderName, zipName, function (err) {
  if (err) {
    console.log('oh no! ', err);
  } else {
    console.log(
      `Successfully zipped the ${folderName} directory and store as ${zipName}`
    );
    // will be invoking upload process
    upload();
  }
});

