-- Email Sequences Table
-- Tracks which emails have been sent to each user in the onboarding sequence

CREATE TABLE IF NOT EXISTS email_sequences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    user_name TEXT,
    
    -- Sequence tracking
    sequence_type TEXT NOT NULL DEFAULT 'onboarding', -- 'onboarding', 'reactivation', etc.
    current_step INTEGER NOT NULL DEFAULT 0,
    
    -- Email timestamps (null = not sent yet)
    welcome_sent_at TIMESTAMPTZ,           -- Day 0: Immediate welcome
    day1_sent_at TIMESTAMPTZ,              -- Day 1: Getting started
    day3_sent_at TIMESTAMPTZ,              -- Day 3: Add your first service
    day5_sent_at TIMESTAMPTZ,              -- Day 5: Organize with stacks
    day7_sent_at TIMESTAMPTZ,              -- Day 7: Invite your team
    
    -- Next scheduled email
    next_email_at TIMESTAMPTZ,
    next_email_step INTEGER,
    
    -- User engagement tracking
    is_active BOOLEAN DEFAULT true,        -- Can be paused/unsubscribed
    unsubscribed_at TIMESTAMPTZ,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, sequence_type)
);

-- Index for efficient querying of pending emails
CREATE INDEX idx_email_sequences_next_email ON email_sequences(next_email_at) 
    WHERE is_active = true AND next_email_at IS NOT NULL;

-- Index for user lookup
CREATE INDEX idx_email_sequences_user_id ON email_sequences(user_id);

-- RLS Policies
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

-- Users can view their own email sequence status
CREATE POLICY "Users can view own email sequences" ON email_sequences
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update (Edge Functions)
CREATE POLICY "Service role can manage email sequences" ON email_sequences
    FOR ALL USING (auth.role() = 'service_role');

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_sequences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_sequences_updated_at
    BEFORE UPDATE ON email_sequences
    FOR EACH ROW
    EXECUTE FUNCTION update_email_sequences_updated_at();

-- Function to initialize email sequence for new users
-- This will be called by the send-welcome Edge Function
CREATE OR REPLACE FUNCTION initialize_email_sequence(
    p_user_id UUID,
    p_email TEXT,
    p_user_name TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_sequence_id UUID;
BEGIN
    INSERT INTO email_sequences (
        user_id,
        email,
        user_name,
        sequence_type,
        current_step,
        welcome_sent_at,
        next_email_at,
        next_email_step
    ) VALUES (
        p_user_id,
        p_email,
        p_user_name,
        'onboarding',
        1,
        NOW(),
        NOW() + INTERVAL '1 day' + INTERVAL '9 hours', -- Next day at 9am
        2
    )
    ON CONFLICT (user_id, sequence_type) DO UPDATE SET
        welcome_sent_at = NOW(),
        current_step = 1,
        next_email_at = NOW() + INTERVAL '1 day' + INTERVAL '9 hours',
        next_email_step = 2,
        is_active = true,
        updated_at = NOW()
    RETURNING id INTO v_sequence_id;
    
    RETURN v_sequence_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark an email step as sent and schedule the next one
CREATE OR REPLACE FUNCTION advance_email_sequence(
    p_user_id UUID,
    p_step INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
    v_next_step INTEGER;
    v_next_interval INTERVAL;
BEGIN
    -- Determine next step and interval
    CASE p_step
        WHEN 2 THEN -- Day 1 sent, schedule Day 3
            v_next_step := 3;
            v_next_interval := INTERVAL '2 days';
        WHEN 3 THEN -- Day 3 sent, schedule Day 5
            v_next_step := 4;
            v_next_interval := INTERVAL '2 days';
        WHEN 4 THEN -- Day 5 sent, schedule Day 7
            v_next_step := 5;
            v_next_interval := INTERVAL '2 days';
        WHEN 5 THEN -- Day 7 sent, sequence complete
            v_next_step := NULL;
            v_next_interval := NULL;
        ELSE
            RETURN FALSE;
    END CASE;
    
    UPDATE email_sequences
    SET 
        current_step = p_step,
        day1_sent_at = CASE WHEN p_step = 2 THEN NOW() ELSE day1_sent_at END,
        day3_sent_at = CASE WHEN p_step = 3 THEN NOW() ELSE day3_sent_at END,
        day5_sent_at = CASE WHEN p_step = 4 THEN NOW() ELSE day5_sent_at END,
        day7_sent_at = CASE WHEN p_step = 5 THEN NOW() ELSE day7_sent_at END,
        next_email_at = CASE WHEN v_next_step IS NOT NULL 
            THEN (NOW() + v_next_interval)::DATE + INTERVAL '9 hours' -- 9am
            ELSE NULL END,
        next_email_step = v_next_step,
        updated_at = NOW()
    WHERE user_id = p_user_id AND sequence_type = 'onboarding';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
