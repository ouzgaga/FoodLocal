API:

Reste à faire:

- Ajouter des filtres 

  - par nom de producteur
  - par notation (seulement ceux avec X étoiles, ceux de X étoiles et +, etc)
  - par nom de produit
  - par description de produit
  - par catégorie
  - par lieu 
    - https://docs.mongodb.com/manual/reference/command/geoSearch/#dbcmd.geoSearch
    - https://docs.mongodb.com/manual/tutorial/build-a-geohaystack-index/index.html

- Supprimer touuuutes les infos d'un producteur / Utilisateur lorsqu'on le supprime

  - Producteur:
    - Il faut delete tous ses produits
    - Il faut delete son salespoint (s'il n'est pas partagé avec un autre producteur)
    - Il faut delete l'id de tous les tableaux où il apparait :
      - followers/follows de chaque producteur/user de la DB
      - producerId des productType
      - delete tous ses posts
      - delete toutes ses notifications
      - envoyer une notification à tous ses followers pour dire qu'il a supprimé son compte
  - User:
    - il faut delete son id de tous les tableaux followers des producteurs de la DB
    - delete toutes ses notifications
  - Conseil de Paul -> ne jamais rien supprimer -> mettre un paramètre disable à true et filtrer les données pour ignorer ces éléments.

- Finir les tests d'intégration :

  - Il reste à faire les schémas :
    - Notifications
    - PersonRatingProducers
    - Posts

- Finir les tests unitaires

- Refaire toute la java doc!

- **Ajouter les transactions!**

- **Filtrer les producteurs qui n'ont pas été validés par un admin!**

- **TESTER les subscription pour les notifications**

- Prendre en charge les images! Récupérer un file ou qqch du genre et le stoquer...!

- **Ajouter la pagination entre la DB et le serveur!!!**

- Ajouter les stats "produits de la semaine" et un endpoint pour les récupérer

- Ajouter des n° d'erreurs aux erreurs retournées

  ```
  {
      fr : {
          err1: {},
          err2: {}
      },
      en: {
          err1: {},
          err2: {}
      }
  }
  ```
