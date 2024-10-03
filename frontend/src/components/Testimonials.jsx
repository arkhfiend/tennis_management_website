import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion'; // For scroll animation
import './testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote: "The coaching at Tennis Academy is exceptional! I’ve improved my game significantly.",
      author: "John Doe",
      title: "AICTE Co-ordinator",
    },
    {
      quote: "Great facilities and a supportive coaching team. Highly recommend!",
      author: "Jane Smith",
      title: "Tennis Coach",
    },
    // Add more testimonials as needed
  ];

  const [showMore, setShowMore] = useState(false);
  const testimonialsContainerRef = useRef(null);

  useEffect(() => {
    if (showMore) {
      testimonialsContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showMore]);

  return (
    <div className="testimonials-container ml-90 p-8 rounded-xl shadow-lg relative">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">What People Say</h2>
      <motion.div
        className="testimonials-content grid gap-6 md:grid-cols-2"
        ref={testimonialsContainerRef}
        initial={{ opacity: 0, y: 50 }} // Start position for scroll animation
        whileInView={{ opacity: 1, y: 0 }} // End position when in view
        transition={{ duration: 0.8, delay: 0.2 }} // Animation speed
      >
        {testimonials.slice(0, showMore ? testimonials.length : 2).map((testimonial, index) => (
          <motion.div
            key={index}
            className="testimonial-card p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            whileHover={{ scale: 1.05 }} // Hover effect
          >
            <p className="text-xl font-semibold text-gray-700 mb-4">{testimonial.quote}</p>
            <div className="testimonial-author text-gray-600">
              <p className="font-medium">{testimonial.author}</p>
              <p className="text-gray-400 text-sm">{testimonial.title}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {testimonials.length > 2 && (
        <div className="text-center mt-8">
          <button
            className="show-more-btn bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-colors duration-300"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? 'Show Less' : 'Show More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
