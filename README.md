# ECF2023_Fredj_Corentin

Ceci est le dépôt pour l'ECF Graduate Developper

# Présentation

Ceci est le rendu ECF pour évaluer les compétences.

___
# **Mettre en place le backoffice en local**

## PostgreSQL 

### **Il faut nécessairement PostgreSQL et NPM sur votre machine !**

### **Le projet a été codé dans un environnement LINUX !**

## Cloner le projet en SSH depuis git :

    git clone git@github.com:DroxKiwi/ECF2023_fredj_corentin.git

## Cloner depuis HTTPS : 

    https://github.com/DroxKiwi/ECF2023_fredj_corentin.git

## Cloner depuis GitHub CLI :

    gh repo clone DroxKiwi/ECF2023_fredj_corentin

## Télécharger les dépendances une fois le projet cloné :

    cd /chemin_du_projet/studiECF2023_Fredj_Corentin
    npm install

## Initialiser la base de données en éxecutant **/bin/init_database.sh** :

Le fichier bash ***/bin/init_database.sh*** permet d'initialiser la BDD en local, il est important de vérifier les informations données à PostgreSQL ***avant de lancer le script !*** Celles ci ne sont pas liées au fichier d'environnement et se trouve dans le script en question ! 

```js
(...)

// Verify information about database HERE !!!!
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'database_dev_studiecf',
    password: 'psqlpsw',
})


// Read the SQL file
(...)
```

Le fichier ***/bin/init_database.sh*** lancera à son tour le fichier de fixture : **./Models/init_models.js**

De même il faut vérifier les valeur données à postgreSQL pour que le script fonctionne ! 

```js
(...)

// Verify information about database HERE !!!!
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'database_dev_studiecf',
    password: 'psqlpsw',
})


function fixtureLoad(){
(...)

```

Une fois les informations postgreSQL vérifiées et correctes en fonction de votre installation, vous pouvez lancer le script d'initialisation de la BDD

    cd studiECF2023_Fredj_Corentin/bin
    ./init_database.sh

Le script bash va donc redémarrer postgres (**nécessite l'accord sudo**), créer la base de données ***database_dev_studiecf*** et appliquer les modèles et les fixtures dans la base de données.

Il existe 3 fichiers qui éxecute l'application :

- ### index.js
- ### secureSSL.js
- ### app.js

***index.js*** est appelé si l'on choisit de lancer l'application en environnement de développement.

***secureSSL.js*** est appelé si l'on choisit de lancer l'application en environnement de production, j'ai initialement codé ce script pour faire tourner l'application avec un serveur **Apache2** sur un droplet **DigitalOcean**.

***app.js*** a été créé pour que **fly.io** puisse connecter l'application à leur serveur en version de production. 

## Lancer l'application en local :

    cd ..
    npm run dev

## Vous connecter et essayer l'application :

A partir de là, l'application est lancée et vous pouvez vous connecter au compte admin injecter en BDD à l'adresse : http://localhost:3000/

identifiant : ***admin@admin.com***

mot de passe : ***admin***
