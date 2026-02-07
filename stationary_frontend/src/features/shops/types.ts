export interface Shop {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    banner?: string;
    rating?: number;
    distance?: number;
    subscriptionTier: string;
    isAcceptingOrders: boolean;
}

export interface Response {
    status: boolean;
    message: string;
}

export interface PageInfo {
    hasNextPage: boolean;
    totalElements: number;
}

export interface GetShopsData {
    shops: {
        response: Response;
        data: Shop[];
        page: PageInfo;
    };
}

export interface ShopFilterInput {
    radiusKm?: number;
    latitude?: number;
    longitude?: number;
    searchTerm?: string;
}
