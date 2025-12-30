export interface GrammarExample {
  japanese: string
  romaji: string
  french: string
}

export interface GrammarLesson {
  id: string
  title: string
  summary: string // Short description for the card
  content: string // Markdown content for the detailed view
  examples: GrammarExample[]
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  category: 'particles' | 'basics' | 'conjugation'
}

export const grammarLessons: GrammarLesson[] = [
  {
    id: 'basic-desu',
    title: 'Être (Desu)',
    summary: 'La structure de base A est B.',
    level: 'N5',
    category: 'basics',
    content: `
En japonais, le verbe se place toujours à la **fin** de la phrase.
Le mot **です (Desu)** agit comme le verbe "être" (c'est/je suis/il est) dans une phrase affirmative polie.

**Structure :**
> [Sujet] は [Attribut] **です**。
> [A] wa [B] **desu**.
> A est B.

*Note : "Desu" se prononce souvent "Dess".*
`,
    examples: [
      {
        japanese: 'わたしはタヌキです。',
        romaji: 'Watashi wa Tanuki desu.',
        french: 'Je suis un Tanuki.',
      },
      {
        japanese: 'これはペンです。',
        romaji: 'Kore wa pen desu.',
        french: "C'est un stylo.",
      },
    ],
  },
  {
    id: 'particle-wa',
    title: 'Particule WA (は)',
    summary: 'Le marqueur de sujet.',
    level: 'N5',
    category: 'particles',
    content: `
La particule **は** (qui s'écrit "ha" mais se prononce **"wa"**) indique le **sujet** ou le **thème** de la phrase.
Elle marque ce dont on parle.

**Attention :**
Quand "ha" (は) est utilisé comme particule, il change de prononciation pour devenir "wa".
`,
    examples: [
      {
        japanese: 'わたしはがくせいです。',
        romaji: 'Watashi wa gakusei desu.',
        french: 'Je suis étudiant. (Quant à moi, je suis étudiant)',
      },
      {
        japanese: 'きょうはあついです。',
        romaji: 'Kyou wa atsui desu.',
        french: "Aujourd'hui, il fait chaud.",
      },
    ],
  },
  {
    id: 'particle-ka',
    title: 'Particule KA (か)',
    summary: 'Poser une question.',
    level: 'N5',
    category: 'particles',
    content: `
Pour poser une question en japonais, il suffit d'ajouter **か (ka)** à la fin de la phrase affirmative.
C'est l'équivalent du point d'interrogation.

Il n'y a pas besoin de changer l'ordre des mots !
`,
    examples: [
      {
        japanese: 'あなたはがくせいですか？',
        romaji: 'Anata wa gakusei desu ka?',
        french: 'Êtes-vous étudiant ?',
      },
      {
        japanese: 'これはなんですか？',
        romaji: 'Kore wa nan desu ka?',
        french: "Qu'est-ce que c'est ?",
      },
    ],
  },
  {
    id: 'particle-no',
    title: 'Particule NO (の)',
    summary: 'La possession (le "de" français).',
    level: 'N5',
    category: 'particles',
    content: `
La particule **の (no)** relie deux noms, indiquant souvent la **possession** ou l'appartenance.
Elle fonctionne un peu comme le "de" en français, mais l'ordre est inversé.

**Structure :**
> [Possesseur] **の** [Objet]
> [A] **no** [B]
> Le B de A
`,
    examples: [
      {
        japanese: 'わたしのほん',
        romaji: 'Watashi no hon',
        french: 'Mon livre (Le livre de moi)',
      },
      {
        japanese: 'にほんごのせんせい',
        romaji: 'Nihongo no sensei',
        french: 'Professeur de japonais',
      },
    ],
  },
  {
    id: 'particle-wo',
    title: 'Particule WO (を)',
    summary: "Le marqueur d'objet direct (COD).",
    level: 'N5',
    category: 'particles',
    content: `
La particule **を** (prononcée **"o"**) marque l'objet direct du verbe (COD).
C'est ce qui subit l'action.

**Structure :**
> [Objet] **を** [Verbe]
`,
    examples: [
      {
        japanese: 'すしを食べます。',
        romaji: 'Sushi wo tabemasu.',
        french: 'Je mange des sushis.',
      },
      {
        japanese: 'みずを飲みます。',
        romaji: 'Mizu wo nomimasu.',
        french: "Je bois de l'eau.",
      },
    ],
  },
  {
    id: 'particle-ni',
    title: 'Particule NI (に)',
    summary: 'Lieu, temps ou but.',
    level: 'N5',
    category: 'particles',
    content: `
La particule **に (ni)** a plusieurs usages, mais les principaux sont :
1.  Indiquer un **lieu** où l'on va (destination).
2.  Indiquer un **temps** précis (à 8h, lundi...).
3.  Indiquer un **lieu d'existence** (il y a un chat *ici*).
`,
    examples: [
      {
        japanese: '日本に行きます。',
        romaji: 'Nihon ni ikimasu.',
        french: 'Je vais au Japon.',
      },
      {
        japanese: '６じにおきます。',
        romaji: 'Roku-ji ni okimasu.',
        french: 'Je me lève à 6 heures.',
      },
    ],
  },
  {
    id: 'particle-mo',
    title: 'Particule MO (も)',
    summary: 'Aussi / Également.',
    level: 'N5',
    category: 'particles',
    content: `
La particule **も (mo)** remplace "wa" ou "ga" pour dire "aussi" ou "également".
`,
    examples: [
      {
        japanese: 'わたしもがくせいです。',
        romaji: 'Watashi mo gakusei desu.',
        french: 'Je suis aussi étudiant.',
      },
      {
        japanese: 'これもおいしいです。',
        romaji: 'Kore mo oishii desu.',
        french: 'Ceci est aussi délicieux.',
      },
    ],
  },
]
