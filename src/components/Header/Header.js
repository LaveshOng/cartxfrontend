import React from 'react';
import './Header.scss';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

const Header = () => {
  return (
    <header className="header text-white">
      <div className="container">
        <div className="header-cnt">
          <div className="header-cnt-bottom">
            <Navbar />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
