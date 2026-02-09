import type { Order, OrderStatus } from '../types';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Badge } from './Badge';
import { Progress } from './Progress';
import { Clock, MapPin, ChevronRight, FileText, QrCode, MessageCircle } from 'lucide-react';
import { cn } from '../../../../lib/utils';

interface OrderCardProps {
    order: Order;
    onClick: (order: Order) => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; progress: number }> = {
    UPLOADED: { label: 'Uploaded', color: 'bg-blue-500', progress: 20 },
    ACCEPTED: { label: 'Accepted', color: 'bg-indigo-500', progress: 40 },
    PRINTING: { label: 'Printing', color: 'bg-amber-500', progress: 60 },
    READY: { label: 'Ready for Pickup', color: 'bg-green-500', progress: 85 },
    COMPLETED: { label: 'Completed', color: 'bg-slate-500', progress: 100 },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-500', progress: 0 },
};

export const OrderCard = ({ order, onClick }: OrderCardProps) => {
    const config = statusConfig[order.status];
    const isCompleted = order.status === 'COMPLETED';
    const isCancelled = order.status === 'CANCELLED';
    const isActive = !isCompleted && !isCancelled;

    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:shadow-md active:scale-[0.98] border-none shadow-sm overflow-hidden group",
                isActive ? "ring-1 ring-brand-100" : ""
            )}
            onClick={() => onClick(order)}
        >
            <CardContent className="p-0">
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200">
                                {order.shop.banner ? (
                                    <img src={order.shop.banner} alt={order.shop.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-brand-50 text-brand-600 font-bold uppercase text-lg">
                                        {order.shop.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 group-hover:text-brand-600 transition-colors uppercase tracking-tight leading-tight">
                                    {order.shop.name}
                                </h3>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                    <MapPin className="h-3 w-3" />
                                    {order.shop.address}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <Badge className={cn("text-[10px] uppercase tracking-wider font-bold", config.color)}>
                                {config.label}
                            </Badge>
                            {isActive && (
                                <span className="text-[10px] font-bold text-brand-600 flex items-center gap-1 animate-pulse">
                                    <Clock className="h-3 w-3" />
                                    ETA: 12 min
                                </span>
                            )}
                        </div>
                    </div>

                    {isActive && (
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                                <span>Progress</span>
                                <span>{config.progress}%</span>
                            </div>
                            <Progress value={config.progress} className="h-1.5 bg-slate-100" barClassName={config.color} />
                        </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div className="flex gap-3 text-slate-400">
                            <div className="flex items-center gap-1">
                                <FileText className="h-3.5 w-3.5" />
                                <span className="text-xs font-bold">{order.items.length} Files</span>
                            </div>
                            <div className="font-bold text-slate-900 text-xs">
                                TZS {Number(order.totalPrice).toLocaleString()}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {order.status === 'READY' && (
                                <div className="p-1.5 bg-green-50 text-green-600 rounded-lg">
                                    <QrCode className="h-4 w-4" />
                                </div>
                            )}
                            <button className="p-1.5 hover:bg-slate-50 text-slate-400 rounded-lg transition-colors">
                                <MessageCircle className="h-4 w-4" />
                            </button>
                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
