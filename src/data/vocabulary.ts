export interface VocabularyWord {
  word: string // The Japanese word (Kana/Kanji)
  reading: string // The reading in Kana (if word uses Kanji, otherwise same as word) - Optional for now as we focus on Kana
  romaji: string
  meaning: string
  category: 'greetings' | 'numbers' | 'colors' | 'animals' | 'food' | 'nature' | 'family'
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

  // Animals
  { word: 'ねこ', reading: 'ねこ', romaji: 'Neko', meaning: 'Chat', category: 'animals' },
  { word: 'いぬ', reading: 'いぬ', romaji: 'Inu', meaning: 'Chien', category: 'animals' },
  { word: 'とり', reading: 'とり', romaji: 'Tori', meaning: 'Oiseau', category: 'animals' },
  { word: 'さかな', reading: 'さかな', romaji: 'Sakana', meaning: 'Poisson', category: 'animals' },
  {
    word: 'たぬき',
    reading: 'たぬき',
    romaji: 'Tanuki',
    meaning: 'Chien viverrin',
    category: 'animals',
  },
  { word: 'くま', reading: 'くま', romaji: 'Kuma', meaning: 'Ours', category: 'animals' },
  { word: 'うさぎ', reading: 'うさぎ', romaji: 'Usagi', meaning: 'Lapin', category: 'animals' },
  { word: 'うま', reading: 'うま', romaji: 'Uma', meaning: 'Cheval', category: 'animals' },

  // Food
  { word: 'すし', reading: 'すし', romaji: 'Sushi', meaning: 'Sushi', category: 'food' },
  { word: 'らーめん', reading: 'らーめん', romaji: 'Ramen', meaning: 'Ramen', category: 'food' },
  { word: 'みず', reading: 'みず', romaji: 'Mizu', meaning: 'Eau', category: 'food' },
  { word: 'おちゃ', reading: 'おちゃ', romaji: 'Ocha', meaning: 'Thé', category: 'food' },
  { word: 'ごはん', reading: 'ごはん', romaji: 'Gohan', meaning: 'Riz', category: 'food' },
  { word: 'ぱん', reading: 'ぱん', romaji: 'Pan', meaning: 'Pain', category: 'food' },
  {
    word: 'たべもの',
    reading: 'たべもの',
    romaji: 'Tabemono',
    meaning: 'Nourriture',
    category: 'food',
  },
  {
    word: 'のみもの',
    reading: 'のみもの',
    romaji: 'Nomimono',
    meaning: 'Boisson',
    category: 'food',
  },

  // Nature
  { word: 'やま', reading: 'やま', romaji: 'Yama', meaning: 'Montagne', category: 'nature' },
  { word: 'かわ', reading: 'かわ', romaji: 'Kawa', meaning: 'Rivière', category: 'nature' },
  { word: 'はな', reading: 'はな', romaji: 'Hana', meaning: 'Fleur', category: 'nature' },
  { word: 'き', reading: 'き', romaji: 'Ki', meaning: 'Arbre', category: 'nature' },
  { word: 'そら', reading: 'そら', romaji: 'Sora', meaning: 'Ciel', category: 'nature' },
  { word: 'あめ', reading: 'あめ', romaji: 'Ame', meaning: 'Pluie', category: 'nature' },
  { word: 'ゆき', reading: 'ゆき', romaji: 'Yuki', meaning: 'Neige', category: 'nature' },
  { word: 'ほし', reading: 'ほし', romaji: 'Hoshi', meaning: 'Étoile', category: 'nature' },
  { word: 'つき', reading: 'つき', romaji: 'Tsuki', meaning: 'Lune', category: 'nature' },
  { word: 'ひ', reading: 'ひ', romaji: 'Hi', meaning: 'Soleil / Feu', category: 'nature' },

  // Family / People
  { word: 'かぞく', reading: 'かぞく', romaji: 'Kazoku', meaning: 'Famille', category: 'family' },
  { word: 'わたし', reading: 'わたし', romaji: 'Watashi', meaning: 'Je / Moi', category: 'family' },
  {
    word: 'ともだち',
    reading: 'ともだち',
    romaji: 'Tomodachi',
    meaning: 'Ami',
    category: 'family',
  },
  {
    word: 'せんせい',
    reading: 'せんせい',
    romaji: 'Sensei',
    meaning: 'Professeur',
    category: 'family',
  },
  { word: 'ちち', reading: 'ちち', romaji: 'Chichi', meaning: 'Mon père', category: 'family' },
  { word: 'はは', reading: 'はは', romaji: 'Haha', meaning: 'Ma mère', category: 'family' },
  { word: 'あに', reading: 'あに', romaji: 'Ani', meaning: 'Grand frère', category: 'family' },
  { word: 'あね', reading: 'あね', romaji: 'Ane', meaning: 'Grande soeur', category: 'family' },
  {
    word: 'おとうと',
    reading: 'おとうと',
    romaji: 'Otouto',
    meaning: 'Petit frère',
    category: 'family',
  },
  {
    word: 'いもうと',
    reading: 'いもうと',
    romaji: 'Imouto',
    meaning: 'Petite soeur',
    category: 'family',
  },
]
