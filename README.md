# RecettesAI - Système de génération de recettes personnalisées

## Description du projet

RecettesAI est une application web permettant de générer et gérer des recettes de cuisine personnalisées avec analyse nutritionnelle. L'application utilise l'intelligence artificielle pour créer des recettes adaptées aux préférences des utilisateurs et calculer automatiquement les valeurs nutritionnelles.

## Fonctionnalités

- **Visualisation des recettes** : Parcourir la liste des recettes précédemment créées
- **Détail des recettes** : Consulter les instructions, ingrédients et analyses nutritionnelles (calories, protéines, glucides, lipides, vitamines, minéraux)
- **Recherche avancée** : Filtrer les recettes par nom, ingrédient ou type de plat
- **Tri personnalisé** : Organiser les résultats par date, calories ou temps de préparation
- **Génération de recettes** : Créer de nouvelles recettes en spécifiant :
  - Les ingrédients souhaités
  - Le nombre de personnes
  - Les intolérances alimentaires à prendre en compte

## Technologies utilisées

- **Frontend** : Next.js, React
- **Base de données** : Airtable
- **IA** : OpenAI pour la génération de recettes et l'analyse nutritionnelle

## Installation et démarrage

1. Cloner le dépôt

```bash
git clone https://github.com/votre-compte/RecettesAI.git
cd RecettesAI
```

2. Installer les dépendances

```bash
npm install
```

3. Configurer les variables d'environnement
   Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
AIRTABLE_API_KEY=votre_clé_api_airtable
AIRTABLE_BASE_ID=votre_base_id
OPENAI_API_KEY=votre_clé_api_openai
```

4. Lancer l'application en mode développement

```bash
npm run dev
```

5. Accéder à l'application
   Ouvrez votre navigateur à l'adresse [http://localhost:3000](http://localhost:3000)

## Structure de la base de données Airtable

L'application utilise les tables suivantes :

- **Recettes** : Stockage des recettes générées
- **Ingrédients** : Liste des ingrédients disponibles avec leurs valeurs nutritionnelles
- **Types de plats** : Catégories de recettes (Entrée, Plat principal, Dessert, etc.)
- **Intolérances** : Liste des allergènes et intolérances alimentaires

## Collaborateurs

- Mohammad GONS SAIB
- Gokhan KABAR
- Ali KHELIFA
