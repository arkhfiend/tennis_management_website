import React from 'react'
import './middle.css'
import video from '../assets/images/potrait1.mp4';
function Middle() {
  return (
    <div className='middle-container'>
    <div className="blocka">
<h2>
Our primary goal is to develop players from the grassroots level into top-ranking contenders in State, AITA, and ITF tournaments. We believe in honing skills, instilling discipline, and fostering a passion for the sport. 
</h2>
    </div>
    <div className="blockb">
    <video autoPlay muted loop width="300" height="200">
      <source src={video} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    </div>
    </div>
  )
}

export default Middle