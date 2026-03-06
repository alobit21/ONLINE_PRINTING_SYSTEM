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

export const GET_ALL_USERS = gql`
  query GetAllUsers($filterInput: UserFilterInput) {
    users(filterInput: $filterInput) {
      response {
        status
        message
      }
      data {
        id
        email
        role
        isActive
      }
    }
  }
`;

export const GET_ALL_USERS_SIMPLE = gql`
  query GetAllUsersSimple {
    usersSimple {
      id
      email
      role
      isActive
    }
  }
`;

export const GET_ALL_USERS_SIMPLE_RESPONSE = gql`
  query GetAllUsersSimpleResponse($pageNumber: Int, $itemsPerPage: Int) {
    usersSimpleResponse(pageNumber: $pageNumber, itemsPerPage: $itemsPerPage) {
      response {
        status
        message
      }
      page {
        number
        hasNextPage
        hasPreviousPage
        currentPageNumber
        nextPageNumber
        previousPageNumber
        numberOfPages
        totalElements
        pagesNumberArray
      }
      data {
        id
        email
        role
        isActive
      }
    }
  }
`;

export const GET_ALL_SHOPS = gql`
  query GetAllShops {
    shops {
      response {
        status
        message
      }
      data {
        id
        name
        address
        owner {
          firstName
          lastName
          email
        }
        isVerified
        isAcceptingOrders
        rating
        subscriptionTier
        createdAt
      }
    }
  }
`;

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    orders {
      response {
        status
        message
      }
      data {
        id
        status
        totalPrice
        createdAt
        customer {
          firstName
          lastName
          email
        }
        shop {
          name
          owner {
            firstName
            lastName
            email
          }
        }
        estimatedCompletionTime
        completedAt
      }
    }
  }
`;

export const GET_ALL_DOCUMENTS = gql`
  query GetAllDocuments {
    documents {
      response {
        status
        message
      }
      data {
        id
        fileName
        fileType
        fileSize
        isScanned
        virusDetected
        createdAt
        updatedAt
        uploadUrl
        downloadUrl
        owner {
          firstName
          lastName
          email
        }
      }
    }
  }
`;

export const GET_PRICING_RULES = gql`
  query GetPricingRules {
    pricingRules {
      response {
        status
        message
      }
      data {
        id
        serviceType
        basePrice
        description
        isActive
        createdAt
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      role
      isVerified
      isActive
    }
  }
`;
