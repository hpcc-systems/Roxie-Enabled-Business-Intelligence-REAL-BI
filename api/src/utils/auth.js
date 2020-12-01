const crypto = require('crypto');

const encryptPassword = password => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(process.env.ALGORITHM, Buffer.from(key), iv);
  let encrypted = cipher.update(password);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${key.toString('hex')}=${encrypted.toString('hex')}`;
};

const decryptHash = hash => {
  if (!hash) return null;

  let hashParts = hash.split(':');
  hashParts = [hashParts[0], ...hashParts[1].split('=')];

  const iv = Buffer.from(hashParts[0], 'hex');
  const key = Buffer.from(hashParts[1], 'hex');
  const encryptedText = Buffer.from(hashParts[2], 'hex');
  const decipher = crypto.createDecipheriv(process.env.ALGORITHM, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

module.exports = { decryptHash, encryptPassword };
