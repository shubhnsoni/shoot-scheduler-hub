
import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden relative">
      {/* Full page background cover image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1973&q=80" 
          alt="Real estate interior" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/70"></div>
      </div>
      
      <div className="flex flex-col md:flex-row w-full z-10">
        {/* Left side with just the logo - hidden on mobile */}
        {!isMobile && (
          <motion.div 
            className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-16 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-md w-full flex flex-col items-center">
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <img 
                  src="/lovable-uploads/b2e1d77f-fa76-4e07-87f5-a4820c7a1396.png" 
                  alt="RePro Photos Logo" 
                  className="w-auto h-auto max-h-48 max-w-full object-contain"
                />
                <p className="text-center text-lg md:text-xl mt-4 text-white font-medium italic drop-shadow-md">
                  Elevating your Status Quo!
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
        
        {/* Mobile-only logo */}
        {isMobile && (
          <motion.div 
            className="pt-8 pb-6 px-6 flex flex-col items-center relative"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src="/lovable-uploads/b2e1d77f-fa76-4e07-87f5-a4820c7a1396.png" 
              alt="RePro Photos Logo" 
              className="w-auto h-auto max-h-32 max-w-full object-contain relative z-10"
            />
            <p className="text-center text-base mt-3 text-white font-medium italic drop-shadow-md relative z-10">
              Elevating your Status Quo!
            </p>
          </motion.div>
        )}
        
        {/* Right side with login form - make scrollable */}
        <motion.div 
          className={`w-full ${!isMobile ? 'md:w-1/2' : ''} flex items-center justify-center ${isMobile ? 'py-2 pb-8' : 'p-8'} bg-background/70 backdrop-blur-sm overflow-y-auto mobile-scrollable`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
