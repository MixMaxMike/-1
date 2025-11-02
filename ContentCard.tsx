import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Eye, Calendar, Sparkles } from "lucide-react";

interface ContentCardProps {
  id: string;
  title: string;
  script: string;
  videoPrompt?: string;
  status: string;
  createdAt: string;
  views?: number;
}

export function ContentCard({ 
  id,
  title, 
  script, 
  videoPrompt, 
  status, 
  createdAt,
  views = 0 
}: ContentCardProps) {
  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    draft: { label: "Черновик", variant: "secondary" },
    generating: { label: "Генерация", variant: "default" },
    ready: { label: "Готово", variant: "outline" },
    published: { label: "Опубликовано", variant: "default" },
  };

  const config = statusConfig[status] || statusConfig.draft;

  return (
    <Card className="p-5 gradient-card shadow-card border-border/50 transition-smooth hover:shadow-glow cursor-pointer group">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={config.variant}>{config.label}</Badge>
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(createdAt).toLocaleDateString('ru-RU')}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
          </div>
          <div className="p-3 rounded-lg gradient-primary">
            <Video className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <h4 className="text-sm font-medium mb-1">Сценарий:</h4>
            <p className="text-sm text-muted-foreground line-clamp-3">{script}</p>
          </div>
          
          {videoPrompt && (
            <div>
              <h4 className="text-sm font-medium mb-1">Промпт для видео:</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">{videoPrompt}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {views.toLocaleString('ru-RU')}
            </span>
          </div>
          <Button size="sm" variant="outline">
            <Sparkles className="w-4 h-4 mr-1" />
            Опубликовать
          </Button>
        </div>
      </div>
    </Card>
  );
}