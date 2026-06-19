import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { LoginInput } from '../../features/auth/types';
import { LoginSchema } from '../../features/auth/types';
import { Button } from '../../components/ui/LegacyButton';
import { Input } from '../../components/ui/LegacyInput';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/LegacyCard';
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
        <div className="flex min-h-screen items-center justify-center bg-canvas transition-colors duration-300 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-[0_2px_8px_rgba(26,26,26,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)] border border-fog dark:border-charcoal bg-canvas rounded-[16px]">
                <CardHeader className="space-y-4 text-center">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[16px] bg-hp-primary shadow-[0_2px_8px_rgba(26,26,26,0.08)]">
                            <svg
                                className="h-8 w-8 text-canvas"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M9 12h6m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-medium tracking-tight text-ink">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-charcoal">
                        Enter your email to sign in to your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md text-sm font-medium border border-red-200 dark:border-red-700/50 animate-in fade-in slide-in-from-top-1">
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
                        <Button className="w-full bg-hp-primary hover:bg-hp-primary/90 text-canvas rounded-[4px] uppercase tracking-[0.7px] font-semibold transition-all duration-200" type="submit" isLoading={isLoading}>
                            Sign In
                        </Button>
                        <p className="text-center text-sm text-charcoal">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-hp-primary hover:underline transition-all">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
