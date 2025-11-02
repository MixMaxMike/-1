-- Add unique constraint on source_url to prevent duplicates
ALTER TABLE trends ADD CONSTRAINT trends_source_url_unique UNIQUE (source_url);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_trends_processed ON trends(processed);
CREATE INDEX IF NOT EXISTS idx_trends_score ON trends(score DESC);
CREATE INDEX IF NOT EXISTS idx_trends_collected_at ON trends(collected_at DESC);