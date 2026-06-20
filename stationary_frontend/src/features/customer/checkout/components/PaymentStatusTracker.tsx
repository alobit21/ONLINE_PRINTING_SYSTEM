import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_PAYMENT_STATUS } from '../../orders/api';

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

export const PaymentStatusTracker: React.FC<PaymentStatusTrackerProps> = ({
    paymentId,
    phoneNumber,
    paymentMethod,
    amount,
    onComplete,
    onPaymentFailed
}) => {
    const [pollingCount, setPollingCount] = useState(0);

    const { data, loading, error, refetch } = useQuery<PaymentStatusData>(
        GET_PAYMENT_STATUS,
        {
            variables: { paymentId },
            pollInterval: 3000,
            skip: !paymentId,
            fetchPolicy: 'network-only'
        }
    );

    const payment = data?.paymentStatus;
    const currentStatus = payment?.status || 'PROCESSING';

    useEffect(() => {
        if (pollingCount >= 60 || ['COMPLETED', 'FAILED', 'CANCELLED'].includes(currentStatus)) {
            return;
        }
        const timer = setTimeout(() => {
            setPollingCount(prev => prev + 1);
        }, 3000);
        return () => clearTimeout(timer);
    }, [pollingCount, currentStatus]);

    const handleCancel = () => {
        if (onPaymentFailed) {
            onPaymentFailed();
        }
    };

    const handleTryAgain = () => {
        if (onPaymentFailed) {
            onPaymentFailed();
        }
    };

    const handleContinue = () => {
        if (onComplete) {
            onComplete();
        }
    };

    // Shared summary details block
    const SummaryDetails = ({ amountLabel = "Amount Due" }: { amountLabel?: string }) => (
        <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center justify-between">
                <span className="text-sm text-charcoal">{amountLabel}</span>
                <span className="text-ink font-medium text-[24px]">TZS {amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-sm text-charcoal">Method</span>
                <span className="text-sm text-ink font-semibold">{paymentMethod}</span>
            </div>
            {payment?.referenceNumber && (
                <div className="flex items-center justify-between">
                    <span className="text-sm text-charcoal">Reference</span>
                    <span className="text-steel text-[12px] font-mono tracking-[0.5px]">
                        {payment.referenceNumber}
                    </span>
                </div>
            )}
        </div>
    );

    if (loading && !payment) {
        return (
            <div className="flex justify-center py-20">
                <svg className="animate-spin w-8 h-8 text-hp-primary" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#e2e2e2" strokeWidth="2.5"></circle>
                    <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"></path>
                </svg>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-cloud rounded-xl w-full max-w-[440px] mx-auto p-8 shadow-[0_8px_24px_rgba(26,26,26,0.12)] border-t-[2px] border-red-600 flex flex-col">
                <div className="flex items-center gap-4 mb-5">
                    <div className="rounded-full flex items-center justify-center shrink-0 border-2 border-red-600 w-12 h-12 bg-red-600/10">
                        <svg className="w-[22px] h-[22px] text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.18" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v4m0 4h.01"></path>
                        </svg>
                    </div>
                    <div>
                        <div className="text-ink font-semibold text-[20px] leading-[1.2]">
                            Connection Failed
                        </div>
                    </div>
                </div>
                <p className="text-base text-charcoal mb-5 leading-relaxed">
                    We couldn't reach the server to check your payment. Please try again.
                </p>
                <div className="border-t border-fog pt-4 flex items-center justify-between mt-auto">
                    <button onClick={handleCancel} className="text-sm text-hp-primary font-semibold">
                        Cancel Payment
                    </button>
                    <button onClick={() => refetch()} className="text-hp-primary font-semibold rounded-md px-6 flex items-center border border-hp-primary h-[44px] text-[14px] tracking-[0.7px]">
                        RETRY
                    </button>
                </div>
            </div>
        );
    }

    if (currentStatus === 'COMPLETED') {
        return (
            <div className="bg-cloud rounded-xl w-full max-w-[440px] mx-auto p-8 shadow-[0_8px_24px_rgba(26,26,26,0.12)] border-t-[2px] border-hp-primary flex flex-col animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-5">
                    <div className="bg-hp-primary rounded-full flex items-center justify-center shrink-0 w-12 h-12">
                        <svg className="w-[22px] h-[22px] text-canvas" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.18" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6L9 17l-5-5"></path>
                        </svg>
                    </div>
                    <div>
                        <div className="text-ink font-semibold text-[20px] leading-[1.2]">
                            Payment Confirmed
                        </div>
                    </div>
                </div>
                <p className="text-base text-charcoal mb-5 leading-relaxed">
                    Your payment was successful. Your print order is now being processed and you'll be notified when it's ready.
                </p>
                
                <div className="border-t border-fog mb-5"></div>
                <SummaryDetails amountLabel="Amount Paid" />
                
                <div className="border-t border-fog pt-4 flex justify-end">
                    <button onClick={handleContinue} className="bg-hp-primary text-canvas font-semibold rounded-md px-6 flex items-center h-[44px] text-[14px] tracking-[0.7px]">
                        CONTINUE
                    </button>
                </div>
            </div>
        );
    }

    if (currentStatus === 'FAILED' || currentStatus === 'CANCELLED') {
        return (
            <div className="bg-cloud rounded-xl w-full max-w-[440px] mx-auto p-8 shadow-[0_8px_24px_rgba(26,26,26,0.12)] border-t-[2px] border-red-600 flex flex-col animate-in fade-in duration-500">
                <div className="flex items-center gap-4 mb-5">
                    <div className="rounded-full flex items-center justify-center shrink-0 border-2 border-red-600 w-12 h-12 bg-red-600/10">
                        <svg className="w-[22px] h-[22px] text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.18" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 8v4m0 4h.01"></path>
                        </svg>
                    </div>
                    <div>
                        <div className="text-ink font-semibold text-[20px] leading-[1.2]">
                            Payment Failed
                        </div>
                    </div>
                </div>
                <p className="text-base text-charcoal mb-5 leading-relaxed">
                    We couldn't confirm your payment. The session may have timed out or was cancelled. Please try again.
                </p>
                
                <div className="border-t border-fog mb-5"></div>
                <SummaryDetails />

                <div className="border-t border-fog pt-4 flex items-center justify-between">
                    <button onClick={handleCancel} className="text-sm text-hp-primary font-semibold">
                        Cancel Payment
                    </button>
                    <button onClick={handleTryAgain} className="text-hp-primary font-semibold rounded-md px-6 flex items-center border border-hp-primary h-[44px] text-[14px] tracking-[0.7px]">
                        TRY AGAIN
                    </button>
                </div>
            </div>
        );
    }

    // PROCESSING / PENDING
    return (
        <div className="bg-cloud rounded-xl w-full max-w-[440px] mx-auto p-8 shadow-[0_8px_24px_rgba(26,26,26,0.12)] border-t-[2px] border-hp-primary flex flex-col">
            <div className="flex items-center gap-4 mb-5">
                <div className="bg-canvas rounded-full flex items-center justify-center shrink-0 w-12 h-12 shadow-[0_1px_4px_rgba(26,26,26,0.08)]">
                    <svg className="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="#e2e2e2" strokeWidth="2.5"></circle>
                        <path d="M12 3a9 9 0 0 1 9 9" stroke="#024ad8" strokeWidth="2.5" strokeLinecap="round"></path>
                    </svg>
                </div>
                <div>
                    <div className="text-ink font-semibold text-[20px] leading-[1.2]">
                        Confirm on Your Phone
                    </div>
                </div>
            </div>
            
            <p className="text-base text-charcoal mb-5 leading-relaxed">
                A payment prompt has been sent to <span className="font-semibold text-ink">{phoneNumber}</span>. Enter your PIN to complete the purchase.
            </p>
            
            <div className="border-t border-fog mb-5"></div>
            <SummaryDetails />
            
            <div className="border-t border-fog pt-4 flex justify-end">
                <button onClick={handleCancel} className="text-sm text-hp-primary font-semibold">
                    Cancel Payment
                </button>
            </div>
        </div>
    );
};

export default PaymentStatusTracker;
