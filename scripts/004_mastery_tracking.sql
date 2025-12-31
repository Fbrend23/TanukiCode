ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS mastered_items TEXT[] DEFAULT '{}';

COMMENT ON COLUMN public.profiles.mastered_items IS 'An array of IDs for items mastered by the user (kana, kanji, grammar).';
