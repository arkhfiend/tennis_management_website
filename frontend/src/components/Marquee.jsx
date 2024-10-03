import React from 'react';
import './Marquee.css'; // Make sure to create this CSS file

const Marquee = () => {
  return (
    <div className="clients-marquee-wrapper">
      <div className="clients-marquee">
        <h2 className="marquee-heading">EXCELLENCE</h2>
        <h2 className="marquee-heading">PASSION</h2>
        <h2 className="marquee-heading">COMMITMENT</h2>
      </div>
    </div>
  );
};

export default Marquee;
