import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Stats {
  videos: {
    total: number;
    trend: number;
  };
  views: {
    total: number;
    formatted: string;
    trend: number;
  };
  engagement: {
    rate: string;
    trend: number;
  };
  publications: {
    total: number;
    trend: number;
  };
  sources: Array<{ name: string; count: number }>;
  trends: any[];
  pipelines: any[];
}

export const useStats = () => {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-stats', {
        body: {},
      });

      if (error) throw error;
      return data as Stats;
    },
    refetchInterval: 10000,
  });
};
