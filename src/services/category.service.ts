import instance from "../apis";

// Set default timeout
instance.defaults.timeout = 45000;

const parseResponse = (response: any) => {
  let data;
  if (typeof response.data === 'string') {
    const jsonString = response.data
      .replace(/^\/\/ bootstrap\/app\.php\n/, '')
      .replace(/<<<<<<< HEAD\n/g, '')
      .replace(/=======\n/g, '')
      .replace(/>>>>>>> [^\n]+\n/g, '');
    data = JSON.parse(jsonString);
  } else {
    data = response.data;
  }
  return Array.isArray(data) ? data : (data.data || data);
};

export const categoryService = {
  getAllCategories: async () => {
    try {
      const response = await instance.get("/categories", { 
        timeout: 45000 // Tăng timeout cho categories
      });
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : [] };
    } catch (error: any) {
      console.warn('Categories API failed:', error.message);
      
      // Kiểm tra nếu là timeout hoặc network error
      if (error.message.includes('timeout') || error.code === 'ECONNABORTED' || !error.response) {
        console.log('Using fallback data due to network issues');
        return {
          data: [
            { id: 1, name: 'Gaming Laptop', description: 'Laptop chơi game cao cấp', products_count: 0 },
            { id: 2, name: 'Ultrabook', description: 'Laptop mỏng nhẹ văn phòng', products_count: 0 },
            { id: 3, name: 'Workstation', description: 'Laptop đồ họa chuyên nghiệp', products_count: 0 },
            { id: 4, name: 'Budget Laptop', description: 'Laptop giá rẻ sinh viên', products_count: 0 }
          ],
          isOffline: true
        };
      }
      
      // Lỗi khác thì throw
      throw error;
    }
  }
};