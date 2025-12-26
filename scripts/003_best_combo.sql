-- Add best_combo column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS best_combo INTEGER DEFAULT 0;

-- Comment on column
COMMENT ON COLUMN public.profiles.best_combo IS 'The highest combo streak achieved by the user in a quiz session.';
