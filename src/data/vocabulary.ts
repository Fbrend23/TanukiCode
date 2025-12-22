export interface VocabularyWord {
  word: string // The Japanese word (Kana/Kanji)
  reading: string // The reading in Kana (if word uses Kanji, otherwise same as word) - Optional for now as we focus on Kana
  romaji: string
  meaning: string
  category: 'greetings' | 'numbers' | 'colors'
}

export const vocabulary: VocabularyWord[] = [
  // Greetings
  {
    word: 'こんにちは',
    reading: 'こんにちは',
    romaji: 'Konnichiwa',
    meaning: 'Bonjour',
    category: 'greetings',
  },
  {
    word: 'ありがとう',
    reading: 'ありがとう',
    romaji: 'Arigatou',
    meaning: 'Merci',
    category: 'greetings',
  },
  {
    word: 'さようなら',
    reading: 'さようなら',
    romaji: 'Sayounara',
    meaning: 'Au revoir',
    category: 'greetings',
  },
  {
    word: 'おはよう',
    reading: 'おはよう',
    romaji: 'Ohayou',
    meaning: 'Bonjour (Matin)',
    category: 'greetings',
  },
  {
    word: 'おやすみ',
    reading: 'おやすみ',
    romaji: 'Oyasumi',
    meaning: 'Bonne nuit',
    category: 'greetings',
  },

  // Numbers
  { word: 'いち', reading: 'いち', romaji: 'Ichi', meaning: 'Un', category: 'numbers' },
  { word: 'に', reading: 'に', romaji: 'Ni', meaning: 'Deux', category: 'numbers' },
  { word: 'さん', reading: 'さん', romaji: 'San', meaning: 'Trois', category: 'numbers' },
  { word: 'よん', reading: 'よん', romaji: 'Yon', meaning: 'Quatre', category: 'numbers' },
  { word: 'ご', reading: 'ご', romaji: 'Go', meaning: 'Cinq', category: 'numbers' },
  { word: 'ろく', reading: 'ろく', romaji: 'Roku', meaning: 'Six', category: 'numbers' },
  { word: 'なな', reading: 'なな', romaji: 'Nana', meaning: 'Sept', category: 'numbers' },
  { word: 'はち', reading: 'はち', romaji: 'Hachi', meaning: 'Huit', category: 'numbers' },
  { word: 'きゅう', reading: 'きゅう', romaji: 'Kyuu', meaning: 'Neuf', category: 'numbers' },
  { word: 'じゅう', reading: 'じゅう', romaji: 'Juu', meaning: 'Dix', category: 'numbers' },

  // Colors
  { word: 'あか', reading: 'あか', romaji: 'Aka', meaning: 'Rouge', category: 'colors' },
  { word: 'あお', reading: 'あお', romaji: 'Ao', meaning: 'Bleu', category: 'colors' },
  { word: 'しろ', reading: 'しろ', romaji: 'Shiro', meaning: 'Blanc', category: 'colors' },
  { word: 'くろ', reading: 'くろ', romaji: 'Kuro', meaning: 'Noir', category: 'colors' },
  { word: 'きいろ', reading: 'きいろ', romaji: 'Kiiro', meaning: 'Jaune', category: 'colors' },
]
