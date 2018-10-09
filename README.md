# FoodLocal

## Objectifs premier Spint

### Objectifs:

- Avoir créé les mockups de chaque page du site
- Avoir appris ReactJS (Antoine et Jérémie) et Express (Benoît et James)
- Maitriser GitLab et ses pipeline (tout le monde!)
- Modéliser la BDD (Benoît et James)
- Modéliser l'API (Benoît et James)
- Mettre en place la structure des dossiers du projet front-end et du dossier back-end
- Mettre en place l'infrastructure nécessaire au fonctionnement du use-case.
  - Trouver un hébergement satisfaisant nos besoins
  - Obtentir un nom de domaine
  - Configurer le déploiement automatique
  - Mettre la démo 1 en production
- Avoir un site accessible en ligne proposant les fonctionnalités décrites dans le use-case



### Use-case que nous souhaitons obtenir pour la démo 1 :

Pour la démo 1, on souhaite avoir un site internet accessible en ligne et proposant les fonctionnalités suivantes:

Une page contenant une carte avec des pins indiquant la position de quelques producteurs sera disponible pour l'utilisateur. Il aura la possibilité de cliquer sur les pins afin d'afficher une info-bulle avec les détails principaux du producteur sélectionné. Dans ses informations se trouvera un lien renvoyant vers la page de détails du producteur sélectionné.

Une autre page affichera la liste de tous les producteurs enregistrés sur notre site. L'utilisateur pourra en sélectionner un pour afficher ses détails (être renvoyé vers la page de détails du producteur sélectionné).

Chaque producteur possèdera une page affichant l'ensemble de ses informations (nom, lieu, adresse, ...) ainsi que la liste des produits qu'il propose. Cette page sera accessible via le lien de l'info-bulle dans la carte, ou via la liste des producteurs.

Une page affichera des informations à propos de notre projet et des fonctionnalités que nous souhaitons offrir à terme.



### Tâches prévues et répartition des tâches :

Nous avons décidé de nous répartir en 2 équipes de 2. Antoine et Jérémie seront chargés du front-end tandis que James et Benoît se chargeront du back-end.



James et Benoît :

- Apprentissage d'Express
- Recherche et renseignement concernant les infrastructures, les possibilités offertes etc, et définition de l'architecture de l'infrastructure selon nos besoins
- Mises en place de l'infrastructure (choix de l'hébergement, mise en place d'un site internet basique mais fonctionnel, ....)
- Modélisation de la base de données
- Modélisation de l'API REST
- Création du projet back-end et définition de son architecture globale
- Création d'une API permettant de faire tourner les fonctionnalités principales du front-end (retourne du JSON codé en dur).



Antoine et Jérémie:

- Apprentissage de ReactJS
- Création des mockups de chaque page du site
- Création du projet front-end et définition de son architecture globale
- Création des pages principales du site web selon les mockup choisis et validés par le groupe:
  - Acceuil
  - Infos projet, présente notre projet et ses évolutions prévues
  - Carte avec pin des producteurs permettant d'afficher leurs infos essentielles dans une bulle et renvoyant sur leur page de description pour plus d'infos
  - Liste de tous les producteurs inscrits sur le site, avec leurs infos essentielles. Cliquer sur un producteur renvoie sur sa page de détails.
  - Détails producteurs affiche les informations détailées du producteur ainsi que la liste des produits qu'il propose.