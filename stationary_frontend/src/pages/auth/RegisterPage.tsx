import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { RegisterInput } from '../../features/auth/types';
import { RegisterSchema } from '../../features/auth/types'; // Ensure correct import path
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            role: "CUSTOMER" // Default role
        }
    });

    const { register: registerUser, isLoading, error } = useAuth();

    const onSubmit = (data: RegisterInput) => {
        registerUser(data);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight text-brand-700">
                        Create an Account
                    </CardTitle>
                    <CardDescription>
                        Join the smart printing marketplace today
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
                                placeholder="name@example.com"
                                autoComplete="email"
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
                                autoComplete="new-password"
                                disabled={isLoading}
                                error={errors.password?.message}
                                {...register("password")}
                            />
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
                                I want to join as a:
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center space-x-2 border p-3 rounded-md w-full cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                                    <input
                                        type="radio"
                                        value="CUSTOMER"
                                        {...register("role")}
                                        className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                                    />
                                    <span className="text-sm font-medium">Customer</span>
                                </label>
                                <label className="flex items-center space-x-2 border p-3 rounded-md w-full cursor-pointer hover:bg-slate-50 transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50">
                                    <input
                                        type="radio"
                                        value="SHOP_OWNER"
                                        {...register("role")}
                                        className="h-4 w-4 text-brand-600 border-slate-300 focus:ring-brand-500"
                                    />
                                    <span className="text-sm font-medium">Shop Owner</span>
                                </label>
                            </div>
                            {errors.role && <p className="text-xs font-medium text-red-500">{errors.role.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Input
                                id="phone"
                                label="Phone Number (Optional)"
                                type="tel"
                                autoComplete="tel"
                                disabled={isLoading}
                                error={errors.phone_number?.message} // Ensure correct accessor
                                {...register("phone_number")} // Matches Zod schema
                            />
                        </div>

                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20 shadow-lg transition-all duration-200" type="submit" isLoading={isLoading}>
                            Create Account
                        </Button>
                        <p className="text-center text-sm text-slate-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-500 hover:underline transition-all">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};
