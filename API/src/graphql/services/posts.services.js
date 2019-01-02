const mongoose = require('mongoose');
const PostsModel = require('../models/posts.modelgql');

function getAllPostsOfProducer(producerId, { limit = 30, page = 0 } = {}) {
  if (!mongoose.Types.ObjectId.isValid(producerId)) {
    return new Error('Received producerId is invalid!');
  }

  let skip;
  if (page !== 0) {
    skip = page * limit;
  }

  return PostsModel.find({ producerId })
    .sort({ _id: 1 })
    .skip(+skip)
    .limit(+limit);
}

function addPostOfProducer(post) {
  post.publicationDate = Date.now();

  // on enregistre le nouveau post dans la base de données
  return new PostsModel(post).save();
}

function deletePostOfProducer(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return new Error('Received personRatingProducer.id is invalid!');
  }

  return PostsModel.findByIdAndRemove(id);
}

module.exports = {
  getAllPostsOfProducer,
  addPostOfProducer,
  deletePostOfProducer
};
