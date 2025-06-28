import instance from "../apis";

// Helper function để parse response
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

export const productService = {
  getAllProducts: async () => {
    try {
      const response = await instance.get('/products', { timeout: 10000 });
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { data: [] };
    }
  },

  getProductById: async (id: number) => {
    try {
      const response = await instance.get(`/products/${id}`, { timeout: 10000 });
      const data = parseResponse(response);
      return { data };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return { data: null };
    }
  },

  searchProducts: async (keyword: string) => {
    try {
      const response = await instance.get(`/products/search?keyword=${keyword}`, { timeout: 10000 });
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error("Error searching products:", error);
      return { data: [] };
    }
  }
};