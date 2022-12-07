import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import { useInteractive } from 'hooks/useInteractive';
import { UploadLoading, Dialog, Portal } from 'components/common';

function RenameModal({ visible, close, targetItem }) {
  const { isLoading, renameFile } = useInteractive();
  const [name, setName] = useState('');

  useEffect(() => {
    setName(targetItem?.name || '');
  }, [targetItem]);

  return (
    <CSSTransition in={visible} timeout={300} classNames='zoom' unmountOnExit mountOnEnter>
      <Portal isOverlay>
        <Dialog title='Đổi tên' onClose={() => close()} onClick={() => renameFile(targetItem, name, close)}>
          <div className={`form-control`}>
            <input type='text' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </Dialog>
        {isLoading && <UploadLoading />}
      </Portal>
    </CSSTransition>
  );
}

export default RenameModal;
