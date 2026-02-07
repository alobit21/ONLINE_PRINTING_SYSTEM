import { gql } from '@apollo/client';

export const GET_SHOPS = gql`
  query GetShops($filterInput: ShopFilterInput) {
    shops(filterInput: $filterInput) {
      response {
        status
        message
      }
      data {
        id
        name
        address
        latitude
        longitude
        banner
        rating
        distance
        subscriptionTier
        isAcceptingOrders
      }
      page {
        hasNextPage
        totalElements
      }
    }
  }
`;
