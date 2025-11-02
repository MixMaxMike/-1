import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePipeline = () => {
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const runPipeline = async () => {
    try {
      setIsRunning(true);
      
      toast({
        title: "Запуск Pipeline",
        description: "Начинаем сбор трендов и генерацию контента...",
      });

      const { data, error } = await supabase.functions.invoke('run-pipeline', {
        body: {},
      });

      if (error) throw error;

      toast({
        title: "Pipeline завершен",
        description: "Контент успешно сгенерирован!",
      });

      return data;
    } catch (error) {
      console.error('Pipeline error:', error);
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось запустить pipeline",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  const collectTrends = async () => {
    try {
      toast({
        title: "Сбор трендов",
        description: "Собираем актуальные новости...",
      });

      const { data, error } = await supabase.functions.invoke('collect-trends', {
        body: {},
      });

      if (error) throw error;

      toast({
        title: "Тренды собраны",
        description: `Найдено ${data.trends} трендов`,
      });

      return data;
    } catch (error) {
      console.error('Collect trends error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось собрать тренды",
        variant: "destructive",
      });
      throw error;
    }
  };

  const analyzeTrends = async () => {
    try {
      toast({
        title: "Анализ трендов",
        description: "AI анализирует собранные тренды...",
      });

      const { data, error } = await supabase.functions.invoke('analyze-trends', {
        body: {},
      });

      if (error) throw error;

      toast({
        title: "Анализ завершен",
        description: `Обработано ${data.processed} трендов`,
      });

      return data;
    } catch (error) {
      console.error('Analyze trends error:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось проанализировать тренды",
        variant: "destructive",
      });
      throw error;
    }
  };

  const generateContent = async (trendId: string) => {
    setIsRunning(true);
    try {
      toast({
        title: "Создание контента",
        description: "AI генерирует сценарий и промпт для видео...",
      });

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { trendId },
      });

      if (error) throw error;

      toast({
        title: "Контент создан",
        description: "Сценарий и промпт успешно сгенерированы",
      });
      
      return data;
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Ошибка генерации",
        description: error instanceof Error ? error.message : "Не удалось создать контент",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsRunning(false);
    }
  };

  return {
    isRunning,
    runPipeline,
    collectTrends,
    analyzeTrends,
    generateContent,
  };
};
