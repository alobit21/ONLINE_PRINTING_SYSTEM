import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import { useQuery } from '@apollo/client/react';
import { GET_PAYMENT_STATUS } from '../../orders/api';


import { 
    Smartphone, 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    Loader2, 
    RefreshCw,
    ArrowRight,
    ShieldCheck
} from 'lucide-react';

interface PaymentStatusData {
    paymentStatus: {
        id: string;
        status: string;
        paymentMethod: string;
        amount: number;
        referenceNumber?: string;
        transactionId?: string;
        failureReason?: string;
        createdAt: string;
        updatedAt: string;
        order?: {
            id: string;
            paymentStatus: string;
            status: string;
        };
    };
}

interface PaymentStatusTrackerProps {
    paymentId: string;
    phoneNumber: string;
    paymentMethod: string;
    amount: number;
    onComplete?: () => void;
    onPaymentFailed?: () => void;
}

const statusConfig = {
    PENDING: {
        icon: Clock,
        color: 'text-amber-600',
        bgColor: 'bg-amber-100',
        title: 'Payment Initiated',
        message: 'Waiting for you to complete mobile money payment...',
        showPasswordPrompt: true
    },
    PROCESSING: {
        icon: Loader2,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        title: 'Processing Payment',
        message: 'Payment is being processed by mobile money provider...',
        showPasswordPrompt: false
    },
    COMPLETED: {
        icon: CheckCircle2,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        title: 'Payment Completed!',
        message: 'Payment successful! Your order has been confirmed.',
        showPasswordPrompt: false
    },
    FAILED: {
        icon: AlertTriangle,
        color: 'text-red-600',
        bgColor: 'bg-red-100',
        title: 'Payment Failed',
        message: 'Payment was not completed. Please try again.',
        showPasswordPrompt: false
    },
    CANCELLED: {
        icon: AlertTriangle,
        color: 'text-gray-600',
        bgColor: 'bg-gray-100',
        title: 'Payment Cancelled',
        message: 'Payment was cancelled. You can try again.',
        showPasswordPrompt: false
    }
};

