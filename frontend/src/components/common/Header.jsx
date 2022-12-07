import { useAuth } from 'contexts/AuthContext';
import React from 'react';
import logo from '../../assets/images/Storage-Logo.png';
import Searching from './Searching';
function Header() {
  const { user, sign_out } = useAuth();
  return (
    <div className='header'>
      <div className='header_logo'>
        <div className='header_logo-img'>
          <img src={logo} alt='' />
        </div>
        <h3>Cloud Storage</h3>
      </div>
      <Searching />
      <div className='header_account'>
        <div className='header_account-info'>
          <span>{user.displayName}</span>
        </div>
        <button className='header_account-logout' onClick={() => sign_out()}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Header;
