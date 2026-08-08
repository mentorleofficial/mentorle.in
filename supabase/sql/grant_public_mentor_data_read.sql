-- Public read for marketing mentors directory
-- mentor_profiles is the source of truth for mentor IDs (is_active = public)

GRANT SELECT ON TABLE public.mentor_data TO anon, authenticated;
GRANT SELECT ON TABLE public.users TO anon, authenticated;

ALTER TABLE public.mentor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'mentor_data'
      AND policyname = 'Public can read approved mentor_data'
  ) THEN
    CREATE POLICY "Public can read approved mentor_data"
      ON public.mentor_data
      FOR SELECT
      TO anon, authenticated
      USING (
        lower(coalesce(status, '')) IN ('approved', 'active', 'live')
        OR status IS NULL
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND policyname = 'Public read active mentor users'
  ) THEN
    CREATE POLICY "Public read active mentor users"
      ON public.users
      FOR SELECT
      TO anon, authenticated
      USING (
        EXISTS (
          SELECT 1 FROM public.mentor_profiles mp
          WHERE mp.user_id = users.id AND mp.is_active = true
        )
      );
  END IF;
END $$;

-- Rewrite expired signed image URLs to public URLs
UPDATE public.mentor_data
SET profile_url = regexp_replace(
  regexp_replace(profile_url, '/object/sign/', '/object/public/'),
  '\?token=.*$',
  ''
)
WHERE profile_url LIKE '%/object/sign/%';
