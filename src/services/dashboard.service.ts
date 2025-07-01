import instance from "../apis";

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await instance.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }
};