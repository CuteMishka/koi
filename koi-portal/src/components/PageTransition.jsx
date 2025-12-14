import React from 'react';
import { motion } from 'framer-motion';

const animations = {
  initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -20, filter: 'blur(10px)' },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} // Плавная кривая Безье
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;