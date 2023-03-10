const Crypto = require('../models/Crypto');

exports.getAll = () => Crypto.find({}).lean();

exports.getOne = (cryptoId) => Crypto.findById(cryptoId).lean();

exports.buy = async (userId, cryptoId) => {
  const crypto = await Crypto.findById(cryptoId);

  //TODO: check if user has already bought the crypto
  const isBuyer = crypto.buyers?.some((id) => id == userId);
  if (!isBuyer) {
    crypto.buyers.push(userId);
    return crypto.save();
    // Crypto.findByIdAndUpdate(cryptoId, { $push: { buyers: userId } });
  } else {
    throw new Error('User has already bought this!');
  }
};

exports.create = (ownerId, cryptoData) =>
  Crypto.create({ ...cryptoData, owner: ownerId });

exports.edit = (cryptoId, cryptoData) =>
  Crypto.findByIdAndUpdate(cryptoId, cryptoData, { runValidators: true });

exports.delete = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);

exports.search = async (name, paymentMethod) => {
  let crypto = await this.getAll();
  if (name) {
    crypto = crypto.filter((x) => x.name.toLowerCase() == name);
  }
  if (paymentMethod) {
    crypto = crypto.filter((x) => x.paymentMethod == paymentMethod);
  }
  return crypto;
};
