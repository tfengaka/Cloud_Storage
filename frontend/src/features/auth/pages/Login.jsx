import { yupResolver } from '@hookform/resolvers/yup';
import facebookIcon from 'assets/icon/facebook.svg';
import githubIcon from 'assets/icon/github.svg';
import googleIcon from 'assets/icon/google.svg';
import { useAuth } from 'contexts/AuthContext';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
const schemaValidation = Yup.object({
  email: Yup.string().email('Địa chỉ email không hợp lệ!').required('Vui lòng nhập email!'),
  password: Yup.string().required('Mật khẩu không được để trống!'),
});

function Login() {
  const { signInWithAccount, signInWithSocial } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemaValidation), mode: 'onChange' });

  return (
    <>
      <div className='auth-heading'>
        <h3>Đăng nhập</h3>
      </div>
      <form onSubmit={handleSubmit(signInWithAccount)} autoComplete='off' className='form'>
        <div className={`form-control ${errors.email ? 'error' : ''}`}>
          <label htmlFor='email'>Địa Chỉ Email</label>
          <input {...register('email')} id='email' type='text' placeholder='Email' />
          {errors.email && <label className='errors-message'>{errors.email.message}</label>}
        </div>
        <div className={`form-control ${errors.email ? 'error' : ''}`}>
          <label htmlFor='password'>Mật Khẩu</label>
          <input {...register('password')} id='password' type='password' placeholder='Mật Khẩu' />
          {errors.password && <label className='errors-message'>{errors.password.message}</label>}
        </div>
        <div className='form-submit'>
          <button type='submit'>Đăng Nhập</button>
        </div>
      </form>
      <div className='devider'>
        <span>Hoặc đăng nhập bằng</span>
      </div>
      <div className='auth-social'>
        <div className='auth-social-item' onClick={() => signInWithSocial(1)}>
          <img src={googleIcon} alt='' />
        </div>
        <div className='auth-social-item' onClick={() => signInWithSocial(2)}>
          <img src={facebookIcon} alt='' />
        </div>
        <div className='auth-social-item' onClick={() => signInWithSocial(3)}>
          <img src={githubIcon} alt='' />
        </div>
      </div>
      <div className='auth-footer'>
        <span>Bạn chưa có tài khoản? </span>
        <Link to='/register' className='auth-footer-link'>
          Đăng ký ngay
        </Link>
      </div>
    </>
  );
}

export default Login;
