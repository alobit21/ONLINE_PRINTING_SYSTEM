import React, { useState } from 'react';
import { User, Phone, ShieldCheck, AlertTriangle, Loader2, ShoppingBag, FileText, CheckCircle2 } from 'lucide-react';
import { useCustomerStore } from '../../../../stores/customerStore';
import { useMutation } from '@apollo/client/react';
import { CREATE_GUEST_ORDER } from '../../orders/api';
import type { CreateGuestOrderData, OrderItemInput } from '../../orders/types';
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
            if (data.createGuestOrder.response.success) {
                setPaymentId(data.createGuestOrder.payment?.id || null);
                setShowPaymentTracker(true);
            }
        },
        onError: (err) => {
            console.error("Guest order creation failed:", err);
        }
    });

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
        if (!guestData.name.trim()) newErrors.name = 'Name is required';
        if (!guestData.whatsappNumber.trim()) {
            newErrors.whatsappNumber = 'WhatsApp number is required';
        } else if (!/^\+?[\d\s-()]+$/.test(guestData.whatsappNumber)) {
            newErrors.whatsappNumber = 'Invalid phone number format';
        }
        if (guestData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestData.email)) {
            newErrors.email = 'Invalid email format';
        }
        if (!phoneNumber.trim()) {
            alert('Payment phone number is required');
            return false;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof GuestCustomerData, value: string) => {
        setGuestData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
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
        const payment: PaymentData = { paymentMethod, phoneNumber: phoneNumber.trim() };
        try {
            await createGuestOrder({
                variables: { shopId: selectedShopId, guestCustomer: { name: guestData.name.trim(), whatsappNumber: guestData.whatsappNumber.trim(), email: guestData.email?.trim() || undefined }, items, payment }
            });
        } catch (err: any) {
            console.error("Guest order creation failed:", err);
        }
    };

    const handlePaymentComplete = () => { setIsSuccess(true); setShowPaymentTracker(false); };
    const handlePaymentFailed = () => { console.error("Payment failed"); setShowPaymentTracker(false); };

    if (showPaymentTracker && paymentId) {
        return <PaymentStatusTracker paymentId={paymentId} phoneNumber={phoneNumber} paymentMethod={paymentMethod} amount={total} onComplete={handlePaymentComplete} onPaymentFailed={handlePaymentFailed} />;
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <div className="h-24 w-24 rounded-full bg-hp-primary/10 flex items-center justify-center text-hp-primary mb-6 scale-up-center">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-extrabold text-ink mb-2">Order Confirmed!</h2>
                <p className="text-charcoal max-w-sm mx-auto leading-relaxed">
                    Your payment was successful. The shop owner will contact you on WhatsApp at <span className="font-semibold text-ink">{guestData.whatsappNumber}</span> when your print is ready.
                </p>
                <button onClick={resetWorkflow} className="mt-10 px-8 py-3 bg-hp-primary text-canvas font-semibold rounded-[4px] hover:bg-hp-primary/90 transition-colors tracking-[0.7px]">
                    Place Another Order
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 pb-32 lg:pb-12 pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column - Input Form */}
                <div className="lg:col-span-7 space-y-12">
                    
                    {/* Contact Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-cloud flex items-center justify-center text-hp-primary">
                                <User size={16} />
                            </div>
                            <h3 className="text-xl font-medium text-ink">Contact Information</h3>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1.5">Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={guestData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className={`w-full h-12 bg-canvas border ${errors.name ? 'border-red-400 focus:ring-red-400/20' : 'border-steel focus:border-ink'} rounded-[4px] px-4 text-ink outline-none transition-all`}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertTriangle size={12} />{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1.5">WhatsApp Number *</label>
                                <input
                                    type="tel"
                                    placeholder="+255 123 456 789"
                                    value={guestData.whatsappNumber}
                                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                                    className={`w-full h-12 bg-canvas border ${errors.whatsappNumber ? 'border-red-400 focus:ring-red-400/20' : 'border-steel focus:border-ink'} rounded-[4px] px-4 text-ink outline-none transition-all`}
                                />
                                {errors.whatsappNumber && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertTriangle size={12} />{errors.whatsappNumber}</p>}
                                <p className="text-xs text-steel mt-2">The shop will notify you on WhatsApp when the order is ready.</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1.5">Email <span className="font-normal text-steel">(Optional)</span></label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={guestData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`w-full h-12 bg-canvas border ${errors.email ? 'border-red-400 focus:ring-red-400/20' : 'border-steel focus:border-ink'} rounded-[4px] px-4 text-ink outline-none transition-all`}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1"><AlertTriangle size={12} />{errors.email}</p>}
                            </div>
                        </div>
                    </section>

                    {/* Divider */}
                    <hr className="border-fog" />

                    {/* Payment Section */}
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-cloud flex items-center justify-center text-hp-primary">
                                <Phone size={16} />
                            </div>
                            <h3 className="text-xl font-medium text-ink">Payment Details</h3>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1.5">Mobile Money Provider</label>
                                <div className="relative">
                                    <select
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full h-12 bg-canvas border border-steel focus:border-ink rounded-[4px] px-4 text-ink outline-none transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="MPESA">Vodacom M-Pesa</option>
                                        <option value="TIGOPESA">Tigo Pesa</option>
                                        <option value="AIRTELMONEY">Airtel Money</option>
                                        <option value="HALOPESA">Halopesa</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-steel">
                                        ▼
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-ink mb-1.5">Payment Phone Number *</label>
                                <input
                                    type="tel"
                                    placeholder="+255 7xx xxx xxx"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full h-12 bg-canvas border border-steel focus:border-ink rounded-[4px] px-4 text-ink outline-none transition-all"
                                />
                                <p className="text-xs text-steel mt-2">We will send a push prompt to this number to complete payment.</p>
                            </div>
                        </div>
                    </section>

                    {/* Security Note */}
                    <div className="bg-cloud/50 rounded-[8px] p-4 flex items-start gap-3 border border-fog">
                        <ShieldCheck className="w-5 h-5 text-hp-primary shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-ink">Secure Encrypted Checkout</p>
                            <p className="text-xs text-charcoal mt-1">Your payment details and documents are securely processed and protected by end-to-end encryption.</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Summary & Items */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Final Details Heading placed here so forms are well seen */}
                    <div className="space-y-2">
                        <h2 className="text-[28px] font-medium text-ink leading-tight">Final Details</h2>
                        <p className="text-charcoal text-sm">Please provide your contact details for order pickup and select your preferred payment method.</p>
                    </div>

                    <div className="sticky top-24 bg-canvas border border-fog rounded-[16px] overflow-hidden shadow-[0_2px_8px_rgba(26,26,26,0.08)] flex flex-col">
                        
                        <div className="bg-cloud p-6 border-b border-fog">
                            <h3 className="text-lg font-medium text-ink flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-hp-primary" />
                                Order Summary
                            </h3>
                        </div>

                        {/* Items List */}
                        <div className="p-6 max-h-[300px] overflow-y-auto hide-scrollbar border-b border-fog bg-canvas">
                            <h4 className="text-xs font-bold uppercase tracking-[0.7px] text-steel mb-4">Items ({readyFiles.length})</h4>
                            <ul className="space-y-4">
                                {readyFiles.map((file) => (
                                    <li key={file.id} className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-cloud rounded-[4px] flex items-center justify-center text-hp-primary shrink-0">
                                            <FileText size={18} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-ink truncate">{file.name}</p>
                                            <p className="text-xs text-steel mt-0.5">
                                                {file.metadata?.pageCount} Pgs • {file.metadata?.isColor ? 'Color' : 'B&W'}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-medium text-sm text-ink">
                                                TZS {((file.metadata?.pageCount || 0) * (file.metadata?.isColor ? 500 : 100)).toLocaleString()}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Totals */}
                        <div className="p-6 bg-canvas">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-charcoal font-medium">Total to Pay</span>
                                <span className="text-2xl font-semibold text-ink tracking-tight">TZS {total.toLocaleString()}</span>
                            </div>

                            {hasInvalidFiles && !isProcessing && (
                                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-[8px]">
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5 mb-2">
                                        <AlertTriangle size={14} /> Session expired for some items.
                                    </p>
                                    <button onClick={resetWorkflow} className="text-xs text-red-700 dark:text-red-300 hover:underline">
                                        Click here to restart
                                    </button>
                                </div>
                            )}

                            {/* Desktop Button */}
                            <button
                                className="hidden lg:flex w-full h-12 rounded-[4px] bg-hp-primary hover:bg-hp-primary/90 text-canvas font-semibold transition-colors items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-[0.7px] uppercase text-[14px]"
                                disabled={!selectedShopId || readyFiles.length === 0 || isProcessing || hasInvalidFiles || !phoneNumber.trim() || !guestData.name.trim() || !guestData.whatsappNumber.trim()}
                                onClick={handleGuestCheckout}
                            >
                                {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                Pay TZS {total.toLocaleString()}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Action Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-canvas/90 backdrop-blur-md border-t border-fog p-4 z-50 shadow-[0_-4px_24px_rgba(26,26,26,0.08)]">
                <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-steel uppercase tracking-[0.5px]">Total</span>
                        <span className="text-lg font-semibold text-ink leading-none">TZS {total.toLocaleString()}</span>
                    </div>
                    <button
                        className="flex-1 h-12 rounded-[4px] bg-hp-primary hover:bg-hp-primary/90 text-canvas font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed tracking-[0.7px] uppercase text-[14px]"
                        disabled={!selectedShopId || readyFiles.length === 0 || isProcessing || hasInvalidFiles || !phoneNumber.trim() || !guestData.name.trim() || !guestData.whatsappNumber.trim()}
                        onClick={handleGuestCheckout}
                    >
                        {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isProcessing ? 'Processing...' : 'Place Order & Pay'}
                    </button>
                </div>
            </div>
        </div>
    );
};
