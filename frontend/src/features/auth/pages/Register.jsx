import { yupResolver } from '@hookform/resolvers/yup';
import { useAuth } from 'contexts/AuthContext';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
const schemaValidation = Yup.object({
  username: Yup.string().required('Họ và tên không được để trống'),
  email: Yup.string().email('Địa chỉ email không hợp lệ!').required('Địa chỉ email không được để trống'),
  password: Yup.string().required('Mật khẩu không được để trống').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  repassword: Yup.string()
    .required('Mật khẩu không được để trống')
    .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp'),
});

function Register() {
  const { signUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemaValidation), mode: 'onChange' });

  return (
    <>
      <div className='auth-heading'>
        <h3>Đăng ký</h3>
      </div>
      <form autoComplete='off' className='form' onSubmit={handleSubmit(signUp)}>
        <div className={`form-control ${errors.username ? 'error' : ''}`}>
          <label htmlFor='username'>Họ và Tên</label>
          <input {...register('username')} id='username' type='text' placeholder='Họ và tên' />
          {errors.username && <label className='errors-message'>{errors.username.message}</label>}
        </div>
        <div className={`form-control ${errors.email ? 'error' : ''}`}>
          <label htmlFor='email'>Địa chỉ Email</label>
          <input {...register('email')} id='email' type='text' placeholder='Email' />
          {errors.email && <label className='errors-message'>{errors.email.message}</label>}
        </div>
        <div className={`form-control ${errors.password ? 'error' : ''}`}>
          <label htmlFor='password'>Mật Khẩu</label>
          <input {...register('password')} id='password' type='password' placeholder='Mật Khẩu' />
          {errors.password && <label className='errors-message'>{errors.password.message}</label>}
        </div>
        <div className={`form-control ${errors.repassword ? 'error' : ''}`}>
          <label htmlFor='repassword'>Xác nhận mật khẩu</label>
          <input {...register('repassword')} id='repassword' type='password' placeholder='Mật Khẩu' />
          {errors.repassword && <label className='errors-message'>{errors.repassword.message}</label>}
        </div>
        <div className='form-submit'>
          <button type='submit'>Đăng Ký</button>
        </div>
      </form>
      <div className='auth-footer'>
        <span>Bạn đã có tài khoản? </span>
        <Link to='/login' className='auth-footer-link'>
          Đăng nhập ngay
        </Link>
      </div>
    </>
  );
}

export default Register;
