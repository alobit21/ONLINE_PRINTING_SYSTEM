import { useCustomerStore } from '../../../../stores/customerStore';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { CreditCard, ShieldCheck, Truck, Quote, CheckCircle2, AlertTriangle, FileCheck, Loader2 } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client/react';
import { CREATE_ORDER } from '../../orders/api';
import { GET_SHOP_DETAILS } from '../../../shops/api';
import type { GetShopDetailsData } from '../../../shops/types';
import type { CreateOrderData, OrderItemInput } from '../../orders/types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CheckoutAction = () => {
    const navigate = useNavigate();
    const { files, selectedShopId, resetWorkflow } = useCustomerStore();
    const [isSuccess, setIsSuccess] = useState(false);

    const isUUID = (str: string) => {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return regex.test(str);
    };

    const readyFiles = files.filter(f => f.status === 'ready' && isUUID(f.id));
    const hasInvalidFiles = files.some(f => f.status === 'ready' && !isUUID(f.id));

    // Fetch Shop Details
    const { data: shopData, loading: shopLoading } = useQuery<GetShopDetailsData>(GET_SHOP_DETAILS, {
        variables: { id: selectedShopId },
        skip: !selectedShopId
    });

    const [createOrder, { loading: isProcessing }] = useMutation<CreateOrderData, { shopId: string; items: OrderItemInput[] }>(CREATE_ORDER, {
        onCompleted: (data) => {
            if (data.createOrder.response.status) {
                setIsSuccess(true);
            }
        }
    });

    const shop = shopData?.shopDetails?.data;

    // Price Calculation
    const subtotal = readyFiles.reduce((acc, f) => acc + (f.metadata?.pageCount || 0) * (f.metadata?.isColor ? 0.50 : 0.10), 0);
    const serviceFee = 2.00;
    const laminationFee = 5.00;
    const discount = 1.50;
    const total = subtotal + serviceFee + laminationFee - discount;

    const handleCheckout = async () => {
        if (!selectedShopId) return;

        const items = readyFiles.map(file => ({
            documentId: file.id,
            pageCount: file.metadata?.pageCount || 1,
            isColor: file.metadata?.isColor || false,
            isBinding: true, // Example
            isLamination: false,
            paperSize: file.metadata?.paperSize || "A4"
        }));

        try {
            await createOrder({
                variables: {
                    shopId: selectedShopId,
                    items
                }
            });
        } catch (err) {
            console.error("Order creation failed:", err);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center text-center py-20 animate-fade-in">
                <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6 scale-up-center">
                    <CheckCircle2 className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-extrabold text-slate-900">Order Placed!</h2>
                <p className="text-slate-500 mt-2 max-w-sm">Your order has been sent to {shop?.name || 'the shop'}. You'll receive a notification when it's ready.</p>
                <div className="mt-10 flex gap-4">
                    <Button variant="primary" onClick={() => navigate('/dashboard/customer/orders')}>View Order status</Button>
                    <Button variant="outline" onClick={resetWorkflow}>New Print Job</Button>
                </div>
            </div>
        );
    }

    if (shopLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-12 w-12 text-brand-600 animate-spin" />
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Finalizing details...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Final Review</h2>
                <p className="text-slate-500">Confirm your printing configuration and place your order.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-6">
                    <Card className="glass border-none shadow-xl rounded-3xl overflow-hidden">
                        <CardHeader className="bg-brand-600/5 p-6 border-b border-brand-100">
                            <CardTitle className="text-lg font-bold flex items-center gap-2 text-brand-700">
                                <FileCheck className="h-5 w-5" />
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
                                            TZS {((file.metadata?.pageCount || 0) * (file.metadata?.isColor ? 0.50 : 0.10)).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100 flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                                <Truck className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Pickup Point</p>
                                <p className="font-bold text-slate-900">{shop?.name || 'Select Shop'}</p>
                                <p className="text-xs text-slate-500">{shop?.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="p-4 bg-slate-100 rounded-2xl flex gap-3 text-slate-600">
                            <ShieldCheck className="h-5 w-5 text-brand-500" />
                            <span>Encrypted file transfer & temporary storage.</span>
                        </div>
                        <div className="p-4 bg-slate-100 rounded-2xl flex gap-3 text-slate-600">
                            <Quote className="h-5 w-5 text-brand-500" />
                            <span>Print Quality Guarantee: Satisfied or Reprint.</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-4">
                    <Card className="glass border-brand-500/20 shadow-2xl rounded-3xl overflow-hidden sticky top-24">
                        <CardHeader className="p-6">
                            <CardTitle className="text-xl font-bold">Pricing Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Base Printing</span>
                                    <span>TZS {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-lg">
                                    <span>Discount</span>
                                    <span>-TZS {discount.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex justify-between items-baseline mb-6">
                                    <span className="text-lg font-bold text-slate-900">Total</span>
                                    <span className="text-3xl font-black text-brand-700">TZS {total.toLocaleString()}</span>
                                </div>

                                {!selectedShopId && (
                                    <div className="flex gap-2 p-3 bg-amber-50 rounded-xl text-amber-700 text-[10px] mb-4 items-start">
                                        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                                        <span>Please select a shop before checking out.</span>
                                    </div>
                                )}

                                {hasInvalidFiles && !isProcessing && (
                                    <div className="flex flex-col gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 mb-4 text-center">
                                        <div className="flex items-center gap-2 text-red-700 justify-center">
                                            <AlertTriangle className="h-5 w-5" />
                                            <span className="font-bold text-xs uppercase tracking-tight">Stale Session Detected</span>
                                        </div>
                                        <p className="text-[10px] text-red-600 leading-tight">Some items were uploaded in a previous session and are incompatible with the current security standards.</p>
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
                                    onClick={handleCheckout}
                                >
                                    {isProcessing ? <Loader2 className="h-6 w-6 animate-spin" /> : <CreditCard className="h-6 w-6" />}
                                    Place Order
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};
