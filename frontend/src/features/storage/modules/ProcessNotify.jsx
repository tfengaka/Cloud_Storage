import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { UploadLoading, Portal } from 'components/common';
import { CSSTransition } from 'react-transition-group';

function ProcessNotify({ visible, fileName = '', percent = 0 }) {
  return (
    <CSSTransition in={visible} timeout={300} classNames='zoom' unmountOnExit mountOnEnter>
      <Portal>
        <div className='process'>
          <div className='process_body'>
            {percent === 100 ? <FontAwesomeIcon icon={faCircleCheck} className='process_done' /> : <UploadLoading />}
            <div className='process_info'>
              <span>{`${fileName}  (${Number(percent).toFixed(0)}%)`}</span>
              <div className='process_persent'>
                <div className='process_persent_bar' style={{ width: `${percent}%` }} />
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </CSSTransition>
  );
}

export default ProcessNotify;
