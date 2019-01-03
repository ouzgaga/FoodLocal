const mongoose = require('mongoose');
const PostsModel = require('../models/posts.modelgql');
const notificationsServices = require('./notifications.services');

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

async function addPostOfProducer(post) {
  post.publicationDate = Date.now();

  // on enregistre le nouveau post dans la base de données
  const newPost = await new PostsModel(post).save();

  const res = await notificationsServices.addNotification('NEW_POST', post.producerId);
  if (res.message != null) {
    return res;
  }
  return newPost;
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
