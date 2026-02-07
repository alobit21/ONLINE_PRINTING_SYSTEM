import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState } from '../features/auth/types';

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false, // Could be used for hydration check

            login: (user, token) => {
                localStorage.setItem('token', token); // For Apollo Link
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage', // unique name
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
        }
    )
);
