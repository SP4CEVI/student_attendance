import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import UserDropdown from './UserDropdown';
import logo from '../../assets/images/Inverse.png';
import './Header.css';

const Header = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Логотип" className="logo" />
        <h1>Посещаемость</h1>
      </div>
      {user && (
        <div className="header-right">
          <UserDropdown />
        </div>
      )}
    </header>
  );
};

export default Header;
