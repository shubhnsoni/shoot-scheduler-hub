
import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface BookingStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const BookingStepIndicator: React.FC<BookingStepIndicatorProps> = ({ 
  currentStep, 
  totalSteps 
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <motion.div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${step < currentStep 
                  ? 'bg-green-500 text-white' 
                  : step === currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }
              `}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {step < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step
              )}
            </motion.div>
            
            <span className={`text-xs mt-2 ${
              step <= currentStep ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              Step {step}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div className={`flex-1 h-0.5 mx-4 ${
              step < currentStep ? 'bg-green-500' : 'bg-muted'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
