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
    try {
      data = JSON.parse(jsonString);
    } catch (e) {
      console.error('Error parsing JSON:', e);
      console.log('Raw response:', response.data);
      return [];
    }
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
      console.log('Products data:', data); // Debug log
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error('Error fetching products:', error); // Log error for debugging
      return { data: [] };
    }
  },

  getProductById: async (id: number) => {
    try {
      const response = await instance.get(`/products/${id}`);
      const data = parseResponse(response);
      return { data };
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return { data: null };
    }
  },

  searchProducts: async (keyword: string) => {
    try {
      const response = await instance.get(`/products/search?keyword=${keyword}`);
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error("Error searching products:", error);
      return { data: [] };
    }
  }
};