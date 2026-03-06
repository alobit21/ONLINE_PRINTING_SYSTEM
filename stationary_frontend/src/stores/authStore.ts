import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState } from '../features/auth/types';

// Debug localStorage content
console.log('AuthStore Init - localStorage token:', localStorage.getItem('token'));
console.log('AuthStore Init - localStorage auth-storage:', localStorage.getItem('auth-storage'));

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false, // Could be used for hydration check

            login: (user, token) => {
                console.log('AuthStore Login - User:', user);
                console.log('AuthStore Login - Token:', token ? token.substring(0, 20) + '...' : 'none');
                localStorage.setItem('token', token); // For Apollo Link
                set({ user, token, isAuthenticated: true });
            },

            logout: () => {
                console.log('AuthStore Logout - Clearing auth');
                localStorage.removeItem('token');
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'auth-storage', // unique name
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
            onRehydrateStorage: () => (state) => {
                console.log('AuthStore Rehydrate - State:', state);
                return state;
            },
        }
    )
);
