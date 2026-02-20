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
export const GET_SHOP_DETAILS = gql`
    query GetShopDetails($id: UUID!) {
        shopDetails(id: $id) {
            response {
                status
                message
            }
            data {
                id
                name
                address
                banner
            }
        }
    }
`;

export const GET_SHOP_DETAILS_WITH_PRICING = gql`
    query GetShopDetailsWithPricing($id: UUID!) {
        shopDetails(id: $id) {
            response {
                status
                message
            }
            data {
                id
                name
                address
                banner
                pricingRules {
                    id
                    serviceType
                    basePrice
                    modifiers
                }
            }
        }
    }
`;

export const UPDATE_PRICING = gql`
    mutation UpdatePricing($shopId: UUID!, $serviceType: String!, $basePrice: Float!, $modifiers: JSONString) {
        updatePricing(shopId: $shopId, serviceType: $serviceType, basePrice: $basePrice, modifiers: $modifiers) {
            response {
                status
                message
            }
            pricing {
                id
                serviceType
                basePrice
                modifiers
            }
        }
    }
`;
export const GET_MY_SHOPS = gql`
    query GetMyShops {
        myShops {
            response {
                status
                message
            }
            data {
                id
                name
                address
                isAcceptingOrders
            }
        }
    }
`;
export const CREATE_SHOP = gql`
    mutation CreateShop($name: String!, $address: String!, $latitude: Float!, $longitude: Float!, $description: String) {
        createShop(name: $name, address: $address, latitude: $latitude, longitude: $longitude, description: $description) {
            response {
                status
                message
            }
            shop {
                id
                name
            }
        }
    }
`;
