import { gql } from '@apollo/client';

export const GET_GUEST_ORDERS = gql`
  query GetGuestOrders($contactInfo: GuestContactInput!) {
    guestOrders(contactInfo: $contactInfo) {
      id
      status
      totalPrice
      createdAt
      completedAt
      estimatedCompletionTime
      shop {
        id
        name
        address
        rating
        isVerified
      }
      items {
        id
        document {
          id
          fileName
        }
        pageCount
        price
        configSnapshot
      }
      customerInfo
      isGuestOrder
    }
  }
`;

export interface GuestContactInput {
  email?: string;
  whatsappNumber?: string;
}

export interface GuestOrder {
  id: string;
  status: 'UPLOADED' | 'ACCEPTED' | 'PRINTING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
  completedAt?: string;
  estimatedCompletionTime?: string;
  shop: {
    id: string;
    name: string;
    address: string;
    rating: number;
    isVerified: boolean;
  };
  items: Array<{
    id: string;
    document: {
      id: string;
      fileName: string;
    };
    pageCount: number;
    price: number;
    configSnapshot: {
      is_color: boolean;
      paper_size: string;
      binding?: boolean;
      lamination?: boolean;
    };
  }>;
  customerInfo: {
    type: 'guest' | 'registered';
    name: string;
    email?: string;
    phone: string;
    id: string;
  };
  isGuestOrder: boolean;
}

export interface GetGuestOrdersData {
  guestOrders: GuestOrder[];
}
