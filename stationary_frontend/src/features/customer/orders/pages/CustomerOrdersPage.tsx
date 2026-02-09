import { useState } from 'react';
import { useCustomerOrders } from '../hooks/useCustomerOrders';
import { OrdersTabs } from '../components/OrdersTabs';
import { OrderCard } from '../components/OrderCard';
import { OrderDetailsDrawer } from '../components/OrderDetailsDrawer';
import type { Order } from '../types';
import { Loader2, PackageSearch, ArrowLeft, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';

export const CustomerOrdersPage = () => {
    const navigate = useNavigate();
    const {
        activeOrders,
        completedOrders,
        cancelledOrders,
        loading,
        refetch
    } = useCustomerOrders();

    const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'cancelled'>('active');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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

    return (
        <div className="space-y-6 fade-in pb-32 max-w-2xl mx-auto">
            <header className="flex items-center justify-between pb-2">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard/customer')}
                        className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-slate-100"
                    >
                        <ArrowLeft className="h-6 w-6 text-slate-900" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Orders</h1>
                        <p className="text-slate-500 font-medium text-sm">Track and manage your print jobs</p>
                    </div>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={loading}
                    className="p-2.5 bg-white border border-slate-100 rounded-2xl shadow-sm text-slate-400 hover:text-brand-600 transition-all hover:rotate-180 disabled:opacity-50"
                >
                    <RotateCcw className={cn("h-5 w-5", loading && "animate-spin")} />
                </button>
            </header>

            <OrdersTabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                counts={counts}
            />

            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="h-10 w-10 text-brand-600 animate-spin" />
                        <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing your orders...</span>
                    </div>
                ) : currentOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-20 text-center space-y-4"
                    >
                        <div className="w-24 h-24 rounded-[32px] bg-slate-50 flex items-center justify-center">
                            <PackageSearch className="h-12 w-12 text-slate-300" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">No {activeTab} orders yet</h3>
                            <p className="text-sm text-slate-500 mt-1 max-w-[240px] mx-auto">
                                {activeTab === 'active'
                                    ? "Any orders you place will show up here for live tracking."
                                    : `You don't have any ${activeTab} orders at the moment.`}
                            </p>
                        </div>
                        {activeTab === 'active' && (
                            <Button
                                onClick={() => navigate('/dashboard/customer/upload')}
                                className="mt-4 gradient-brand rounded-2xl px-8 h-12 shadow-lg shadow-brand-500/20"
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
            />
        </div>
    );
};
