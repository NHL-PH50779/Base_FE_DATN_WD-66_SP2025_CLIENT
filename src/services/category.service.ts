import instance from "../apis";

// Set timeout cho category service
instance.defaults.timeout = 8000;

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
      const response = await instance.get("/categories", { timeout: 10000 });
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error("Error fetching categories:", error);
      // Fallback to mock data if API fails
      return {
        data: [
          { id: 1, name: 'Laptop', description: 'Máy tính xách tay' },
          { id: 2, name: 'Điện thoại', description: 'Smartphone' },
          { id: 3, name: 'Tablet', description: 'Máy tính bảng' },
          { id: 4, name: 'Phụ kiện', description: 'Phụ kiện công nghệ' }
        ]
      };
    }
  }
};