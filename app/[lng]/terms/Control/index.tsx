'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link'
import { useTranslation } from '@/app/i18n/client';
import AddPoint from '../../terms/Control/Addpoint';

export default function Control({ lng } ) {
  const [isOpen, setIsOpen] = useState(false);


  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  

  return (
    <div className="fixed top-0 h-screen w-full flex justify-end items-start p-4 overflow-hidden pointer-events-none">
      <button
        className="fixed top-2 right-14 focus:outline-none z-50 pointer-events-auto"
        onClick={toggleDrawer}
      >
        {isOpen ? (
          <XMarkIcon className="h-8 w-8" />
        ) : (
          <FolderIcon className="h-8 w-8" />
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
            <AddPoint lng/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
