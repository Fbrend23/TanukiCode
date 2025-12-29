-- Add current_combo column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_combo integer DEFAULT 0;

-- Optional: If you use RLS (Row Level Security), ensure policies allow update
-- (Usually existing policies for 'score' and 'streak' will cover this if they allow full row update)
