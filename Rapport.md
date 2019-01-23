# Rapport projet Localfood
## Choix des technologies
### Choix technologiques pour le backend :
Pour développer notre backend, nous avons utilisé les technologies suivantes :
- NodeJs
- Express
- REST ( au début de notre projet. A été abandonné après la 1ère démo de PDG)
- GraphQL (apollo-server-express)
- MongoDB

Le choix des technologies a fortement été influencé par le cours de TWEB et les exigences du projet de TWEB/MAC. De plus, ces technologies nous intéressaient énormément et nous souhaitions les apprendre et les mettre en pratique dans le cadre d'un gros projet.

Nous avons commencé le développement en partant sur une API REST car nous ne connaissions pas GraphQL. Lorsqu'il nous a été présenté durant le cours de TWEB, nous avons rapidement décidé de passer à cette technologie. Ce choix fût prit tant par curiosité pour cette technologie que pour les avantages qu'elle procure. Ce qui nous a réellement décidé est le fait que GraphQL permette de réellement séparer le développement front-end et back-end car les développeur du backend étaient régulièrement en attente de feedback des développeurs frontend et inversément ce qui nous pénalisait grandement.
De plus, nous rencontrions d'importants problèmes d'over-fetching ou d'under-fetching avec l'API REST. GraphQL offre l'énorme avantage de pouvoir sélectionner très précisément les données que le client souhaite récupérer réglant définitivement ce problème.

Nous avons donc décidé de passer à GraphQL et avons pour cela entièrement recodé l'API.

Nous avons choisi d'utiliser une base de données MongoDB car nous souhaitions profiter de la flexibilité offerte par les base de données orientées documents. Nous avons pu découvrir durant le projet les capacités ainsi que certaines limites de MongoDB et, notamment, la puissance de ses aggrégations, qui, après quelques longues heures de casse-tête pour comprendre leur fonctionnement, se sont avérées très utiles!

### Choix technologiques pour le frontend :
Pour développer notre frontend, nous avons utilisé les technologies suivantes:

- React
- Material-UI
- Apollo-client
- Leaflet

