import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './courses.css';
import beginner from '../assets/images/beginner.jpeg';
import intermediate from '../assets/images/intermediate.jpeg';
import advance from '../assets/images/advance.jpg';
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.1 }, // Subtle hover animation
  click: { scale: 0.95, duration: 0.1 }, // Click animation
};

function Courses() {
  const [selectedId, setSelectedId] = useState(null);
  const ref = useRef(null);

  const courses = [
    {
      id: 1,
      title: 'Beginner\'s Course',
      subtitle: 'Designed for newcomers to tennis',
      image: beginner,
      description: 'Learn the basics and develop foundational skills.',
    },
    {
      id: 2,
      title: 'Intermediate Course',
      subtitle: 'For players with basic skills',
      image: intermediate,
      description: 'Improve technique and strategy.',
    },
    {
      id: 3,
      title: 'Advanced Course',
      subtitle: 'For experienced players',
      image: advance,
      description: 'Refine skills and compete at higher levels.',
    },
  ];

  const handleCardClick = (id) => {
    setSelectedId(id);
    ref.current.animate('click'); // Animate the clicked card
  };

  return (
    <div className="card-container">
      {courses.map((course) => (
        <motion.div
          key={course.id}
          ref={ref}
          layoutId={course.id}
          className={`cards card bg-base-100 image-full w-96 shadow-xl ${
            selectedId === course.id ? 'selected' : ''
          }`}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ when: 'beforeChange', duration: 0.3 }} // Animate state change
          onClick={() => handleCardClick(course.id)}
          whileHover="hover" // Apply hover animation
        >
          <figure>
            <motion.img
              src={course.image}
              alt={course.title}
            />
          </figure>
          <div className="card-body">
            <motion.h2 className="card-title">{course.title}</motion.h2>
            <motion.p>{course.description}</motion.p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Know More</button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default Courses;