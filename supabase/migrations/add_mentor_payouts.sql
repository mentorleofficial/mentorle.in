-- Mentor payouts and earnings tracking

CREATE TABLE IF NOT EXISTS mentor_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, completed, rejected
  reference_id TEXT, -- External payout reference / transaction id
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_mentor_payouts_mentor_id ON mentor_payouts(mentor_id);
CREATE INDEX IF NOT EXISTS idx_mentor_payouts_status ON mentor_payouts(status);


