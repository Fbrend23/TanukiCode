export interface ChangelogEntry {
  version: string
  date: string
  sections: {
    title: string
    items: string[]
  }[]
}

export const changelog: ChangelogEntry[] = [
  {
    version: '0.12.0',
    date: '2026-01-04',
    sections: [
      {
        title: 'Apprentissage & Flashcards',
        items: [
          'MODE KANJI : Révisez maintenant vos Kanjis avec le nouveau mode Flashcards.',
          'MAÎTRISE : Visualisez votre progression N5 directement dans la grille des Kanjis et les tableaux de Kanas.',
          'FILTRES : Nouveau mode "Cacher les maîtrisés" disponible dans les Flashcards et les Kanjis.',
          'BUG FIX : Les scores et séries du Quiz sont désormais sauvegardés instantanément pour éviter les pertes de données.',
        ],
      },
      {
        title: 'Interface & Expérience',
        items: [
          'HARMONISATION : Les titres et la navigation sont désormais parfaitement centrés et cohérents sur toutes les pages.',
          "NAVIGATION : L'onglet actif dans la barre de menu est maintenant mis en évidence par une couleur brune.",
          'MULTI-SÉLECTION : Choisissez plusieurs catégories de filtres simultanément.',
          "MOBILE : Optimisation de l'affichage des catégories sur petit écran.",
          "FOOTER : Ajout d'espace supplémentaire pour une navigation plus aérée.",
        ],
      },
      {
        title: 'Style & Design',
        items: [
          'THEME TANUKI : Extension du pack de style "Brun/Vert" aux barres de progression, séparateurs et volets de filtres.',
          'BARRE DE SCORE : Nouveau design compact du score dans le Quiz avec bordure et séparateur colorés.',
        ],
      },
    ],
  },
  {
    version: '0.11.0',
    date: '2026-01-02',
    sections: [
      {
        title: 'Profil & Personnalisation',
        items: [
          'AVATARS : 12 nouveaux Tanukis exclusifs (Ninja, Samouraï...) et **9 Avatars Pays** (France, Japon, USA, Corée...).',
          'STYLE : Choisissez votre avatar et votre couleur de fond indépendamment.',
          "NAVBAR : Votre avatar s'affiche désormais dans la barre de navigation.",
        ],
      },
      {
        title: 'Expérience Mobile & Tablette',
        items: [
          'ÉDITEUR : Interface repensée pour le tactile (boutons larges, grille adaptée).',
          "NOTIFICATIONS : Nouvelles alertes fluides qui descendent du haut de l'écran.",
          'TABLETTE : Adaptation du layout pour les iPad et autres tablettes (md -> lg).',
        ],
      },
      {
        title: 'Sécurité',
        items: [
          'ACCÈS : Protection des routes `/profile` et `/update-password` (redirection automatique pour les invités).',
        ],
      },
    ],
  },
  {
    version: '0.10.0',
    date: '2026-01-01',
    sections: [
      {
        title: 'Interface & Navigation',
        items: [
          'ACCUEIL : Ajout d\'une tuile dédiée "Vocabulaire" pour un accès rapide au dictionnaire.',
          'CLARTÉ : Renommage du mode "Étude" en "Flashcards" pour éviter la confusion.',
          'LAYOUT : Réorganisation du tableau de bord en grille sur 2 colonnes.',
        ],
      },
      {
        title: 'Contenu & Fonctionnalités',
        items: [
          'VOCABULAIRE : Explorez des centaines de mots avec prononciation audio native.',
          'KANJIS : Ajout de 50 nouveaux Kanjis (N5) et nouvelle navigation par onglets.',
          'MAÎTRISE : Cochez les mots et kanjis appris pour suivre votre progression.',
        ],
      },
      {
        title: 'Expérience Utilisateur',
        items: [
          'NAVIGATION : Nouvelle barre de navigation avec séparateurs visuels clairs.',
          'MOBILE : Menu optimisé (scrollable) et séparateurs plus visibles.',
          'CONFORT : Retour automatique en haut de page à chaque changement de menu.',
          'UNIFORMISATION : Le système de "Coche Verte" est maintenant identique partout (Kanas, Kanjis, Grammaire).',
          'ACCUEIL : Ajout d\'une bannière "Login" incitative pour les visiteurs.',
          'DESIGN : Filigranes thématiques ajoutés sur toutes les tuiles du dashboard.',
          'ACCÈS : Restriction des indicateurs de progression aux utilisateurs connectés.',
          'MASCOTTE : Tanuki Étudiant vous invite à vous connecter !',
        ],
      },
      {
        title: 'Correctifs',
        items: ["MOBILE : Les catégories de grammaire s'affichent désormais sur plusieurs lignes."],
      },
    ],
  },
  {
    version: '0.9.1',
    date: '2026-01-01',
    sections: [
      {
        title: 'Correctifs UI',
        items: [
          "TABLEAUX : Correction de l'alignement du tableau des Yoon sur mobile et desktop.",
          'TABLEAUX : Uniformisation de la largeur des tableaux et réduction des espaces vides.',
          'MOBILE : Rétablissement de la grille à 5 colonnes pour les Kanas de base.',
        ],
      },
    ],
  },
  {
    version: '0.9.0',
    date: '2025-12-31',
    sections: [
      {
        title: 'Quiz & Apprentissage',
        items: [
          'EXPANSION : Intégration complète des Kanjis et de la Grammaire dans le Quiz.',
          'FILTRES : Nouveau système de sélection de catégories (Kanas, Kanjis, Grammaire, Vocabulaire).',
          'MAÎTRISE : Suivi de progression individuelle pour chaque caractère et leçon.',
        ],
      },
      {
        title: 'Interface Premium',
        items: [
          'DASHBOARD : Refonte avec barres de progression stylisées et badges de réussite.',
          'BADGES : Les Kanas, Kanjis et Leçons maîtrisés affichent désormais une coche verte.',
          'HEADER : Nouveau design avec mascotte intégrée pour un look plus moderne.',
        ],
      },
      {
        title: 'Synchronisation Cloud',
        items: [
          'PROGRÈS : Vos maîtrises sont désormais sauvegardées et synchronisées via Supabase.',
          'FIABILITÉ : Système de persistance hybride (Local + Cloud).',
        ],
      },
    ],
  },
  {
    version: '0.8.0',
    date: '2025-12-30',
    sections: [
      {
        title: 'Module Grammaire',
        items: [
          "LEÇONS N5 : Nouveau module d'apprentissage avec recherche et filtres par catégorie.",
          'DESIGN : Interface épurée et standardisée pour une lecture plus agréable.',
          'AUDIO : Exemples audios haute qualité générés pour chaque leçon.',
        ],
      },
      {
        title: 'Migration Cloud & Audio',
        items: [
          'SUPABASE : Hébergement des audios (Kana, Grammaire, Kanji) sur le cloud pour plus de rapidité.',
          'ROBUSTESSE : Nouveau système hybride (Stockage > Cloud TTS > Voix Native).',
          'FIX : Correction des noms de fichiers Kanji (Hex-encoding).',
        ],
      },
      {
        title: 'Polissage & UX',
        items: [
          'ANIMATIONS : Stabilisation des boutons 3D (le footer ne saute plus au clic).',
          'MOBILE : Ajustement des marges en mode étude pour un meilleur confort.',
        ],
      },
    ],
  },
  {
    version: '0.7.0',
    date: '2025-12-29',
    sections: [
      {
        title: 'Contenu & Apprentissage',
        items: [
          'KANA COMPLET : Ajout des Dakuten (ga, za...), Handakuten (pa...) et Yoon (kya, shu...).',
          'VOCABULAIRE : +30 nouveaux mots ! (Nature, Famille, Animaux, Nourriture)',
          'TABLEAUX : Nouvelle navigation par onglets (Base, Dérivés, Combos) pour tout explorer.',
          'FLASHCARDS : Cartes plus grandes et format "Cinéma" sur ordinateur pour une meilleure lisibilité.',
        ],
      },
      {
        title: 'Interface',
        items: [
          'TABLEAUX : Mise en page responsive optimisée (Cartes plus grosses sur mobile).',
          'LISIBILITÉ : Police dynamique agrandie pour les Kana et Romaji.',
        ],
      },
    ],
  },
  {
    version: '0.6.1',
    date: '2025-12-29',
    sections: [
      {
        title: 'Ajustements',
        items: [
          'QUIZ : La série (Combo) est synchronisée avec votre compte sur tous vos appareils (Cloud).',
          'QUIZ : Suppression du bouton Audio (TTS) pour se concentrer sur la lecture.',
          'QUIZ : Stabilisation de la largeur des cartes (plus de sauts de mise en page).',
          'ANIMATION : Correction du glitch visuel lors du changement de taille de texte.',
        ],
      },
    ],
  },
  {
    version: '0.6.0',
    date: '2025-12-29',
    sections: [
      {
        title: 'Nouveautés Mobile & UX',
        items: [
          'EXPÉRIENCE MOBILE : Refonte complète pour une meilleure fluidité tactile.',
          'QUIZ : Nouvelle grille 2x2 pour les réponses, cartes stabilisées et texte adaptatif.',
          'KANJIS : Les cartes s\'adaptent désormais à toute la largeur sur mobile. Recherche francisée ("Soleil").',
          'CONNEXION : Interface allégée et ajout de la mascotte Tanuki.',
          'MENU : Nouvelle animation "rideau" pour le menu mobile.',
        ],
      },
      {
        title: 'Correctifs',
        items: [
          'Alignement parfait des titres sur toutes les pages (Flashcards, Quiz, Tableaux).',
          'Alignement parfait des titres sur toutes les pages (Flashcards, Quiz, Tableaux).',
          'Harmonisation des bordures et des marges.',
        ],
      },
      {
        title: 'Changements',
        items: ['QUIZ : Suppression du bouton Audio (TTS) pour se concentrer sur la lecture.'],
      },
    ],
  },
  {
    version: '0.5.0',
    date: '2025-12-28',
    sections: [
      {
        title: 'Module Kanjis',
        items: [
          'DASHBOARD : Nouvelle vue grille avec recherche instantanée.',
          'DÉTAILS : Vue modale avec nombre de traits, niveau JLPT et lectures.',
          'LECTURES : Distinction visuelle Onyomi/Kunyomi avec info-bulles.',
          'TRADUCTION : Base de données Kanji N5 entièrement traduite en français.',
        ],
      },
      {
        title: 'Améliorations',
        items: [
          'ACCUEIL : Nouveau dashboard avec accès rapide aux modules.',
          'NAVIGATION : Lien direct vers le module Kanjis ajouté.',
        ],
      },
    ],
  },
  {
    version: '0.4.0',
    date: '2025-12-26',
    sections: [
      {
        title: 'Gamification',
        items: [
          'SÉRIE (COMBO) : Suivi et sauvegarde du meilleur score de série.',
          'SCORE : Calcul plus précis prenant en compte les erreurs.',
          'PERSISTANCE : La série survit désormais à la navigation entre les pages.',
        ],
      },
      {
        title: 'Sécurité & UI',
        items: [
          'BASE DE DONNÉES : Sécurisation de la suppression de compte.',
          'FOOTER : Nouveau design compact avec lien vers la Release GitHub.',
          'AUDIO : Désactivation de la lecture auto sur les cartes (pour éviter le spam).',
        ],
      },
    ],
  },
  {
    version: '0.3.0',
    date: '2025-12-25',
    sections: [
      {
        title: 'Design System',
        items: [
          'UNIFICATION : Style visuel cohérent (cartes, boutons 3D) sur tout le site.',
          'IDENTITÉ : Nouvelle mascotte Tanuki et favicon.',
          'UX : Curseurs et effets de survol améliorés.',
        ],
      },
      {
        title: 'Légal',
        items: ['MENTIONS LÉGALES : Ajout des CGU et Politique de Confidentialité (RGPD).'],
      },
    ],
  },
  {
    version: '0.2.0',
    date: '2025-12-24',
    sections: [
      {
        title: 'Audio & Compte',
        items: [
          'TTS : Synthèse vocale japonaise native (Kana, Quiz, Vocabulaire).',
          'NOTIFICATIONS : Nouveau système de "Toasts" pour les alertes.',
          'MOT DE PASSE : Flux complet de réinitialisation par email.',
          'ZONE DE DANGER : Suppression de compte sécurisée avec confirmation.',
        ],
      },
    ],
  },
  {
    version: '0.1.0',
    date: '2025-12-22',
    sections: [
      {
        title: 'Lancement',
        items: [
          'VOCABULAIRE : Base de données initiale Japonais/Français.',
          "I18N : Traduction intégrale de l'interface en Français.",
          "RESPONSIVE : Optimisation mobile pour l'Accueil et les Quiz.",
        ],
      },
    ],
  },
]
