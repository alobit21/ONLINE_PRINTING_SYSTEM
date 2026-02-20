import { gql } from '@apollo/client';

export const GET_MY_ORDERS = gql`
    query GetMyOrders {
        myOrders {
            id
            status
            totalPrice
            createdAt
            estimatedCompletionTime
            completedAt
            shop {
                id
                name
                address
                banner
            }
            items {
                id
                pageCount
                price
                configSnapshot
                document {
                    id
                    fileName
                }
            }
        }
    }
`;
export const CREATE_ORDER = gql`
    mutation CreateOrder($shopId: UUID!, $items: [OrderItemInput!]!) {
        createOrder(shopId: $shopId, items: $items) {
            response {
                status
                message
            }
            order {
                id
                status
            }
        }
    }
`;

export const GET_SHOP_ORDERS = gql`
    query GetShopOrders($shopId: UUID!) {
        shopOrders(shopId: $shopId) {
            id
            status
            totalPrice
            createdAt
            estimatedCompletionTime
            completedAt
            shop {
                id
                name
            }
            customer {
                id
                email
                firstName
                lastName
            }
            items {
                id
                pageCount
                price
                configSnapshot
                document {
                    id
                    fileName
                    fileType
                }
            }
        }
    }
`;

export const UPDATE_ORDER_STATUS = gql`
    mutation UpdateOrderStatus($orderId: UUID!, $status: String!) {
        updateOrderStatus(orderId: $orderId, status: $status) {
            response {
                status
                message
            }
            order {
                id
                status
                completedAt
            }
        }
    }
`;
export const GET_ALL_MY_SHOP_ORDERS = gql`
    query GetAllMyShopOrders {
        allMyShopOrders {
            id
            status
            totalPrice
            commissionFee
            createdAt
            estimatedCompletionTime
            completedAt
            shop {
                id
                name
                address
            }
            customer {
                id
                email
                firstName
                lastName
            }
            items {
                id
                pageCount
                price
                configSnapshot
                document {
                    id
                    fileName
                    fileType
                }
            }
        }
    }
`;
