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
