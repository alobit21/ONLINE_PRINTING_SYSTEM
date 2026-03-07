import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Search, Package, Clock, CheckCircle, Truck, Phone, Mail, Calendar, Filter, RefreshCw, AlertCircle, User, FileUp } from 'lucide-react';
import { useGuestVerification } from '../../../hooks/useGuestVerification';
import { useGuestOrders } from './hooks/useGuestOrders';
import type { GuestOrder } from './api/guestOrdersApi';

export const GuestOrdersPage = () => {
    const { guestContactInfo } = useGuestVerification();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    // Debug logging
    console.log('GuestOrdersPage - guestContactInfo:', guestContactInfo);
    console.log('GuestOrdersPage - localStorage guestContactInfo:', localStorage.getItem('guestContactInfo'));

    // Fetch real orders using API
    const { orders, loading, error, refetch, hasData } = useGuestOrders({
        contactInfo: {
            email: guestContactInfo?.email || undefined,
            whatsappNumber: guestContactInfo?.whatsappNumber || ''
        },
        skip: !guestContactInfo || (!guestContactInfo.email && !guestContactInfo.whatsappNumber)
    });

    const filteredOrders = orders.filter((order: GuestOrder) => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.shop.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
            case 'READY': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
            case 'PRINTING': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30';
            case 'ACCEPTED': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30';
            case 'UPLOADED': return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-900/30';
            case 'CANCELLED': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
            default: return 'text-slate-600 bg-slate-100 dark:text-slate-400 dark:bg-slate-900/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
            case 'READY': return <Package className="w-4 h-4" />;
            case 'PRINTING': return <Truck className="w-4 h-4" />;
            case 'ACCEPTED': return <Clock className="w-4 h-4" />;
            case 'UPLOADED': return <Clock className="w-4 h-4" />;
            case 'CANCELLED': return <AlertCircle className="w-4 h-4" />;
            default: return <Package className="w-4 h-4" />;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-TZ', {
            style: 'currency',
            currency: 'TZS',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const calculatePricePerPage = (price: number, pageCount: number) => {
        return price / pageCount;
    };

    if (!guestContactInfo || (!guestContactInfo.email && !guestContactInfo.whatsappNumber)) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center py-20">
                        <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            Verification Required
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            Please verify your contact information to view your orders.
                        </p>
                        <Button onClick={() => window.history.back()}>
                            Go Back
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-800 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                        Your Orders
                    </h1>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{guestContactInfo.email || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{guestContactInfo.whatsappNumber || 'Not provided'}</span>
                        </div>
                    </div>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="UPLOADED">Uploaded</option>
                        <option value="ACCEPTED">Accepted</option>
                        <option value="PRINTING">Printing</option>
                        <option value="READY">Ready</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                    {loading ? (
                        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
                            <CardContent className="text-center py-12">
                                <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Loading Orders...
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Fetching your order information
                                </p>
                            </CardContent>
                        </Card>
                    ) : error ? (
                        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
                            <CardContent className="text-center py-12">
                                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    Error Loading Orders
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400 mb-4">
                                    {error.message || 'Unable to load your orders. Please try again.'}
                                </p>
                                <Button onClick={() => refetch()} className="flex items-center gap-2">
                                    <RefreshCw className="w-4 h-4" />
                                    Try Again
                                </Button>
                            </CardContent>
                        </Card>
                    ) : filteredOrders.length === 0 ? (
                        <Card className="bg-white dark:bg-slate-800 border-0 shadow-lg">
                            <CardContent className="text-center py-12">
                                <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                                    No orders found
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    {searchTerm || filterStatus !== 'all' 
                                        ? 'Try adjusting your search or filter criteria.'
                                        : 'You haven\'t placed any orders yet.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredOrders.map((order: GuestOrder) => (
                            <Card key={order.id} className="bg-white dark:bg-slate-800 border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-6">
                                    {/* Order Header */}
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                    Order #{order.id.slice(0, 8).toUpperCase()}
                                                </h3>
                                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                    {getStatusIcon(order.status)}
                                                    <span className="capitalize">{order.status.toLowerCase().replace('_', ' ')}</span>
                                                </div>
                                                {order.isGuestOrder && (
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                                                        <Package className="w-3 h-3" />
                                                        <span>Guest</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Shop Information */}
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                    {order.shop.name.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                                        {order.shop.name}
                                                    </h4>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                                                        {order.shop.address}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-yellow-500">★</span>
                                                            <span className="text-sm font-medium">{order.shop.rating}</span>
                                                        </div>
                                                        {order.shop.isVerified && (
                                                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                                <CheckCircle className="w-3 h-3" />
                                                                <span className="text-xs">Verified</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Customer Information */}
                                            {order.customerInfo && (
                                                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <User className="w-4 h-4 text-slate-500" />
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Customer Details</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-slate-500">Name:</span>
                                                            <span className="font-medium">{JSON.parse(order.customerInfo).name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Mail className="w-3 h-3 text-slate-400" />
                                                            <span className="text-slate-600 dark:text-slate-400 truncate">
                                                                {JSON.parse(order.customerInfo).email}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3 text-slate-400" />
                                                            <span className="text-slate-600 dark:text-slate-400">
                                                                {JSON.parse(order.customerInfo).phone}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Pricing and Actions */}
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                                                    {formatCurrency(parseFloat(order.totalPrice))}
                                                </p>
                                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                                                <Package className="w-4 h-4" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Order Timeline */}
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Order Timeline</h5>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Order Placed</p>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {order.completedAt ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Completed</p>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                                            {new Date(order.completedAt).toLocaleDateString()} at {new Date(order.completedAt).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : order.estimatedCompletionTime ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                                                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Estimated Completion</p>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                                            {new Date(order.estimatedCompletionTime).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Processing</p>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                                            Timeline to be confirmed
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {/* Order Items */}
                                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                                        <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Order Items</h5>
                                        <div className="space-y-3">
                                            {order.items.map((item) => {
                                                const config = JSON.parse(item.configSnapshot);
                                                const itemPrice = parseFloat(item.price);
                                                const pricePerPage = calculatePricePerPage(itemPrice, item.pageCount);
                                                const isAboveStandardPrice = pricePerPage > 100;
                                                
                                                return (
                                                    <div key={item.id} className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                                                        <div className="flex items-start gap-4">
                                                            <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                <FileUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between mb-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate mb-2">
                                                                            {item.document.fileName}
                                                                        </p>
                                                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400 mb-2">
                                                                            <span className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-600 rounded">
                                                                                <span>•</span>
                                                                                {item.pageCount} pages
                                                                            </span>
                                                                            <span className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-600 rounded">
                                                                                <span>•</span>
                                                                                {config.is_color ? 'Color' : 'B&W'}
                                                                            </span>
                                                                            <span className="flex items-center gap-1 px-2 py-1 bg-white dark:bg-slate-600 rounded">
                                                                                <span>•</span>
                                                                                {config.paper_size}
                                                                            </span>
                                                                            {config.binding && (
                                                                                <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded">
                                                                                    <span>•</span>
                                                                                    Binding
                                                                                </span>
                                                                            )}
                                                                            {config.lamination && (
                                                                                <span className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                                                                                    <span>•</span>
                                                                                    Lamination
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-right ml-4">
                                                                        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                                                            {formatCurrency(itemPrice)}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Price Breakdown */}
                                                                <div className="bg-white dark:bg-slate-600 rounded-lg p-3 border border-slate-200 dark:border-slate-600">
                                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-slate-600 dark:text-slate-400">Standard Rate:</span>
                                                                            <span className="font-medium">TSh 100/page</span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-slate-600 dark:text-slate-400">Your Rate:</span>
                                                                            <span className={`font-medium ${isAboveStandardPrice ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400'}`}>
                                                                                {formatCurrency(pricePerPage)}/page
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-slate-600 dark:text-slate-400">Total:</span>
                                                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                                                {item.pageCount} × {formatCurrency(pricePerPage)} = {formatCurrency(parseFloat(item.price))}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Price Indicator */}
                                                                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
                                                                        <div className="flex items-center gap-2">
                                                                            {isAboveStandardPrice ? (
                                                                                <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                                                                    <AlertCircle className="w-3 h-3" />
                                                                                    <span className="text-xs">
                                                                                        Above standard rate by {formatCurrency(pricePerPage - 100)}/page
                                                                                    </span>
                                                                                </div>
                                                                            ) : pricePerPage < 100 ? (
                                                                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                                                    <CheckCircle className="w-3 h-3" />
                                                                                    <span className="text-xs">
                                                                                        Below standard rate by {formatCurrency(100 - pricePerPage)}/page
                                                                                    </span>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                                                                    <CheckCircle className="w-3 h-3" />
                                                                                    <span className="text-xs">
                                                                                        Standard rate applied
                                                                                    </span>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            
                                            {/* Total Price Summary */}
                                            <div className="bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h6 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Order Total</h6>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''} • {order.items.reduce((sum, item) => sum + item.pageCount, 0)} total pages
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-bold text-slate-900 dark:text-slate-100">
                                                            {formatCurrency(parseFloat(order.totalPrice))}
                                                        </p>
                                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                                            Avg: {formatCurrency(parseFloat(order.totalPrice) / order.items.reduce((sum, item) => sum + item.pageCount, 0))}/page
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
