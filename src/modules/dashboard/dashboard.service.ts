import { dashboardRepository } from './dashboard.repository';

export const dashboardService = {
  getSummary: async () => {
    return dashboardRepository.getSummary();
  },

  getCategoryBreakdown: async () => {
    return dashboardRepository.getCategoryBreakdown();
  },

  getRecentActivity: async () => {
    return dashboardRepository.getRecentActivity();
  },

  getMonthlyTrends: async (year?: number) => {
    return dashboardRepository.getMonthlyTrends(year);
  },
};