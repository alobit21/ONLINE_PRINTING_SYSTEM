import { gql } from '@apollo/client';

export const GET_ADMIN_STATS = gql`
  query GetAdminStats {
    adminStats {
      response {
        status
        message
      }
      data {
        totalUsers
        totalShops
        totalOrders
        totalRevenue
        pendingShopsCount
      }
    }
  }
`;

export const GET_PENDING_SHOPS = gql`
  query GetPendingShops {
    pendingShops {
      response {
        status
        message
      }
      data {
        id
        name
        address
        isVerified
      }
    }
  }
`;