export const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({
    paymentId,
    phoneNumber,
    paymentMethod,
    amount,
    onComplete,
    onPaymentFailed
}) => {
    const [pollingCount, setPollingCount] = useState(0);
    const [showRetry, setShowRetry] = useState(false);

    const { data, loading, error, refetch } = useQuery<PaymentStatusData>(
        GET_PAYMENT_STATUS,
        {
            variables: { paymentId },
            pollInterval: 3000, // Poll every 3 seconds
            skip: !paymentId
        }
    );

    const payment = data?.paymentStatus;
    const currentStatus = payment?.status || 'PENDING';
    const statusInfo = statusConfig[currentStatus as keyof typeof statusConfig] || statusConfig.PENDING;

    // Stop polling after 60 attempts (3 minutes) or when payment is completed/failed
    useEffect(() => {
        if (pollingCount >= 60 || ['COMPLETED', 'FAILED', 'CANCELLED'].includes(currentStatus)) {
            return;
        }
        
        const timer = setTimeout(() => {
            setPollingCount(prev => prev + 1);
        }, 3000);

        return () => clearTimeout(timer);
    }, [pollingCount, currentStatus]);

    // Handle payment completion
    useEffect(() => {
        if (currentStatus === 'COMPLETED' && onComplete) {
            setTimeout(() => onComplete(), 1000);
        }
        if (currentStatus === 'FAILED' && onPaymentFailed) {
            setTimeout(() => onPaymentFailed(), 1000);
        }
    }, [currentStatus, onComplete, onPaymentFailed]);

    const StatusIcon = statusInfo.icon;

    const handleManualRefresh = () => {
        refetch();
        setPollingCount(0);
    };

    const getPaymentInstructions = () => {
        const instructions = {
            MPESA: {
                steps: [
                    '1. Check your phone for M-Pesa menu',
                    '2. Enter your M-Pesa PIN when prompted',
                    '3. Confirm the transaction',
                    '4. Wait for confirmation message'
                ],
                ussdCode: '*150#'
            },
            TIGOPESA: {
                steps: [
                    '1. Open Tigo Pesa menu',
                    '2. Enter your PIN when prompted',
                    '3. Confirm the payment request',
                    '4. Wait for SMS confirmation'
                ],
                ussdCode: '*150*01#'
            },
            AIRTELMONEY: {
                steps: [
                    '1. Check phone for Airtel Money prompt',
                    '2. Enter your Airtel Money PIN',
                    '3. Confirm the transaction',
                    '4. Wait for confirmation'
                ],
                ussdCode: '*150*60#'
            },
            HALOPESA: {
                steps: [
                    '1. Open Halopesa menu',
                    '2. Enter your PIN when prompted',
                    '3. Confirm payment',
                    '4. Wait for confirmation'
                ],
                ussdCode: '*150*70#'
            }
        };

        return instructions[paymentMethod as keyof typeof instructions] || instructions.MPESA;
    };

    const instructions = getPaymentInstructions();

    if (loading && !payment) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 text-brand-600 animate-spin mx-auto mb-4" />
                    <p className="text-slate-600">Loading payment status...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
                <Card className="w-full max-w-md border-red-200">
                    <CardContent className="p-6 text-center">
                        <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">Error Checking Payment Status</h3>
                        <p className="text-slate-600 mb-4">Unable to verify payment status. Please try again.</p>
                        <Button onClick={handleManualRefresh} className="w-full">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8">
            <div className="max-w-4xl mx-auto px-4 space-y-6">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className={`w-20 h-20 rounded-full ${statusInfo.bgColor} flex items-center justify-center mx-auto`}>
                        <StatusIcon className={`h-10 w-10 ${statusInfo.color}`} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900">{statusInfo.title}</h1>
                    <p className="text-lg text-slate-600">{statusInfo.message}</p>
                </div>

                {/* Status Progress Bar */}
                <Card className="border-0 shadow-xl">
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm font-medium">
                                <span className="text-slate-700">Payment Status</span>
                                <span className={`font-bold ${statusInfo.color}`}>{currentStatus}</span>
                            </div>
                            
                            {/* Progress Steps */}
                            <div className="relative">
                                <div className="flex items-center justify-between mb-2">
                                    {['Initiated', 'Processing', 'Completed'].map((step, index) => (
                                        <div key={step} className="flex items-center">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                                currentStatus === 'COMPLETED' || 
                                                (currentStatus === 'PROCESSING' && index <= 1) ||
                                                (currentStatus === 'PENDING' && index === 0)
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-300 text-gray-600'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            {index < 2 && (
                                                <div className={`w-16 h-1 mx-2 ${
                                                    currentStatus === 'COMPLETED' || 
                                                    (currentStatus === 'PROCESSING' && index <= 0) ||
                                                    (currentStatus === 'PENDING' && index === 0)
                                                        ? 'bg-green-500'
                                                        : 'bg-gray-300'
                                                }`} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between text-xs text-slate-600">
                                    <span>Initiated</span>
                                    <span>Processing</span>
                                    <span>Completed</span>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Amount:</span>
                                    <span className="font-bold text-slate-900">TZS {amount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Method:</span>
                                    <span className="font-bold text-slate-900">{paymentMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Phone:</span>
                                    <span className="font-bold text-slate-900">{phoneNumber}</span>
                                </div>
                                {payment?.referenceNumber && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Reference:</span>
                                        <span className="font-bold text-slate-900">{payment.referenceNumber}</span>
                                    </div>
                                )}
                                {payment?.transactionId && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Transaction ID:</span>
                                        <span className="font-bold text-slate-900">{payment.transactionId}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Mobile Money Instructions */}
                {statusInfo.showPasswordPrompt && (
                    <Card className="border-0 shadow-xl">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5 text-brand-600" />
                                Complete Your Payment
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                {/* USSD Code */}
                                <div className="text-center">
                                    <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-800 px-4 py-2 rounded-lg font-mono text-lg">
                                        <span>USSD:</span>
                                        <span className="font-bold">{instructions.ussdCode}</span>
                                    </div>
                                </div>

                                {/* Steps */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-slate-900">Follow these steps:</h4>
                                    <ol className="space-y-2">
                                        {instructions.steps.map((step, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <span className="flex-shrink-0 w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                    {index + 1}
                                                </span>
                                                <span className="text-slate-700">{step}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>

                                {/* Alert */}
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-amber-800 mb-1">Important</h4>
                                            <p className="text-sm text-amber-700">
                                                You will receive a prompt on your phone {phoneNumber}. 
                                                Enter your mobile money PIN to confirm the payment. 
                                                Do not share your PIN with anyone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <Button 
                        variant="outline" 
                        onClick={handleManualRefresh}
                        className="flex items-center gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Check Status
                    </Button>
                    
                    {showRetry && (
                        <Button variant="primary" className="flex items-center gap-2">
                            <ArrowRight className="h-4 w-4" />
                            Try Payment Again
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentStatusTracker;
