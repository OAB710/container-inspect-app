import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';

type AuthUser = {
  id: number;
  username: string;
  full_name: string;
  email?: string;
  role: string;
};

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  hydrated: boolean;
  setAuth: (token: string, user: AuthUser) => Promise<void>;
  setUser: (user: AuthUser | null) => Promise<void>;
  clearAuthState: () => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>(set => ({
  token: null,
  user: null,
  hydrated: false,

  setAuth: async (token, user) => {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    set({token, user});
  },

  setUser: async user => {
    if (user) {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem(USER_KEY);
    }
    set({user});
  },

  clearAuthState: () => {
    set({token: null, user: null});
  },

  logout: async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    set({token: null, user: null});
  },

  hydrate: async () => {
    try {
      const savedToken = await AsyncStorage.getItem(TOKEN_KEY);
      const userRaw = await AsyncStorage.getItem(USER_KEY);
      const savedUser = userRaw ? (JSON.parse(userRaw) as AuthUser) : null;
      set({token: savedToken, user: savedUser, hydrated: true});
    } catch {
      set({token: null, user: null, hydrated: true});
    }
  },
}));
