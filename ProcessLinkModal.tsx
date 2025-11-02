import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link2, Loader2 } from "lucide-react";

interface ProcessLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const ProcessLinkModal = ({ open, onOpenChange, onSuccess }: ProcessLinkModalProps) => {
  const [url, setUrl] = useState("");
  const [generateContent, setGenerateContent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('process-single-link', {
        body: { url, generateContent },
      });

      if (error) throw error;

      toast({
        title: "Ссылка обработана",
        description: generateContent 
          ? "Тренд добавлен и контент сгенерирован" 
          : "Тренд успешно добавлен",
      });

      setUrl("");
      setGenerateContent(false);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error processing link:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось обработать ссылку",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Обработать ссылку
          </DialogTitle>
          <DialogDescription>
            Вставьте ссылку на новость, видео или пост для анализа и создания контента
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://youtube.com/... или https://t.me/... или любая другая ссылка"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Поддерживаются: YouTube, TikTok, Telegram, Reddit, RSS и любые веб-страницы
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="generateContent"
              checked={generateContent}
              onCheckedChange={(checked) => setGenerateContent(checked as boolean)}
            />
            <Label
              htmlFor="generateContent"
              className="text-sm font-normal cursor-pointer"
            >
              Сразу сгенерировать сценарий и промпт для видео
            </Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading} className="gradient-primary">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Обработать
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};