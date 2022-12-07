import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Dialog, Portal } from 'components/common';
import { useMyFolder } from 'contexts/FolderContext';
import { useInteractive } from 'hooks/useInteractive';

function CreateFolder({ visible, close }) {
  const { currentFolder } = useMyFolder();
  const { isLoading, createFolder } = useInteractive();
  const [folderName, setFolderName] = useState('New Folder');

  const onFinished = () => {
    close();
    setTimeout(() => {
      setFolderName('New Folder');
    }, 300);
  };

  return (
    <CSSTransition in={visible} timeout={300} classNames='zoom' unmountOnExit mountOnEnter>
      <Portal isOverlay>
        <Dialog
          title='Tạo thư mục mới'
          loading={isLoading}
          onClose={() => onFinished()}
          onClick={() => createFolder(folderName, currentFolder?.path || '', onFinished)}
        >
          <div className={`form-control`}>
            <input type='text' value={folderName} onChange={(e) => setFolderName(e.target.value)} />
          </div>
        </Dialog>
      </Portal>
    </CSSTransition>
  );
}

export default CreateFolder;
