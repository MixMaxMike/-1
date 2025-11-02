import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PipelineCard } from "@/components/PipelineCard";
import { StatsCard } from "@/components/StatsCard";
import { TrendItem } from "@/components/TrendItem";
import { ContentCard } from "@/components/ContentCard";
import { TrendDetailsModal } from "@/components/TrendDetailsModal";
import { ContentDetailsModal } from "@/components/ContentDetailsModal";
import { AddSourceModal } from "@/components/AddSourceModal";
import { ProcessLinkModal } from "@/components/ProcessLinkModal";
import { usePipeline } from "@/hooks/usePipeline";
import { useStats } from "@/hooks/useStats";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Zap,
  TrendingUp,
  Video,
  Upload,
  Eye,
  ThumbsUp,
  Rss,
  Brain,
  Wand2,
  Share2,
  PlayCircle,
  Loader2,
  Sparkles,
  Plus,
  Link2,
} from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [generatingTrendId, setGeneratingTrendId] = useState<string | null>(null);
  const [selectedTrend, setSelectedTrend] = useState<any>(null);
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [trendModalOpen, setTrendModalOpen] = useState(false);
  const [contentModalOpen, setContentModalOpen] = useState(false);
  const [addSourceModalOpen, setAddSourceModalOpen] = useState(false);
  const [processLinkModalOpen, setProcessLinkModalOpen] = useState(false);
  const [trendsCategory, setTrendsCategory] = useState<'all' | 'ai' | 'general'>('all');
  
  const { isRunning, runPipeline, collectTrends, analyzeTrends, generateContent } = usePipeline();
  const { data: stats, isLoading, refetch } = useStats();

  const { data: content, isLoading: isLoadingContent, refetch: refetchContent } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  const { data: allTrends, isLoading: isLoadingTrends, refetch: refetchTrends } = useQuery({
    queryKey: ['all-trends', trendsCategory],
    queryFn: async () => {
      let query = supabase
        .from('trends')
        .select('*')
        .order('collected_at', { ascending: false })
        .limit(100);
      
      if (trendsCategory !== 'all') {
        query = query.eq('category', trendsCategory);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    refetchInterval: 10000,
  });

  const handleRunPipeline = async () => {
    await runPipeline();
    refetch();
  };

  const handleCollectTrends = async () => {
    await collectTrends();
    refetch();
  };

  const handleAnalyzeTrends = async () => {
    await analyzeTrends();
    refetch();
  };

  const handleGenerateContent = async (trendId: string) => {
    setGeneratingTrendId(trendId);
    try {
      await generateContent(trendId);
      refetch();
      refetchContent();
    } finally {
      setGeneratingTrendId(null);
    }
  };

  const handleTrendClick = (trend: any) => {
    setSelectedTrend(trend);
    setTrendModalOpen(true);
  };

  const handleContentClick = (item: any) => {
    setSelectedContent(item);
    setContentModalOpen(true);
  };

  return (
    <div className="min-h-screen p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-primary">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                Auto Buzz Factory
              </h1>
              <p className="text-muted-foreground">AI-платформа для создания вирусного контента</p>
            </div>
          </div>
        </div>
        <Button 
          size="lg" 
          className="gradient-primary shadow-glow"
          onClick={handleRunPipeline}
          disabled={isRunning || isLoading}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Выполняется...
            </>
          ) : (
            <>
              <PlayCircle className="w-5 h-5 mr-2" />
              Запустить Pipeline
            </>
          )}
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Видео создано"
          value={isLoading ? "..." : stats?.videos.total.toString() || "0"}
          icon={Video}
          trend={{ value: stats?.videos.trend || 0, positive: (stats?.videos.trend || 0) > 0 }}
        />
        <StatsCard
          title="Просмотры"
          value={isLoading ? "..." : stats?.views.formatted || "0"}
          icon={Eye}
          trend={{ value: stats?.views.trend || 0, positive: (stats?.views.trend || 0) > 0 }}
        />
        <StatsCard
          title="Вовлеченность"
          value={isLoading ? "..." : `${stats?.engagement.rate || "0"}%`}
          icon={ThumbsUp}
          trend={{ value: stats?.engagement.trend || 0, positive: (stats?.engagement.trend || 0) > 0 }}
        />
        <StatsCard
          title="Публикации"
          value={isLoading ? "..." : stats?.publications.total.toString() || "0"}
          icon={Upload}
          trend={{ value: stats?.publications.trend || 0, positive: (stats?.publications.trend || 0) > 0 }}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-card">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="trends">Тренды</TabsTrigger>
          <TabsTrigger value="generator">Генератор</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="archive">Архив</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Pipeline Status
              </h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCollectTrends}
                  disabled={isRunning || isLoading}
                >
                  <Rss className="w-4 h-4 mr-2" />
                  Собрать тренды
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleAnalyzeTrends}
                  disabled={isRunning || isLoading}
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Анализировать
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                <div className="col-span-2 text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-muted-foreground">Загрузка статуса...</p>
                </div>
              ) : stats?.pipelines && stats.pipelines.length > 0 ? (
                stats.pipelines.slice(0, 4).map((pipeline: any, idx: number) => {
                  const icons = [Rss, Brain, Wand2, Share2];
                  const titles = ['Сбор трендов', 'AI Анализ', 'Генерация видео', 'Публикация'];
                  return (
                    <PipelineCard
                      key={idx}
                      title={titles[idx] || pipeline.pipeline_name}
                      icon={icons[idx]}
                      status={pipeline.status}
                      progress={pipeline.progress}
                      itemsProcessed={pipeline.items_processed}
                      totalItems={pipeline.total_items}
                      lastRun={pipeline.last_run ? new Date(pipeline.last_run).toLocaleString('ru-RU') : 'Никогда'}
                    />
                  );
                })
              ) : (
                <>
                  <PipelineCard title="Сбор трендов" icon={Rss} status="idle" lastRun="Никогда" />
                  <PipelineCard title="AI Анализ" icon={Brain} status="idle" lastRun="Никогда" />
                  <PipelineCard title="Генерация видео" icon={Wand2} status="idle" lastRun="Никогда" />
                  <PipelineCard title="Публикация" icon={Share2} status="idle" lastRun="Никогда" />
                </>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Источники данных
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="p-6 gradient-card shadow-card border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">RSS Feeds</h3>
                    <Badge className="gradient-primary">6 активных</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between items-center">
                      <span>TechCrunch</span>
                      <Badge variant="outline">Tech</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>The Verge</span>
                      <Badge variant="outline">Tech</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>AI News</span>
                      <Badge variant="outline">AI</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 gradient-card shadow-card border-border/50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Reddit</h3>
                    <Badge className="gradient-primary">4 активных</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between items-center">
                      <span>r/MachineLearning</span>
                      <Badge variant="outline">AI</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>r/technology</span>
                      <Badge variant="outline">Tech</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>r/videos</span>
                      <Badge variant="outline">Viral</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Топ трендов
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1 bg-muted p-1 rounded-lg">
                <Button 
                  size="sm"
                  variant={trendsCategory === 'all' ? 'default' : 'ghost'}
                  onClick={() => setTrendsCategory('all')}
                  className={trendsCategory === 'all' ? 'gradient-primary' : ''}
                >
                  Все
                </Button>
                <Button 
                  size="sm"
                  variant={trendsCategory === 'ai' ? 'default' : 'ghost'}
                  onClick={() => setTrendsCategory('ai')}
                  className={trendsCategory === 'ai' ? 'gradient-primary' : ''}
                >
                  AI / Нейросети
                </Button>
                <Button 
                  size="sm"
                  variant={trendsCategory === 'general' ? 'default' : 'ghost'}
                  onClick={() => setTrendsCategory('general')}
                  className={trendsCategory === 'general' ? 'gradient-primary' : ''}
                >
                  Остальное
                </Button>
              </div>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => setProcessLinkModalOpen(true)}
              >
                <Link2 className="w-4 h-4 mr-2" />
                Добавить ссылку
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => setAddSourceModalOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить источник
              </Button>
              <Button 
                size="sm"
                variant="outline"
                onClick={() => {
                  handleCollectTrends();
                  refetchTrends();
                }}
                disabled={isRunning || isLoading}
              >
                {isRunning ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Rss className="w-4 h-4 mr-2" />
                )}
                Обновить
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            {isLoadingTrends ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">Загрузка трендов...</p>
              </div>
            ) : allTrends && allTrends.length > 0 ? (
              allTrends.map((trend: any) => (
                <div key={trend.id} onClick={() => handleTrendClick(trend)}>
                  <TrendItem 
                    id={trend.id}
                    title={trend.title}
                    description={trend.description || ''}
                    score={trend.score}
                    keywords={trend.keywords || []}
                    source={trend.source}
                    url={trend.source_url || '#'}
                    onGenerate={handleGenerateContent}
                    isGenerating={generatingTrendId === trend.id}
                  />
                </div>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Пока нет собранных трендов. Нажмите "Обновить" для сбора.
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Video className="w-6 h-6 text-primary" />
              Созданный контент
            </h2>
            <Button 
              variant="outline"
              onClick={() => {
                refetchContent();
                refetch();
              }}
              disabled={isLoadingContent}
            >
              {isLoadingContent ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Обновить
            </Button>
          </div>

          {isLoadingContent ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-muted-foreground">Загрузка контента...</p>
            </div>
          ) : content && content.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {content.map((item: any) => (
                <div key={item.id} onClick={() => handleContentClick(item)}>
                  <ContentCard
                    id={item.id}
                    title={item.title}
                    script={item.script}
                    videoPrompt={item.video_prompt}
                    status={item.status}
                    createdAt={item.created_at}
                    views={0}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="inline-flex p-6 rounded-2xl gradient-primary mb-4">
                <Wand2 className="w-12 h-12 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Нет созданного контента</h3>
              <p className="text-muted-foreground mb-6">
                Перейдите во вкладку "Тренды" и нажмите "Создать" на понравившемся тренде
              </p>
              <Button 
                className="gradient-primary shadow-glow"
                onClick={() => setActiveTab("trends")}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Перейти к трендам
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Аналитика производительности
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-6 gradient-card shadow-card border-border/50">
              <h3 className="font-semibold mb-4">Статистика по источникам</h3>
              <div className="space-y-3">
                {isLoading ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </div>
                ) : stats?.sources && stats.sources.length > 0 ? (
                  stats.sources.map((source: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm">{source.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(source.count / Math.max(...stats.sources.map((s: any) => s.count))) * 100} 
                          className="w-24 h-2"
                        />
                        <Badge variant="outline">{source.count}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Нет данных
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6 gradient-card shadow-card border-border/50">
              <h3 className="font-semibold mb-4">Контент по статусам</h3>
              <div className="space-y-3">
                {isLoadingContent ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </div>
                ) : content ? (
                  <>
                    {['draft', 'ready', 'published'].map((status) => {
                      const count = content.filter((c: any) => c.status === status).length;
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{status === 'draft' ? 'Черновики' : status === 'ready' ? 'Готово' : 'Опубликовано'}</span>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(count / content.length) * 100} 
                              className="w-24 h-2"
                            />
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Нет данных
                  </p>
                )}
              </div>
            </Card>

            <Card className="p-6 gradient-card shadow-card border-border/50 lg:col-span-2">
              <h3 className="font-semibold mb-4">Последние тренды</h3>
              <div className="space-y-2">
                {isLoading ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  </div>
                ) : stats?.trends && stats.trends.length > 0 ? (
                  stats.trends.slice(0, 5).map((trend: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm hover:bg-muted/30 p-2 rounded transition-smooth cursor-pointer" onClick={() => handleTrendClick(trend)}>
                      <span className="flex-1 truncate">{trend.title}</span>
                      <Badge variant="outline" className="ml-2">{trend.source}</Badge>
                      <Badge className="ml-2 gradient-primary">
                        {trend.score}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Нет данных
                  </p>
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="archive" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Архив новостей
            </h2>
            <Button 
              variant="outline"
              onClick={() => refetchTrends()}
              disabled={isLoadingTrends}
            >
              {isLoadingTrends ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Обновить
            </Button>
          </div>

          <div className="space-y-3">
            {isLoadingTrends ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
                <p className="text-muted-foreground">Загрузка архива...</p>
              </div>
            ) : allTrends && allTrends.length > 0 ? (
              allTrends.map((trend: any) => (
                <div key={trend.id} onClick={() => handleTrendClick(trend)}>
                  <TrendItem 
                    id={trend.id}
                    title={trend.title}
                    description={trend.description || ''}
                    score={trend.score}
                    keywords={trend.keywords || []}
                    source={trend.source}
                    url={trend.source_url || '#'}
                    onGenerate={handleGenerateContent}
                    isGenerating={generatingTrendId === trend.id}
                  />
                </div>
              ))
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  Архив пуст
                </p>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <TrendDetailsModal
        open={trendModalOpen}
        onOpenChange={setTrendModalOpen}
        trend={selectedTrend}
        onGenerate={handleGenerateContent}
      />
      
      <ContentDetailsModal
        open={contentModalOpen}
        onOpenChange={setContentModalOpen}
        content={selectedContent}
      />

      <AddSourceModal
        open={addSourceModalOpen}
        onOpenChange={setAddSourceModalOpen}
        onSuccess={() => {
          refetch();
          refetchTrends();
        }}
      />

      <ProcessLinkModal
        open={processLinkModalOpen}
        onOpenChange={setProcessLinkModalOpen}
        onSuccess={() => {
          refetch();
          refetchTrends();
          refetchContent();
        }}
      />
    </div>
  );
};

export default Index;
