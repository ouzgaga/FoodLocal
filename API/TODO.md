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

- Finir les tests d'intégration :

  - Il reste à faire les schémas :
    - Notifications
    - PersonRatingProducers
    - Posts

- Finir les tests unitaires

- Refaire toute la java doc!

- **Ajouter les transactions!!**

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
