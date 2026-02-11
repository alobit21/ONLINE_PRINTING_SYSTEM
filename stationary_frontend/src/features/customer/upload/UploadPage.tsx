import React from 'react';
import { UploadFlowManager } from './UploadFlowManager';
import { OrderProgress } from '../orders/components/OrderProgress';

export const UploadPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <OrderProgress currentStep={1} />
      <UploadFlowManager />
    </div>
  );
};
