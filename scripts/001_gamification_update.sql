-- Add last_studied_at column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS last_studied_at TIMESTAMPTZ DEFAULT NOW();

-- Comment on column
COMMENT ON COLUMN public.profiles.last_studied_at IS 'Timestamp of the last time the user answered a question correctly.';
