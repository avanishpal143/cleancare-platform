import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomerDTO, UserDTO } from '@cleancare/types';

interface AuthState {
  user: UserDTO | null;
  customer: CustomerDTO | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setTokens: (access: string, refresh: string) => void;
  setUser: (user: UserDTO, customer?: CustomerDTO) => void;
  setCustomer: (customer: CustomerDTO) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      customer: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setTokens: (accessToken, refreshToken) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('cc_access_token', accessToken);
          localStorage.setItem('cc_refresh_token', refreshToken);
        }
        set({ accessToken, refreshToken });
      },

      setUser: (user, customer) =>
        set({ user, customer: customer || null, isAuthenticated: true }),

      setCustomer: (customer) => set({ customer }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cc_access_token');
          localStorage.removeItem('cc_refresh_token');
        }
        set({
          user: null,
          customer: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'cc-auth',
      partialize: (state) => ({
        user: state.user,
        customer: state.customer,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
