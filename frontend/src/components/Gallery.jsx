import React from 'react';
import { motion } from 'framer-motion';
import './gallery.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; 
import image4 from '../assets/images/img4.webp';
import image5 from '../assets/images/img5.webp';
import image6 from '../assets/images/img6.webp';
import image7 from '../assets/images/img7.webp';
import image8 from '../assets/images/img8.webp';
import image9 from '../assets/images/img9.webp';
import image10 from '../assets/images/img10.webp';
import image12 from '../assets/images/img12.webp';
import image13 from '../assets/images/img13.webp';
import image14 from '../assets/images/img14.webp';
import image15 from '../assets/images/img15.webp';
import image17 from '../assets/images/img17.webp';
import image18 from '../assets/images/img18.webp';
import image19 from '../assets/images/img19.webp';
import image20 from '../assets/images/img20.webp';
import image21 from '../assets/images/trophy_img1.webp';
import image22 from '../assets/images/trophy2.webp';
import image23 from '../assets/images/women_trophy1.webp';
import image24 from '../assets/images/vicinia.webp';
import image25 from '../assets/images/signia waterfront.webp';
import image26 from '../assets/images/Lodha.webp';
import image27 from '../assets/images/Lake_homes.webp';


const images = [
    image4,
    image5,
    image6,
    image7,
    image8,
    image9,
    image10,
    image12,
    image13,
    image14,
    image15,
    image17,
    image18,
    image19,
    image20,
    image21,
    image22,
    image23,
    image24,
    image25,
    image26,
    image27

];

const Gallery = () => {
  return (
    <div className="gallery-container p-8">
      <h2 className="text-4xl font-bold mb-8 text-center">Gallery</h2>
      <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((src, index) => (
          <motion.div
            key={index}
            className="gallery-item overflow-hidden rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <img src={src} alt={`Gallery Image ${index + 1}`} className="w-full h-full object-cover" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;