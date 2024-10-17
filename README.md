# Test technique myDiabby

## Introduction

Dans ce repo, tu trouveras une application Angular et une application NestJS.

Les deux applications sont configurées pour fonctionner avec Docker via le `docker-compose.yml` et le fichier `.env` à créer à partir du `.env.dist`.

Le but est d'évaluer globalement tes connaissances sur les deux frameworks.

## Instructions

À partir du code actuel, je souhaite que :

- L'application Angular ait deux nouvelles routes :
  - `/users` qui affiche la liste des utilisateurs récupérée depuis l'API NestJS, triée par ordre alphabétique. Cette route devra comporter un bouton "Ajouter un utilisateur" qui redirigera vers la seconde route.
  - `/users/add` qui affiche un formulaire permettant d'ajouter un utilisateur. Ce formulaire devra comporter les champs "Nom" et "Prénom".

- L'application NestJS soit adaptée en conséquence pour permettre l'ajout d'un utilisateur via une requête POST sur la route `/users`.

- Le résultat final ne doit pas permettre de créer un utilisateur avec les mêmes npm et prénom qu'un utilisateur déjà existant.

N'hésite pas à ajouter toute autre fonctionnalité que tu juges pertinente (tests, validation des formulaires, etc.).

## Propositions

Voici ma proposition pour ce test technique utilisant Angular et NestJS.

### Angular

Concernant la partie Angular, j'ai modifié les composants existants et ajouté des composants en fonction des besoins.

Mon idée de design était d'avoir une page divisée en deux parties :

  - À gauche, un contenu fixe, avec uniquement les boutons de redirection qui changent en fonction de la page actuelle.
  - À droite, le contenu spécifique à la page en cours.

#### Component app

  - J'ai d'abord déplacé le contenu du fichier app.component.html vers un fichier app.component.css pour séparer la présentation du style.
  - J'ai modifié le texte de la partie gauche pour correspondre à mes attentes.
  - J'ai ajouté le component app-navigation dans cette partie.
  - J'ai supprimé les boutons de lien vers les docs Angular qui étaient présents à droite.
  - J'ai déplacé le component router-outlet à droite, là où les boutons ont été supprimés.
  - Dans app.component, j'ai modifié le texte du titre pour l'adapter au contenu.
  - J'ai ajouté dans les imports de @Component un nouveau component appelé NavigationComponent.
  - J'ai configuré ViewEncapsulation sur None afin de permettre la récupération des styles CSS par les composants enfants.
  - Pour les tests, j'ai simplement vérifié que les modifications n'affectent pas les comportements attendus.

#### Component navigation 

J'ai créé un dossier navigation contenant un component NavigationComponent avec les fichiers nécessaires : navigation.component.css, navigation.component.html, navigation.component.spec.ts, et navigation.component.ts.
Le but de ce composant est d'afficher les boutons de navigation en fonction de la page actuelle.

  - Le template HTML est une div contenant des boutons qui réagissent différemment selon l'URL actuelle. Cela permet d'afficher ou cacher certains boutons selon les besoins.
  - Le CSS est simple et utilise des variables et règles CSS définies dans app.component.css grâce à ViewEncapsulation sur None.
  - Le composant a deux rôles principaux : initialiser la variable currentRoute en fonction de l'URL et permettre la navigation grâce à navigateTo() qui est appelée lors du click() sur un bouton. Il permet à chaque initilisation du composant, avec ngOnInit, de récupérer l'url de la route et avec CommonModule on utilise le ngIf dans le template ce qui permet d'afficher les boutons que l'on souhaite en fonction de la currentRoute
  Pour les tests, j'ai commencé par simuler un routeur, sur lequel j'ai ajouté un espion (spy) sur la fonction navigate. Ensuite, après avoir vérifié que le composant se crée bien et s'initialise correctement, je réalise des tests pour savoir quels boutons sont affichés en fonction de la route actuelle. Par exemple, pour l'accueil, '/', je suis censé avoir les boutons qui mènent à la "Liste des utilisateurs" et à l'option "Ajouter un utilisateur".
  Pour cela, je simule que je suis sur la page '/', puis je vérifie les éléments affichés par le composant sur cette route. Je m'assure qu'il y a bien deux boutons visibles et que ces boutons contiennent le texte attendu. Ensuite, comme j'ai simulé un clic sur chaque bouton, je vérifie que l'espion placé sur la fonction navigate contient bien deux éléments et que ces éléments correspondent aux routes souhaitées. Je répète ce processus pour les autres routes, en adaptant les éléments attendus pour chacune d'elles

