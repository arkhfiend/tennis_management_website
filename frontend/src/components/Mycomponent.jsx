import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

function MyComponent() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start('animate');
  }, []);

  const variants = {
    initial: { fontSize: 20 },
    animate: { fontSize: 48 },
  };

  return (
    <div>
<motion.h1
      variants={variants}
      initial="initial"
      animate={controls}
      transition={{ duration: 1 }}
    >
      This text will animate on load
    </motion.h1>
    <h1>Hi there
    </h1>
    </div>
    
  );
}

export default MyComponent;
