export interface Sentence {
  id: string
  category: 'greetings' | 'shopping' | 'travel' | 'restaurant'
  japanese: string
  kana: string
  romaji: string
  translation: string
  context?: string // Explains when to use it (e.g. "Entering a store")
  audioPath?: string // Optional override if filename differs from ID
}

export const sentences: Sentence[] = [
  // --- GREETINGS ---
  // --- GREETINGS ---
  {
    id: 'aisatsu_01',
    category: 'greetings',
    japanese: '今日はとてもいい天気ですね',
    kana: 'きょうはとてもいいてんきですね',
    romaji: 'Kyou wa totemo ii tenki desu ne',
    translation: "Il fait très beau aujourd'hui, n'est-ce pas ?",
    context: 'Conversation phatique standard sur la météo.',
  },
  {
    id: 'aisatsu_02',
    category: 'greetings',
    japanese: 'お久しぶりです、お元気ですか？',
    kana: 'おひさしぶりです、おげんきですか？',
    romaji: 'Ohisashiburi desu, ogenki desu ka?',
    translation: 'Ça faisait longtemps, comment allez-vous ?',
    context: "À dire à quelqu'un qu'on n'a pas vu depuis longtemps.",
  },
  {
    id: 'aisatsu_03',
    category: 'greetings',
    japanese: '遅れて申し訳ありません',
    kana: 'おくれてもうしわけありません',
    romaji: 'Okurete moushiwake arimasen',
    translation: "Je suis désolé d'être en retard.",
    context: 'Excuses formelles en arrivant en retard.',
  },

  // --- SHOPPING (KONBINI) ---
  {
    id: 'shop_01',
    category: 'shopping',
    japanese: 'いらっしゃいませ',
    kana: 'いらっしゃいませ',
    romaji: 'Irasshaimase',
    translation: 'Bienvenue !',
    context: 'Entendu immédiatement en entrant dans un magasin.',
  },
  {
    id: 'shop_02',
    category: 'shopping',
    japanese: '袋にお入れしますか？',
    kana: 'ふくろにおいれしますか？',
    romaji: 'Fukuro ni oire shimasu ka?',
    translation: 'Voulez-vous un sac ?',
    context: 'Question classique à la caisse.',
  },
  {
    id: 'shop_03',
    category: 'shopping',
    japanese: 'これをお願いします',
    kana: 'これをおねがいします',
    romaji: 'Kore o onegaishimasu',
    translation: "Celui-ci, s'il vous plaît.",
    context: 'En donnant des articles à la caisse.',
  },

  // --- RESTAURANT ---
  {
    id: 'rest_01',
    category: 'restaurant',
    japanese: '禁煙席と喫煙席、どちらがよろしいですか？',
    kana: 'きんえんせきときつえんせき、どちらがよろしいですか？',
    romaji: 'Kinenseki to kitsuenseki, dochira ga yoroshii desu ka?',
    translation: 'Zone fumeur ou non-fumeur ?',
    context: "Question posée à l'accueil du restaurant.",
  },
  {
    id: 'rest_02',
    category: 'restaurant',
    japanese: '二名です',
    kana: 'にめいです',
    romaji: 'Nimei desu',
    translation: 'Deux personnes.',
    context: 'Réponse à la question sur la taille du groupe.',
  },

  // --- GREETINGS (Supplement) ---
  {
    id: 'aisatsu_04',
    category: 'greetings',
    japanese: 'はじめまして、タヌキです',
    kana: 'はじめまして、たぬきです',
    romaji: 'Hajimemashite, Tanuki desu',
    translation: 'Enchanté, je suis Tanuki.',
    context: 'Phrase standard pour se présenter.',
  },
  {
    id: 'aisatsu_05',
    category: 'greetings',
    japanese: 'よろしくお願いします',
    kana: 'よろしくおねがいします',
    romaji: 'Yoroshiku onegaishimasu',
    translation: "Je m'en remets à vous / Enchanté.",
    context: "Utilisé lors d'une rencontre ou pour demander une faveur.",
  },

  // --- SHOPPING (Supplement) ---
  {
    id: 'shop_04',
    category: 'shopping',
    japanese: 'これはいくらですか？',
    kana: 'これはいくらですか？',
    romaji: 'Kore wa ikura desu ka?',
    translation: "C'est combien ?",
    context: "Pour demander le prix d'un article.",
  },
  {
    id: 'shop_05',
    category: 'shopping',
    japanese: 'カードは使えますか？',
    kana: 'かーどはつかえますか？',
    romaji: 'Kaado wa tsukaemasu ka?',
    translation: 'Acceptez-vous les cartes de crédit ?',
    context: 'À la caisse pour payer.',
  },

  // --- RESTAURANT (Supplement) ---
  {
    id: 'rest_03',
    category: 'restaurant',
    japanese: 'お会計をお願いします',
    kana: 'おかいけいをおねがいします',
    romaji: 'O-kaikei o onegaishimasu',
    translation: "L'addition, s'il vous plaît.",
    context: 'À la fin du repas.',
  },
  {
    id: 'rest_04',
    category: 'restaurant',
    japanese: 'おすすめは何ですか？',
    kana: 'おすすめはなんですか？',
    romaji: 'Osusume wa nan desu ka?',
    translation: "Qu'est-ce que vous recommandez ?",
    context: 'Pour demander des conseils au serveur.',
  },

  // --- TRAVEL ---
  {
    id: 'travel_01',
    category: 'travel',
    japanese: 'トイレはどこですか？',
    kana: 'といれはどこですか？',
    romaji: 'Toire wa doko desu ka?',
    translation: 'Où sont les toilettes ?',
    context: 'Question essentielle en voyage.',
  },
  {
    id: 'travel_02',
    category: 'travel',
    japanese: 'この電車は渋谷に行きますか？',
    kana: 'このでんしゃはしぶやにいきますか？',
    romaji: 'Kono densha wa Shibuya ni ikimasu ka?',
    translation: 'Ce train va-t-il à Shibuya ?',
    context: 'Pour vérifier sa direction dans le métro.',
  },

  // --- COMMUNICATION BASICS (GREETINGS) ---
  {
    id: 'aisatsu_06',
    category: 'greetings',
    japanese: 'わかりません',
    kana: 'わかりません',
    romaji: 'Wakarimasen',
    translation: 'Je ne comprends pas.',
    context: 'Indispensable quand on est perdu.',
  },
  {
    id: 'aisatsu_07',
    category: 'greetings',
    japanese: 'もう一度お願いします',
    kana: 'もういちどおねがいします',
    romaji: 'Mou ichido onegaishimasu',
    translation: "Encore une fois, s'il vous plaît.",
    context: 'Pour demander de répéter.',
  },
  {
    id: 'aisatsu_08',
    category: 'greetings',
    japanese: 'ありがとうございます',
    kana: 'ありがとうございます',
    romaji: 'Arigatou gozaimasu',
    translation: 'Merci beaucoup.',
    context: 'Forme polie de remerciement.',
  },
  {
    id: 'aisatsu_09',
    category: 'greetings',
    japanese: 'すみません',
    kana: 'すみません',
    romaji: 'Sumimasen',
    translation: 'Excusez-moi / Pardon.',
    context: "Pour attirer l'attention ou s'excuser.",
  },
  {
    id: 'aisatsu_10',
    category: 'greetings',
    japanese: '私はフランス人です',
    kana: 'わたしはふらんすじんです',
    romaji: 'Watashi wa furansujin desu',
    translation: 'Je suis français(e).',
    context: 'Pour se présenter.',
  },
  {
    id: 'aisatsu_11',
    category: 'greetings',
    japanese: '英語を話せますか？',
    kana: 'えいごをはなせますか？',
    romaji: 'Eigo o hanasemasu ka?',
    translation: 'Parlez-vous anglais ?',
    context: "Pour demander de l'aide linguistique.",
  },

  // --- SHOPPING ---
  {
    id: 'shop_06',
    category: 'shopping',
    japanese: 'これを見せてください',
    kana: 'これをみせてください',
    romaji: 'Kore o misete kudasai',
    translation: "Montrez-moi ceci, s'il vous plaît.",
    context: 'Pour voir un article en vitrine.',
  },
  {
    id: 'shop_07',
    category: 'shopping',
    japanese: 'これにします',
    kana: 'これにします',
    romaji: 'Kore ni shimasu',
    translation: 'Je vais prendre celui-ci.',
    context: 'Pour conclure un achat.',
  },
  {
    id: 'shop_08',
    category: 'shopping',
    japanese: 'もっと安いのはありますか？',
    kana: 'もっとやすいのはありますか？',
    romaji: 'Motto yasui no wa arimasu ka?',
    translation: 'En avez-vous un moins cher ?',
    context: 'Pour demander une alternative moins coûteuse.',
  },
  {
    id: 'shop_09',
    category: 'shopping',
    japanese: 'レシートをください',
    kana: 'れしーとをください',
    romaji: 'Reshiito o kudasai',
    translation: "Un reçu s'il vous plaît.",
    context: 'Après avoir payé.',
  },
  {
    id: 'shop_10',
    category: 'shopping',
    japanese: 'ATMはどこですか？',
    kana: 'えーてぃーえむはどこですか？',
    romaji: 'ATM wa doko desu ka?',
    translation: 'Où est le distributeur automatique ?',
    context: "Pour retirer de l'argent.",
  },

  // --- RESTAURANT ---
  {
    id: 'rest_05',
    category: 'restaurant',
    japanese: 'お水をください',
    kana: 'おみずをください',
    romaji: 'Omizu o kudasai',
    translation: "De l'eau s'il vous plaît.",
    context: "Pour commander de l'eau.",
  },
  {
    id: 'rest_06',
    category: 'restaurant',
    japanese: 'メニューをください',
    kana: 'めにゅーをください',
    romaji: 'Menyuu o kudasai',
    translation: "Le menu, s'il vous plaît.",
    context: 'Avant de commander.',
  },
  {
    id: 'rest_07',
    category: 'restaurant',
    japanese: 'とても美味しいです',
    kana: 'とてもおいしいです',
    romaji: 'Totemo oishii desu',
    translation: "C'est très bon.",
    context: 'Pour complimenter le chef.',
  },
  {
    id: 'rest_08',
    category: 'restaurant',
    japanese: 'これをもう一つください',
    kana: 'これをもひとつください',
    romaji: 'Kore o mou hitotsu kudasai',
    translation: "Un autre comme ça, s'il vous plaît.",
    context: 'Pour recommander la même chose.',
  },
  {
    id: 'rest_09',
    category: 'restaurant',
    japanese: 'わさび抜きでお願いします',
    kana: 'わさびぬきでおねがいします',
    romaji: 'Wasabi nuki de onegaishimasu',
    translation: "Sans wasabi s'il vous plaît.",
    context: 'Pour adapter son plat.',
  },

  // --- TRAVEL ---
  {
    id: 'travel_03',
    category: 'travel',
    japanese: '切符を一枚ください',
    kana: 'きっぷをいちまいください',
    romaji: 'Kippu o ichimai kudasai',
    translation: "Un billet s'il vous plaît.",
    context: 'À la billetterie ou au guichet.',
  },
  {
    id: 'travel_04',
    category: 'travel',
    japanese: 'ここから遠いですか？',
    kana: 'ここからとおいですか？',
    romaji: 'Koko kara tooi desu ka?',
    translation: "Est-ce loin d'ici ?",
    context: 'Pour évaluer la distance.',
  },
  {
    id: 'travel_05',
    category: 'travel',
    japanese: 'ここで止まってください',
    kana: 'ここでとまってください',
    romaji: 'Koko de tomatte kudasai',
    translation: "Arrêtez-vous ici s'il vous plaît.",
    context: 'Instructions au chauffeur de taxi.',
  },
  {
    id: 'travel_06',
    category: 'travel',
    japanese: '手伝っていただけますか？',
    kana: 'てつだっていただけますか？',
    romaji: 'Tetsudatte itadakemasu ka?',
    translation: "Pourriez-vous m'aider ?",
    context: "Demande d'aide polie.",
  },
]
