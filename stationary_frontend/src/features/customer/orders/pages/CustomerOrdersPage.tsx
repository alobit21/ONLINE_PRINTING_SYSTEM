import { useState } from 'react';
import { useCustomerOrders } from '../hooks/useCustomerOrders';
import { useOrderLiveTracking } from '../hooks/useOrderLiveTracking';
import { OrdersTabs } from '../components/OrdersTabs';
import { OrderCard } from '../components/OrderCard';
import { OrderDetailsDrawer } from '../components/OrderDetailsDrawer';
import { OrderTimelineModal } from '../components/OrderTimelineModal';
import { ReorderFlow } from '../components/ReorderFlow';
import { NotificationCenter } from '../components/NotificationCenter';
import type { Order, OrderStatus } from '../types';
import { Loader2, PackageSearch, ArrowLeft, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { useNotificationStore } from '../../../../stores/notificationStore';

export const CustomerOrdersPage = () => {
    const navigate = useNavigate();
    const { addNotification } = useNotificationStore();

    const {
        activeOrders,
        completedOrders,
        cancelledOrders,
        loading,
        refetch
    } = useCustomerOrders();

    const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [timelineOrder, setTimelineOrder] = useState<Order | null>(null);
    const [reorderOrder, setReorderOrder] = useState<Order | null>(null);

    const { isTracking } = useOrderLiveTracking({
        onStatusChange: (newStatus: OrderStatus, order: Order) => {
            const statusMessages: Record<OrderStatus, { title: string; message: string }> = {
                UPLOADED: { title: 'Order Uploaded', message: `Your order has been uploaded to ${order.shop.name}` },
                ACCEPTED: { title: 'Order Accepted', message: `${order.shop.name} has accepted your order` },
                PRINTING: { title: 'Printing Started', message: `Your documents are now being printed` },
                READY: { title: 'Order Ready! 🎉', message: `Your order is ready for pickup at ${order.shop.name}` },
                COMPLETED: { title: 'Order Completed', message: `Thank you for using our service!` },
                CANCELLED: { title: 'Order Cancelled', message: `Your order has been cancelled` }
            };

            const statusInfo = statusMessages[newStatus];
            if (statusInfo) {
                addNotification({
                    type: newStatus === 'READY' ? 'order_ready' : newStatus === 'COMPLETED' ? 'order_completed' : 'order_status',
                    title: statusInfo.title,
                    message: statusInfo.message,
                    orderId: order.id,
                    orderStatus: newStatus,
                    actionUrl: '/dashboard/customer/orders'
                });
            }
        }
    });

    const counts = {
        active: activeOrders.length,
        completed: completedOrders.length,
        cancelled: cancelledOrders.length
    };

    const currentOrders = {
        active: activeOrders,
        completed: completedOrders,
        cancelled: cancelledOrders
    }[activeTab];

    const handleReorderSuccess = () => {
        refetch();
        addNotification({
            type: 'success',
            title: 'Order Placed Successfully',
            message: 'Your reorder has been placed and is being processed',
            actionUrl: '/dashboard/customer/orders'
        });
    };

    return (
        <div className="space-y-6 fade-in pb-32 max-w-2xl mx-auto">
            <header className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/customer')}
                        className="p-2 hover:bg-slate-700 rounded-full transition-colors border border-transparent hover:border-slate-600"
                    >
                        <ArrowLeft className="h-6 w-6 text-slate-200" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-100 tracking-tight">Your Orders</h1>
                        <p className="text-slate-400 font-medium text-sm">Track and manage your print jobs</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isTracking && activeOrders.length > 0 && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/30 border border-green-700 rounded-xl">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-green-300">Live</span>
                        </div>
                    )}

                    <NotificationCenter />

                    <button
                        onClick={() => refetch()}
                        disabled={loading}
                        className="p-2.5 bg-slate-800 border border-slate-700 rounded-2xl shadow-sm text-slate-400 hover:text-cyan-400 transition-all hover:rotate-180 disabled:opacity-50"
                    >
                        <RotateCcw className={cn("h-5 w-5", loading && "animate-spin")} />
                    </button>
                </div>
            </header>

            <OrdersTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
                className="bg-slate-900 text-slate-200"
            />

            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing your orders...</span>
                    </div>
                ) : currentOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                    >
                        <div className="w-24 h-24 rounded-[32px] bg-slate-800 flex items-center justify-center">
                            <PackageSearch className="h-12 w-12 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-100">No {activeTab} orders yet</h3>
                            <p className="text-sm text-slate-400 mt-1 max-w-[240px] mx-auto">
                                {activeTab === 'active'
                                    ? "Any orders you place will show up here for live tracking."
                                    : `You don't have any ${activeTab} orders at the moment.`}
                            </p>
                        </div>
                        {activeTab === 'active' && (
                            <Button
                                onClick={() => navigate('/dashboard/customer/upload')}
                                className="mt-4 bg-cyan-500 text-black rounded-2xl px-8 h-12 shadow-lg shadow-cyan-500/20"
                            >
                                Start Printing
                            </Button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence mode="popLayout">
                            {currentOrders.map((order: Order, idx: number) => (
                                <motion.div
                                    key={order.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                                >
                                    <OrderCard
                                        order={order}
                                        onClick={setSelectedOrder}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <OrderDetailsDrawer
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                onViewTimeline={(order) => {
                    setTimelineOrder(order);
                    setSelectedOrder(null);
                }}
                onReorder={(order) => {
                    setReorderOrder(order);
                    setSelectedOrder(null);
                }}
            />

            <OrderTimelineModal
                order={timelineOrder}
                onClose={() => setTimelineOrder(null)}
            />

            <ReorderFlow
                order={reorderOrder}
                onClose={() => setReorderOrder(null)}
                onSuccess={handleReorderSuccess}
            />
        </div>
    );
};
