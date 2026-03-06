import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginInput } from '../../features/auth/types';
import { LoginSchema } from '../../features/auth/types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
    });

    const { login, isLoading, error } = useAuth();

    const onSubmit = (data: LoginInput) => {
        login(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-gray-800/90 backdrop-blur-sm">
                <CardHeader className="space-y-4 text-center">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg">
                            <svg
                                className="h-8 w-8 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 12h6m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-white">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        Enter your email to sign in to your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="bg-red-900/50 text-red-400 p-3 rounded-md text-sm font-medium border border-red-700/50 animate-in fade-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Input
                                id="email"
                                label="Email"
                                type="email"
                                placeholder="m@example.com"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                disabled={isLoading}
                                error={errors.email?.message}
                                {...register("email")}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Input
                                id="password"
                                label="Password"
                                type="password"
                                autoComplete="current-password"
                                disabled={isLoading}
                                error={errors.password?.message}
                                {...register("password")}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20 shadow-lg transition-all duration-200" type="submit" isLoading={isLoading}>
                            Sign In
                        </Button>
                        <p className="text-center text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 hover:underline transition-all">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
