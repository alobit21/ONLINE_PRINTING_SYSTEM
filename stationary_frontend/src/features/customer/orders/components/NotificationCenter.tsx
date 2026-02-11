import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X, Package, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { useNotificationStore } from '../../../../stores/notificationStore';
import { cn } from '../../../../lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

export const NotificationCenter = () => {
    const navigate = useNavigate();
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotificationStore();
    const [isOpen, setIsOpen] = React.useState(false);

    const getIcon = (type: string) => {
        switch (type) {
            case 'order_status':
            case 'order_ready':
                return Package;
            case 'order_completed':
            case 'success':
                return CheckCircle2;
            case 'warning':
            case 'error':
                return AlertCircle;
            default:
                return Info;
        }
    };

    const getIconColor = (type: string) => {
        switch (type) {
            case 'order_status':
                return 'text-blue-600 bg-blue-50';
            case 'order_ready':
                return 'text-amber-600 bg-amber-50';
            case 'order_completed':
            case 'success':
                return 'text-green-600 bg-green-50';
            case 'warning':
                return 'text-orange-600 bg-orange-50';
            case 'error':
                return 'text-red-600 bg-red-50';
            default:
                return 'text-slate-600 bg-slate-50';
        }
    };

    const handleNotificationClick = (notification: any) => {
        markAsRead(notification.id);
        if (notification.actionUrl) {
            navigate(notification.actionUrl);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
            >
                <Bell className="h-5 w-5 text-slate-600" />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                                <div>
                                    <h3 className="font-bold text-slate-900">Notifications</h3>
                                    <p className="text-xs text-slate-500">
                                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                    </p>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs font-bold text-brand-600 hover:text-brand-700"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* List */}
                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                            <Bell className="h-8 w-8 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-500">No notifications yet</p>
                                        <p className="text-xs text-slate-400 mt-1">We'll notify you when something happens</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-100">
                                        {notifications.map((notification) => {
                                            const Icon = getIcon(notification.type);
                                            const iconColor = getIconColor(notification.type);

                                            return (
                                                <motion.div
                                                    key={notification.id}
                                                    layout
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className={cn(
                                                        "p-4 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                                                        !notification.read && "bg-brand-50/30"
                                                    )}
                                                    onClick={() => handleNotificationClick(notification)}
                                                >
                                                    {!notification.read && (
                                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r" />
                                                    )}

                                                    <div className="flex gap-3">
                                                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", iconColor)}>
                                                            <Icon className="h-5 w-5" />
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <h4 className="font-bold text-sm text-slate-900 leading-tight">
                                                                    {notification.title}
                                                                </h4>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        removeNotification(notification.id);
                                                                    }}
                                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-all"
                                                                >
                                                                    <X className="h-3.5 w-3.5 text-slate-400" />
                                                                </button>
                                                            </div>
                                                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// Add React import
import React from 'react';