Nous avons souhaité utiliser React car c'est une technologie qui prend une place majeur sur le marché des technologies web. De plus, nous l'avons étudié durant le semestre dans le cours de TWEB et avions deux experts (bon d'accord, surtout un) à dispositions pour nous débloquer lorsque nous rencontrions des problèmes insumontables pour les pauvres novices que nous sommes. Le fait de l'utiliser dans ce projet nous a permis de le prendre bien en main et de bien intégrer son fonctionnement, ses possibilités et ses limites. De plus, nous voulions une technologie capable de s'adapter sur mobile et React, couplé à des librairies comme Material-UI le fait très bien. Nous avons passé passablement de temps à faire en sorte que notre site soit le plus responsive possible et qu'il soit aussi agréable sur desktop que sur mobile.

Pour l'affichage de la carte, nous avons utilisé Leaflet car elle est disponible gratuitement et est open-source. De plus, elle s'intègre très bien avec React et nous étions secondés par un asistant expert en la matière qui nous l'a chaudement recommandé.

Au niveau de la structure de notre code, nous avons réalisé la structure suivante:

- Le fichiers du dossier *accouontCRUD* gèrent la modification d'un profil utilisateur.
- Les fichiers du dossier *accueil* gèrent la page d'accueil.
- Les fichiers du dossier *admin* gèrent l'interface administrateur.
- Les fichiers du dossier *items* sont des composants utilisés un peu partout dans l'application.
- Les fichiers du dossier *mapPageProducer* gèrent la page affichant la carte.
- Les fichiers du dossier *menu* gèrent le menu affiché.
- Les fichiers du dossier *mur* gèrent le mur de notification des utilisateurs.
- Les fichiers du dossier *newUser* gèrent la création de nouveaux utilisateurs ou producteurs.
- Les fichiers du dossier *producers* gèrent l'affichage de la page des informations détaillées d'un producteur.
- Les fichiers du dossier *producerRegistration* permettent l'ajout d'un point de vente ainsi que de produits au producteur.
- Le dossier *providers* contient les providers utilisés dans l'application.
- Les fichiers du dossier *pages* contient les différentes pages de l'application.
- Le fichier *app.js* gère le routing.
- Le fichier *index.js* contient toute l'arborescence des providers.

### Choix technologiques pour l'infrastructure :
Nous avons hébergé notre application sur Gitlab car, contrairement à certains de ses concurrents, il permet d'utiliser les fonctionnalités de Continuous Integration (CI) ce qui nous a permis de créer des pipelines de production automatisés qui se sont révélés extrêmement pratiques.
En effet, cela nous a permis de mettre en place des tests de qualités ainsi qu'un pipeline de mise en production automatisée basée sur des commits effectués sur des branches spécifiques.

Nous avons acheté le nom de domaine foodlocal.ch chez Infomaniak et avons décidé d'héberger notre application sur Google Cloud avec Kubernetes. Nous avons choisi Google Cloud car ils offraient un bonus de 300.- pour débuter, ce qui nous était suffisant pour la durée de notre projet. De plus, Google Cloud offre la possibilité de faire du scaling de l'application sans trop impacter le prix de l'hébergement.

L'appentissage et la mise en place de ces technologies se sont avérés vraiment complexes mais nous y sommes parvenus et avons pu, en prime, découvrir un peu le monde des DevOps.

## API

L'API est structurée de la façon suivante: 

- Les fichiers situés dans le dossier *API/src/graphql/schemas* constituent le schéma GraphQL. Ces fichiers définissent les appels que peut faire le client sur l'API ainsi que toutes les communications (paramètres requis, contenu des objets etc...).
- Chaque endpoint du schéma nécessite un resolver. Ces resolvers se trouvent dans le dossier *API/src/graphql/resolvers*. Les resolvers sont appelés automatiquement par GraphQL en fonction du endpoint appelé. Nous avons fait en sorte que le code des resolvers soit toujours le plus concis possible. En général, les resolvers se content de vérifier l'authentification du client ainsi que son autorisation (s'il possède les droits d'appeler cet endpoint ou non), puis ils appellent une fonction dans l'un des services de l'API.
- Les services se trouvent dans le dossier *API/src/graphql/services*. Les services effectuent tout le traitement des resolvers. C'est eux qui manipulent les données et qui font les appels à la base de données en se basant sur les modèles mongoose.
- Les modèles mongoose sont situés dans le dossier *API/src/graphql/models*. Chaque fichier décrit une collection de la base de données.
- Dans le dossier *API/src/graphql/schemaDirective* se trouve une directive GraphQL. Cette directive (créée par notre très cher PaulNta *__\*) est utilisée dans le schéma GraphQL grâce à l'annotation *@connection*. Lorsqu'un élément du schéma contient cette annotation cela signifie que l'élément est paginé. Ainsi, le résultat retourné par le resolver d'un élément du schéma GraphQL possèdant cette annotation sera automatiquement passé à la directive. La directive se charge d'ajouter les paramètres de pagination (first, before, last, after) à l'élément du schéma et passe le retour du resolver dans une fonction *connectionFromArray()* qui transforme le tableau reçu en une connection (un tableau paginé) valide.
- Le fichier API/src/graphql/graphqlConfig.js contient la configuration de GraphQL. C'est lui qui merge tous les resolvers en une constante *resolvers* ainsi que tous les fichiers de schémas GraphQL en une constante *schema*. Ces constante (ainsi que la directive) sont ensuite exportées afin de pouvoir être utilisées facilement dans le reste de l'API.
- Dans le dossier *API/src/utils* se trouvent quelques fichiers contenant diverses fonctions utilitaires appelées par d'autres services.
- Dans le fichier *API/src/config* se trouvent 1 fichier d'importance capitale. En effet, le fichier *config.js* contient tous les paramètres de l'API tels que le numéro de port, la string de connection à la base de données, le secret jwt, etc. Cette configuration est disposée dans un objet contenant 3 configurations distinctes (*development*, *test* et *production*). La configuration appropriée est sélectionnée à l'aide de la variable d'environnement *NODE_ENV*. Par défaut, c'est la configuration *development* qui est sélectionnée.
- Les 2 derniers fichiers importants sont *app.js* et *server.js* situés dans le dossier *API/src/*. 
  *app.js* configure effectue la connexion à la base de données et lance le serveur express et le serveur apollo.
  *server.js* se contente d'appeler *app.js* puis fait le listen afin d'écouter un port et de mettre l'API réellement à disposition de clients distants.

### Requêtes et données

L'API offre de très nombreux endpoints. L'utilité de chaque endpoint est donnée en commentaires dans les fichiers du schéma GraphQL (dossier *API/src/graphql/schemas*). De plus, chaque fonction des services sont commentées et documentées.

### Tests
Nous avons effectué deux types de tests de notre API.
Tout d'abord, nous avons testé chaque fonction de chaque service afin de s'assurer de son bon fonctionnement et de pouvoir être certain que son comportement ne change pas tout au long du développement de l'API. Pour cela, nous avons créé des tests unitaires à l'aide de *Mocha* ainsi *Chai*.

Dans un second temps, nous avons créé des tests d'intégration permettant de tester le comportement de l'API en se mettant à la place du client. Dans ces tests, nous faisons un appel non pas directement à un service comme c'est le cas dans les tests unitaires, mais en faisant un appel à GraphQL. Ainsi, on "traverse" toute l'API et on peut tester les données exactement comme le client les reçoit.

Nous avons tout d'abord implémenté les tests d'intégration à l'aide de Jest, mais suite à de nombreux problèmes de timer et à des tests extrêment lents (plus de 5 seconde par test, entre 25 et 30 minutes pur tous les exécuter...!), nous avons abandonné Jest pour revenir à des tests Mocha. Nous avons toutefois utilisé une librairie (snap-shot-it) permettant d'utiliser le même genre de snapshot que Jest propose, mais avec Mocha.

Pour lancer tous les tests (services et intégration) il faut exécuter la commande `npm run test`dans le dossier *API*. Pour lancer uniquement les tests d'intégration, utilisez la commande `npm run test-integration`et pour lancer uniquement les tests des services utilisez la commande `npm run test-services`.

Pour terminer, nous avons réalisé quelques tests de charge à l'aide de JMeter. Malheureusement, nous n'avons pas eu le temps de tester pleinement la résistance à la charge de l'API... Nous sommes également avertit de certains problèmes que nous n'avons eu le temps de répondre. Le premier gros problème dont souffre l'API est le fait que nous n'utilisions pas de transactions. Le second gros problème est que nous n'avons pas eu le temps d'implémenter la pagination entre le serveur et la base de données...!



Au niveau du frontend, nous avons effectué les tests de l'interface graphique à l'aide d'un *storybook* testant une bonne partie des composants utilisés. Ce dernier peut être consulté en lançant la commande `npm run storybook` et est consultable à l'adresse http://localhost:9009.

## Déploiement
Toutes les informations concernant le déploiement sont accessibles dans le fichier [README.md](./Deployment/README.md) du dossier [/Deployment](./Deployment).

## Utilisation
L'application est accessible en ligne à l'adresse: https://foodlocal.ch/. L'API est accessible à l'adresse https://api.foodlocal.ch/.

L'application est séparée en plusieurs onglets :

### L'acceuil
L'acceuil permet de voir des informations d'ordre générales concernant le projet. En descendant dans la page, on trouvera la liste des producteurs par ordre de proximité (du plus proche au plus éloigné par rapport à notre position si on a accepté que le navigateur la relève, par rapport à Lausanne sinon).
### La carte
La carte permet de voir ou se situent les producteurs autour de nous. L'utilisateur a la possibilité de filtrer les producteurs par types de produits qu'ils proposent. Il peut également les filtrer par distance maximale par rapport à sa position ainsi que par rating.

En cliquant sur un marqueur sur la carte, un aperçu des informations du point de vente du producteur sélectionné s'affiche. Il est possible d'accéder au informations complètes du producteur en cliquant dessus. 

### Partie réseau social
Les utilisateurs connectés peuvent noter les producteurs et les suivre. Lorsqu'ils suivent un producteur, ils seront notifiés de toute les nouvelles actualités du producteur, soit lorsque le producteur publie un nouveau post ou lorsqu'il met à jour ses informations, celles de ses produits ou encore celles de son point de vente.
Les utilisateurs connectés peuvent afficher toutes leurs notifications sous la forme d'un "mur de notifications". S'ils cliquent sur l'une d'elles, ils seront renvoyé sur la page du producteur ayant produit la notification.

### Producteurs

Les producteurs peuvent gérer leur point de vente, leurs informations personnelles ainsi que leurs produits lorsqu'ils sont connectés. Ils peuvent aussi publier des actualités sur leur mur. 

## Démarrer l'application en local

### 1) Démarrer un replica set MongoDB en local

Utiliser la commande `run-rs`. Pour se faire, créez un dossier temporaire et lancez les commandes suivantes :

```sh
npm install run-rs
run-rs -v 4.0.0
```

### 2) Démarrer l'API

- Rendez-vous dans le dossier [API](./API/) 
- À partir du fichier [.env.default](./API/.env.default), créez un fichier *.env* et remplacez les valeurs des variables d'environnement par celles que vous souhaitez. Faîtes attention à bien entrer les informations pour vous connecter au replica set créé avec la commande `run-rs`à l'étape 1.
- Lancez un terminal et rendez-vous dans le dossier [API](./API/).
- Lancez la commande `npm install` pour télécharger et installer toutes les dépendances du projet.
- Lancez la commande `npm start` pour démarrer l'API.
- Vous pourrez accéder à l'API à l'adresse suivante : http://locahost:<port-choisi-dans-votre-fichier-.env>/graphql

### 3) Démarrer le frontend

- Rendez-vous dans le dossier [FrontEnd](./FrontEnd) 
- Lancez un terminal dans le dossier [FrontEnd](./FrontEnd)
- Lancez la commande `npm install` pour télécharger et installer toutes les dépendances du projet.
- Lancer la commande `npm start` pour démarrer le frontend.
- Vous pourrez accéder au frontend à l'addresse http://localhost:3000

## Problèmes rencontrés
### Connaissances
Le plus gros problème qu'on a rencontré est le fait d'avoir utilisé des technologies que nous ne connaissions et ne maitrisions pas!
Au fur et à mesure du semestre, nous découvrions des nouvelles technologies en MAC et en TWEB et au fur et à mesure de ces découvertes, nous nous rendions compte de nos erreurs. Nous avons perdu de nombreuses heures à refaire au propre certaines choses déjà faites car nous venions d'apprendre / comprendre comment les faire proprement!
Cela nous a permis d'apprendre énormément, mais cela nous a également fait perdre un temps considérable, comme par exemple tout le premier mois de cours où nous avons fait une API REST avant de passer à GraphQL...!

### Organisation
Au début du semestre, nous avons pris le risque de regrouper les projets de MAC, TWEB et de PDG en un seul énorme projet. Cela nous a permis de nous concentrer sur un projet qui nous portait à coeur en profitant de l'occasion pour voir gros!
Nous nous sommes dit dès le début du semestre que nous allions avoir de nombreuses heures de labos sur ce projet et l'avons donc dimensionné en conséquence. Sauf qu'au final, le temps de labo de MAC et TWEB dévolu à ce projet n'a pas du tout été aussi important que nous ne l'imaginions! Nous avons souffert la première partie du semestre avec un projet très conséquent à réaliser et, en plus, des laboratoires de MAC et de TWEB à côté! C'était dur et intense, mais nous avons survécus! :D
Nous avons vu gros et nous sommes posés un défi avec ce gros projet. Nous avons eu de la peine à tenir nos délais fixés pour ce projet en plus du travail requis pour tous les cours...

### API

Notre manque de connaissance nous a fait faire plusieurs mauvais choix tactique durant la conception de notre API. Le plus notable est le fait d'être parti sur une API REST avant de basculer sur une API GraphQL, mais il y en a eu d'autres. 

Par exemple, si nous devions recommencer un tel projet, nous commencerions par définir tous ensemble un schéma GraphQL aussi précis que possible afin d'éviter les nombreuses modifications que nous avons dû faire à l'API suite à des imcompréhensions entre le front et le back. 

Nous implémenterions également immédiatement et tout au long du projet la gestion de la pagination, ainsi que les tests d'intégration. En effet, nous avons dès le début implémenté des tests unitaires (pour les services) mais avons trop tardé à nous lancer dans les tests d'intégration, ce qui s'est révélé long et rébarbatif. De plus, ne pas avoir ces tests nous a obfusqué de nombreux bugs au niveau de GraphQL qui ne sont apparus que lorsque le front-developpeurs nous les ont signalés...!
Quant à la pagination, nous l'avons implémentée à la toute fin, ce qui nous a contraint à revoir et adapter tous nos tests...!
Pour terminer, nous implémenterions directement une base de données configurée en réplication set. En effet, nous avons franchi cette étape tardivement dans le déroulement du projet. Résultat, lorsque nous avons implémenté les fonctionnalités de l'API, nous n'avons pas pu utiliser les transcations (disponibles uniquement sur les replicaset) et lorsque nous sommes enfin passés sur un replicaset, nous étions débordés et n'avons finalement pas pu implémenter les transactions à temps...

### FrontEnd

Là encore, notre manque de connaissance nous a considérablement ralenti. Nous avons passé un temps non négligeable à apprendre le fonctionnement de React. Nous nous sommes lancés dans la conceptions sans vraiment maîtriser l'outil et avons plusieurs fois réalisé durant les cours de TWEB que nous n'avions pas fait les choses très proprement. Cela nous a souvent obligé de reprendre des choses terminées afin de les réaliser plus proprement et plus efficacement.

Le frontend récupère par défaut les données sur l'API qui est en production. Ce choix est dû à des problèmes matériels du côté d'un de nos développeur. Pour changer l'adresse sur laquelle récupérer les données, il faut modifier l'adresse dans le fichier [index.js](./FrontEnd/src/index.js)...

Nous n'avons pas totalement réussi à implémenter les notifications. En effet, lorsqu'un utilisateur se connecte, il reçoit bien les notifications reçues lors de son absence. En revanche, les notifications en direct ne fonctionnent pas tout à fait. En effet, elle ne sont pas reçues par l'utilisateur connecté malgré son inscription sur la subscription GraphQL. Nous pensons que cela est dû à la connexion sur le serveur webSocket mais n'avons pas eu le temps de résoudre le problème.

Dû à la complexité et au manque de temps, nous n'avons pas pu implémenter les modifications des produits d'un producteur. Les fonctions sont disponibles au niveau de l'API mais n'ont pas pu être implémentées à temps du côté du frontend... Cependant, il est tout de même possible d'ajouter des produits. Il est également possible de faire un CRUD complet sur les points de vente.

### Infrastructure
La grande difficulté de la mise en production sur Google Cloud fut l'apprentissage des différents outils proposés, notemment Kubernetes. L'apprentissage pour la mise en production de service et de deployment fut assez rapide mais la gestion des certificats pour l'HTTPS fut la première grosse étape compliquée. 

Nous avons choisi d'héberger l'ensemble de notre application sur Google Cloud. Ceci a engendré des diffucultés au niveau de l'hébergement de la base de donnée. L'implémentation d'un replica set sur Google Cloud est assez complexe et nécessite des connaissances en la matière, ce qui n'était de loin pas notre cas... Si c'était à refaire, nous choisirions une option plus facilement à mettre en place tel qu'un hébergement comme Mongo Atlas. Cela faciliterait la tâche au niveau du scaling et de la mise en place, mais engendrerait un coût un peu plus important...

## Conclusion

En conclusion, nous sommes vraiment fiers du travail que nous avons accompli durant ce semestre. Nous nous étions fixé un gros projet, ambitieux et complexe, mais estimons vraiment l'avoir mené à bon port! 

De plus, nous avons appris une quantité hallucinante de choses en une durée de temps très réduite! Ce fut une super expérience et nous serions tous prêts à recommencer! Nous souhaitons maintenant pouvoir trouver le temps de terminer ce projet et parvenir à réellement le rendre public.

## Remerciements
Un grand merci à Paul, Miguel et Olivier pour leur aide très précieuse! à tout heure du jour ou de la nuit, pendant les weekend et même pendant les vacances, ils ont été réactifs et nous ont donnés de nombreux coups de main afin de nous sortir d'impasses ou nous épargner de longues et pénibles heures de debugging obscure! Grâce à eux, on a appris énormément de choses et avons pu rendre un projet que nous estimons relativement bien abouti et dont nous sommes fiers! Merci!  :-* 