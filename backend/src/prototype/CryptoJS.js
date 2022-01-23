const CryptoJS = require("crypto-js");

CryptoJS.enencrypt = (string) => {
  return CryptoJS.AES.encrypt(string, process.env.SECRET_KEY_JWT_VALID_AGENT).toString();
}

CryptoJS.decrypt = (string) => {
  const decrypt = CryptoJS.AES.decrypt(string, process.env.SECRET_KEY_JWT_VALID_AGENT);
  return decrypt.toString(CryptoJS.enc.Utf8);
}

