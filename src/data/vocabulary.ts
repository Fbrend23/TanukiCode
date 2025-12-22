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
    meaning: 'Hello',
    category: 'greetings',
  },
  {
    word: 'ありがとう',
    reading: 'ありがとう',
    romaji: 'Arigatou',
    meaning: 'Thank you',
    category: 'greetings',
  },
  {
    word: 'さようなら',
    reading: 'さようなら',
    romaji: 'Sayounara',
    meaning: 'Goodbye',
    category: 'greetings',
  },
  {
    word: 'おはよう',
    reading: 'おはよう',
    romaji: 'Ohayou',
    meaning: 'Good morning',
    category: 'greetings',
  },
  {
    word: 'おやすみ',
    reading: 'おやすみ',
    romaji: 'Oyasumi',
    meaning: 'Good night',
    category: 'greetings',
  },

  // Numbers
  { word: 'いち', reading: 'いち', romaji: 'Ichi', meaning: 'One', category: 'numbers' },
  { word: 'に', reading: 'に', romaji: 'Ni', meaning: 'Two', category: 'numbers' },
  { word: 'さん', reading: 'さん', romaji: 'San', meaning: 'Three', category: 'numbers' },
  { word: 'よん', reading: 'よん', romaji: 'Yon', meaning: 'Four', category: 'numbers' },
  { word: 'ご', reading: 'ご', romaji: 'Go', meaning: 'Five', category: 'numbers' },
  { word: 'ろく', reading: 'ろく', romaji: 'Roku', meaning: 'Six', category: 'numbers' },
  { word: 'なな', reading: 'なな', romaji: 'Nana', meaning: 'Seven', category: 'numbers' },
  { word: 'はち', reading: 'はち', romaji: 'Hachi', meaning: 'Eight', category: 'numbers' },
  { word: 'きゅう', reading: 'きゅう', romaji: 'Kyuu', meaning: 'Nine', category: 'numbers' },
  { word: 'じゅう', reading: 'じゅう', romaji: 'Juu', meaning: 'Ten', category: 'numbers' },

  // Colors
  { word: 'あか', reading: 'あか', romaji: 'Aka', meaning: 'Red', category: 'colors' },
  { word: 'あお', reading: 'あお', romaji: 'Ao', meaning: 'Blue', category: 'colors' },
  { word: 'しろ', reading: 'しろ', romaji: 'Shiro', meaning: 'White', category: 'colors' },
  { word: 'くろ', reading: 'くろ', romaji: 'Kuro', meaning: 'Black', category: 'colors' },
  { word: 'きいろ', reading: 'きいろ', romaji: 'Kiiro', meaning: 'Yellow', category: 'colors' },
]
