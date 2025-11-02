-- Create trends table for storing collected trends
CREATE TABLE public.trends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  score INTEGER DEFAULT 0,
  keywords TEXT[] DEFAULT '{}',
  source TEXT NOT NULL,
  source_url TEXT,
  collected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create content table for storing generated content
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trend_id UUID REFERENCES public.trends(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  script TEXT NOT NULL,
  video_prompt TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  audio_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  generation_started_at TIMESTAMP WITH TIME ZONE,
  generation_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create publications table for tracking social media posts
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  platform_post_id TEXT,
  post_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics table for tracking performance
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
  publication_id UUID REFERENCES public.publications(id) ON DELETE CASCADE,
  metric_type TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pipeline_status table for tracking pipeline execution
CREATE TABLE public.pipeline_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pipeline_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'idle',
  progress INTEGER DEFAULT 0,
  items_processed INTEGER DEFAULT 0,
  total_items INTEGER DEFAULT 0,
  last_run TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_status ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is an automation system)
CREATE POLICY "Allow public read access to trends" 
ON public.trends FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to trends" 
ON public.trends FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to trends" 
ON public.trends FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to content" 
ON public.content FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to content" 
ON public.content FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to content" 
ON public.content FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to publications" 
ON public.publications FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to publications" 
ON public.publications FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to publications" 
ON public.publications FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to analytics" 
ON public.analytics FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to analytics" 
ON public.analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to pipeline_status" 
ON public.pipeline_status FOR SELECT USING (true);

CREATE POLICY "Allow public insert access to pipeline_status" 
ON public.pipeline_status FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access to pipeline_status" 
ON public.pipeline_status FOR UPDATE USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_content_updated_at
BEFORE UPDATE ON public.content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_publications_updated_at
BEFORE UPDATE ON public.publications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pipeline_status_updated_at
BEFORE UPDATE ON public.pipeline_status
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_trends_score ON public.trends(score DESC);
CREATE INDEX idx_trends_collected_at ON public.trends(collected_at DESC);
CREATE INDEX idx_trends_processed ON public.trends(processed);
CREATE INDEX idx_content_status ON public.content(status);
CREATE INDEX idx_content_trend_id ON public.content(trend_id);
CREATE INDEX idx_publications_status ON public.publications(status);
CREATE INDEX idx_publications_platform ON public.publications(platform);
CREATE INDEX idx_analytics_content_id ON public.analytics(content_id);
CREATE INDEX idx_pipeline_status_name ON public.pipeline_status(pipeline_name);