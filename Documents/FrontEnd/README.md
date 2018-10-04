# FoodLocal: Front end

Cette branche comporte la réalisation et le code du front end de l'application.

## Librairie: React-JS

Nous utilisons React-JS car:

- **Cela concorde avec les objectifs du cour TWEB.**
- On peut faire une "SinglePage APP".
- Nous voulons découvire cette technologie.
- https://medium.com/javascript-scene/top-javascript-libraries-tech-to-learn-in-2018-c38028e028e6

## FrameWork

### Material UI

C'est un librairie graphique qui dévelopée par *Google* basé sur *Material Design*. Elle est spécialement desygnée pour fonctioner avec *React*.Elle met à disposition tout un panel de composant graphiques qui sont **tous modifiables**. Ils sont aussi basé sur un designe Android.
Elle est sous la **MIT License** ce qui donne des droits de modification, comercialisation, distributions (https://github.com/mui-org/material-ui/blob/master/LICENSE/). 

C'est aussi un des framework les plus utilisé et conseillées.

## GuidLine

Nnous utilisons la guidLine de *AireBnB* avec l'outil **ESLint** car nous utilisons la même en TWEB et que c'est une des plus uilisées.

## Squelette

Nous utilisons le squelette **create-react-app**. 
Nous l'avons choisit car:

- Il est conseillé par OpenClassrooms (https://openclassrooms.com/fr/courses/4664381-realisez-une-application-web-avec-react-js/4664801-demarrez-facilement-avec-create-react-app)
- Il est approuvé par M.Miguel Santamaria.
- Il est conseillé pour débuter avec React.
- Il est bien pour faire une *SinglePage App*.
- Nous le considérons come "safe" et "stable" car il est mis à disposition par *Facebook*.

## Carte

Nous utilisons l'**API  googleMap** de *google*. Nous avons fait ce choix suivant les critères suivants:

- Elle est érgonomique est facile à comprendre/utiliser.
- Nous supposons que les uilisateurs sont déjà familier avec l'interface, donc ça facilitera l'utilisation de notre application.
- Nous utilisons trouvons logique de continuer sur des composants *google* (avec *Material UI*).
- Nous utilisons googleCloud qui nous met à disposition un crédit mensuel d'au moins 200.-, avec les-quelles on peut payer (si besoin, en fonction de la game tarifaire) l'utilisation de l'API googleMap

## Mobile

Nous pensons utiliser ReactNativ pour faire l'application mobile. Cela nous permettera de réutiliser certains composants de l'application web.