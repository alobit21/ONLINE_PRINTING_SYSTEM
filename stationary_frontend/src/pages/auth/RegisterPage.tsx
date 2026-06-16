import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterSchema } from '../../features/auth/types';
import type { RegisterInput } from '../../features/auth/types';
import { Button } from '../../components/ui/LegacyButton';
import { Input } from '../../components/ui/LegacyInput';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/LegacyCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../../features/auth/hooks/useAuth';

export const RegisterPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: { role: "CUSTOMER" }
    });

    const { register: registerUser, isLoading, error } = useAuth();

    const onSubmit = (data: RegisterInput) => registerUser(data);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 dark:bg-gray-50 px-4">

            {/* subtle background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_60%)] pointer-events-none" />

            <Card className="relative w-full max-w-md bg-gray-900/80 dark:bg-white/80 backdrop-blur-xl border border-gray-800/50 dark:border-gray-200/50 shadow-2xl rounded-3xl">

                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-black text-white dark:text-gray-900">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-gray-400 dark:text-gray-600">
                        Join the smart printing marketplace
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-5">

                        {/* error */}
                        {error && (
                            <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* email */}
                        <Input
                            id="email"
                            label="Email"
                            type="email"
                            disabled={isLoading}
                            error={errors.email?.message}
                            {...register("email")}
                        />

                        {/* password */}
                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            disabled={isLoading}
                            error={errors.password?.message}
                            {...register("password")}
                        />

                        {/* role selection */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 dark:text-gray-700">
                                Join as
                            </label>

                            <div className="grid grid-cols-2 gap-3">

                                <label className="cursor-pointer p-4 rounded-2xl border border-gray-700 dark:border-gray-300 bg-gray-800/60 dark:bg-white/60 hover:scale-[1.02] transition group has-[:checked]:border-brand-600 has-[:checked]:bg-brand-600/10">
                                    <input type="radio" value="CUSTOMER" {...register("role")} className="hidden" />
                                    <div className="text-sm font-bold text-white dark:text-gray-900 group-has-[:checked]:text-brand-500">
                                        Customer
                                    </div>
                                </label>

                                <label className="cursor-pointer p-4 rounded-2xl border border-gray-700 dark:border-gray-300 bg-gray-800/60 dark:bg-white/60 hover:scale-[1.02] transition group has-[:checked]:border-brand-600 has-[:checked]:bg-brand-600/10">
                                    <input type="radio" value="SHOP_OWNER" {...register("role")} className="hidden" />
                                    <div className="text-sm font-bold text-white dark:text-gray-900 group-has-[:checked]:text-brand-500">
                                        Shop Owner
                                    </div>
                                </label>

                            </div>
                        </div>

                        {/* phone */}
                        <Input
                            id="phone"
                            label="Phone (optional)"
                            type="tel"
                            disabled={isLoading}
                            error={errors.phone_number?.message}
                            {...register("phone_number")}
                        />
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-2xl py-3 font-bold transition active:scale-[0.98]"
                        >
                            Create Account
                        </Button>

                        <p className="text-sm text-center text-gray-400 dark:text-gray-600">
                            Already have an account?{' '}
                            <Link className="text-brand-500 font-semibold hover:underline" to="/login">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};