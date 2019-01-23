module.exports = {
  getAllPostsOfProducer,
  countNbPostsOfProducerInDB,
  addPostOfProducer,
  deletePostOfProducer
};

const PostsModel = require('../models/posts.modelgql');
const notificationsServices = require('./notifications.services');

/**
 * Retourne tous les posts du producteur correspondant à l'id reçu.
 * @param producerId, l'id du producteur dont on souhaite récupérer tous les posts.
 * @returns un tableau contenant tous les posts du producteur correspondant à l'id reçu.
 */
function getAllPostsOfProducer(producerId) {
  // FIXME: Il faut ajouter la pagination entre la DB et le serveur !!!
  return PostsModel.find({ producerId, deleted: false })
    .sort({ publicationDate: -1 });
}

/**
 * Retourne le nombre total de posts d'un producteur enregistrés dans la base de données.
 * @param producerId, l'id du producteur dont on souhaite connaitre le nombre total de posts.
 * @returns le nombre total de posts d'un producteur enregistrés dans la base de données
 */
function countNbPostsOfProducerInDB(producerId) {
  return PostsModel.countDocuments({ producerId, deleted: false });
}

/**
 * Ajoute un nouveau post à la base de données et l'attribue au producteur correspondant à l'id 'producerId'.
 * @param post, les informations du post que l'on souhaite créer.
 * @returns le nouveau post.
 */
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

  await notificationsServices.addNotification('NEW_POST', newPost.producerId);

  return newPost;
}

/**
 * "Supprime" le post correspondant à l'id reçu. En réalité, on ne supprime pas le post mais on fait passer le booléen 'deleted' à true. Les posts avec
 * 'deleted' à true ne sont ensuite plus passés aux clients.
 * @param id, l'id du post à "supprimer".
 * @returns les informations du post supprimé.
 */
function deletePostOfProducer(id) {
  // FIXME: il faudrait supprimer les notifications ou les rediriger sur un message type "ce post a été supprimé par son auteur"!
  return PostsModel.findByIdAndUpdate(id, { deleted: true });
}
