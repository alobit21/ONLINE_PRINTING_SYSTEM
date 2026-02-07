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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-brand-700">
                        Welcome Back
                    </CardTitle>
                    <CardDescription>
                        Enter your email to sign in to your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="grid gap-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm font-medium border border-red-100 animate-in fade-in slide-in-from-top-1">
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
                        <p className="text-center text-sm text-slate-600">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-500 hover:underline transition-all">
                                Sign up
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
