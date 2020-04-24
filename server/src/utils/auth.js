const crypto = require('crypto');
const { user: userModel } = require('../models');

// Utils
const { awaitHandler, unNestSequelizeObj } = require('./misc');

// Constants
const algorithm = process.env.ALGORITHM;

const getUserByID = async userID => {
  let [err, user] = await awaitHandler(userModel.findOne({ where: { id: userID } }));

  // Return error
  if (err) throw err;

  // No user found with provided id
  if (!user) {
    return false;
  }

  // Get nested object
  user = unNestSequelizeObj(user);

  return user;
};

const encryptPassword = password => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(password);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return `${iv.toString('hex')}:${key.toString('hex')}=${encrypted.toString('hex')}`;
};

// Create decrypt method on clusterAuth model
const decryptHash = hash => {
  let hashParts = hash.split(':');
  hashParts = [hashParts[0], ...hashParts[1].split('=')];

  const iv = Buffer.from(hashParts[0], 'hex');
  const key = Buffer.from(hashParts[1], 'hex');
  const encryptedText = Buffer.from(hashParts[2], 'hex');
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

module.exports = { decryptHash, encryptPassword, getUserByID };
