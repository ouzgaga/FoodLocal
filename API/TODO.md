API:

Reste à faire:

- Une mise à jour des infos d'un prod ou de ses produits ou de son salespoint doit automatiquement créer un post sur son mur si celui-ci le demande.

  ```
  Notre application permettra aux producteurs de partager de petits messages sur leur murs (petites news) contenant du texte et éventuellement une géolocalisation (affichant leur position sur une mini-map).
  Lorsqu'ils mettront à jour leur liste de produits ou toute autre information, une news annonçant la modification sera automatiquement publiée (si le producteur le souhaite).
  ```

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

- Filtrer les producteurs qui n'ont pas été validés par un admin!

- Ajouter les subscription pour les notifications

- Prendre en charge les images! Récupérer un file ou qqch du genre et le stoquer...!

- Ajouter la pagination entre la DB et le serveur!!! (répliquer les paramètres reçus dans les appels à la DB)

- Ajouter le geoFilter au filtre des byProductsTypesId!

- rajouter l'envoi du mail lorsqu'on génère un novueau password