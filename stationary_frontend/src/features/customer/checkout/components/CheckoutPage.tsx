import { OrderProgress } from '../../orders/components/OrderProgress';
import { CheckoutAction } from './CheckoutAction';
import { GuestCheckoutForm } from './GuestCheckoutForm';
import { useAuthStore } from '../../../../stores/authStore';

export const CheckoutPage = () => {
  const { user } = useAuthStore();
  
  return (
    <div className="max-w-5xl mx-auto p-4">
      <OrderProgress currentStep={4} />
      {user ? <CheckoutAction /> : <GuestCheckoutForm />}
    </div>
  );
};
