# Rapport projet Localfood
## Choix des technologies
### Choix technologique pour le backend :
Pour développer notre backend, nous avons utilisé les technologies suivantes :
- NodeJs
- Express
- REST ( au début de notre projet. A été abandonné après la 1ère démo de PDG)
- Graphql (apollo-server-express)
- MongoDB

Nous avons commencé le développement en partant sur une API REST car nous ne connaissions pas GraphQL. Lorsqu'il nous a été présenté durant le cours de TWEB, nous avons rapidement décidé de passer à cette technologie. Ce choix fût prit tant par curiosité pour cette technologie que pour les avantages qu'elle procure. Ce qui nous a réellement décidé est le fait que GraphQL permette de réellement séparer le développement front-end et back-end



Le choix des technologies à fortement été influencé par le cours de TWEB et les exigences du projet de MAC. De plus, ces technologie nous interessaient énormément et nous trouvions intéressant de les apprendre et les mettre en pratique dans le cadre d'un gros projet.
Le choix d'utiliser graphql à la place d'une API REST fut prise du à la taille des données que nous traitons. Nous avons peut de type de données différentes mais nous avons besoin de les récupérer sous différentes forme avec des paramètres différents. Je prends l'exemple des producteurs qui est objet complexe que nous récupérons dans diverse page mais toujours avec un niveau de détail différent.

### Choix technologique pour le frontend
Pour développer notre frontend, nous avons utilisé le framework React.

Cette technologie prend une place majeur sur le marché des technologies web. Le fait de l'utiliser dans ce projet nous a permis de si accoutumer. Les applications "one page" sont de plus en plus à la mode et React permet de le faire facilement.

Nous voulions une technologie permetant de s'adapter sur mobile et React avec ces librairies comme material-ui nous facilite la tâche. Nous pourrons dans le futur transformer notre application en Progressive Web App pour amélioré l'expérience mobile des utilisateurs.

### Choix technologique pour l'infrastructure
Nous avons héberger notre application sur **Gitlab**. Ce choix fut pris par rapport à ces concurants pour pouvoir utiliser les fonctionnalités de Continuous Integration (CI) qui nous a permis de faire des pipeline de production.

Cela nous a permis de mettre en place des tests de qualités et une mise en production automatisée basée sur des commits sur des branches spécifiques.

Nous avons décidé d'héberger notre application sur **Google Cloud** avec Kubernetes. C'était la technologie la moi cher et la plus accessible pour pouvoir faire du scaling de l'application.

L'appentissage et la mise en place de ces technologies fuent complexe mais une réelle expérience. Ceci nous a permis de découvrir le monde des DevOps.

## API

### Requêtes et données
// TODO
### Tests
Nous avons effectué deux type de tests. Des tests unitaires qui teste les différents services et méthodes d'accès aux données et des tests d'intégration qui tests le fonctionnement de GraphQL.

Pour lancer les tests il faut exécuté la commande `npm test`dans le dossier *API*

## Deployment
Toutes les informations concerant le deployment sont accéssible dans le [README.md](./Deployment/README.md) dans le dossier [/Deployment](./Deployment).

## Utilisation
L'application est accessible à l'adresse: https://foodlocal.ch.
L'application est séparée en plusieurs onglets.

### L'acceuil
L'acceuil permet de voir les informations concernant le projet, en descendant dans la page, on trouvera la liste des producteurs ce situant autour de soit.
### La carte
La carte permet de voir ou se situent les producteurs autour de nous. Il y a la possibilité de les filtrer et de gérer la distance maximum de recherche.

En cliquant sur un marqueur sur la carte, on peut avoir un aperçu des information du point de vente. Il est possible d'accéder au informations complète en recliquant dessus. 

### Partie réseau sociale
Les utilisateurs connectés peuvent noter un producteur et suivre son actualité par le biais de notification.

### Producteurs

Les producteurs pourront gérer leur point de vente et leur produits lorsqu'ils sont connectés. Ils pourront aussi posté des actualités sur leur "mur".

### Lancer l'application en local

### Pour lancer un replica set MongoDB en local

Utiliser `run-rs` , pour ce faire aller dans un dossier temporaire et lancer les commandes.

```sh
npm install run-rs
run-rs -v 4.0.0
```

### Pour lancer l'api

- Aller dans le dossier [API](./API/) 
- Créé un fichier *.env* contenant les mêmes variables que le fichier [.env.default](./API/.env.default) avec vos données. Faites attentions de bien mettre les informations pour vous connectez au replica set de *run-rs*
- Lancer un terminal dans le dossier API
- Lancer la commande `npm install` pour installer les dépendances du projet
- Lancer la commande `npm start` pour lancer l'API
- Vous pourrez accéder à l'api à l'adresse: http://locahost:<portDu.env>

### Pour lancer le frontend

- Aller dans le dossier [FrontEnd](./FrontEnd) 
- Lancer un terminal dan sle dossier FrontEnd
- Lancer la commande `npm install`
- Lancer la commande `npm start`
- Vous pourrez accéder au frontend à l'addresse http://localhost:3000

## Problèmes rencontrés
### Connaissances
Le plus gros problème qu'on a rencontré c'est le fait de partir des technologies que l'on ne connaissait pas. Au fur et à mesure du semestre, nous découvrions des nouvelles technologies en MAC et TWEB et nous nous rendions compte qu'elle était beaucoup plus adpaté à notre problème.
Nous avons régulièrement pris le choix de refaire des parties en utilisant une nouvelle technologie par curiosité et pour l'évolutivité du projet dans le futur.
### Organisation
Nous avons pris le risque de regrouper les projets de MAC, TWEB et PDG ensemble. Cela nous a permis de nous concentrer sur un projet qui nous porte à coeur mais nous a posé des problèmes concernant la charge de travail que l'on c'est imposé. Il était difficile de respécter le demande de tous les cours sans augmenter le nombre de fonctionnalités et la complexité du projet.

### Pagination

### Infrastructure
La grande difficulté de la mise en production sur Google Cloud fut l'apprentissage de Kubernetes. L'apprentissage pour la mise en production de service et de deployment fut assez rapide mais la gestion des certificats pour l'HTTPS fut la première étape compliquée. 

Nous avons pris le choix de tous héberger sur Google Cloud et donc nous avons du mettre notre base de données mongo. Nous avons voulu rendre la base de donnée plsu robuste en la transformant en un replica set. Ceci à nécessiter beaucoup d'essaie mais grâce à la découverte de l'outils Helm, de nombreuses heures de configuration on pu être sauvé. Malgrés une réussite, je pense que Mongo Atlas est plus adapter à l'hébergement d'une telle base de données. Mais engendrerais des frais supplémentaires.

## Conclusion

Nous sommes très fière de notre idée et avons appris une quantité démesuré de chose en une durée de temps très réduite. Ce fut une super expérience et nous espérons pouvoir continuer ce projet pour pouvoir le mener à bien.

## Remerciements
Un grand merci à Paul, Miguel et Olivier pour leur aide durant des heures sombres de debugging et de nous avoir mener sur le droit chemin.

