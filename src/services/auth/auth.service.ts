import instance from "../../apis";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  otp: string;
}

interface ProfileData {
  name: string;
  phone?: string;
  province?: string;
  district?: string;
  ward?: string;
  address?: string;
  birth_date?: string;
  gender?: string;
}

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export const authService = {
  login: async (data: LoginData) => {
    try {
      const response = await instance.post('/login', data);
      let result = response.data;
      
      // Xử lý response string
      if (typeof result === 'string') {
        const jsonString = result
          .replace(/^\/\/ bootstrap\/app\.php\n/, '')
          .replace(/<<<<<<< HEAD\n/g, '')
          .replace(/=======\n/g, '')
          .replace(/>>>>>>> [^\n]+\n/g, '');
        result = JSON.parse(jsonString);
      }
      
      console.log('Login response:', result);
      
      if (result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        console.log('Token saved:', result.token);
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterData) => {
    try {
      const response = await instance.post('/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await instance.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  updateProfile: async (data: any) => {
    try {
      const response = await instance.put('/profile', data);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (data: any) => {
    try {
      const response = await instance.put('/change-password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendOtp: async (email: string) => {
    try {
      const response = await instance.post('/send-otp', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  verifyOtp: async (email: string, otp: string) => {
    try {
      const response = await instance.post('/verify-otp', { email, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await instance.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (data: { email: string; otp: string; new_password: string; new_password_confirmation: string }) => {
    try {
      const response = await instance.post('/reset-password', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};