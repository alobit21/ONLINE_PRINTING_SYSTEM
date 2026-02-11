import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '../../../../components/ui/Button';
import { cn } from '../../../../lib/utils';
import type { Order } from '../types';
import { format } from 'date-fns';

interface InvoiceDownloaderProps {
    order: Order;
    className?: string;
}

export const InvoiceDownloader = ({ order, className }: InvoiceDownloaderProps) => {
    const [downloading, setDownloading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateInvoicePDF = async () => {
        setDownloading(true);
        setError(null);
        setSuccess(false);

        try {
            // Create invoice content
            const invoiceHTML = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Invoice #${order.id.split('-')[0]}</title>
                    <style>
                        * { margin: 0; padding: 0; box-sizing: border-box; }
                        body { 
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                            padding: 40px;
                            color: #1e293b;
                            line-height: 1.6;
                        }
                        .header { 
                            border-bottom: 3px solid #6366f1;
                            padding-bottom: 20px;
                            margin-bottom: 30px;
                        }
                        .header h1 { 
                            color: #6366f1;
                            font-size: 32px;
                            font-weight: 800;
                            margin-bottom: 5px;
                        }
                        .header p { color: #64748b; font-size: 14px; }
                        .info-grid { 
                            display: grid;
                            grid-template-columns: 1fr 1fr;
                            gap: 30px;
                            margin-bottom: 40px;
                        }
                        .info-box h3 { 
                            font-size: 12px;
                            text-transform: uppercase;
                            color: #64748b;
                            font-weight: 700;
                            letter-spacing: 1px;
                            margin-bottom: 10px;
                        }
                        .info-box p { 
                            font-size: 14px;
                            color: #1e293b;
                            margin-bottom: 5px;
                        }
                        table { 
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 30px;
                        }
                        th { 
                            background: #f1f5f9;
                            padding: 12px;
                            text-align: left;
                            font-size: 12px;
                            text-transform: uppercase;
                            color: #64748b;
                            font-weight: 700;
                            letter-spacing: 0.5px;
                        }
                        td { 
                            padding: 12px;
                            border-bottom: 1px solid #e2e8f0;
                            font-size: 14px;
                        }
                        .total-section { 
                            margin-left: auto;
                            width: 300px;
                            background: #f8fafc;
                            padding: 20px;
                            border-radius: 8px;
                        }
                        .total-row { 
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 10px;
                            font-size: 14px;
                        }
                        .total-row.grand { 
                            border-top: 2px solid #6366f1;
                            padding-top: 15px;
                            margin-top: 15px;
                            font-size: 18px;
                            font-weight: 800;
                            color: #6366f1;
                        }
                        .footer { 
                            margin-top: 50px;
                            padding-top: 20px;
                            border-top: 1px solid #e2e8f0;
                            text-align: center;
                            color: #64748b;
                            font-size: 12px;
                        }
                        .badge { 
                            display: inline-block;
                            padding: 4px 12px;
                            background: #dbeafe;
                            color: #1e40af;
                            border-radius: 6px;
                            font-size: 11px;
                            font-weight: 700;
                            text-transform: uppercase;
                            letter-spacing: 0.5px;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>INVOICE</h1>
                        <p>Order #${order.id.split('-')[0]}</p>
                    </div>

                    <div class="info-grid">
                        <div class="info-box">
                            <h3>Billed To</h3>
                            <p><strong>${order.customer?.firstName || ''} ${order.customer?.lastName || ''}</strong></p>
                            <p>${order.customer?.email || 'N/A'}</p>
                        </div>
                        <div class="info-box">
                            <h3>Print Shop</h3>
                            <p><strong>${order.shop.name}</strong></p>
                            <p>${order.shop.address}</p>
                        </div>
                        <div class="info-box">
                            <h3>Invoice Date</h3>
                            <p>${format(new Date(order.createdAt), 'MMMM dd, yyyy')}</p>
                            <p>Status: <span class="badge">${order.status}</span></p>
                        </div>
                        <div class="info-box">
                            <h3>Payment Method</h3>
                            <p>Mobile Money</p>
                            <p>Paid in Full</p>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Document</th>
                                <th>Pages</th>
                                <th>Specifications</th>
                                <th style="text-align: right;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${order.items.map(item => `
                                <tr>
                                    <td><strong>${item.document.name}</strong></td>
                                    <td>${item.pageCount}</td>
                                    <td>
                                        ${item.configSnapshot.is_color ? 'Color' : 'B&W'} • 
                                        ${item.configSnapshot.paper_size}
                                        ${item.configSnapshot.binding ? ' • Binding' : ''}
                                        ${item.configSnapshot.lamination ? ' • Lamination' : ''}
                                    </td>
                                    <td style="text-align: right;"><strong>TZS ${Number(item.price).toLocaleString()}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="total-section">
                        <div class="total-row">
                            <span>Subtotal</span>
                            <strong>TZS ${Number(order.totalPrice).toLocaleString()}</strong>
                        </div>
                        <div class="total-row">
                            <span>Service Fee</span>
                            <strong>TZS 0</strong>
                        </div>
                        <div class="total-row">
                            <span>Discount</span>
                            <strong>-TZS 0</strong>
                        </div>
                        <div class="total-row grand">
                            <span>TOTAL</span>
                            <span>TZS ${Number(order.totalPrice).toLocaleString()}</span>
                        </div>
                    </div>

                    <div class="footer">
                        <p><strong>Thank you for your business!</strong></p>
                        <p>This is a computer-generated invoice. No signature required.</p>
                        <p style="margin-top: 10px;">Generated on ${format(new Date(), 'MMMM dd, yyyy • hh:mm a')}</p>
                    </div>
                </body>
                </html>
            `;

            // Create a blob and download
            const blob = new Blob([invoiceHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `invoice-${order.id.split('-')[0]}.html`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to generate invoice. Please try again.');
            console.error('Invoice generation error:', err);
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <Button
                onClick={generateInvoicePDF}
                disabled={downloading}
                variant="outline"
                className={cn(
                    "w-full h-14 rounded-2xl gap-2 border-slate-200 transition-all",
                    success && "border-green-200 bg-green-50 text-green-700",
                    error && "border-red-200 bg-red-50 text-red-700"
                )}
            >
                {downloading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Generating Invoice...
                    </>
                ) : success ? (
                    <>
                        <CheckCircle2 className="h-5 w-5" />
                        Invoice Downloaded!
                    </>
                ) : error ? (
                    <>
                        <AlertCircle className="h-5 w-5" />
                        {error}
                    </>
                ) : (
                    <>
                        <Download className="h-5 w-5" />
                        Download Invoice
                    </>
                )}
            </Button>

            {success && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-center text-green-600 font-medium"
                >
                    Invoice saved to your downloads folder
                </motion.p>
            )}
        </div>
    );
};
