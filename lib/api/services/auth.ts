import api from "../axios-config";

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  id: string;
  email: string;
  tokenType: string;
  roles: Array<string>;
  accessToken: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
};

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/user/signin", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/user/logout");
  },

  getCurrentUser: async () => {
    const response = await api.get("/admin/me");
    return response.data;
  },
};

