const crypto = require('crypto');
const fs = require('fs');

const passphrase = 'this is a very very secret key so keep it safe';

// The `generateKeyPairSync` method accepts two arguments:
// 1. The type ok keys we want, which in this case is "rsa"
// 2. An object with the properties of the key
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  // The standard secure default length for RSA keys is 2048 bits
  modulusLength: 2048,
});

fs.writeFileSync(
  './keypairs/pub.pem',
  publicKey.export({
    type: 'spki',
    format: 'pem',
  })
);

fs.writeFileSync(
  './keypairs/pri.pem',
  privateKey.export({
    type: 'pkcs1',
    format: 'pem',
    cipher: 'aes-256-cbc',
    passphrase: passphrase,
  })
);
