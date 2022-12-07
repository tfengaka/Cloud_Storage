import { CircleLoading, Overlay } from 'components/common';
import { useAuth } from 'contexts/AuthContext';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
function AuthLayout() {
  const { user, isLoading } = useAuth();
  return user && !isLoading ? (
    <Navigate to='/' />
  ) : (
    <div className='auth'>
      <Overlay isActive={isLoading}>
        <CircleLoading />
      </Overlay>
      <div className='wrapper'>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
