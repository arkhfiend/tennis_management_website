// Loader.jsx
import React, { useEffect } from 'react';
import './Loader.css';

const Loader = () => {
    useEffect(() => {
        const loader = document.querySelector("#loader");
        setTimeout(() => {
            loader.style.top = "-100%";
        }, 4200);
    }, []);

    return (
        <div id="loader">
            <h1>ENVIRONMENTS</h1>
            <h1>EXPERIENCES</h1>
            <h1>CONTENT</h1>
        </div>
    );
};

export default Loader;