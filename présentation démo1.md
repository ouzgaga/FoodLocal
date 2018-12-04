##Ce qu'on a fait:

```
faire une démo de ce qui a été réalisé (tant au niveau du logiciel que des aspects infrastructure, qualité, communication)
```

- mockups
- Appris ReactJS, Material UI et Express
- Appris gitLab, google Cloud, Kubernetes et Ingress
- Modélisé la DB et l'API
- Pris un hébergement, compte google Cloud

##Ce qui est en place:

- Un site internet accessible en ligne
- Une API lisant et stoquant les infos dans une DB avec des données fictives
- Un site internet proposant les pages suivantes:
  - Accueil (carte)
  - À propos
  - S'inscrire
  - Se connecter
  - Page détaillée pour les producteurs

##Ce qui a été prévu:

```
présenter ce qui avait été prévu au début de l'itération
```

--> cf readme.md



- site en ligne et accessible -> OK
- carte OK
  - possibilité de cliquer sur les pins -> OK
  - Possibilité d'afficher les infos détaillées (une partie seulement pour le moment) d'un producteurs
- Page "À propos" -->OK



```
qu'est-ce qui a pris plus ou moins de temps? pourquoi? qu'a-t-on appris?
```

#### API

- Mettre en place un template pour générer un squellette à partir de la spec OpenAPI

#### Infra

- Déployement sur Google Cloud
- Temps pour mettre en ligne le site
- Automatisation des pipeline 

#### UI

- Comprendre ReactJs et Material UI



##Ce qui manque:

- Page affichant tous les producteurs --> pas utile --> pas implémenté



```
présenter ce qui est prévu pour l'itération suivante. Qu'est-ce qu'on vise? Cela veut dire aussi bien des nouvelles fonctionnalités et des choses à améliorer (également sur la manière de travailler ensemble, de se coordonner)
```

## À améliorer:

#### API

- Améliorer l'API pour qu'elle réponde aux besoins du site au fur et à mesure qu'ils apparaissent
- Ajouter les nouvelles fonctionnalités prévues (OAuth 2.0)
- Finir les tests d'intégration

#### UI

- Ajouter les nouvelle fonctionnalités prévues 
- Ajouter des tests unitaires
- Finir d'unifier le code en résolvant les erreurs indiquées par ESLint

#### Infra

- Ajouter la prise en charge https
- Améliorer les CI
- Donner un accès depuis l'extérieur à la DB



## Prévu pour la démo 2:

## Infra:

- https
- Améliorer les CI
- Donner un accès depuis l'extérieur à la DB

## UI

- Ajout fonctionnalités:
  - recherche de produits / producteurs / points de vente
  - inscription producteurs
  - partie administration (vérification des inscription, etc)
  - partie producteurs inscrits
    - Ajout d'un produit
    - Modicification d'un produit
    - Ajout d'un point de vente
    - Modification d'un point de vente

## API

- Ajouter l'authentification OAuth 2.0
- Ajouter et adapter l'API en fonction des besoins/demandes de l'UI