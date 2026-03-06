import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
    Printer,
    Loader2,
    Package,
    AlertCircle,
    Eye,
    Copy,
    Mail,
    CheckCircle2,
    Paperclip,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../../components/ui/dialog';
import { Select } from '../../components/ui/Select';
import { FilePreview, FileAttachmentCard, type FileAttachment } from '../../components/ui/FilePreview';
import { GET_ALL_MY_SHOP_ORDERS, UPDATE_ORDER_STATUS } from '../../features/customer/orders/api';
import type { GetAllMyShopOrdersData, Order, OrderStatus } from '../../features/customer/orders/types';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

// Order Status Badge Component
const OrderStatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
        UPLOADED: 'bg-blue-900/50 text-blue-400 border-blue-700',
        ACCEPTED: 'bg-indigo-900/50 text-indigo-400 border-indigo-700',
        PRINTING: 'bg-amber-900/50 text-amber-400 border-amber-700',
        READY: 'bg-green-900/50 text-green-400 border-green-700',
        COMPLETED: 'bg-gray-700 text-gray-300 border-gray-600',
        CANCELLED: 'bg-red-900/50 text-red-400 border-red-700',
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
    const [selectedFile, setSelectedFile] = useState<FileAttachment | null>(null);
    const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);

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

    // Extract unique file attachments from order items
    const fileAttachments: FileAttachment[] = order.items.map((item) => ({
        id: item.document?.id || '',
        fileName: item.document?.fileName || 'Unknown File',
        fileType: item.document?.fileType || 'application/octet-stream',
        fileSize: item.document?.fileSize || 0,
        uploadUrl: item.document?.uploadUrl || undefined,
        downloadUrl: item.document?.downloadUrl || undefined,
        createdAt: item.document?.createdAt,
    }));

    const handleFilePreview = (file: FileAttachment) => {
        setSelectedFile(file);
        setIsFilePreviewOpen(true);
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">Order Details</DialogTitle>
                        <DialogDescription className="text-gray-400">
                            Order ID: {order.id.slice(0, 8).toUpperCase()}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Customer Information */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Customer Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Full Name</p>
                                    <p className="text-sm font-medium text-white">{customerName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Email</p>
                                    <p className="text-sm font-medium text-white">{order.customer?.email || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Information */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Order Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Order ID</p>
                                    <p className="text-sm font-mono font-medium text-white">{order.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Date Created</p>
                                    <p className="text-sm font-medium text-white">
                                        {format(new Date(order.createdAt), 'MMM d, yyyy h:mm a')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Current Status</p>
                                    <OrderStatusBadge status={order.status} />
                                </div>
                                {order.completedAt && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Completed At</p>
                                        <p className="text-sm font-medium text-white">
                                            {format(new Date(order.completedAt), 'MMM d, yyyy h:mm a')}
                                        </p>
                                    </div>
                                )}
                                {order.estimatedCompletionTime && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Estimated Completion</p>
                                        <p className="text-sm font-medium text-white">
                                            {format(new Date(order.estimatedCompletionTime), 'MMM d, yyyy h:mm a')}
                                        </p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Shop</p>
                                    <p className="text-sm font-medium text-white">{order.shop?.name || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Order Items</h3>
                            <div className="border border-gray-600 rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-700 border-b border-gray-600">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Item</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Pages</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300 uppercase">Configuration</th>
                                            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300 uppercase">Price</th>
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
                                                <tr key={item.id} className="border-b border-gray-600 last:border-0">
                                                    <td className="px-4 py-3">
                                                        <p className="font-medium text-white">{item.document?.fileName || 'Document'}</p>
                                                        <p className="text-xs text-gray-400">{item.document?.fileType || 'N/A'}</p>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-300">{item.pageCount}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex flex-wrap gap-1">
                                                            {configParts.map((part, idx) => (
                                                                <span key={idx} className="text-xs text-gray-300">{part}</span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-right font-medium text-white">
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
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Totals</h3>
                            <div className="space-y-2 p-4 bg-gray-700 rounded-lg border border-gray-600">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-300">Subtotal:</span>
                                    <span className="font-medium text-white">TZS {subtotal.toLocaleString()}</span>
                                </div>
                                {commissionFee > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-300">Commission Fee:</span>
                                        <span className="font-medium text-white">TZS {commissionFee.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="pt-2 border-t border-gray-600 flex justify-between">
                                    <span className="font-semibold text-white">Total:</span>
                                    <span className="font-bold text-lg text-white">TZS {total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Attachments Section */}
                        {fileAttachments.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-white uppercase tracking-wide flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    Attachments ({fileAttachments.length})
                                </h3>
                                <div className="space-y-2">
                                    {fileAttachments.map((file) => (
                                        <FileAttachmentCard
                                            key={file.id}
                                            file={file}
                                            onPreview={handleFilePreview}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status Update Section */}
                        <div className="space-y-3 pt-4 border-t border-gray-600">
                            <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Update Status</h3>
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

            {/* File Preview Modal */}
            {selectedFile && (
                <FilePreview
                    file={selectedFile}
                    open={isFilePreviewOpen}
                    onOpenChange={setIsFilePreviewOpen}
                />
            )}
        </>
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
                    .order-info {
                        margin-bottom: 20px;
                    }
                    .order-info h2 {
                        font-size: 16pt;
                        margin-bottom: 10px;
                    }
                    .info-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                        margin-bottom: 20px;
                    }
                    .info-item {
                        margin-bottom: 5px;
                    }
                    .info-item strong {
                        font-weight: bold;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                    }
                    .total-section {
                        border-top: 2px solid #000;
                        padding-top: 15px;
                    }
                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 5px;
                    }
                    .total-row.final {
                        font-weight: bold;
                        font-size: 14pt;
                        border-top: 1px solid #ddd;
                        padding-top: 5px;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 15px;
                        border-top: 1px solid #ddd;
                        font-size: 10pt;
                        color: #666;
                    }
                    @media print {
                        body { padding: 10mm; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>ORDER INVOICE</h1>
                    <p>Order ID: ${order.id.slice(0, 8).toUpperCase()}</p>
                    <p>${orderDate}</p>
                </div>

                <div class="order-info">
                    <h2>Customer Information</h2>
                    <div class="info-grid">
                        <div class="info-item"><strong>Name:</strong> ${customerName}</div>
                        <div class="info-item"><strong>Email:</strong> ${order.customer?.email || 'N/A'}</div>
                        <div class="info-item"><strong>Phone:</strong> ${order.customer?.phone || 'N/A'}</div>
                        <div class="info-item"><strong>Status:</strong> ${order.status}</div>
                    </div>
                </div>

                <h2>Order Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Pages</th>
                            <th>Configuration</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => {
                            const config = item.printConfig || {};
                            const configParts = [
                                config.copies > 1 ? `${config.copies} copies` : '',
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
                                    <td>TZS ${Number(item.price).toLocaleString()}</td>
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
        
        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
            // Close the window after print dialog is handled (either printed or cancelled)
            printWindow.onafterprint = () => {
                printWindow.close();
            };
            // Fallback for browsers that don't support onafterprint
            setTimeout(() => {
                if (!printWindow.closed) {
                    printWindow.close();
                }
            }, 1000);
        }, 500);
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
        
        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
            // Close the window after print dialog is handled (either printed or cancelled)
            printWindow.onafterprint = () => {
                printWindow.close();
            };
            // Fallback for browsers that don't support onafterprint
            setTimeout(() => {
                if (!printWindow.closed) {
                    printWindow.close();
                }
            }, 1000);
        }, 500);
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

    const [updateStatusMutation] = useMutation<{
        updateOrderStatus: {
            response: {
                status: boolean;
                message: string;
            };
            order: {
                id: string;
                status: string;
                completedAt: string | null;
            };
        };
    }>(UPDATE_ORDER_STATUS);

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
                            ? 'border-green-700 bg-green-900/50 text-green-400'
                            : 'border-red-700 bg-red-900/50 text-red-400'
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
                    <h1 className="text-2xl font-bold text-white">Orders</h1>
                    <p className="text-gray-400 mt-1">Manage and track all customer orders</p>
                </div>
                <PrintAllOrders orders={orders} />
            </div>

            {/* Loading State */}
            {loading && (
                <Card className="border border-gray-700 bg-gray-800">
                    <CardContent className="py-12 flex items-center justify-center gap-2 text-gray-400">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading orders…</span>
                    </CardContent>
                </Card>
            )}

            {/* Error State */}
            {error && (
                <Card className="border border-red-700 bg-red-900/50">
                    <CardContent className="py-12 flex flex-col items-center justify-center gap-2 text-red-400">
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
                <Card className="border border-gray-700 bg-gray-800">
                    <CardContent className="py-12 text-center text-gray-400">
                        <Package className="h-12 w-12 mx-auto mb-3 text-gray-500" />
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
                            <Card key={order.id} className="border border-gray-700 bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* Order Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="h-12 w-12 rounded-full bg-brand-900/50 flex items-center justify-center text-brand-400 font-bold flex-shrink-0">
                                                {(order.customer?.firstName?.[0] || order.customer?.email?.[0] || '?').toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className="font-bold text-white">{customerName}</p>
                                                    <OrderStatusBadge status={order.status} />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                                                    <span>Order ID: <strong className="text-white">{order.id.slice(0, 8).toUpperCase()}</strong></span>
                                                    <span>•</span>
                                                    <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
                                                    <span>•</span>
                                                    <span>{format(new Date(order.createdAt), 'MMM d, yyyy')}</span>
                                                    <span>•</span>
                                                    <span className="font-medium text-white">TZS {Number(order.totalPrice).toLocaleString()}</span>
                                                </div>
                                                {order.shop?.name && (
                                                    <p className="text-xs text-gray-500 mt-1">Shop: {order.shop.name}</p>
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
