-- Security Fix: Set search_path for delete_user function
-- This prevents malicious users from hijacking the search path to execute arbitrary code.
-- Supabase Advisor: function_search_path_mutable

CREATE OR REPLACE FUNCTION public.delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions -- Explicitly set search_path
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = auth.uid();
END;
$$;
