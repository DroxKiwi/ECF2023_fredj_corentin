# studiECF2023_Fredj_Corentin

Ceci est le dépôt pour l'ECF Graduate Developper

# Présentation 

Ceci est le rendu ECF pour évaluer les compétences.

## ***Je vous demande s'il vous plaît d'être indulgent ! Veuillez m'excusez par avance .. seulement j'ai codé une application entière (après avoir posé des questions sur le forum de STUDI), et 72H avant la date limite de rendu j'ai remqarqué qu'il y avait un annexe avec des consignes précises.. Je ne suis visiblement pas le pinguin le plus glissant de la banquise ..***
___
## Voici le git de mon projet que j'ai codé si vous souhaitez vérifier : https://github.com/DroxKiwi/webappBeWave

## J'ai tout de même décidé de faire l'ECF en suivant les consignes (72h c'est court pour rattraper la boulette) ceci explique le manque de commit pour le début de ce projet, ayant utilisé une partie du projet précedent pour monter celui ci.
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

Le fichier bash ***/bin/init_database.sh*** permet d'initialiser la BDD en local, il est important de vérifier les informations PostgreSQL avant de lancer le script ! Celles ci ne sont pas liées au fichier d'environnement ! Le fichier ***/bin/init_database.sh*** lancera à sont tour le fichier de fixture : **./Models/init_models.js**

Une fois les informations postgreSQL vérifiées et correctes dans les scripts vous pouvez lancer le script d'initialisation de la BDD

    cd studiECF2023_Fredj_Corentin/bin
    ./init_database.sh

Le script bash va donc redémarrer postgres (**nécessite l'accord sudo**), créer la base de données ***database_dev_studiecf*** et appliquer les modèles et les fixtures dans la base de données. Si la variable d'environnement du fichier .env.dev NODE_ENV est fixée sur "test" alors le script ne fonctionnera pas (par défaut NODE_ENV=dev) !

## Lancer l'application en local :

    cd ..
    npm run dev

## Vous connecter et essayer l'application :

A partir de là, l'application est lancée et vous pouvez vous connecter au compte admin injecter en BDD, en utilisant l'adresse : http://localhost:3000/

identifiant : ***admin@admin.com***

mot de passe : ***admin***
