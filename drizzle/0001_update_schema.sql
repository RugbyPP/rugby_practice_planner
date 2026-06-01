-- Update sessions table to match new schema
ALTER TABLE sessions 
  RENAME COLUMN player_count TO player_count_old;
ALTER TABLE sessions 
  ADD COLUMN player_count_new INTEGER;
UPDATE sessions SET player_count_new = CAST(player_count_old AS INTEGER);
ALTER TABLE sessions DROP COLUMN player_count_old;
ALTER TABLE sessions RENAME COLUMN player_count_new TO player_count;

ALTER TABLE sessions 
  RENAME COLUMN session_length TO session_length_old;
ALTER TABLE sessions 
  ADD COLUMN session_length_new INTEGER;
UPDATE sessions SET session_length_new = CAST(session_length_old AS INTEGER);
ALTER TABLE sessions DROP COLUMN session_length_old;
ALTER TABLE sessions RENAME COLUMN session_length_new TO session_length;

ALTER TABLE sessions 
  RENAME COLUMN coaching_topic TO topic;
ALTER TABLE sessions 
  RENAME COLUMN principle_of_play TO principle;
ALTER TABLE sessions 
  RENAME COLUMN player_struggles TO struggles;

ALTER TABLE sessions DROP COLUMN IF EXISTS is_ai_generated;

-- Add userId to adaptations table
ALTER TABLE adaptations 
  ADD COLUMN user_id INTEGER REFERENCES users(id) ON DELETE CASCADE;

-- Update existing adaptations to have user_id from their sessions
UPDATE adaptations a 
SET user_id = s.user_id 
FROM sessions s 
WHERE a.session_id = s.id;

-- Make user_id NOT NULL
ALTER TABLE adaptations 
  ALTER COLUMN user_id SET NOT NULL;

-- Update session_series table
ALTER TABLE session_series 
  ALTER COLUMN total_sessions DROP NOT NULL;
ALTER TABLE session_series 
  ALTER COLUMN current_session DROP NOT NULL;
