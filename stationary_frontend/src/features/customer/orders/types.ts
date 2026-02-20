export type OrderStatus = 'UPLOADED' | 'ACCEPTED' | 'PRINTING' | 'READY' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
    id: string;
    document: {
        id: string;
        fileName: string;
        fileType: string;
        fileSize?: number;
        uploadUrl?: string;
        downloadUrl?: string;
        createdAt?: string;
    };
    pageCount: number;
    price: number;
    configSnapshot: {
        is_color: boolean;
        paper_size: string;
        binding: boolean;
        lamination: boolean;
    };
}

export interface Order {
    id: string;
    status: OrderStatus;
    totalPrice: number;
    commissionFee?: number;
    createdAt: string;
    estimatedCompletionTime?: string;
    completedAt?: string;
    shop: {
        id: string;
        name: string;
        address: string;
        banner?: string;
    };
    customer?: {
        id: string;
        email: string;
        firstName?: string;
        lastName?: string;
    };
    items: OrderItem[];
}

export interface GetMyOrdersData {
    myOrders: Order[];
}

export interface OrderItemInput {
    documentId: string;
    pageCount: number;
    isColor: boolean;
    isBinding: boolean;
    isLamination: boolean;
    paperSize: string;
}

export interface CreateOrderData {
    createOrder: {
        response: {
            status: boolean;
            message: string;
        };
        order?: {
            id: string;
            status: OrderStatus;
        };
    };
}
export interface GetShopOrdersData {
    shopOrders: Order[];
}

export interface GetAllMyShopOrdersData {
    allMyShopOrders: Order[];
}
