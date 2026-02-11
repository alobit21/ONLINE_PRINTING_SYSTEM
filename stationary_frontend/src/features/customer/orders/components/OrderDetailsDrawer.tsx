import { AnimatePresence, motion } from 'framer-motion';
import type { Order, OrderStatus } from '../types';
import { X, FileText, CheckCircle2, Download, RefreshCw, MessageSquare, Clock } from 'lucide-react';
import { Badge } from './Badge';
import { cn } from '../../../../lib/utils';
import { Button } from '../../../../components/ui/Button';
import { InvoiceDownloader } from './InvoiceDownloader';

interface OrderDetailsDrawerProps {
    order: Order | null;
    onClose: () => void;
    onViewTimeline?: (order: Order) => void;
    onReorder?: (order: Order) => void;
}

const statusSteps: OrderStatus[] = ['UPLOADED', 'ACCEPTED', 'PRINTING', 'READY', 'COMPLETED'];

export const OrderDetailsDrawer = ({ order, onClose, onViewTimeline, onReorder }: OrderDetailsDrawerProps) => {
    if (!order) return null;

    const currentStatusIndex = statusSteps.indexOf(order.status);
    const isCancelled = order.status === 'CANCELLED';

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
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Content */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] z-[101] max-h-[92vh] overflow-y-auto shadow-2xl pb-safe"
                    >
                        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 leading-tight">Order Details</h2>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">#{order.id.split('-')[0]}</p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X className="h-6 w-6 text-slate-400" />
                            </button>
                        </div>

                        <div className="p-6 space-y-8 pb-32">
                            {/* Visual Timeline */}
                            {!isCancelled && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center px-2">
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</h3>
                                        <Badge className="bg-brand-500">{order.status}</Badge>
                                    </div>
                                    <div className="relative flex justify-between">
                                        <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 -z-0" />
                                        <div
                                            className="absolute top-4 left-4 h-0.5 bg-brand-500 transition-all duration-1000 -z-0"
                                            style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
                                        />

                                        {statusSteps.map((step, idx) => {
                                            const isDone = idx <= currentStatusIndex;
                                            const isCurrent = idx === currentStatusIndex;

                                            return (
                                                <div key={step} className="relative z-10 flex flex-col items-center gap-2">
                                                    <div className={cn(
                                                        "h-8 w-8 rounded-full flex items-center justify-center transition-all duration-500",
                                                        isDone ? "bg-brand-500 text-white" : "bg-white border-2 border-slate-100 text-slate-300",
                                                        isCurrent ? "ring-4 ring-brand-100 scale-110 shadow-lg" : ""
                                                    )}>
                                                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : <div className="h-2 w-2 rounded-full bg-slate-200" />}
                                                    </div>
                                                    <span className={cn(
                                                        "text-[8px] font-bold uppercase transition-colors",
                                                        isDone ? "text-brand-600" : "text-slate-300"
                                                    )}>{step}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pickup From</p>
                                    <p className="text-sm font-bold text-slate-900">{order.shop.name}</p>
                                    <p className="text-[10px] text-slate-500 line-clamp-1">{order.shop.address}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estimated Ready</p>
                                    <p className="text-sm font-bold text-slate-900">
                                        {order.estimatedCompletionTime ? new Date(order.estimatedCompletionTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Calculating...'}
                                    </p>
                                    <p className="text-[10px] text-slate-500">Approximately 15 mins</p>
                                </div>
                            </div>

                            {/* Files Section */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Documents ({order.items.length})
                                </h3>
                                <div className="space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 p-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                                                <FileText className="h-6 w-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">{item.document.name}</p>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100 uppercase">
                                                        {item.pageCount} Pages
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100 uppercase">
                                                        {item.configSnapshot.is_color ? 'Color' : 'B&W'}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5 bg-slate-50 rounded border border-slate-100 uppercase">
                                                        {item.configSnapshot.paper_size}
                                                    </span>
                                                    {item.configSnapshot.binding && (
                                                        <span className="text-[10px] font-bold text-brand-500 px-1.5 py-0.5 bg-brand-50 rounded border border-brand-100 uppercase">
                                                            Binding
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-slate-900">TZS {Number(item.price).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Breakdown */}
                            <div className="p-6 border-2 border-dashed border-slate-100 rounded-[24px] space-y-4">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="font-bold">TZS {Number(order.totalPrice).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500">
                                        <span>Service Fee</span>
                                        <span className="font-bold">TZS 0</span>
                                    </div>
                                    <div className="flex justify-between text-brand-600 bg-brand-50 px-3 py-2 rounded-xl border border-brand-100">
                                        <span className="font-medium">Total Discount</span>
                                        <span className="font-black">-TZS 0</span>
                                    </div>
                                    <div className="flex justify-between text-lg pt-4 border-t border-slate-100 font-black text-slate-900">
                                        <span>Total Paid</span>
                                        <span>TZS {Number(order.totalPrice).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-3">
                                {/* View Timeline Button */}
                                {!isCancelled && onViewTimeline && (
                                    <Button
                                        onClick={() => onViewTimeline(order)}
                                        variant="outline"
                                        className="w-full h-14 rounded-2xl gap-2 border-slate-200"
                                    >
                                        <Clock className="h-5 w-5" />
                                        View Timeline
                                    </Button>
                                )}

                                {/* Invoice & Reorder */}
                                <div className="grid grid-cols-2 gap-3">
                                    <InvoiceDownloader order={order} />
                                    {onReorder && (
                                        <Button
                                            onClick={() => onReorder(order)}
                                            className="h-14 rounded-2xl gap-2 gradient-brand shadow-lg"
                                        >
                                            <RefreshCw className="h-5 w-5" />
                                            Reorder
                                        </Button>
                                    )}
                                </div>

                                {/* Contact Support */}
                                <Button
                                    variant="outline"
                                    className="w-full h-14 rounded-2xl gap-2 text-slate-500 hover:text-brand-600 transition-colors"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    Contact Support
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
