import { useQuery } from '@apollo/client/react';
import { GET_MY_ORDERS } from '../api';
import type { GetMyOrdersData, Order } from '../types';
import { useMemo } from 'react';

export const useCustomerOrders = () => {
    const { data, loading, error, refetch } = useQuery<GetMyOrdersData>(GET_MY_ORDERS, {
        pollInterval: 30000, // Poll every 30 seconds for status updates
    });

    const activeOrders = useMemo(() =>
        (data?.myOrders || []).filter((o: Order) => !['COMPLETED', 'CANCELLED'].includes(o.status)),
        [data]);

    const completedOrders = useMemo(() =>
        (data?.myOrders || []).filter((o: Order) => o.status === 'COMPLETED'),
        [data]);

    const cancelledOrders = useMemo(() =>
        (data?.myOrders || []).filter((o: Order) => o.status === 'CANCELLED'),
        [data]);

    return {
        orders: data?.myOrders || [],
        activeOrders,
        completedOrders,
        cancelledOrders,
        loading,
        error,
        refetch
    };
};
