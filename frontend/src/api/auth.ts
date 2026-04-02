import apiInstance from './apiInstance';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  full_name: string;
  email: string;
  role?: string;
}

export interface LoginUser {
  id: number;
  username: string;
  full_name: string;
  email?: string;
  role: string;
}

export interface LoginResponse {
  access_token: string;
  user: LoginUser;
}

const authApi = {
  login: (payload: LoginPayload): Promise<LoginResponse> => {
    return apiInstance.post('/auth/login', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },

  me: (): Promise<LoginUser> => {
    return apiInstance.get('/auth/me');
  },

  register: (payload: RegisterPayload): Promise<LoginResponse> => {
    return apiInstance.post('/auth/register', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  },
};

export default authApi;
