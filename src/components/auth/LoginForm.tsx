
import React from 'react';
import { BetaWaitlistForm } from './BetaWaitlistForm';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export function LoginForm() {
  const isMobile = useIsMobile();

  return (
    <motion.div 
      className={`w-full max-w-md mx-auto ${isMobile ? 'px-4 pb-8' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <BetaWaitlistForm />
    </motion.div>
  );
}
