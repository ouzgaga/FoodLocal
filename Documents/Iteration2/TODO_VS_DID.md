Ce document indique ce qui a été fait en comparaison de ce qu'on avait planifié pour la deuxième itération.

Nous avons pas pu résoudre toutes les issues de cette itération. Les raisons principales sont:

- Le manque de temps => Nous n'avions pas les périodes de TWEB et de MAC pour avancer sur le projet.
- manque de conaissance => Nous attendions de voir certaines téchnologies pendant les cours (la connexion utilisateur ou graphql par exempl)
- La migration sur graphQL fût plus laborieuse que prévu.
- Nous avons du faire correspondre le projet avec le attentes des cours TWEB et MAC.
  - Ajout d'un mur et les producteurs peuvent faire des "posts".
  - Les utilisateurs peuvent "Suivre" des producteurs.
  - Ajout d'un rating pour les prducteurs.

|                                                              | Status | %    |
| ------------------------------------------------------------ | ------ | ---- |
| API - Passage à GraphQL                                      | Ok     |      |
| INFRA - Amélioration des CI / CA de gitlab                   | OK     |      |
| Donner un accès sécurié à la base de donnée depuis l'extérieur |        |      |
| HTTPS                                                        | OK     |      |
| Promouvoir l'application                                     | OK     |      |
| Faire des tests                                              | OK     |      |
| API - Recherche détaillée                                    |        |      |
| UI - Authentification                                        |        | 80%  |
| Carte - Recherche                                            |        |      |
| UI - Ajout d'un produit                                      |        |      |
| UI - Mofification d'un producteur                            |        | 60   |
| UI - Inscription d'un producteur                             |        | 90%  |
| Démarchage de client                                         | OK     |      |

### Status  %  API - Passage à GraphQL

### NFRA - Amélioration des CI / CA de gitlab

Reste à intégrer les tests dans la CI

### Donner un accès sécurié à la base de donnée depuis l'extérieur

### Promouvoir l'application:

La vidéo est en cour de réalisation. Je vois le réalisateur samedi prochain pour tourner des rush.
Nous avons trouvé quelques producteurs qui sont d'accord de tester l'application. Cepandant, nous ne voulions pas leur demander de la tester tant que l'inscription et l'ajout de point de vente n'étaient pas finis.

### HTTPS

HTTPS activé. On ne peux plus accéder au site en http.

### Faire des tests 

Nous avons créer une storybook pour nos composants et des tests Selenium.

### API - Recherche détaillée

### UI - Authentification

Les composants sont finis, il reste à faire

- connexion avec graphql
- Stoquer le token dans le local storage.

Nous avons attendu de voir ce sujet en cour de TWEB (ce qui devrait se passer prochainement)

### UI - Carte - Recherche



### UI - Ajout d'un produit

Nous avons décidé que les produits seront stoqué statiquement dans la base de donée. Le produits sont directement liés à un point de vente.
Il est possible d'ajouter un point de vente et les produits pour un producteur. Cepandant, nous n'avons pas de connexion utilisateur finalisée, donc nous n'avons pas pu tester cette fonctionalité correctement.

### UI - Inscription d'un producteur

Les composants sont créés mais il manque la liaison avec l'API

### UI - Mofification d'un producteur

Les composants sont en cour de création (80).

### Démarchage de client

Cf: Promouvoir l'application



