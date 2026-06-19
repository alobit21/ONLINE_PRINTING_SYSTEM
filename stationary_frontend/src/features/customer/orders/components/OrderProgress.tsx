import React from 'react';

interface OrderProgressProps {
  currentStep: number;
}

const steps = [
  'Upload',
  'Analyze',
  'Shop',
  'Checkout',
  'Track',
];

export const OrderProgress: React.FC<OrderProgressProps> = ({ currentStep }) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      
      {/* Track line */}
      <div className="relative flex justify-between items-center">

        {/* background line */}
        <div className="absolute top-4 left-0 right-0 h-1 bg-fog rounded-full" />

        {/* active progress line */}
        <div
          className="absolute top-4 left-0 h-1 bg-hp-primary rounded-full transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />

        {steps.map((label, index) => {
          const stepNumber = index + 1;

          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={label} className="flex flex-col items-center flex-1 relative z-10">

              {/* circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-bold transition-all duration-300
                  ${
                    isCompleted
                      ? 'bg-hp-primary text-canvas'
                      : isActive
                      ? 'bg-canvas border-2 border-hp-primary text-hp-primary scale-110 shadow-[0_2px_8px_rgba(26,26,26,0.08)]'
                      : 'bg-fog text-steel'
                  }
                `}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>

              {/* label */}
              <div
                className={`
                  mt-2 text-xs font-semibold text-center
                  ${
                    isCompleted || isActive
                      ? 'text-ink'
                      : 'text-steel'
                  }
                `}
              >
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};