-- Add custom_sources table for user-defined sources
CREATE TABLE IF NOT EXISTS public.custom_sources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source_type TEXT NOT NULL DEFAULT 'rss', -- rss, reddit, telegram, tiktok, youtube, custom
  category TEXT NOT NULL DEFAULT 'general', -- ai, tech, general, entertainment
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_sources ENABLE ROW LEVEL SECURITY;

-- Allow public access
CREATE POLICY "Allow public insert access to custom_sources"
  ON public.custom_sources FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to custom_sources"
  ON public.custom_sources FOR SELECT
  USING (true);

CREATE POLICY "Allow public update access to custom_sources"
  ON public.custom_sources FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access to custom_sources"
  ON public.custom_sources FOR DELETE
  USING (true);

-- Add category to trends table
ALTER TABLE public.trends ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'general';

-- Create index on category
CREATE INDEX IF NOT EXISTS idx_trends_category ON public.trends(category);

-- Add trigger for updated_at
CREATE TRIGGER update_custom_sources_updated_at
  BEFORE UPDATE ON public.custom_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();