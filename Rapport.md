# Rapport projet Localfood
## Choix des technologies
### Choix technologique pour le backend
Pour développer notre backend, nous avons utilisé trois technologie
- Express
- Graphql
- MongoDB

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

## Deployment
Toutes les informations concerant le deployment sont accéssible dans le [README.md](./Deployment/README.md) dans le dossier [/Deployment](./Deployment).

## Utilisation
L'application est accessible à l'adresse: https://foodlocal.ch.
L'application est séparé en plusieurs onglets.
### L'acceuil

### La carte

### A propos

### Gestion de compte

### Partie producteurs

### Partie réseau sociale

## Auto évaluation
