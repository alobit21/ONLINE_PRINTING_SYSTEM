import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Phone, Mail, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface GuestVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (contactInfo: { email?: string; whatsappNumber: string }) => void;
    title: string;
    description: string;
}

export const GuestVerificationModal = ({ isOpen, onClose, onSuccess, title, description }: GuestVerificationModalProps) => {
    const [contactInfo, setContactInfo] = useState({
        email: '',
        whatsappNumber: ''
    });
    const [errors, setErrors] = useState<Partial<typeof contactInfo>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    const handleInputChange = (field: keyof typeof contactInfo, value: string) => {
        setContactInfo(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = () => {
        const newErrors: Partial<typeof contactInfo> = {};

        if (!contactInfo.email && !contactInfo.whatsappNumber) {
            newErrors.email = 'Please provide either email or WhatsApp number';
            newErrors.whatsappNumber = 'Please provide either email or WhatsApp number';
        }

        if (contactInfo.email && !validateEmail(contactInfo.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (contactInfo.whatsappNumber && !validatePhone(contactInfo.whatsappNumber)) {
            newErrors.whatsappNumber = 'Please enter a valid WhatsApp number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        
        console.log('GuestVerificationModal - Submitting contact info:', contactInfo);
        
        try {
            // Simulate API call to verify guest contact
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            console.log('GuestVerificationModal - Verification successful, calling onSuccess');
            setIsVerified(true);
            setTimeout(() => {
                onSuccess(contactInfo);
                onClose();
                // Reset form
                setContactInfo({ email: '', whatsappNumber: '' });
                setIsVerified(false);
            }, 1000);
        } catch (error) {
            console.error('GuestVerificationModal - Verification failed:', error);
            setErrors({ email: 'Verification failed. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSkip = () => {
        onSuccess({ whatsappNumber: '' }); // Empty for skip
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md">
                <Card className="bg-white dark:bg-slate-800 shadow-2xl border-0">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white mb-4">
                            <Search className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            {title}
                        </CardTitle>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            {description}
                        </p>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {!isVerified ? (
                            <>
                                <div className="text-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                    <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-400 mb-2">
                                        <AlertCircle className="w-4 h-4" />
                                        <span className="text-sm font-medium">Guest Order Verification</span>
                                    </div>
                                    <p className="text-xs text-amber-600 dark:text-amber-500">
                                        Please enter the contact details you used when placing your order
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={contactInfo.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            className={cn(
                                                "pl-10",
                                                errors.email && "border-red-300 focus:border-red-500"
                                            )}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="text-center">
                                    <span className="text-sm text-slate-500 dark:text-slate-400">OR</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        WhatsApp Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="tel"
                                            placeholder="+255 123 456 789"
                                            value={contactInfo.whatsappNumber}
                                            onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                                            className={cn(
                                                "pl-10",
                                                errors.whatsappNumber && "border-red-300 focus:border-red-500"
                                            )}
                                        />
                                    </div>
                                    {errors.whatsappNumber && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" />
                                            {errors.whatsappNumber}
                                        </p>
                                    )}
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        onClick={handleSkip}
                                        className="flex-1"
                                        disabled={isLoading}
                                    >
                                        Skip
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        className="flex-1"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Verifying...' : 'Verify & Continue'}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Verification Successful!
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Redirecting you to your orders...
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