#### Component social

J'ai créé un dossier social avec un component AppSocialComponent avec les fichiers nécéssaire : social.component.css, social.component.html, social.component.ts.
Le but de ce composant est d'afficher les boutons de lien supprimés de AppComponent sur la page d'accueil.

  - Le template HTML contient ces boutons.
  - Le CSS stylise les boutons en réutilisant les styles de AppComponent.
  - Le composant est minimal et sert uniquement à afficher le template pour l'instant. À terme, on pourrait ajouter des variables pour modifier les liens ou les textes des liens, au lieu de les initialiser directement dans le HTML.
  - Ce composant est affiché uniquement sur la route / grâce à app.routes.ts.

#### Component list of user

J'ai créé un dossier list contenant le component UserListComponent avec les fichiers nécéssaire : user-list.component.css, user-list.component.html, user-list.component.spec.ts, user-list.component.ts.
Le but de ce composant est de récupérer et afficher une liste d'utilisateurs en BDD, triée par ordre alphabétique.

  - Le template HTML utilise une liste ordonnée (ol) pour afficher les utilisateurs, avec pour chaque élément un li qui affiche le nom complet et un bouton de suppression avec un component user-suppr associé a cette utilisateur avec des paramètres.
  - Le CSS correspond aux besoins esthétiques.
  - Pour le composant, il y a plusieurs points à prendre en compte. Tout d'abord, j'initialise la liste des utilisateurs à vide, et je la type pour qu'elle soit une liste de User, User étant une interface créée dans le fichier user.interface.ts. Cette interface précise qu'un utilisateur est composé d'un id, d'un firstname, d'un lastname et d'un fullname (qui correspond à la concaténation du prénom et du nom).
  Ensuite, à chaque appel du UserListComponent, on charge les utilisateurs présents dans la base de données. Pour cela, on utilise une fonction du UserService, situé dans le fichier user.service.ts. Cette fonction, appelée getUsers, envoie une requête GET et retourne la réponse sous la forme d'un tableau de User[]. On en profite pour initialiser tous les champs de nos utilisateurs, en créant le fullname grâce à la concaténation du firstname et du lastname.
  Après avoir récupéré le résultat de ce service, on trie les utilisateurs par ordre alphabétique avant de les initialiser dans la liste users, qui sera utilisée par la suite pour afficher chaque utilisateur à l'aide d'un ngFor dans le template, après avoir importé le CommonModule.
  On créé aussi une foncton de refresh de la liste des utilisateurs, qui se contente de recharger la liste en rappelant la fonction loadUsers. Cela permet de mettre à jour la liste en cas de modification.
  - Comme pour la partie "social", grâce au routeur, nous affichons ce composant uniquement pour une certaine page, à savoir la page /users.
  - En ce qui concerne les tests de ce composant, nous utilisons un espion (spy) pour surveiller ce que retourne la fonction getUsers. Nous créons ensuite une fausse liste d'utilisateurs et configurons l'espion pour qu'il retourne cette fausse liste à chaque appel. Après avoir testé la création du composant, nous vérifions si celui-ci parvient à récupérer et trier la liste des utilisateurs. Pour cela, nous nous assurons qu'à l'initialisation, il récupère bien deux éléments et que le premier élément contient bien le prénom qui devrait apparaître en premier après le tri, c'est-à-dire "Caroline", puisque "Caroline" < "Christopher".
  Ensuite, nous vérifions que, après récupération et tri de la liste, elle est bien affichée dans le bon ordre. Pour cela, nous récupérons l'élément qui affiche les noms dans le DOM, et vérifions qu'il y a autant d'éléments que d'utilisateurs dans la liste, c'est-à-dire deux. Enfin, nous nous assurons que le premier élément contient bien le texte "Caroline" et le deuxième "Christopher".

