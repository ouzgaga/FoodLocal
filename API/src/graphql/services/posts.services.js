module.exports = {
  getAllPostsOfProducer,
  countNbPostsOfProducerInDB,
  addPostOfProducer,
  deletePostOfProducer
};

const mongoose = require('mongoose');
const PostsModel = require('../models/posts.modelgql');
const notificationsServices = require('./notifications.services');

function getAllPostsOfProducer(producerId) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return PostsModel.find({ producerId })
    .sort({ publicationDate: -1 });
}

function countNbPostsOfProducerInDB(producerId) {
  return PostsModel.countDocuments({ producerId });
}

async function addPostOfProducer(post) {
  const postToAdd = {
    ...post,
    publicationDate: Date.now()
  };

  if (postToAdd.address != null) {
    const { number, street, city, postalCode, state, country, longitude, latitude } = postToAdd.address;

    postToAdd.address = {
      number,
      street,
      city,
      postalCode,
      state,
      country,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    };
  }

  // on enregistre le nouveau post dans la base de données
  const newPost = await new PostsModel(postToAdd).save();

  const res = await notificationsServices.addNotification('NEW_POST', newPost.producerId);

  return newPost;
}

function deletePostOfProducer(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Received personRatingProducer.id is invalid!');
  }

  // FIXME: il faut supprimer les notifications ou les rediriger sur un message type "ce post a été supprimé par son auteur"!
  return PostsModel.findByIdAndRemove(id);
}
