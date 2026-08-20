import { useQuery } from '@tanstack/react-query';
import { fetchRevenueDaily, fetchDashboardKpis } from '../adminApi';

export function useMetrics() {
  const revenueQuery = useQuery({
    queryKey: ['revenue-daily'],
    queryFn: fetchRevenueDaily,
    staleTime: 1000 * 60 * 30,
  });

  const kpisQuery = useQuery({
    queryKey: ['dashboard-kpis'],
    queryFn: fetchDashboardKpis,
    staleTime: 1000 * 60 * 10,
  });

  return {
    revenue: revenueQuery.data || [],
    kpis: kpisQuery.data || { revenueThisMonth: 0, paidOrdersThisMonth: 0, totalCustomers: 0, suspectScans: 0 },
    isLoading: revenueQuery.isLoading || kpisQuery.isLoading,
    error: revenueQuery.error || kpisQuery.error,
  };
}
