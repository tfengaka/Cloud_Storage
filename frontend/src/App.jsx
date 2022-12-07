import { AuthProvider } from 'contexts/AuthContext';
import AuthLayout from 'features/auth/components/AuthLayout';
import LoginPage from 'features/auth/pages/Login';
import RegisterPage from 'features/auth/pages/Register';
import AppLayout from 'features/storage/components/AppLayout';
import MyDrivePage from 'features/storage/pages/MyDrive';
import SharedWithMePage from 'features/storage/pages/SharedWithMe';
import TrashPage from 'features/storage/pages/Trash';
import React from 'react';
import { Navigate, Route, Routes as Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { NotFound } from './components/common';

function App() {
  return (
    <React.Fragment>
      <AuthProvider>
        <Switch>
          <Route path='/' element={<AuthLayout />}>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Route>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Navigate to='/drive/my-drive' />} />
            <Route path='drive'>
              <Route path='my-drive' element={<MyDrivePage />} />
              <Route path='shared-with-me' element={<SharedWithMePage />} />
              <Route path='trash' element={<TrashPage />} />
            </Route>
          </Route>
          <Route path='*' element={<NotFound />} />
        </Switch>
      </AuthProvider>
      <ToastContainer
        position='bottom-right'
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme={'light'}
      />
    </React.Fragment>
  );
}

export default App;
