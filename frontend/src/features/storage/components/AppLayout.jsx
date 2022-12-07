import { CircleLoading, Header, Overlay, SideBar } from 'components/common';
import { useAuth } from 'contexts/AuthContext';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { FolderProvider } from 'contexts/FolderContext';
function AppLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className='layout'></div>;

  return !user && !isLoading ? (
    <Navigate to='/login' />
  ) : (
    <div className='layout'>
      {isLoading ? (
        <Overlay isActive={true}>
          <CircleLoading />
        </Overlay>
      ) : (
        <FolderProvider>
          <Header />
          <SideBar />
          <div className='main-content'>
            <Outlet />
          </div>
        </FolderProvider>
      )}
    </div>
  );
}

export default AppLayout;
