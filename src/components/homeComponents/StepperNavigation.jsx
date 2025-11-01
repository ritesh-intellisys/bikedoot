import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { useTheme } from '../context/ThemeContext';

const StepperNavigation = ({ steps, activeStep, onStepClick }) => {
  const { theme } = useTheme();
  return (
    <div className="w-full relative">
      <div className="flex items-start relative">
        {/* Connector Lines - positioned absolutely between circles */}
        {steps.map((step, index) => {
          if (index < steps.length - 1) {
            const isCompleted = index < activeStep;
            return (
              <div
                key={`connector-${index}`}
                className={`absolute h-0.5 top-5 ${
                  isCompleted 
                    ? 'bg-green-600' 
                    : theme === 'light'
                    ? 'bg-gray-300'
                    : 'bg-gray-700'
                }`}
                style={{
                  left: `${(index + 0.5) * (100 / steps.length)}%`,
                  width: `${100 / steps.length}%`,
                  transform: 'translateX(0)'
                }}
              />
            );
          }
          return null;
        })}
        
        {steps.map((step, index) => {
          const isCompleted = index < activeStep;
          const isActive = index === activeStep;
          const isClickable = index <= activeStep;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center relative z-10">
              {/* Step Circle - perfectly centered */}
              <button
                onClick={() => isClickable && onStepClick(index)}
                disabled={!isClickable}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : isActive
                    ? 'bg-red-600 text-white ring-4 ring-red-600 ring-opacity-30'
                    : theme === 'light'
                    ? 'bg-gray-200 text-gray-600'
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
              
              {/* Step Label - perfectly centered below circle */}
              <div className="mt-3">
                <p
                  className={`text-sm font-medium text-center whitespace-nowrap ${
                    isActive
                      ? theme === 'light' ? 'text-gray-900' : 'text-white'
                      : isCompleted
                      ? 'text-green-600'
                      : theme === 'light'
                      ? 'text-gray-500'
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

