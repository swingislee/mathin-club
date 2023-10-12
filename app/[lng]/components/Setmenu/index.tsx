'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CogIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ThemeSwitcher from './Day-to-night/ThemeSwitcher';
import { Setlng } from './Setlanguage/client';

export default function Setmenu({ lng } ) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  

  return (
    <div className="fixed top-0 h-screen w-full flex justify-end items-start p-4 overflow-hidden pointer-events-none">
      <button
        className="fixed top-2 focus:outline-none z-50 pointer-events-auto"
        onClick={toggleDrawer}
      >
        {isOpen ? (
          <XMarkIcon className="h-8 w-8" />
        ) : (
          <CogIcon className="h-8 w-8" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: '0' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute top-0 right-0 h-full bg-white dark:bg-slate-600 shadow-lg p-4 pointer-events-auto"
          >
            <button
              className="mt-4 focus:outline-none"
              onClick={toggleDrawer}
            >
                <ThemeSwitcher/>
                
            </button>
            <Setlng lng={lng}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
