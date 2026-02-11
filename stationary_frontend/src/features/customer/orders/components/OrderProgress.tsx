import React from 'react';

interface Step {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface OrderProgressProps {
  currentStep: number; // 1-based index
}

const steps: string[] = [
  'Upload Document',
  'Document Analysis',
  'Shop Selection',
  'Checkout',
  'Order Tracking',
];

export const OrderProgress: React.FC<OrderProgressProps> = ({ currentStep }) => {
  return (
    <div className="flex justify-between items-center w-full max-w-4xl mx-auto px-4 py-6">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <div key={label} className="flex flex-col items-center text-center flex-1">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-300 
                ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-brand-600 text-white' : 'bg-gray-300 text-gray-600'}`}
            >
              {isCompleted ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={3}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            <div
              className={`text-xs font-semibold transition-colors duration-300 
                ${isCompleted ? 'text-green-600' : isActive ? 'text-brand-600' : 'text-gray-500'}`}
            >
              {label}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`h-1 flex-1 mt-4 rounded-full transition-colors duration-300 
                  ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// TailwindCSS classes used for colors:
// bg-green-500, text-green-600 for completed
// bg-brand-600, text-brand-600 for active
// bg-gray-300, text-gray-600, text-gray-500 for inactive

// This component is responsive by default due to flex and max-w constraints

// Usage example:
// <OrderProgress currentStep={3} />

