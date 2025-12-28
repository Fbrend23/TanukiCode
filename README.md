# TanukiCode

TanukiCode est une application web interactive pour l'apprentissage du japonais, se concentrant sur les bases essentielles : Hiragana, Katakana, vocabulaire et Kanjis (Niveau N5).

## Fonctionnalités

### 1. Apprentissage des Kanas

- Tableaux complets des Hiragana et Katakana.
- Visualisation claire pour l'apprentissage par cœur.

### 2. Mode Étude

- Cartes de vocabulaire interactives.
- Apprentissage de mots et phrases courants.

### 3. Quiz

- Test de connaissances pour valider les acquis.
- Questions à choix multiples sur les leçons précédentes.

### 4. Kanjis (Nouveau)

- Module dédié aux Kanjis de niveau JLPT N5.
- Grille de recherche et de visualisation.
- Détails complets pour chaque Kanji : nombre de traits, lectures Onyomi (Chinoise) et Kunyomi (Japonaise).
- Traductions et significations en français.

## Stack Technique

- **Framework** : Vue 3
- **Langage** : TypeScript
- **Build Tool** : Vite
- **Styles** : TailwindCSS (via @import et @theme)
- **Backend/Auth** : Supabase
- **Icônes** : Lucide Vue Next

## Installation et Configuration

### Pré-requis

- Node.js (version LTS recommandée)
- npm

### Installation des dépendances

```bash
npm install
```

### Configuration de l'environnement

Créez un fichier `.env` à la racine du projet et ajoutez vos clés Supabase :

```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_KEY=votre_cle_anon_publique
```

### Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`.

### Construction pour la production

```bash
npm run build
```

Les fichiers générés se trouveront dans le dossier `dist`.

## Conventions de Code

- **Kanjis** : Les données se trouvent dans `src/data/kanji.ts`.
- **Composants** : Les composants réutilisables sont dans `src/components`, les pages principales dans `src/views`.
- **Styles** : Les styles globaux et le thème sont définis dans `src/assets/main.css`.
