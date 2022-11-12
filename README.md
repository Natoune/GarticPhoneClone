# GarticPhoneClone
Un clone amélioré de Gartic Phone utilisant React et Socket.IO

+ [Application React](#application-react)
    + [Avant de commencer](#avant-de-commencer)
    + [.env](#env)
    + [Page d'administration](#page-dadministration)
    + [Scripts](#scripts)
        + [npm start](#npm-start)
        + [npm test](#npm-test)
        + [npm run build](#npm-run-build)
        + [Plus d'informations](#plus-dinformations)
+ [Serveur SOCKET.IO](#serveur-socketio)
    + [Avant de commencer](#avant-de-commencer-1)
    + [.env](#env-1)
     + [Scripts](#scripts)
        + [npm start](#npm-start-1)
        + [npm run build](#npm-run-build-1)

# Application React

## Avant de commencer

Exécutez la commande `npm install` à la racine du projet pour installer toutes les dépendances de l'application React.

## .env

Créez un fichier .env à la racine du projet:

```.env
REACT_APP_SOCKETIO_TIMEOUT=5000
REACT_APP_SOCKETIO_SERVER=http://127.0.0.1:3001/
```

`REACT_APP_SOCKETIO_TIMEOUT`: Délai de réponse maximum pour les requêtes aux serveurs\
`REACT_APP_SOCKETIO_SERVER`: URL du serveur SOCKET.IO

## Page d'administration

Pour vous rendre sur la page d'administration, rentrez l'url http://localhost:3000/admin/USER/PASSWORD avec les identifiants définis dans le [.env du serveur](#env-1).

## Scripts

#### `npm start`

Exécute l'application en mode développement.\
Ouvrez [http://localhost:3000](http://localhost:3000) pour l'afficher dans votre navigateur.

La page se rechargera lorsque vous apporterez des modifications.\
Vous pouvez également voir les erreurs dans la console.

#### `npm test`

Lance les tests en watch mode.\
Voir la section sur [l'exécution de tests](https://facebook.github.io/create-react-app/docs/running-tests) de la documentation de Create React App pour plus d'informations.

#### `npm run build`

Génère l'application en mode production dans le dossier `build`.\
Il regroupe correctement React en mode production et optimise la construction pour les meilleures performances.

La construction est minifiée et les noms de fichiers incluent les hashs.\
Votre application est prête à être déployée !

Voir la section sur le [déploiement](https://facebook.github.io/create-react-app/docs/deployment) de la documentation de Create React App pour plus d'informations.

### Plus d'informations

Pour en savoir plus, consultez la [documentation de Create React App](https://facebook.github.io/create-react-app/docs/getting-started).

Pour apprendre React, consultez la [documentation React](https://reactjs.org/).

# Serveur SOCKET.IO

Le serveur Socekt.IO se trouve dans le dossier [/server/](/server/)

## Avant de commencer

Exécutez la commande `npm install` dans le dossier `server` pour installer toutes les dépendances.

## .env

Créez un fichier .env dans le dossier server:

```.env
PORT=3001
ADMIN_USER=b026aba01a531ec3d8f71b65c2972bf5
ADMIN_PASSWORD=bd8ff1083de9bcfcd7b599d0f774211a
```

`PORT`: Port d'exécution du serveur (Ne pas oublier de modifier le port sur le [.env de l'application React](#env))\
`ADMIN_USER`: Le nom d'utilisateur de connexion à l'espace admin hashé en md5\
`ADMIN_PASSWORD`: Le mot de passe de connexion à l'espace admin hashé en md5

**Note:** Vous pouvez utiliser [cet outil](https://emn178.github.io/online-tools/md5) pour hasher le nom d'utilisateur et le mot de passe.

#### `npm start`

Lance l'application en mode développement\
[Nodemon](https://nodemon.io/) redémarre le serveur automatiquement à chaque modification de code.

#### `npm run build`

Build par défaut de typescript