const { Storage } = require('@google-cloud/storage');
const path = require('path');
const serviceKey = path.join(__dirname, '../config/keyGoogleCloud');

const gc = new Storage({
  keyFilename: serviceKey,
  projectId: 'your project id',
});

const name_bucket = gc.bucket("name-bucket");

module.exports = {
  gc,
  name_bucket
};

//https://medium.com/@olamilekan001/image-upload-with-google-cloud-storage-and-node-js-a1cf9baa1876
