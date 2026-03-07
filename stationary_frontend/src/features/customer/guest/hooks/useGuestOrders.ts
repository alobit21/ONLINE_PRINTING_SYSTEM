import { useQuery } from '@apollo/client/react';
import { GET_GUEST_ORDERS } from '../api/guestOrdersApi';
import type { GuestContactInput, GetGuestOrdersData } from '../api/guestOrdersApi';

interface UseGuestOrdersOptions {
  contactInfo: GuestContactInput;
  skip?: boolean;
}

export const useGuestOrders = ({ contactInfo, skip = false }: UseGuestOrdersOptions) => {
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery<GetGuestOrdersData>(GET_GUEST_ORDERS, {
    variables: {
      contactInfo: {
        email: contactInfo.email,
        whatsappNumber: contactInfo.whatsappNumber
      }
    },
    skip: skip || !contactInfo.email && !contactInfo.whatsappNumber,
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all'
  });

  const orders = data?.guestOrders || [];

  return {
    orders,
    loading,
    error,
    refetch,
    hasData: orders.length > 0
  };
};
