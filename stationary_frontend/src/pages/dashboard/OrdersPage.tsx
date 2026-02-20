import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
    Printer,
    Loader2,
    Package,
    AlertCircle,
    FileText,
    Eye,
    Copy,
    Mail,
    X,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../../components/ui/dialog';
import { Select } from '../../components/ui/Select';
import { GET_ALL_MY_SHOP_ORDERS, UPDATE_ORDER_STATUS } from '../../features/customer/orders/api';
import type { GetAllMyShopOrdersData, Order, OrderStatus } from '../../features/customer/orders/types';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

// Order Status Badge Component
const OrderStatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        UPLOADED: 'bg-blue-100 text-blue-700 border-blue-200',
        ACCEPTED: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        PRINTING: 'bg-amber-100 text-amber-700 border-amber-200',
        READY: 'bg-green-100 text-green-700 border-green-200',
        COMPLETED: 'bg-slate-100 text-slate-700 border-slate-200',
        CANCELLED: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
        <span className={cn(
            'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
            styles[status] || styles.UPLOADED
        )}>
            {status.charAt(0) + status.slice(1).toLowerCase().replace(/_/g, ' ')}
        </span>
    );
};

// Toast state
interface ToastState {
    type: 'success' | 'error';
    message: string;
}

// Order Details Dialog Component
function OrderDetailsDialog({
    order,
    open,
    onOpenChange,
    onStatusUpdate,
    onCopyOrderId,
}: {
    order: Order | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onStatusUpdate: (orderId: string, newStatus: OrderStatus) => Promise<void>;
    onCopyOrderId: (orderId: string) => void;
}) {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order?.status || 'UPLOADED');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (order) {
            setSelectedStatus(order.status);
        }
    }, [order]);

    if (!order) return null;

    const customerName = order.customer?.firstName && order.customer?.lastName
        ? `${order.customer.firstName} ${order.customer.lastName}`
        : order.customer?.email || 'Customer';

    const statusOptions: { value: OrderStatus; label: string }[] = [
        { value: 'UPLOADED', label: 'Uploaded' },
        { value: 'ACCEPTED', label: 'Accepted' },
        { value: 'PRINTING', label: 'Printing' },
        { value: 'READY', label: 'Ready' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'CANCELLED', label: 'Cancelled' },
    ];

    const handleStatusUpdate = async () => {
        if (selectedStatus === order.status) return;
        setIsUpdating(true);
        try {
            await onStatusUpdate(order.id, selectedStatus);
        } finally {
            setIsUpdating(false);
        }
    };

    const subtotal = order.items.reduce((sum, item) => sum + Number(item.price), 0);
    const commissionFee = order.commissionFee ? Number(order.commissionFee) : 0;
    const total = Number(order.totalPrice);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Order Details</DialogTitle>
                    <DialogDescription>
                        Order ID: {order.id.slice(0, 8).toUpperCase()}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Customer Information */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Customer Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Full Name</p>
                                <p className="text-sm font-medium text-slate-900">{customerName}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Email</p>
                                <p className="text-sm font-medium text-slate-900">{order.customer?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Information */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Order Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Order ID</p>
                                <p className="text-sm font-mono font-medium text-slate-900">{order.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Date Created</p>
                                <p className="text-sm font-medium text-slate-900">
                                    {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Current Status</p>
                                <OrderStatusBadge status={order.status} />
                            </div>
                            {order.completedAt && (
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Completed At</p>
                                    <p className="text-sm font-medium text-slate-900">
                                        {format(new Date(order.completedAt), 'MMM d, yyyy h:mm a')}
                                    </p>
                                </div>
                            )}
                            {order.estimatedCompletionTime && (
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Estimated Completion</p>
                                    <p className="text-sm font-medium text-slate-900">
                                        {format(new Date(order.estimatedCompletionTime), 'MMM d, yyyy h:mm a')}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-slate-500 mb-1">Shop</p>
                                <p className="text-sm font-medium text-slate-900">{order.shop?.name || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Order Items</h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Item</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Pages</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase">Configuration</th>
                                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => {
                                        const config = item.configSnapshot || {};
                                        const configParts = [
                                            config.is_color ? 'Color' : 'B&W',
                                            config.paper_size || 'A4',
                                            config.binding ? 'Binding' : '',
                                            config.lamination ? 'Lamination' : '',
                                        ].filter(Boolean);

                                        return (
                                            <tr key={item.id} className="border-b border-slate-100 last:border-0">
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-slate-900">{item.document?.fileName || 'Document'}</p>
                                                    <p className="text-xs text-slate-500">{item.document?.fileType || 'N/A'}</p>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600">{item.pageCount}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {configParts.map((part, idx) => (
                                                            <span key={idx} className="text-xs text-slate-600">{part}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-slate-900">
                                                    TZS {Number(item.price).toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Totals Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Totals</h3>
                        <div className="space-y-2 p-4 bg-slate-50 rounded-lg">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Subtotal:</span>
                                <span className="font-medium text-slate-900">TZS {subtotal.toLocaleString()}</span>
                            </div>
                            {commissionFee > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Commission Fee:</span>
                                    <span className="font-medium text-slate-900">TZS {commissionFee.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="pt-2 border-t border-slate-200 flex justify-between">
                                <span className="font-semibold text-slate-900">Total:</span>
                                <span className="font-bold text-lg text-slate-900">TZS {total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Update Section */}
                    <div className="space-y-3 pt-4 border-t border-slate-200">
                        <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Update Status</h3>
                        <div className="flex gap-3 items-end">
                            <div className="flex-1">
                                <Select
                                    label="Order Status"
                                    options={statusOptions}
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                                />
                            </div>
                            <Button
                                onClick={handleStatusUpdate}
                                disabled={selectedStatus === order.status || isUpdating}
                                className="bg-brand-600 text-white hover:bg-brand-700"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Status'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-row justify-between sm:justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onCopyOrderId(order.id)}
                        >
                            <Copy className="h-4 w-4 mr-2" />
                            Copy Order ID
                        </Button>
                        {order.customer?.email && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`mailto:${order.customer?.email}`, '_blank')}
                            >
                                <Mail className="h-4 w-4 mr-2" />
                                Contact Customer
                            </Button>
                        )}
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Print Component for Single Order
const PrintOrder = ({ order }: { order: Order }) => {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to print');
            return;
        }

        const customerName = order.customer?.firstName && order.customer?.lastName
            ? `${order.customer.firstName} ${order.customer.lastName}`
            : order.customer?.email || 'Customer';

        const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Order ${order.id.slice(0, 8).toUpperCase()}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        font-size: 12pt;
                        line-height: 1.6;
                        color: #000;
                        background: #fff;
                        padding: 20mm;
                    }
                    .header {
                        border-bottom: 3px solid #000;
                        padding-bottom: 15px;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        font-size: 24pt;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .header p {
                        font-size: 10pt;
                        color: #666;
                    }
                    .order-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 20px;
                        margin-bottom: 25px;
                    }
                    .info-section h3 {
                        font-size: 11pt;
                        font-weight: bold;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                        color: #333;
                    }
                    .info-section p {
                        font-size: 10pt;
                        margin: 3px 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    thead {
                        background: #f5f5f5;
                    }
                    th, td {
                        padding: 10px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        font-weight: bold;
                        font-size: 10pt;
                        text-transform: uppercase;
                    }
                    td {
                        font-size: 10pt;
                    }
                    .total-section {
                        margin-top: 20px;
                        padding-top: 15px;
                        border-top: 2px solid #000;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 8px 0;
                        font-size: 11pt;
                    }
                    .total-row.final {
                        font-weight: bold;
                        font-size: 14pt;
                        margin-top: 10px;
                        padding-top: 10px;
                        border-top: 1px solid #ddd;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                        font-size: 9pt;
                        color: #666;
                        text-align: center;
                    }
                    @media print {
                        body { padding: 15mm; }
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ORDER RECEIPT</h1>
                    <p>Order ID: ${order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                
                <div class="order-info">
                    <div class="info-section">
                        <h3>Customer Information</h3>
                        <p><strong>Name:</strong> ${customerName}</p>
                        <p><strong>Email:</strong> ${order.customer?.email || 'N/A'}</p>
                    </div>
                    <div class="info-section">
                        <h3>Order Details</h3>
                        <p><strong>Date:</strong> ${orderDate}</p>
                        <p><strong>Status:</strong> ${order.status.charAt(0) + order.status.slice(1).toLowerCase().replace(/_/g, ' ')}</p>
                        <p><strong>Shop:</strong> ${order.shop?.name || 'N/A'}</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Pages</th>
                            <th>Configuration</th>
                            <th style="text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map((item) => {
                            const config = item.configSnapshot || {};
                            const configParts = [
                                config.is_color ? 'Color' : 'B&W',
                                config.paper_size || 'A4',
                                config.binding ? 'Binding' : '',
                                config.lamination ? 'Lamination' : '',
                            ].filter(Boolean);
                            return `
                                <tr>
                                    <td>${item.document?.fileName || 'Document'}</td>
                                    <td>${item.pageCount}</td>
                                    <td>${configParts.join(', ')}</td>
                                    <td style="text-align: right;">TZS ${Number(item.price).toLocaleString()}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>

                <div class="total-section">
                    <div class="total-row">
                        <span>Subtotal:</span>
                        <span>TZS ${Number(order.totalPrice).toLocaleString()}</span>
                    </div>
                    <div class="total-row final">
                        <span>TOTAL:</span>
                        <span>TZS ${Number(order.totalPrice).toLocaleString()}</span>
                    </div>
                </div>

                <div class="footer">
                    <p>Generated on ${new Date().toLocaleString()}</p>
                    <p>Thank you for your business!</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="print-button"
        >
            <Printer className="h-4 w-4 mr-2" />
            Print
        </Button>
    );
};

// Print All Orders Component
const PrintAllOrders = ({ orders }: { orders: Order[] }) => {
    const handlePrintAll = () => {
        if (orders.length === 0) {
            alert('No orders to print');
            return;
        }

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow popups to print');
            return;
        }

        const printDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>All Orders Report</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        font-size: 11pt;
                        line-height: 1.5;
                        color: #000;
                        background: #fff;
                        padding: 15mm;
                    }
                    .header {
                        border-bottom: 3px solid #000;
                        padding-bottom: 15px;
                        margin-bottom: 25px;
                    }
                    .header h1 {
                        font-size: 22pt;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    .header p {
                        font-size: 10pt;
                        color: #666;
                    }
                    .order-section {
                        page-break-inside: avoid;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px dashed #ccc;
                    }
                    .order-section:last-child {
                        border-bottom: none;
                    }
                    .order-header {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 15px;
                        padding-bottom: 10px;
                        border-bottom: 1px solid #ddd;
                    }
                    .order-header h2 {
                        font-size: 14pt;
                        font-weight: bold;
                    }
                    .order-header .status {
                        font-size: 10pt;
                        padding: 4px 10px;
                        background: #f5f5f5;
                        border: 1px solid #ddd;
                        border-radius: 3px;
                    }
                    .order-info {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                        margin-bottom: 15px;
                        font-size: 10pt;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 15px;
                        font-size: 10pt;
                    }
                    thead {
                        background: #f5f5f5;
                    }
                    th, td {
                        padding: 8px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        font-weight: bold;
                        text-transform: uppercase;
                        font-size: 9pt;
                    }
                    .order-total {
                        text-align: right;
                        font-weight: bold;
                        font-size: 11pt;
                        margin-top: 10px;
                    }
                    .summary {
                        margin-top: 40px;
                        padding-top: 20px;
                        border-top: 3px solid #000;
                    }
                    .summary-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 8px 0;
                        font-size: 11pt;
                    }
                    .summary-row.total {
                        font-weight: bold;
                        font-size: 14pt;
                        margin-top: 15px;
                        padding-top: 15px;
                        border-top: 2px solid #000;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                        font-size: 9pt;
                        color: #666;
                        text-align: center;
                    }
                    @media print {
                        body { padding: 10mm; }
                        .order-section {
                            page-break-inside: avoid;
                        }
                        .order-section + .order-section {
                            page-break-before: auto;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ALL ORDERS REPORT</h1>
                    <p>Generated on ${printDate}</p>
                    <p>Total Orders: ${orders.length}</p>
                </div>

                ${orders.map((order) => {
                    const customerName = order.customer?.firstName && order.customer?.lastName
                        ? `${order.customer.firstName} ${order.customer.lastName}`
                        : order.customer?.email || 'Customer';
                    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    });
                    return `
                        <div class="order-section">
                            <div class="order-header">
                                <h2>Order ${order.id.slice(0, 8).toUpperCase()}</h2>
                                <span class="status">${order.status.charAt(0) + order.status.slice(1).toLowerCase().replace(/_/g, ' ')}</span>
                            </div>
                            <div class="order-info">
                                <div>
                                    <strong>Customer:</strong> ${customerName}<br>
                                    <strong>Email:</strong> ${order.customer?.email || 'N/A'}
                                </div>
                                <div>
                                    <strong>Date:</strong> ${orderDate}<br>
                                    <strong>Shop:</strong> ${order.shop?.name || 'N/A'}
                                </div>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th>Pages</th>
                                        <th>Config</th>
                                        <th style="text-align: right;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map((item) => {
                                        const config = item.configSnapshot || {};
                                        const configParts = [
                                            config.is_color ? 'Color' : 'B&W',
                                            config.paper_size || 'A4',
                                        ].filter(Boolean);
                                        return `
                                            <tr>
                                                <td>${item.document?.fileName || 'Document'}</td>
                                                <td>${item.pageCount}</td>
                                                <td>${configParts.join(', ')}</td>
                                                <td style="text-align: right;">TZS ${Number(item.price).toLocaleString()}</td>
                                            </tr>
                                        `;
                                    }).join('')}
                                </tbody>
                            </table>
                            <div class="order-total">
                                Total: TZS ${Number(order.totalPrice).toLocaleString()}
                            </div>
                        </div>
                    `;
                }).join('')}

                <div class="summary">
                    <div class="summary-row">
                        <span>Total Orders:</span>
                        <span>${orders.length}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Grand Total:</span>
                        <span>TZS ${orders.reduce((sum, o) => sum + Number(o.totalPrice), 0).toLocaleString()}</span>
                    </div>
                </div>

                <div class="footer">
                    <p>Report generated on ${new Date().toLocaleString()}</p>
                </div>
            </body>
            </html>
        `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };

    return (
        <Button
            onClick={handlePrintAll}
            className="bg-brand-600 text-white hover:bg-brand-700"
            disabled={orders.length === 0}
        >
            <Printer className="h-4 w-4 mr-2" />
            Print All
        </Button>
    );
};

export function OrdersPage() {
    const {
        data,
        loading,
        error,
        refetch,
    } = useQuery<GetAllMyShopOrdersData>(GET_ALL_MY_SHOP_ORDERS, {
        fetchPolicy: 'network-only',
    });

    const [updateStatusMutation] = useMutation(UPDATE_ORDER_STATUS);

    const orders = data?.allMyShopOrders || [];
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsOpen(true);
    };

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        try {
            const result = await updateStatusMutation({
                variables: { orderId, status: newStatus },
            });

            if (result.data?.updateOrderStatus?.response?.status) {
                setToast({ type: 'success', message: 'Order status updated successfully.' });
                refetch();
                // Update selected order if it's the one being updated
                if (selectedOrder?.id === orderId) {
                    setSelectedOrder({
                        ...selectedOrder,
                        status: newStatus,
                        completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : selectedOrder.completedAt,
                    });
                }
            } else {
                setToast({
                    type: 'error',
                    message: result.data?.updateOrderStatus?.response?.message || 'Failed to update status.',
                });
            }
        } catch (err: any) {
            setToast({ type: 'error', message: err.message || 'Failed to update order status.' });
        }
    };

    const handleCopyOrderId = (orderId: string) => {
        navigator.clipboard.writeText(orderId.slice(0, 8).toUpperCase());
        setToast({ type: 'success', message: 'Order ID copied to clipboard.' });
    };

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div
                    className={cn(
                        'fixed bottom-4 right-4 z-[100] max-w-sm rounded-lg border px-4 py-3 shadow-lg flex items-center gap-2',
                        toast.type === 'success'
                            ? 'border-green-200 bg-green-50 text-green-800'
                            : 'border-red-200 bg-red-50 text-red-800'
                    )}
                    role="alert"
                >
                    {toast.type === 'success' ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : (
                        <AlertCircle className="h-5 w-5" />
                    )}
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
                    <p className="text-slate-500 mt-1">Manage and track all customer orders</p>
                </div>
                <PrintAllOrders orders={orders} />
            </div>

            {/* Loading State */}
            {loading && (
                <Card className="border border-slate-200">
                    <CardContent className="py-12 flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading orders…</span>
                    </CardContent>
                </Card>
            )}

            {/* Error State */}
            {error && (
                <Card className="border border-red-200 bg-red-50/50">
                    <CardContent className="py-12 flex flex-col items-center justify-center gap-2 text-red-700">
                        <AlertCircle className="h-10 w-10" />
                        <p className="font-medium">Failed to load orders</p>
                        <p className="text-sm">{error.message || 'Please try again later.'}</p>
                        <Button variant="outline" onClick={() => refetch()} className="mt-2">
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Empty State */}
            {!loading && !error && orders.length === 0 && (
                <Card className="border border-slate-200">
                    <CardContent className="py-12 text-center text-slate-500">
                        <Package className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                        <p className="font-medium">No orders yet</p>
                        <p className="text-sm">Wait for customers to place orders.</p>
                    </CardContent>
                </Card>
            )}

            {/* Orders List */}
            {!loading && !error && orders.length > 0 && (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const customerName = order.customer?.firstName && order.customer?.lastName
                            ? `${order.customer.firstName} ${order.customer.lastName}`
                            : order.customer?.email || 'Customer';

                        return (
                            <Card key={order.id} className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold flex-shrink-0">
                                                {(order.customer?.firstName?.[0] || order.customer?.email?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className="font-bold text-slate-900">{customerName}</p>
                                                    <OrderStatusBadge status={order.status} />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                                                    <span>Order ID: <strong className="text-slate-900">{order.id.slice(0, 8).toUpperCase()}</strong></span>
                                                    <span>•</span>
                                                    <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                                                    <span>•</span>
                                                    <span>{format(new Date(order.createdAt), 'MMM d, yyyy')}</span>
                                                    <span>•</span>
                                                    <span className="font-medium text-slate-900">TZS {Number(order.totalPrice).toLocaleString()}</span>
                                                </div>
                                                {order.shop?.name && (
                                                    <p className="text-xs text-slate-500 mt-1">Shop: {order.shop.name}</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewOrder(order)}
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View
                                            </Button>
                                            <PrintOrder order={order} />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Order Details Dialog */}
            <OrderDetailsDialog
                order={selectedOrder}
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                onStatusUpdate={handleStatusUpdate}
                onCopyOrderId={handleCopyOrderId}
            />
        </div>
    );
}