#### Component Add an user

J'ai créé un dossier add avec un component UserAddComponent avec les fichiers nécéssaire : user-add.component.css, user-add.component.html, user-add.component.spec.ts, user-add.component.ts.
Le but de ce composant est d'ajouter un utilisateur à la BDD via un formulaire avec champs prénom et nom.

  - Le template HTML comporte deux champs de formulaire et un bouton de soumission, ainsi qu'un espace pour afficher les résultats de l'ajout.
  - Le CSS est conforme à l'esthétique générale.
  - Pour le component UserAdd, il devient peut-être un peu plus complexe, même s'il n'y a rien de trop difficile. Tout d'abord, nous initialisons et typons les variables nécessaires, principalement des variables de formulaire et des variables pour la réponse de la requête.
  Dans le constructeur, nous initialisons les champs des inputs pour qu'ils soient vides. Nous mettons également en place deux validateurs : le premier pour rendre les champs obligatoires, et le deuxième pour vérifier que les champs respectent un certain modèle grâce à une regex, permettant à l'utilisateur de saisir uniquement des caractères latins, des espaces ou des tirets (https://www.rexegg.com/regex-interesting-character-classes.php).
  Grâce à ces validateurs, on s'assure que l'utilisateur ne peut soumettre le formulaire que si les données respectent le format souhaité. Si des caractères interdits sont saisis, le bouton d'envoi est désactivé (disabled).
  Ensuite, nous avons une fonction onSubmit, qui est déclenchée lorsque l'utilisateur clique sur le bouton pour ajouter un utilisateur. Cette fonction vérifie d'abord si le formulaire est valide, bien que normalement un utilisateur ne puisse pas cliquer sur le bouton s'il est désactivé. Si le formulaire est valide, nous récupérons les champs firstName et lastName, puis envoyons ces données à une autre fonction du userService, appelée addUser. Cette fonction envoie une requête POST au serveur avec les informations du formulaire, récupère la réponse, et si tout se passe bien, crée un nouvel utilisateur côté client et l'ajoute à la liste des utilisateurs. Si l'opération est réussie, un message de confirmation est affiché.
  J'ai également ajouté deux champs d'affichage pour gérer les messages d'erreur. Pour l'instant, c'est purement visuel, et j'aurais pu simplement ajouter le message d'erreur dans le texte de retour.
  En ce qui concerne la gestion des erreurs, si un problème survient lors de l'ajout d'un utilisateur, nous vérifions quel type d'erreur est renvoyé par le serveur. J'ai prévu trois types d'erreurs : la première survient si l'utilisateur existe déjà dans la base de données, la deuxième si le serveur ne répond plus, et la troisième pour toute autre erreur imprévue. En cas d'erreur, un message adapté est affiché à l'utilisateur.
  À la fin de la soumission, nous réinitialisons les valeurs du formulaire à vide et remettons la variable de contrôle isSubmitting à false, permettant de soumettre à nouveau le formulaire. Cela évite le spam ou la duplication en cas de lenteur du serveur, car nous attendons la réponse du serveur avant de permettre un nouvel envoi.
  - Concernant les tests, comme pour UserList, nous utilisons un espion sur le service utilisé, ici addUser, ce qui nous permet de vérifier ce qu'il retourne et de faire les vérifications nécessaires. Ensuite, comme précédemment, nous créons nos éléments, vérifions que le composant est bien créé, et que le formulaire contient les champs que nous souhaitons récupérer. Nous vérifions également que le formulaire est bien invalide lors de son initialisation (quand il est vide).
  Ensuite, nous passons aux vrais tests, en commençant par vérifier si un utilisateur est bien ajouté lorsqu'un formulaire valide est soumis et que le message affiché est correct. Pour cela, nous créons un utilisateur correspondant à ce que nous attendons du service, puis nous envoyons son nom et prénom dans le formulaire. Nous vérifions ensuite que, lors de la soumission, la fonction est bien appelée avec les bonnes valeurs et que le message affiché est correct. Nous faisons de même pour les erreurs possibles, telles que les erreurs 409 et 500.
  Enfin, le dernier test consiste à vérifier qu'après la soumission et l'ajout réussi d'un utilisateur, le formulaire est bien réinitialisé.

#### Component delete an user


J'ai créé un dossier suppr avec un component UserSupprComponent avec les fichiers nécéssaire : user-suppr.component.css, user-suppr.component.html, user-suppr.component.spec.ts, user-suppr.component.ts.
Le but de ce composant est de supprimer un utilisateur de la liste des utilisateurs. Ce composant n'était pas demandé dans le test, mais je souhaitais l'ajouter car je pense qu'il est important. De plus, cela me permettait de revoir tout ce que j'avais appris avec la création des autres composants.

  - Le template HTML est composé d'un bouton avec une icône SVG et une modal de confirmation de suppression.
  - Le CSS gère l'affichage de la modal.
  - Pour le component UserSupprComponent, on peut voir qu'il est composé d'un @Input et d'un @Output. Comme je l'ai mentionné, lorsqu'on fait appel à ce composant, on lui passe des paramètres, et ces paramètres sont récupérés via l'@Input. Concernant l'@Output, on peut aussi voir que lors de l'appel à user-suppr, il y avait un paramètre UserDeleted qui déclenchait la fonction permettant de rafraîchir la liste. C'est précisément l'@Output de UserSupprComponent, car lorsque l'utilisateur est supprimé, un événement est émis, ce qui lance la fonction de rafraîchissement présente dans UserListComponent.
  Sinon, le reste est assez simple. Nous avons des fonctions pour ouvrir et fermer la modal, ainsi qu'une fonction deleteUser, qui est déclenchée lors de la confirmation de suppression. Cette fonction fait appel au dernier service du userService, SupprUser. Ce service prend en paramètre une chaîne de caractères (le userId de l'utilisateur à supprimer) et envoie une requête POST pour récupérer une nouvelle liste d'utilisateurs. Si la réponse est correcte, c'est-à-dire une liste actualisée des utilisateurs, alors nous mettons à jour la liste et émettons l'événement qui rafraîchit l'affichage. Sinon, une erreur est affichée dans la console.
  - Pour les tests, de la même manière que précédemment, nous espionnons le UserService, vérifions que le composant se crée correctement, que l'ouverture et la fermeture de la modal fonctionnent bien, et que la suppression d'un utilisateur dans une liste fonctionne. Pour cela, nous prenons une liste initiale, créons la liste attendue après la suppression de l'utilisateur, lançons l'appel de la fonction deleteUser sur le composant testé (avec une valeur pour userId initialisée plus haut), et vérifions que l'appel à SupprUser a été effectué avec le bon paramètre. Ensuite, nous nous assurons que la nouvelle liste correspond bien à celle attendue et qu'elle ne contient plus l'utilisateur supprimé.
  Ensuite, nous faisons la même chose, mais en vérifiant que, après avoir récupéré la nouvelle liste d'utilisateurs sans l'utilisateur initial, l'événement de rafraîchissement est bien déclenché et que la modal est fermée.
  Enfin, le dernier test vérifie que, si le serveur renvoie une erreur au lieu de la réponse attendue, le message d'erreur s'affiche correctement dans la console avec console.error.


