import React from 'react';
import { OrderProgress } from '../../orders/components/OrderProgress';
import { CheckoutAction } from './CheckoutAction';

export const CheckoutPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <OrderProgress currentStep={4} />
      <CheckoutAction />
    </div>
  );
};
