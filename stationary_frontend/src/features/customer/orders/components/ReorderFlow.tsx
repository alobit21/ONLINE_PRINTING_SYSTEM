import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, RefreshCw, Edit3, ShoppingCart, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import type { Order } from '../types';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { CREATE_ORDER } from '../api';

interface ReorderFlowProps {
    order: Order | null;
    onClose: () => void;
    onSuccess?: () => void;
}

export const ReorderFlow = ({ order, onClose, onSuccess }: ReorderFlowProps) => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'error'>('confirm');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const [createOrder] = useMutation(CREATE_ORDER);

    if (!order) return null;

    const handleQuickReorder = async () => {
        setStep('processing');
        setErrorMessage('');

        try {
            // Map order items to the expected input format
            const items = order.items.map(item => ({
                documentId: item.document.id,
                pageCount: item.pageCount,
                isColor: item.configSnapshot.is_color,
                isBinding: item.configSnapshot.binding,
                isLamination: item.configSnapshot.lamination,
                paperSize: item.configSnapshot.paper_size,
            }));

            const { data } = await createOrder({
                variables: {
                    shopId: order.shop.id,
                    items: items,
                },
            });

            if (data?.createOrder?.response?.status) {
                setStep('success');
                setTimeout(() => {
                    onClose();
                    onSuccess?.();
                }, 2000);
            } else {
                throw new Error(data?.createOrder?.response?.message || 'Failed to create order');
            }
        } catch (err: any) {
            setStep('error');
            setErrorMessage(err.message || 'Failed to reorder. Please try again.');
        }
    };

    const handleEditAndReorder = () => {
        // Navigate to upload page with pre-filled data
        navigate('/dashboard/customer/upload', {
            state: {
                reorderData: {
                    shopId: order.shop.id,
                    items: order.items,
                }
            }
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {order && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-white rounded-[32px] z-[111] shadow-2xl overflow-hidden"
                    >
                        {step === 'confirm' && (
                            <>
                                {/* Header */}
                                <div className="sticky top-0 bg-gradient-to-br from-brand-500 to-brand-600 px-6 py-5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            <RefreshCw className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-bold text-white leading-tight">Reorder</h2>
                                            <p className="text-xs text-white/80 font-medium">Order #{order.id.split('-')[0]}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                    >
                                        <X className="h-5 w-5 text-white" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {/* Order Summary */}
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Summary</h3>
                                        <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                                            <div className="flex items-center gap-3">
                                                {order.shop.banner ? (
                                                    <img
                                                        src={order.shop.banner}
                                                        alt={order.shop.name}
                                                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-lg uppercase">
                                                        {order.shop.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-900 text-sm">{order.shop.name}</p>
                                                    <p className="text-xs text-slate-500 truncate">{order.shop.address}</p>
                                                </div>
                                            </div>

                                            <div className="pt-3 border-t border-slate-200 space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Documents</span>
                                                    <span className="font-bold text-slate-900">{order.items.length} files</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-500">Total Pages</span>
                                                    <span className="font-bold text-slate-900">
                                                        {order.items.reduce((sum, item) => sum + item.pageCount, 0)} pages
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-base pt-2 border-t border-slate-200">
                                                    <span className="font-bold text-slate-900">Total</span>
                                                    <span className="font-black text-brand-600">TZS {Number(order.totalPrice).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-3">
                                        <Button
                                            onClick={handleQuickReorder}
                                            className="w-full h-14 rounded-2xl gap-2 gradient-brand shadow-lg shadow-brand-500/20"
                                        >
                                            <ShoppingCart className="h-5 w-5" />
                                            Quick Reorder
                                        </Button>
                                        <Button
                                            onClick={handleEditAndReorder}
                                            variant="outline"
                                            className="w-full h-14 rounded-2xl gap-2 border-slate-200"
                                        >
                                            <Edit3 className="h-5 w-5" />
                                            Edit Before Reorder
                                        </Button>
                                    </div>

                                    <p className="text-xs text-center text-slate-400">
                                        Quick reorder will use the same settings and shop as your previous order
                                    </p>
                                </div>
                            </>
                        )}

                        {step === 'processing' && (
                            <div className="p-12 flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center">
                                    <Loader2 className="h-8 w-8 text-brand-600 animate-spin" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-slate-900">Processing Order</h3>
                                    <p className="text-sm text-slate-500 mt-1">Please wait while we create your order...</p>
                                </div>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="p-12 flex flex-col items-center justify-center space-y-4">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 15 }}
                                    className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
                                >
                                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                                </motion.div>
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-slate-900">Order Created!</h3>
                                    <p className="text-sm text-slate-500 mt-1">Your reorder has been placed successfully</p>
                                </div>
                            </div>
                        )}

                        {step === 'error' && (
                            <div className="p-12 flex flex-col items-center justify-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertCircle className="h-8 w-8 text-red-600" />
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-bold text-slate-900">Reorder Failed</h3>
                                    <p className="text-sm text-slate-500 mt-1">{errorMessage}</p>
                                </div>
                                <Button
                                    onClick={() => setStep('confirm')}
                                    variant="outline"
                                    className="mt-4"
                                >
                                    Try Again
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
