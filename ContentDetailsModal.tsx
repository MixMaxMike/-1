import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Eye, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: {
    id: string;
    title: string;
    script: string;
    video_prompt?: string;
    status: string;
    created_at: string;
    views?: number;
  } | null;
}

export function ContentDetailsModal({ open, onOpenChange, content }: ContentDetailsModalProps) {
  const { toast } = useToast();

  if (!content) return null;

  const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
    draft: { label: "Черновик", variant: "secondary" },
    generating: { label: "Генерация", variant: "default" },
    ready: { label: "Готово", variant: "outline" },
    published: { label: "Опубликовано", variant: "default" },
  };

  const config = statusConfig[content.status] || statusConfig.draft;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} скопирован!`,
      description: "Текст сохранен в буфер обмена",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            {content.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Метаданные */}
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant={config.variant}>{config.label}</Badge>
            <Badge variant="outline">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(content.created_at).toLocaleDateString('ru-RU')}
            </Badge>
            <Badge variant="outline">
              <Eye className="w-3 h-3 mr-1" />
              {content.views || 0} просмотров
            </Badge>
          </div>

          {/* Сценарий */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Сценарий видео:</h3>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(content.script, "Сценарий")}
              >
                <Copy className="w-4 h-4 mr-2" />
                Копировать
              </Button>
            </div>
            <div className="p-4 rounded-lg gradient-card border border-border/50">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {content.script}
              </p>
            </div>
          </div>

          {/* Промпт для видео */}
          {content.video_prompt && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Промпт для AI генератора:</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(content.video_prompt!, "Промпт")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать
                </Button>
              </div>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm leading-relaxed">
                  {content.video_prompt}
                </p>
              </div>
            </div>
          )}

          {/* Рекомендации по использованию */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3">Рекомендации по генерации:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Используйте промпт в Runway Gen-3, Sora, или других AI видео-генераторах</li>
              <li>• Сценарий можно использовать для озвучки с помощью ElevenLabs или других TTS</li>
              <li>• Рекомендуемый формат: вертикальное видео 9:16 (1080x1920)</li>
              <li>• Длительность: 30-60 секунд для TikTok/Shorts</li>
              <li>• Добавьте субтитры для лучшей вовлеченности</li>
            </ul>
          </div>

          {/* Действия */}
          <div className="border-t pt-6 flex gap-3">
            <Button className="flex-1 gradient-primary">
              <Video className="w-4 h-4 mr-2" />
              Экспортировать
            </Button>
            <Button 
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
