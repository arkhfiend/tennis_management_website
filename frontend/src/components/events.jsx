import React from 'react'
import './events.css'
import img12 from '../assets/images/img12.webp'
import img13 from '../assets/images/img13.webp'
import img17 from '../assets/images/img17.webp'
import img15 from '../assets/images/img15.webp'
function Events() {
  return (
    <div className='outer'>
        <div className="event-card card lg:card-side bg-base-100 shadow-xl">
  <figure>
    <img
      src={img12}
      alt="Album" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">Upcoming Tennis Workshop</h2>
    <p>Join us for a comprehensive workshop covering advanced techniques and strategies. Date: September 15, 2024.</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Know more</button>
    </div>
  </div>
</div>

<div className="event-card card lg:card-side bg-base-100 shadow-xl">
  
  <div className="card-body">
    <h2 className="card-title">New Training Facility Opening</h2>
    <p>We're excited to announce the opening of our new training facility with enhanced amenities. Date: October 1, 2024.</p>
    <div className="card-actions justify-end">
      <button className="alternate btn btn-primary">Know More</button>
    </div>
  </div>
  <figure>
    <img
      src={img17}
      alt="Album" />
  </figure>
</div>
<div className="event-card card lg:card-side bg-base-100 shadow-xl">
  <figure>
    <img
      src={img15}
      alt="Album" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">Summer Tennis Tournament</h2>
    <p>Register for our annual Summer Tennis Tournament. Categories for all ages and skill levels. Date: August 20-25, 2024.</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Know More</button>
    </div>
  </div>
</div>

<div className="event-card card lg:card-side bg-base-100 shadow-xl">
  
  <div className="card-body">
    <h2 className="card-title">Championship Cup</h2>
    <p>Participate in our Championship Cup to compete for top honors. Date: November 10-15, 2024.</p>
    <div className="card-actions justify-end">
      <button className="alternate lower btn btn-primary">Know More</button>
    </div>
  </div>
  <figure>
    <img
      src={img13}
      alt="Album" />
  </figure>
</div>
    </div>
  )
}

export default Events