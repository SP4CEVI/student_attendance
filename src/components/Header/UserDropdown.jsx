import React, { useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Header.css';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="user-dropdown">
      <div className="user-info" onClick={toggleDropdown}>
        <span>{user.name}</span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={logout} className="dropdown-item">
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;