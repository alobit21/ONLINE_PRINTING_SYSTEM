import { useState, useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_ORDER, GET_MY_ORDERS } from '../api';
import type { Order, OrderItemInput } from '../types';

interface UseReorderOptions {
    onSuccess?: (orderId: string) => void;
    onError?: (error: Error) => void;
}

export const useReorder = ({ onSuccess, onError }: UseReorderOptions = {}) => {
    const [isReordering, setIsReordering] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const [createOrderMutation] = useMutation(CREATE_ORDER, {
        refetchQueries: [{ query: GET_MY_ORDERS }],
        awaitRefetchQueries: true,
    });

    const reorder = useCallback(async (order: Order, customItems?: OrderItemInput[]) => {
        setIsReordering(true);
        setError(null);

        try {
            // Use custom items if provided, otherwise use original order items
            const items = customItems || order.items.map(item => ({
                documentId: item.document.id,
                pageCount: item.pageCount,
                isColor: item.configSnapshot.is_color,
                isBinding: item.configSnapshot.binding,
                isLamination: item.configSnapshot.lamination,
                paperSize: item.configSnapshot.paper_size,
            }));

            const { data } = await createOrderMutation({
                variables: {
                    shopId: order.shop.id,
                    items,
                },
            });

            if (data?.createOrder?.response?.status) {
                const newOrderId = data.createOrder.order?.id;
                onSuccess?.(newOrderId);
                return { success: true, orderId: newOrderId };
            } else {
                throw new Error(data?.createOrder?.response?.message || 'Failed to create order');
            }
        } catch (err: any) {
            const error = new Error(err.message || 'Failed to reorder');
            setError(error);
            onError?.(error);
            return { success: false, error };
        } finally {
            setIsReordering(false);
        }
    }, [createOrderMutation, onSuccess, onError]);

    const quickReorder = useCallback(async (order: Order) => {
        return await reorder(order);
    }, [reorder]);

    const reorderWithChanges = useCallback(async (order: Order, items: OrderItemInput[]) => {
        return await reorder(order, items);
    }, [reorder]);

    return {
        reorder,
        quickReorder,
        reorderWithChanges,
        isReordering,
        error,
    };
};
