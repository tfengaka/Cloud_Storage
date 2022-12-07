import React from 'react';
import { createPortal } from 'react-dom';
import Overlay from './Overlay';
function Portal({ children, isOverlay, opacity }) {
  return createPortal(
    <React.Fragment>
      {isOverlay ? (
        <Overlay isActive={true} opacity={opacity}>
          {children}
        </Overlay>
      ) : (
        children
      )}
    </React.Fragment>,
    document.querySelector('body')
  );
}

export default Portal;
