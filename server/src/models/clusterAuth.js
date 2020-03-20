module.exports = (sequelize, DataTypes) => {
  const clusterAuth = sequelize.define(
    'clusterAuth',
    {
      username: DataTypes.STRING(50),
      hash: DataTypes.STRING,
    },
    { charset: 'utf8', collate: 'utf8_general_ci', tableName: 'clusterAuth', timestamps: false },
  );

  // Create encrypt method on clusterAuth model
  clusterAuth.encrypt = password => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(password);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}:${key.toString('hex')}=${encrypted.toString('hex')}`;
  };

  // Create decrypt method on clusterAuth model
  clusterAuth.decrypt = hash => {
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

  return clusterAuth;
};
