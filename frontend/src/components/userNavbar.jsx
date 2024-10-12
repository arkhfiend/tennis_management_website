import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import './user_navbar.css';
import { AuthContext } from './authContext';

function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'winter');
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleThemeChange = (e) => {
    const selectedTheme = e.target.value;
    setTheme(selectedTheme);
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    setHistory((prevHistory) => [...prevHistory, location.pathname]);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }, [location.pathname]);

  const handleLogoutRedirect = () => {
    navigate('/');
    setAuthenticated(true);
  };

  const handleBackNavigation = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      navigate(history[newIndex]);
    }
  };

  const handleForwardNavigation = () => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      navigate(history[newIndex]);
    }
  };

  return (
    <div className="user_navbar bg-gradient-to-r from-yellow-400 to-orange-500 px-4 h-60px flex items-center justify-between">
      <div className="flex items-center gap-2" style={{ position: 'absolute', left: '90px', top: '5px' }}>
        <button
          className="bg-gray-700 hover:bg-black text-white font-bold py-3 px-5 rounded-full glass flex items-center justify-center"
          onClick={handleBackNavigation}
          disabled={currentIndex <= 0}
        >
          <FaArrowLeft className="h-5 w-5" />
        </button>
        <button
          className="bg-gray-700 hover:bg-black text-white font-bold py-3 px-5 rounded-full glass flex items-center justify-center"
          onClick={handleForwardNavigation}
          disabled={currentIndex >= history.length - 1}
        >
          <FaArrowRight className="h-5 w-5" />
        </button>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <button
          className="bg-gray-700 hover:bg-black text-white font-bold py-2 px-4 rounded glass"
          onClick={handleLogoutRedirect}
        >
          Logout
        </button>
        <div className="dropdown relative">
          <div tabIndex={0} role="button" className="btn m-1">
            Theme
            <svg
              width="12px"
              height="12px"
              className="inline-block h-2 w-2 fill-current opacity-60"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 2048 2048"
            >
              <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content absolute bg-base-300 rounded-box z-[1] w-52 p-2 shadow-2xl top-full mt-2"
          >
            <li>
              <label className="theme-controller btn btn-sm btn-block btn-ghost justify-start">
                <input
                  type="radio"
                  name="theme-dropdown"
                  aria-label="Winter"
                  value="winter"
                  checked={theme === 'winter'}
                  onChange={handleThemeChange}
                  className="hidden-radio"
                />
                Winter
              </label>
            </li>
            <li>
              <label className="theme-controller btn btn-sm btn-block btn-ghost justify-start">
                <input
                  type="radio"
                  name="theme-dropdown"
                  aria-label="Retro"
                  value="retro"
                  checked={theme === 'retro'}
                  onChange={handleThemeChange}
                  className="hidden-radio"
                />
                Retro
              </label>
            </li>
            <li>
              <label className="theme-controller btn btn-sm btn-block btn-ghost justify-start">
                <input
                  type="radio"
                  name="theme-dropdown"
                  aria-label="Cyberpunk"
                  value="cyberpunk"
                  checked={theme === 'cyberpunk'}
                  onChange={handleThemeChange}
                  className="hidden-radio"
                />
                Cyberpunk
              </label>
            </li>
            <li>
              <label className="theme-controller btn btn-sm btn-block btn-ghost justify-start">
                <input
                  type="radio"
                  name="theme-dropdown"
                  aria-label="Valentine"
                  value="valentine"
                  checked={theme === 'valentine'}
                  onChange={handleThemeChange}
                  className="hidden-radio"
                />
                Valentine
              </label>
            </li>
            <li>
              <label className="theme-controller btn btn-sm btn-block btn-ghost justify-start">
                <input
                  type="radio"
                  name="theme-dropdown"
                  aria-label="Aqua"
                  value="aqua"
                  checked={theme === 'aqua'}
                  onChange={handleThemeChange}
                  className="hidden-radio"
                />
                Aqua
              </label>
            </li>
            <li>
              <label className="theme-controller btn btn-sm btn-block btn-ghost justify-start">
                <input
                  type="radio"
                  name="theme-dropdown"
                  aria-label="Synthwave"
                  value="synthwave"
                  checked={theme === 'synthwave'}
                  onChange={handleThemeChange}
                  className="hidden-radio"
                />
                Synthwave
              </label>
            </li>
            <li>
              <label className="theme-controller btn btn-sm btn-block btn-ghost justify-start">
                <input
                  type="radio"
                  name="theme-dropdown"
                  aria-label="Corporate"
                  value="corporate"
                  checked={theme === 'corporate'}
                  onChange={handleThemeChange}
                  className="hidden-radio"
                />
                Corporate
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;