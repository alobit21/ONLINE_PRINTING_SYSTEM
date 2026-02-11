import { useEffect, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_MY_ORDERS } from '../api';
import type { Order, OrderStatus } from '../types';

interface UseOrderLiveTrackingOptions {
    orderId?: string;
    onStatusChange?: (newStatus: OrderStatus, order: Order) => void;
    pollInterval?: number;
}

export const useOrderLiveTracking = ({
    orderId,
    onStatusChange,
    pollInterval = 10000, // 10 seconds for active tracking
}: UseOrderLiveTrackingOptions = {}) => {
    const [previousStatus, setPreviousStatus] = useState<OrderStatus | null>(null);
    const [isTracking, setIsTracking] = useState(true);

    const { data, loading, error, refetch, startPolling, stopPolling } = useQuery(GET_MY_ORDERS, {
        pollInterval: isTracking ? pollInterval : 0,
        notifyOnNetworkStatusChange: true,
    });

    const orders = data?.myOrders || [];
    const trackedOrder = orderId ? orders.find((o: Order) => o.id === orderId) : null;

    // Detect status changes
    useEffect(() => {
        if (trackedOrder && previousStatus && trackedOrder.status !== previousStatus) {
            onStatusChange?.(trackedOrder.status, trackedOrder);
        }
        if (trackedOrder) {
            setPreviousStatus(trackedOrder.status);
        }
    }, [trackedOrder?.status, previousStatus, onStatusChange]);

    // Auto-stop polling for completed/cancelled orders
    useEffect(() => {
        if (trackedOrder) {
            const isFinal = ['COMPLETED', 'CANCELLED'].includes(trackedOrder.status);
            if (isFinal && isTracking) {
                setIsTracking(false);
                stopPolling();
            }
        }
    }, [trackedOrder?.status, isTracking, stopPolling]);

    const startTracking = useCallback(() => {
        setIsTracking(true);
        startPolling(pollInterval);
    }, [startPolling, pollInterval]);

    const stopTracking = useCallback(() => {
        setIsTracking(false);
        stopPolling();
    }, [stopPolling]);

    const manualRefresh = useCallback(async () => {
        await refetch();
    }, [refetch]);

    return {
        order: trackedOrder,
        orders,
        loading,
        error,
        isTracking,
        startTracking,
        stopTracking,
        manualRefresh,
    };
};
