import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { User, Phone, Mail, ShieldCheck, AlertTriangle, Loader2, ShoppingBag, FileText, Clock } from 'lucide-react';
import { useCustomerStore } from '../../../../stores/customerStore';
import { useMutation } from '@apollo/client/react';
import { CREATE_GUEST_ORDER } from '../../orders/api';
import type { CreateGuestOrderData, OrderItemInput } from '../../orders/types';
import { useNavigate } from 'react-router-dom';
import PaymentStatusTracker from './PaymentStatusTracker';

interface GuestCustomerData {
  name: string;
  whatsappNumber: string;
  email?: string;
}

interface PaymentData {
  paymentMethod: string;
  phoneNumber: string;
}

export const GuestCheckoutForm = () => {
    const navigate = useNavigate();
    const { files, selectedShopId, resetWorkflow } = useCustomerStore();
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentId, setPaymentId] = useState<string | null>(null);
    const [showPaymentTracker, setShowPaymentTracker] = useState(false);
    const [guestData, setGuestData] = useState<GuestCustomerData>({
        name: '',
        whatsappNumber: '',
        email: ''
    });
    const [errors, setErrors] = useState<Partial<GuestCustomerData>>({});
    const [paymentMethod, setPaymentMethod] = useState('MPESA');
    const [phoneNumber, setPhoneNumber] = useState('');

    const isUUID = (str: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(str);
    };

    const readyFiles = files.filter(f => f.status === 'ready' && isUUID(f.id));
    const hasInvalidFiles = files.some(f => f.status === 'ready' && !isUUID(f.id));

    const [createGuestOrder, { loading: isProcessing }] = useMutation<CreateGuestOrderData, { 
        shopId: string; 
        guestCustomer: GuestCustomerData; 
        items: OrderItemInput[];
        payment?: PaymentData;
    }>(CREATE_GUEST_ORDER, {
        onCompleted: (data) => {
            if (data.createGuestOrder.response.status) {
                // Show payment tracker instead of success message
                setPaymentId(data.createGuestOrder.payment?.id || null);
                setShowPaymentTracker(true);
            }
        },
        onError: (err) => {
            console.error("Guest order creation failed:", err);
        }
    });

    // Price Calculation
    const subtotal = readyFiles.reduce((acc, f) => {
        const baseRate = f.metadata?.isColor ? 500 : 100;
        let itemCost = (f.metadata?.pageCount || 0) * baseRate;

        if (f.metadata?.isBinding) itemCost += 1000;
        if (f.metadata?.isLamination) itemCost += 1000;

        return acc + itemCost;
    }, 0);

    const total = subtotal;

    const validateForm = (): boolean => {
        const newErrors: Partial<GuestCustomerData> = {};

        if (!guestData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!guestData.whatsappNumber.trim()) {
            newErrors.whatsappNumber = 'WhatsApp number is required';
        } else if (!/^\+?[\d\s-()]+$/.test(guestData.whatsappNumber)) {
            newErrors.whatsappNumber = 'Invalid phone number format';
        }

        if (guestData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Validate payment phone number
        if (!phoneNumber.trim()) {
            alert('Payment phone number is required');
            return false;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof GuestCustomerData, value: string) => {
        setGuestData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleGuestCheckout = async () => {
        if (!selectedShopId || !validateForm()) return;

        const items = readyFiles.map(file => ({
            documentId: file.id,
            pageCount: file.metadata?.pageCount || 1,
            isColor: file.metadata?.isColor || false,
            isBinding: file.metadata?.isBinding || false,
            isLamination: file.metadata?.isLamination || false,
            paperSize: file.metadata?.paperSize || "A4"
        }));

        const payment: PaymentData = {
            paymentMethod,
            phoneNumber: phoneNumber.trim()
        };

        try {
            await createGuestOrder({
                variables: {
                    shopId: selectedShopId,
                    guestCustomer: {
                        name: guestData.name.trim(),
                        whatsappNumber: guestData.whatsappNumber.trim(),
                        email: guestData.email?.trim() || undefined
                    },
                    items,
                    payment
                }
            });
        } catch (err: any) {
            console.error("Guest order creation failed:", err);
        }
    };

    // Payment completion handlers
    const handlePaymentComplete = () => {
        setIsSuccess(true);
        setShowPaymentTracker(false);
    };

    const handlePaymentFailed = () => {
        console.error("Payment failed");
        setShowPaymentTracker(false);
    };

    // Show payment tracker if payment was initiated
    if (showPaymentTracker && paymentId) {
        return (
            <PaymentStatusTracker
                paymentId={paymentId}
                phoneNumber={phoneNumber}
                paymentMethod={paymentMethod}
                amount={total}
                onComplete={handlePaymentComplete}
                onPaymentFailed={handlePaymentFailed}
            />
        );
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6 scale-up-center">
                    <ShieldCheck className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900">Payment Completed!</h2>
                <p className="text-slate-500 mt-2 max-w-sm">
                    Your payment was successful and order has been confirmed. 
                    The shop owner will contact you on WhatsApp at {guestData.whatsappNumber} when your order is ready.
                </p>
                <div className="mt-10 flex gap-4">
                    <Button variant="primary" onClick={resetWorkflow}>Place Another Order</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Contact Form & Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Section */}
                        <div className="text-center space-y-4 py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl shadow-lg mb-4">
                                <ShieldCheck className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Secure Guest Checkout</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Provide your contact details so we can reach you when your order is ready. Your information is secure and only used for order fulfillment.
                            </p>
                        </div>

                        {/* Contact Information Card */}
                        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 rounded-3xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
                                <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-slate-100">
                                    <div className="w-10 h-10 bg-brand-100 dark:bg-brand-800 rounded-xl flex items-center justify-center">
                                        <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                    </div>
                                    Contact Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Full Name *
                                    </label>
                                    <Input
                                        placeholder="Enter your full name"
                                        value={guestData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className={`w-full h-12 rounded-xl ${errors.name ? 'border-red-300 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400' : 'dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100'}`}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        WhatsApp Number *
                                    </label>
                                    <Input
                                        placeholder="+255 123 456 789"
                                        value={guestData.whatsappNumber}
                                        onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                                        className={`w-full h-12 rounded-xl ${errors.whatsappNumber ? 'border-red-300 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400' : 'dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100'}`}
                                    />
                                    {errors.whatsappNumber && (
                                        <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            {errors.whatsappNumber}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                        The shop owner will contact you on this number when your order is ready.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Email (Optional)
                                    </label>
                                    <Input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={guestData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className={`w-full h-12 rounded-xl ${errors.email ? 'border-red-300 focus:border-red-500 dark:border-red-400 dark:focus:border-red-400' : 'dark:bg-slate-700 dark:border-slate-600 dark:text-slate-100'}`}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1">
                                            <AlertTriangle className="h-3 w-3" />
                                            {errors.email}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                        Optional: For order confirmation and updates.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Information Card */}
                        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 rounded-3xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
                                <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-slate-100">
                                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-800 rounded-xl flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    Payment Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Payment Method *
                                    </label>
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full h-12 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    >
                                        <option value="MPESA">M-Pesa</option>
                                        <option value="TIGOPESA">Tigo Pesa</option>
                                        <option value="AIRTELMONEY">Airtel Money</option>
                                        <option value="HALOPESA">Halopesa</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Payment Phone Number *
                                    </label>
                                    <Input
                                        type="tel"
                                        placeholder="+255 7xx xxx xxx"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                        This number will be used for the mobile money payment prompt.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items Card */}
                        <Card className="border-0 shadow-xl bg-white dark:bg-slate-800 rounded-3xl overflow-hidden">
                            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 border-b border-slate-200 dark:border-slate-700">
                                <CardTitle className="text-xl font-bold flex items-center gap-3 text-slate-900 dark:text-slate-100">
                                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-800 rounded-xl flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    Order Items ({readyFiles.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <ul className="space-y-3">
                                    {readyFiles.map((file) => (
                                        <li key={file.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl group hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                                                    {file.name.split('.').pop()?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{file.name}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        <Clock className="w-3 h-3 inline mr-1" />
                                                        {file.metadata?.pageCount} Pages • {file.metadata?.isColor ? 'Color' : 'Grayscale'} • {file.metadata?.paperSize}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-slate-900 dark:text-slate-100">
                                                    TZS {((file.metadata?.pageCount || 0) * (file.metadata?.isColor ? 500 : 100)).toLocaleString()}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Order Summary Card */}
                            <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-3xl overflow-hidden">
                                <CardHeader className="bg-gradient-to-r from-brand-600 to-blue-600 p-6 text-white">
                                    <CardTitle className="text-xl font-bold flex items-center gap-3">
                                        <ShoppingBag className="w-6 h-6" />
                                        Order Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-slate-600 dark:text-slate-400">Base Printing</span>
                                            <span className="font-semibold text-slate-900 dark:text-slate-100">TZS {subtotal.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Total</span>
                                            <span className="text-3xl font-black text-brand-600 dark:text-brand-400">TZS {total.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {hasInvalidFiles && !isProcessing && (
                                        <div className="flex flex-col gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-800 text-center">
                                            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 justify-center">
                                                <AlertTriangle className="h-5 w-5" />
                                                <span className="font-bold text-xs uppercase tracking-tight">Session Issue</span>
                                            </div>
                                            <p className="text-xs text-red-600 dark:text-red-400 leading-tight">Some items need to be reuploaded.</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={resetWorkflow}
                                                className="h-8 text-xs border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20"
                                            >
                                                Reset & Start Fresh
                                            </Button>
                                        </div>
                                    )}

                                    <Button
                                        className="w-full h-14 rounded-2xl bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 text-white font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3"
                                        disabled={!selectedShopId || readyFiles.length === 0 || isProcessing || hasInvalidFiles || !phoneNumber.trim()}
                                        onClick={handleGuestCheckout}
                                    >
                                        {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : <ShoppingBag className="h-6 w-6" />}
                                        Place Order & Pay
                                    </Button>
                                </CardContent>
                            </Card>

                            {/* Security Badge */}
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-xl flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-800 dark:text-green-200 text-sm">Secure Checkout</p>
                                        <p className="text-xs text-green-600 dark:text-green-400">Your data is encrypted and protected</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
