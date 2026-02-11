import { AnimatePresence, motion } from 'framer-motion';
import type { Order, OrderStatus } from '../types';
import { X, Clock, CheckCircle2, Package, Printer, Truck, MapPin, User } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { format } from 'date-fns';

interface OrderTimelineModalProps {
    order: Order | null;
    onClose: () => void;
}

interface TimelineStep {
    status: OrderStatus;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
}

const timelineSteps: TimelineStep[] = [
    {
        status: 'UPLOADED',
        label: 'Order Placed',
        icon: Package,
        description: 'Your documents have been uploaded successfully'
    },
    {
        status: 'ACCEPTED',
        label: 'Shop Accepted',
        icon: CheckCircle2,
        description: 'Print shop confirmed your order'
    },
    {
        status: 'PRINTING',
        label: 'Printing',
        icon: Printer,
        description: 'Your documents are being printed'
    },
    {
        status: 'READY',
        label: 'Ready for Pickup',
        icon: Truck,
        description: 'Your order is ready to collect'
    },
    {
        status: 'COMPLETED',
        label: 'Completed',
        icon: CheckCircle2,
        description: 'Order successfully completed'
    }
];

export const OrderTimelineModal = ({ order, onClose }: OrderTimelineModalProps) => {
    if (!order) return null;

    const currentStatusIndex = timelineSteps.findIndex(step => step.status === order.status);
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
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white rounded-[32px] z-[111] shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-br from-brand-500 to-brand-600 px-6 py-5 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white leading-tight">Order Timeline</h2>
                                    <p className="text-xs text-white/80 font-medium">#{order.id.split('-')[0]}</p>
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
                        <div className="p-6 max-h-[70vh] overflow-y-auto">
                            {isCancelled ? (
                                <div className="text-center py-8 space-y-3">
                                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
                                        <X className="h-8 w-8 text-red-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Order Cancelled</h3>
                                    <p className="text-sm text-slate-500">
                                        This order was cancelled on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {timelineSteps.map((step, idx) => {
                                        const isDone = idx <= currentStatusIndex;
                                        const isCurrent = idx === currentStatusIndex;
                                        const Icon = step.icon;
                                        const isLast = idx === timelineSteps.length - 1;

                                        return (
                                            <div key={step.status} className="relative">
                                                {/* Connector Line */}
                                                {!isLast && (
                                                    <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-slate-100">
                                                        {isDone && (
                                                            <motion.div
                                                                initial={{ height: 0 }}
                                                                animate={{ height: '100%' }}
                                                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                                className="w-full bg-gradient-to-b from-brand-500 to-brand-400"
                                                            />
                                                        )}
                                                    </div>
                                                )}

                                                {/* Step */}
                                                <motion.div
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className={cn(
                                                        "flex gap-4 p-4 rounded-2xl transition-all",
                                                        isCurrent && "bg-brand-50 ring-2 ring-brand-200",
                                                        isDone && !isCurrent && "bg-slate-50/50"
                                                    )}
                                                >
                                                    {/* Icon */}
                                                    <div className={cn(
                                                        "relative z-10 w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500",
                                                        isDone
                                                            ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/30"
                                                            : "bg-white border-2 border-slate-200 text-slate-400",
                                                        isCurrent && "ring-4 ring-brand-100 scale-110"
                                                    )}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>

                                                    {/* Content */}
                                                    <div className="flex-1 min-w-0 pt-1">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div>
                                                                <h4 className={cn(
                                                                    "font-bold text-sm leading-tight",
                                                                    isDone ? "text-slate-900" : "text-slate-400"
                                                                )}>
                                                                    {step.label}
                                                                </h4>
                                                                <p className={cn(
                                                                    "text-xs mt-0.5",
                                                                    isDone ? "text-slate-500" : "text-slate-400"
                                                                )}>
                                                                    {step.description}
                                                                </p>
                                                            </div>
                                                            {isDone && (
                                                                <span className="text-[10px] font-bold text-brand-600 whitespace-nowrap">
                                                                    {isCurrent ? 'In Progress' : 'Completed'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {isDone && (
                                                            <div className="mt-2 text-[10px] text-slate-400 font-medium">
                                                                {format(new Date(order.createdAt), 'MMM dd, yyyy • hh:mm a')}
                                                            </div>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Shop Info */}
                            <div className="mt-6 p-4 bg-slate-50 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <MapPin className="h-3.5 w-3.5" />
                                    Pickup Location
                                </div>
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
                            </div>

                            {/* ETA */}
                            {!isCancelled && order.estimatedCompletionTime && (
                                <div className="mt-4 p-4 bg-gradient-to-br from-brand-50 to-brand-100/50 rounded-2xl border border-brand-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                                            <Clock className="h-5 w-5 text-brand-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-brand-600 uppercase tracking-wider">Estimated Ready Time</p>
                                            <p className="text-sm font-black text-brand-900 mt-0.5">
                                                {format(new Date(order.estimatedCompletionTime), 'hh:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
