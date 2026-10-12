-- ============================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================
-- Emails collected on the maintenance / launch page.
-- Written only by /api/newsletter using the service-role key,
-- then synced to a Brevo contact list for sending.

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE CHECK (email = LOWER(email)), -- stored lowercased
  source TEXT NOT NULL DEFAULT 'maintenance',
  brevo_synced_at TIMESTAMP WITH TIME ZONE, -- last successful Brevo sync; NULL = never synced
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS on with no policies: anon/authenticated clients can neither read nor write.
-- The service-role key used by the API route bypasses RLS.
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
