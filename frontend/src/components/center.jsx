import React from 'react'
import './center.css'
import lake_homes from '../assets/images/Lake_homes.webp';
import lodha from '../assets/images/Lodha.webp';
import signia from '../assets/images/signia waterfront.webp';
import vicinia from '../assets/images/vicinia.webp';

function Center() {
  return <div >
    <h2 className='heading'>Our Coaching Center's</h2>
    <div className='centers'>

    <div className="places">
        <figure>
            <img src={lake_homes} alt="Lake Homes, Powai" />
            <h2 className='caption'>Lake Homes </h2>
            <h2>(Powai)</h2>
        </figure> 
        </div>
        <div className="places">
        <figure>
            <img src={lodha} alt="Lodha Society (kanjurmarg)" />
            <h2>Lodha Society </h2>
            <h2>(kanjurmarg)</h2>
        </figure>
         </div>
        <div className="places">
        <figure>
            <img src={signia} alt="Waterfront (Airoli)" />
            <h2>Waterfront </h2>
            <h2>(Airoli)</h2>
        </figure>
        </div>
        <div className="places">
        <figure>
            <img src={vicinia} alt="Vicinia Shapoorji (Chandivali)" />
            <h2>Vicinia Shapoorji </h2>
            <h2>(Chandivali)</h2>
        </figure>
        </div>
        

        </div>
    </div>
  
}

export default Center