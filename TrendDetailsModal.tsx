import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExternalLink, Sparkles, Wand2, Mic, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TrendDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trend: {
    id: string;
    title: string;
    description: string;
    content?: string;
    score: number;
    keywords: string[];
    source: string;
    source_url?: string;
    collected_at: string;
  } | null;
  onGenerate: (id: string) => void;
}

export function TrendDetailsModal({ open, onOpenChange, trend, onGenerate }: TrendDetailsModalProps) {
  const [isGeneratingNarrator, setIsGeneratingNarrator] = useState(false);
  const [narratorText, setNarratorText] = useState("");
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptedPrompt, setAdaptedPrompt] = useState("");
  const [userIdea, setUserIdea] = useState("");
  const [characters, setCharacters] = useState("");
  const [plot, setPlot] = useState("");
  const { toast } = useToast();

  if (!trend) return null;

  const handleGenerateNarrator = async () => {
    setIsGeneratingNarrator(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-narrator-text', {
        body: { trendId: trend.id }
      });

      if (error) throw error;

      setNarratorText(data.narratorText);
      toast({
        title: "Текст создан!",
        description: `${data.wordCount} слов, ~${data.estimatedDuration}с`,
      });
    } catch (error) {
      console.error('Error generating narrator text:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать текст диктора",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingNarrator(false);
    }
  };

  const handleAdaptPrompt = async () => {
    if (!trend.description && !userIdea) {
      toast({
        title: "Заполните данные",
        description: "Добавьте вашу идею или другие параметры",
        variant: "destructive",
      });
      return;
    }

    setIsAdapting(true);
    try {
      const { data, error } = await supabase.functions.invoke('adapt-prompt', {
        body: {
          originalPrompt: trend.description || trend.title,
          userIdea,
          characters,
          plot
        }
      });

      if (error) throw error;

      setAdaptedPrompt(data.adaptedPrompt);
      toast({
        title: "Промпт адаптирован!",
        description: "Проверьте результат ниже",
      });
    } catch (error) {
      console.error('Error adapting prompt:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось адаптировать промпт",
        variant: "destructive",
      });
    } finally {
      setIsAdapting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            {trend.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Основная информация */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{trend.source}</Badge>
              <Badge className="gradient-primary">
                <Sparkles className="w-3 h-3 mr-1" />
                {trend.score}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(trend.collected_at).toLocaleDateString('ru-RU')}
              </span>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Описание:</h3>
              <p className="text-sm text-muted-foreground">{trend.description}</p>
            </div>

            {trend.content && (
              <div>
                <h3 className="font-semibold mb-2">Полный текст:</h3>
                <div className="p-4 rounded-lg bg-muted/50 text-sm">
                  {trend.content}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Ключевые слова:</h3>
              <div className="flex flex-wrap gap-2">
                {trend.keywords.map((keyword, idx) => (
                  <Badge key={idx} variant="outline">{keyword}</Badge>
                ))}
              </div>
            </div>

            {trend.source_url && (
              <Button variant="outline" size="sm" asChild>
                <a href={trend.source_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Открыть источник
                </a>
              </Button>
            )}
          </div>

          {/* Генерация текста диктора */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              Текст для диктора (6 сек, Gen Alpha style)
            </h3>
            <div className="space-y-3">
              <Button 
                onClick={handleGenerateNarrator}
                disabled={isGeneratingNarrator}
                className="w-full"
              >
                {isGeneratingNarrator ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Генерирую...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Сгенерировать текст диктора
                  </>
                )}
              </Button>
              
              {narratorText && (
                <div className="p-4 rounded-lg gradient-card border border-primary/20">
                  <p className="text-lg font-medium">{narratorText}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => {
                      navigator.clipboard.writeText(narratorText);
                      toast({ title: "Скопировано!" });
                    }}
                  >
                    Копировать
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Адаптация промпта */}
          <div className="border-t pt-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-primary" />
              Адаптировать промпт с помощью ИИ
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="userIdea">Ваша идея</Label>
                <Textarea
                  id="userIdea"
                  placeholder="Опишите свою идею для видео..."
                  value={userIdea}
                  onChange={(e) => setUserIdea(e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="characters">Персонажи</Label>
                  <Input
                    id="characters"
                    placeholder="Например: молодая девушка, кот"
                    value={characters}
                    onChange={(e) => setCharacters(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="plot">Сюжет</Label>
                  <Input
                    id="plot"
                    placeholder="Основная линия сюжета"
                    value={plot}
                    onChange={(e) => setPlot(e.target.value)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleAdaptPrompt}
                disabled={isAdapting}
                className="w-full"
              >
                {isAdapting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Адаптирую...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 mr-2" />
                    Адаптировать промпт
                  </>
                )}
              </Button>

              {adaptedPrompt && (
                <div className="p-4 rounded-lg gradient-card border border-primary/20">
                  <p className="text-sm mb-2 text-muted-foreground">Адаптированный промпт:</p>
                  <p className="font-medium">{adaptedPrompt}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-3"
                    onClick={() => {
                      navigator.clipboard.writeText(adaptedPrompt);
                      toast({ title: "Промпт скопирован!" });
                    }}
                  >
                    Копировать промпт
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Действия */}
          <div className="border-t pt-6 flex gap-3">
            <Button 
              className="flex-1 gradient-primary"
              onClick={() => {
                onGenerate(trend.id);
                onOpenChange(false);
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Создать контент
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
