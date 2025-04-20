import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import Button from '../Shared/Button';
import './Header.css';

const UserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <div className="user-info" onClick={toggleDropdown}>
        <span className="user-name">{user.name}</span>
        <div className="menu-icon">
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
          <span className="menu-bar"></span>
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <Button onClick={logout} variant="secondary" className="dropdown-item">
            Выйти
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;