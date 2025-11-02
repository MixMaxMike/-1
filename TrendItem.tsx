import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, ExternalLink, Loader2 } from "lucide-react";

interface TrendItemProps {
  id: string;
  title: string;
  description: string;
  score: number;
  keywords: string[];
  source: string;
  url?: string;
  onGenerate?: (id: string) => void;
  isGenerating?: boolean;
}

export function TrendItem({ id, title, description, score, keywords, source, url, onGenerate, isGenerating }: TrendItemProps) {
  return (
    <Card className="p-5 gradient-card shadow-card border-border/50 transition-smooth hover:shadow-glow animate-slide-up cursor-pointer group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {source}
            </Badge>
            <Badge className="text-xs gradient-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              {score}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-smooth">
            {title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
          
          <div className="flex flex-wrap gap-2">
            {keywords.slice(0, 5).map((keyword, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {keywords.length > 5 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{keywords.length - 5} еще
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            size="sm" 
            className="gradient-primary"
            onClick={() => onGenerate?.(id)}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                Создаю...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                Создать
              </>
            )}
          </Button>
          {url && (
            <Button size="sm" variant="outline" asChild>
              <a href={url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
