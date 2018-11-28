#  FoodLocal

Membres du groupe :

- Antoine Rochat
- Benoît Schopfer
- James Smith
- Jérémie Châtillon

## Objectif

Pour ce projet, nous avons regroupé les projet de TWEB, MAC et PDG.

L'objectif de projet est de créer un site internet promouvant les petits producteurs locaux. La première itération de notre site est dors et déjà disponible à l'adresse http://foodlocal.ch.



## Objectifs pour TWEB et MAC

Pour la partie réseau social de notre projet, nous allons développer les fonctionnalités suivantes :

```
Votre application gèrera l’inscription et la connexion d’un utilisateur, ainsi que l’accès à sa page de profil.
```

- Notre application permettra à des utilisateurs de s'inscrire. Un utilisateur inscrit et connecté pourra :
  - Modifier ses informations
  - Noter des producteurs
  - S'abonner à des producteurs
  - Afficher un mur présentant les dernières nouveautés des producteurs suivis par l'utilisateur
  - Gérer ses abonnements
- Notre application permettra aussi à des producteurs de s'inscrire. Un producteur inscrit et connecté pourra :
  - Modifier ses informations (ajouter des produits, lieux de vente, changer les horaires, ....)
  - Publier des news (message texte et géolocalisation)
  - Il aura en plus accès aux fonctionnalités disponible pour un simple utilisateur inscrit. 

Note : le mur d'un producteur sera public et accessible à n'importe qui (même un utilisateur non connecté). Celui d'un utilisateur sera entièrement privé et accessible que par lui-même (donc lorsqu'il est connecté).



```
Votre application permet de partager au minimum un type de donnée.
```

Notre application permettra aux producteurs de partager de petits messages sur leur murs (petites news) contenant du texte et éventuellement une géolocalisation (affichant leur position sur une mini-map).
Lorsqu'ils mettront à jour leur liste de produits ou toute autre information, une news annonçant la modification sera automatiquement publiée (si le producteur le souhaite).



```
API
```

Notre serveur implémentera une API REST et une API GraphQL offrant de multiples endroits (voir documentation sur http://api.foodlocal.ch pour plus de détails sur les possibilités offertes par l'API)



```
Notation --> Gestion d’annotations ou Notations (Rating, like/dislike)
```

Notre application intégrera un système de notation des producteurs. Les utilisateurs connectés pourront attribuer une note aux producteurs (allant de 0 à 5 étoiles).



```
Recherche avancée
```

Notre application affiche une carte indiquant la position de tous les points de ventes des producteurs inscrits. Tous les producteurs affichés apparaissent dans une liste sur la droite de l'écran.

Un utilisateur (connecté ou non) pourra effectuer les recherches avancées suivantes :

- Filtrer / recherche par:
  - nom de producteur
  - notation de producteur (seulement ceux avec 5 étoiles, etc)
  - produits 
  - catégorie de produit (pommes, légumes, viande, ....)
  - lieu



```
Flux d'activités
```

Le flux des activités d'un producteur sera visible pour tout utilisateur (même sans être connecté) sur le mur du producteur.

Le flux d'activités d'un utilisateur sera visible sur son mur personnel (et privé). De plus, les utilisateurs recevront des notifications lorsqu'un producteur auquel ils sont abonnés mettra ses informations à jour ou ajoutera une ou plusieurs news.