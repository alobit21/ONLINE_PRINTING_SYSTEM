import { z } from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    role: z.enum(["CUSTOMER", "SHOP_OWNER"], {
        message: "Please select a valid role"
    }),
    phone_number: z.string().optional(),
});

export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface User {
    id: string;
    email: string;
    role: "CUSTOMER" | "SHOP_OWNER" | "ADMIN";
    is_verified: boolean;
    avatar?: string;
}

export interface Response {
    status: boolean;
    message: string;
}

export interface LoginMutationData {
    tokenAuth: {
        token: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            role: string;
            isVerified: boolean;
            avatar?: string;
        };
        response: Response;
    };
}

export interface RegisterMutationData {
    registerUser: {
        response: Response;
        user: {
            id: string;
            email: string;
            role: string;
        };
    };
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User, token: string) => void;
    logout: () => void;
}