### NestJS

Pour ce qui est de NestJS j'ai simplement rajouter des use-cases pour les nouvelles requête envoyer par Angular.

#### Module

Le fichier user.module.ts nous donne le module NestJs qui permet la gestion des utilisateur nommé UserModule.

Avec ce module on sait qu'il utilise UserController en tant que controller pour les requêtes HTTP.
Il nous donne également la liste des services disponible avec providers. Pour cela il nous dit qu'il faut utiliser la class UserAdapter en tant que UserService.
Et il nous dit qu'il y a 3 use-cases disponibles : GetAllUsers, AddUser et SupprUser

#### Controller

Dans le fichier user.controller.ts j'ai 3 fonctions qui gère les 3 types de requète qui peuvent être envoyer par Angular avec user.service.ts

  - Une requête Get sur '/users' : qui fait appel a la fonction getAllUsers() qui exécute la fonction du fichier getAllUsers.ts et qui retoune une liste de User

  - Une requête Post sur '/suppruser' qui fait appel a la fonction SupprUser() qui exécute la fonction du fichier SupprUser.ts avec comme argument les paramêtre de la requête et qui retoune une liste de User

  - Une requête Post sur sur '/users' qui fait appel a la fonction addUser() qui exécute la fonction du fichier addUser.ts avec comme argument les paramêtre de la requête et qui retoune un User

