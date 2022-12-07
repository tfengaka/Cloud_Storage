import React from 'react';
import { CircleLoading } from 'components/common';

function Dialog({ title, loading, onClick, onClose, children }) {
  return (
    <React.Fragment>
      <div className='modal wrapper'>
        <h4 className='modal_header'>{title}</h4>
        {children}
        <div className='modal_button'>
          <button className='cancel' onClick={onClose}>
            Hủy bỏ
          </button>
          <button className='confirm' onClick={onClick}>
            Xác nhận
          </button>
        </div>
      </div>
      {loading && <CircleLoading />}
    </React.Fragment>
  );
}

export default Dialog;
