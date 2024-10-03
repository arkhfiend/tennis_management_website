import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import png_bg from '../assets/images/png_bg.jpg';
import bg2 from '../assets/images/bg2.jpg';
import bg3 from '../assets/images/bg3.webp';

function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const backgroundImages = [png_bg, bg2, bg3]; // Add your images here
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Cycle through the images
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [backgroundImages.length]);

  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div
      className="hero min-h-screen relative"
      style={{
        backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="hero-overlay bg-opacity-60 absolute inset-0"></div>
      <div className="hero-content text-neutral-content text-center relative z-9">
        <div className="max-w-md">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 1, delay: 0.5 }}
            className="mb-5 text-5xl font-bold"
          >
            Welcome to our coaching
          </motion.h1>
          <motion.p
            className="mb-5"
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Your journey to becoming a tennis champion starts here!
          </motion.p>
          <button className="btn btn-primary border-radius-5px solid">Get Started</button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