#### Use-cases

##### getAllUsers

  - getAllUsers récupère juste les UserService et fait en sort que pour la fonction execute on lance la fonction getUsers de UserService

##### SupprUser

  - SupprUser récupère juste les UserService et fait en sort que pour la fonction execute on lance la fonction SupprUsers de UserService avec pour paramêtre un id d'un utilisateur

##### AddUser

  - AddUser récupère juste les UserService.
  Ensuite quand on lance la fonction execute dans un premier temps on récupère la liste de tous les utilisateurs grâce a la fonction de userService getUsers, qu'on utilise également dans getAllUsers.ts.
  Ensuite on formatte les valeurs passé en argument dans la requête Post, pour cela on utilise un fonction présente dans la class qui supprime les espaces au début et à la fin des valeurs, ainsi que toute les espaces en trop au milieu.
  On enregistre ces valeurs pour plus tard.
  On refait pareil mais en utilisant une autre fonction présente dans la class, qui en plus transforme la chaîme en minuscule.
  Avec ces valeurs on vérifie si il n'éxiste pas dans la liste des utilisateurs en BDD un utilisateur avec le même prénom et même nom un fois transformé en minuscule.
  Si il existe on retourne une erreur avec un status 409 (CONFLICT), c'est cette valeur qu'on récupère avec Angular lors de duplication d'un utilisateur
  Sinon, on récupère l'id maximal présent dans la liste des utilisateurs, on ajoute 1 a cette valeuret on se retrouve avec un id dont on est certains qu'il sera unique
  On créer un utilisateur avec la classe User avec en paramètre l'id, le nom et le prénom
  Ensuite on essaye d'utiliser le service AddUser avec ce nouvelle utilisateur, si cela fonction on retourne le nouvelle utilisateur
  Sinon on envoie une erreur 500 pour dire qu'il y a eu une erreur lors de l'ajout de l'utilisateur.

#### UserService - UserAdapter

UserService est un interface qui nous permet d'être sur de créer des class enfant avec toutes les caractéristique nécessaire.

UserAdapter est une extension de UserService et donc toute les fonctions associé.
Il implémente un Repository, ce qui correspond a notre BDD ORM.

  - Avec addUser on créer un élément avant de le sauvegarder dans le repository
  - Avec getUser on recherche tous les éléments présent dans le repository
  - Avec SupprUser on supprime un utilisateur avec son id avant de retouner la nouvelle liste.

### Autres

Concernant les tests, je n'ai pas réalisé de tests pour NestJS, et pour Angular, j'ai utilisé Karma, comme pour les tests déjà présents dans app.component.spec.ts.