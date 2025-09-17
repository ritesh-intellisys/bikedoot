import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';

const StepperNavigation = ({ steps, activeStep, onStepClick }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isClickable = index <= activeStep;
          
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div className="flex items-center">
                <button
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isActive
                      ? 'bg-red-600 text-white ring-4 ring-red-600 ring-opacity-30'
                      : 'bg-gray-700 text-gray-400'
                  } ${
                    isClickable ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed'
                  }`}
                >
                  {isCompleted ? (
                    <CheckIcon className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </button>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
              
              {/* Step Label */}
              <div className="mt-3 text-center">
                <p
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                      ? 'text-green-400'
                      : 'text-gray-500'
                  }`}
                >
                  {step}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepperNavigation;

