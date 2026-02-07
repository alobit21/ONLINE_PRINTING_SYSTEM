import { useAuthStore } from '../../../stores/authStore';
import { LOGIN_MUTATION, REGISTER_MUTATION } from '../api';
import type { LoginMutationData, RegisterMutationData } from '../types';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

export const useAuth = () => {
    const navigate = useNavigate();
    const { login: setAuthUser } = useAuthStore();
    const [error, setError] = useState<string | null>(null);

    const [loginMutation, { loading: loginLoading }] = useMutation<LoginMutationData>(LOGIN_MUTATION);
    const [registerMutation, { loading: registerLoading }] = useMutation<RegisterMutationData>(REGISTER_MUTATION);

    const login = async (form: any) => {
        setError(null);
        try {
            const { data } = await loginMutation({ variables: form });
            if (data?.tokenAuth?.token) {
                const { token, user: gqlUser } = data.tokenAuth;
                // Map GraphQL response to User type
                const user = {
                    id: gqlUser.id,
                    email: gqlUser.email,
                    role: gqlUser.role as "CUSTOMER" | "SHOP_OWNER" | "ADMIN",
                    is_verified: gqlUser.isVerified,
                    avatar: gqlUser.avatar,
                };
                setAuthUser(user, token);

                // Redirect based on role
                if (user.role === 'SHOP_OWNER') {
                    navigate('/dashboard/shop');
                } else if (user.role === 'ADMIN') {
                    navigate('/dashboard/admin');
                } else {
                    navigate('/dashboard/customer');
                }
            } else {
                setError(data?.tokenAuth?.response?.message || "Login failed");
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        }
    };

    const register = async (form: any) => {
        setError(null);
        try {
            const { data } = await registerMutation({ variables: form });
            if (data?.registerUser?.response?.status) {
                // Auto login or redirect to login? Typically redirect to login for security/verification flow
                // or auto-login if backend returns token (which current register mutation does NOT).
                navigate('/login', { state: { message: "Account created! Please log in." } });
            } else {
                setError(data?.registerUser?.response?.message || "Registration failed");
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
        }
    };

    return {
        login,
        register,
        isLoading: loginLoading || registerLoading,
        error
    };
};
