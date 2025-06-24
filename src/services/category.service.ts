import instance from "../apis";

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
      const response = await instance.get("/categories");
      const data = parseResponse(response);
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { data: [] };
    }
  }
};