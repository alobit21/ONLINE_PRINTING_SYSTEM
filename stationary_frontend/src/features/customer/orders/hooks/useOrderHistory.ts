import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_MY_ORDERS } from '../api';
import type { Order, OrderStatus } from '../types';

interface UseOrderHistoryOptions {
    pageSize?: number;
    initialFilter?: OrderStatus | 'all';
}

export const useOrderHistory = ({
    pageSize = 10,
    initialFilter = 'all',
}: UseOrderHistoryOptions = {}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState<OrderStatus | 'all'>(initialFilter);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, loading, error, refetch } = useQuery(GET_MY_ORDERS, {
        fetchPolicy: 'cache-and-network',
    });

    const allOrders = useMemo(() => data?.myOrders || [], [data]);

    // Filter orders
    const filteredOrders = useMemo(() => {
        let orders = [...allOrders];

        // Apply status filter
        if (filter !== 'all') {
            orders = orders.filter((order: Order) => order.status === filter);
        }

        // Apply search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            orders = orders.filter((order: Order) =>
                order.id.toLowerCase().includes(query) ||
                order.shop.name.toLowerCase().includes(query) ||
                order.items.some(item => item.document.name.toLowerCase().includes(query))
            );
        }

        // Sort by date (newest first)
        orders.sort((a: Order, b: Order) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        return orders;
    }, [allOrders, filter, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    const paginatedOrders = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return filteredOrders.slice(startIndex, endIndex);
    }, [filteredOrders, currentPage, pageSize]);

    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    const goToNextPage = useCallback(() => {
        if (hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    }, [hasNextPage]);

    const goToPreviousPage = useCallback(() => {
        if (hasPreviousPage) {
            setCurrentPage(prev => prev - 1);
        }
    }, [hasPreviousPage]);

    const goToPage = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    }, [totalPages]);

    const resetPagination = useCallback(() => {
        setCurrentPage(1);
    }, []);

    // Stats
    const stats = useMemo(() => {
        const total = allOrders.length;
        const completed = allOrders.filter((o: Order) => o.status === 'COMPLETED').length;
        const active = allOrders.filter((o: Order) => !['COMPLETED', 'CANCELLED'].includes(o.status)).length;
        const cancelled = allOrders.filter((o: Order) => o.status === 'CANCELLED').length;
        const totalSpent = allOrders
            .filter((o: Order) => o.status === 'COMPLETED')
            .reduce((sum: number, o: Order) => sum + Number(o.totalPrice), 0);

        return { total, completed, active, cancelled, totalSpent };
    }, [allOrders]);

    return {
        orders: paginatedOrders,
        allOrders: filteredOrders,
        loading,
        error,
        refetch,
        // Pagination
        currentPage,
        totalPages,
        pageSize,
        hasNextPage,
        hasPreviousPage,
        goToNextPage,
        goToPreviousPage,
        goToPage,
        resetPagination,
        // Filtering
        filter,
        setFilter: (newFilter: OrderStatus | 'all') => {
            setFilter(newFilter);
            resetPagination();
        },
        searchQuery,
        setSearchQuery: (query: string) => {
            setSearchQuery(query);
            resetPagination();
        },
        // Stats
        stats,
    };
};
