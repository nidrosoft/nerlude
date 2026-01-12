-- Create invite_tokens table for tracking invitations
CREATE TABLE IF NOT EXISTS invite_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    token TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('workspace', 'project')),
    target_id UUID NOT NULL,
    target_name TEXT NOT NULL,
    role TEXT NOT NULL,
    inviter_name TEXT NOT NULL,
    inviter_email TEXT NOT NULL,
    workspace_name TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON invite_tokens(token);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_email ON invite_tokens(email);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_expires_at ON invite_tokens(expires_at);

-- Enable RLS
ALTER TABLE invite_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (for Edge Functions)
CREATE POLICY "Service role can manage invite tokens"
    ON invite_tokens
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Function to clean up expired tokens (can be called via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_invite_tokens()
RETURNS void AS $$
BEGIN
    DELETE FROM invite_tokens
    WHERE expires_at < NOW() AND accepted_at IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
