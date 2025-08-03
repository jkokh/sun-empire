const crypto = require('crypto');
const fs = require('fs');
const { execSync } = require('child_process');

// Generate an ECDSA key pair similar to SSH
const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
    namedCurve: 'secp256r1', // secp256r1 is commonly used for SSH ECDSA keys
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});



console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);
