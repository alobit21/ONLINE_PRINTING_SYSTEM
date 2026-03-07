import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { Input } from '../../../../components/ui/Input';
import { User, Phone, Mail, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { useCustomerStore } from '../../../../stores/customerStore';
import { useMutation } from '@apollo/client/react';
import { CREATE_GUEST_ORDER } from '../../orders/api';
import type { CreateGuestOrderData, OrderItemInput } from '../../orders/types';
import { useNavigate } from 'react-router-dom';

interface GuestCustomerData {
  name: string;
  whatsappNumber: string;
  email?: string;
}

export const GuestCheckoutForm = () => {
    const navigate = useNavigate();
    const { files, selectedShopId, resetWorkflow } = useCustomerStore();
    const [isSuccess, setIsSuccess] = useState(false);
    const [guestData, setGuestData] = useState<GuestCustomerData>({
        name: '',
        whatsappNumber: '',
        email: ''
    });
    const [errors, setErrors] = useState<Partial<GuestCustomerData>>({});

    const isUUID = (str: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(str);
    };

    const readyFiles = files.filter(f => f.status === 'ready' && isUUID(f.id));
    const hasInvalidFiles = files.some(f => f.status === 'ready' && !isUUID(f.id));

    const [createGuestOrder, { loading: isProcessing }] = useMutation<CreateGuestOrderData, { 
        shopId: string; 
        guestCustomer: GuestCustomerData; 
        items: OrderItemInput[] 
    }>(CREATE_GUEST_ORDER, {
        onCompleted: (data) => {
            if (data.createGuestOrder.response.status) {
                setIsSuccess(true);
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

        try {
            await createGuestOrder({
                variables: {
                    shopId: selectedShopId,
                    guestCustomer: {
                        name: guestData.name.trim(),
                        whatsappNumber: guestData.whatsappNumber.trim(),
                        email: guestData.email?.trim() || undefined
                    },
                    items
                }
            });
        } catch (err: any) {
            console.error("Guest order creation failed:", err);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6 scale-up-center">
                    <ShieldCheck className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900">Order Placed!</h2>
                <p className="text-slate-500 mt-2 max-w-sm">
                    Your order has been placed successfully. The shop owner will contact you on WhatsApp at {guestData.whatsappNumber} when your order is ready.
                </p>
                <div className="mt-10 flex gap-4">
                    <Button variant="primary" onClick={resetWorkflow}>Place Another Order</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Guest Checkout</h2>
                <p className="text-slate-500">Provide your contact details so we can reach you when your order is ready.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="glass border-none shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-brand-600/5 p-6 border-b border-brand-100">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-brand-700">
                                <User className="h-5 w-5" />
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Full Name *
                                </label>
                                <Input
                                    placeholder="Enter your full name"
                                    value={guestData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={`w-full ${errors.name ? 'border-red-300 focus:border-red-500' : ''}`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    WhatsApp Number *
                                </label>
                                <Input
                                    placeholder="+255 123 456 789"
                                    value={guestData.whatsappNumber}
                                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                                    className={`w-full ${errors.whatsappNumber ? 'border-red-300 focus:border-red-500' : ''}`}
                                />
                                {errors.whatsappNumber && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.whatsappNumber}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500 mt-1">
                                    The shop owner will contact you on this number when your order is ready.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email (Optional)
                                </label>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={guestData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertTriangle className="h-3 w-3" />
                                        {errors.email}
                                    </p>
                                )}
                                <p className="text-xs text-slate-500 mt-1">
                                    Optional: For order confirmation and updates.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="glass border-none shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-brand-600/5 p-6 border-b border-brand-100">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-brand-700">
                                <Phone className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <ul className="divide-y divide-slate-100">
                                {readyFiles.map((file) => (
                                    <li key={file.id} className="py-4 flex justify-between items-center group">
                                        <div className="flex gap-4">
                                            <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                                                {file.name.split('.').pop()?.toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{file.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    {file.metadata?.pageCount} Pages • {file.metadata?.isColor ? 'Color' : 'Grayscale'} • {file.metadata?.paperSize}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-bold text-slate-900">
                                            TZS {((file.metadata?.pageCount || 0) * (file.metadata?.isColor ? 500 : 100)).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-4">
                    <Card className="glass border-brand-500/20 shadow-2xl rounded-3xl overflow-hidden sticky top-24">
                        <CardHeader className="p-6">
                            <CardTitle className="text-xl font-bold">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Base Printing</span>
                                    <span>TZS {subtotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-baseline mb-6">
                                    <span className="text-lg font-bold text-slate-900">Total</span>
                                    <span className="text-3xl font-black text-brand-700">TZS {total.toLocaleString()}</span>
                                </div>

                                {hasInvalidFiles && !isProcessing && (
                                    <div className="flex flex-col gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 mb-4 text-center">
                                        <div className="flex items-center gap-2 text-red-700 justify-center">
                                            <AlertTriangle className="h-5 w-5" />
                                            <span className="font-bold text-xs uppercase tracking-tight">Session Issue</span>
                                        </div>
                                        <p className="text-[10px] text-red-600 leading-tight">Some items need to be reuploaded.</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={resetWorkflow}
                                            className="h-8 text-[10px] border-red-200 text-red-600 hover:bg-red-100"
                                        >
                                            Reset & Start Fresh
                                        </Button>
                                    </div>
                                )}

                                <Button
                                    className="w-full h-14 rounded-2xl gradient-brand text-white font-black text-lg shadow-xl shadow-brand-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3"
                                    disabled={!selectedShopId || readyFiles.length === 0 || isProcessing || hasInvalidFiles}
                                    onClick={handleGuestCheckout}
                                >
                                    {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Phone className="h-6 w-6" />}
                                    Place Order as Guest
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
