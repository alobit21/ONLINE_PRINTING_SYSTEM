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
        <div className="min-h-screen flex items-center justify-center bg-canvas transition-colors duration-300 px-4">

            {/* subtle background glow */}

            <Card className="relative w-full max-w-md bg-canvas border border-fog dark:border-charcoal shadow-[0_2px_8px_rgba(26,26,26,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.5)] rounded-[16px]">

                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-3xl font-medium text-ink">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-charcoal">
                        Join the smart printing marketplace
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-5">

                        {/* error */}
                        {error && (
                            <div className="p-3 rounded-md border border-red-200 dark:border-red-700/50 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm">
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
                            <label className="text-sm font-medium text-ink">
                                Join as
                            </label>

                            <div className="grid grid-cols-2 gap-3">

                                <label className="cursor-pointer p-4 rounded-[16px] border border-fog dark:border-charcoal bg-cloud hover:scale-[1.02] transition group has-[:checked]:border-hp-primary has-[:checked]:bg-hp-primary/10">
                                    <input type="radio" value="CUSTOMER" {...register("role")} className="hidden" />
                                    <div className="text-sm font-medium text-ink group-has-[:checked]:text-hp-primary">
                                        Customer
                                    </div>
                                </label>

                                <label className="cursor-pointer p-4 rounded-[16px] border border-fog dark:border-charcoal bg-cloud hover:scale-[1.02] transition group has-[:checked]:border-hp-primary has-[:checked]:bg-hp-primary/10">
                                    <input type="radio" value="SHOP_OWNER" {...register("role")} className="hidden" />
                                    <div className="text-sm font-medium text-ink group-has-[:checked]:text-hp-primary">
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
                            className="w-full bg-hp-primary hover:bg-hp-primary/90 text-canvas rounded-[4px] uppercase tracking-[0.7px] py-3 font-semibold transition active:scale-[0.98]"
                        >
                            Create Account
                        </Button>

                        <p className="text-sm text-center text-charcoal">
                            Already have an account?{' '}
                            <Link className="text-hp-primary font-semibold hover:underline" to="/login">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};