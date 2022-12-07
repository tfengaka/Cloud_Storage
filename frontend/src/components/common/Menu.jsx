import { useMutation } from '@apollo/client';
import { faCloudArrowUp, faFolderPlus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { useMyFolder } from 'contexts/FolderContext';
import { CreateFolder, ProcessNotify } from 'features/storage/modules';
import { UPLOAD_FILE } from 'features/storage/graphql/mutation';
import { GET_MY_STORE } from 'features/storage/graphql/query';
import useFirebaseStorage from 'hooks/useFirebaseStorage';

const sidebarToolItem = [
  {
    displayName: 'Thư mục mới',
    icon: <FontAwesomeIcon size='lg' icon={faFolderPlus} />,
    type: 'folder',
  },
  {
    displayName: 'Tải tệp lên',
    icon: <FontAwesomeIcon size='lg' icon={faCloudArrowUp} />,
    type: 'file',
  },
];

function Menu() {
  const { uploader, progress } = useFirebaseStorage();
  const { currentFolder } = useMyFolder();
  const [uploadFile] = useMutation(UPLOAD_FILE, { refetchQueries: [GET_MY_STORE] });

  const [isOpen, setIsOpen] = useState(false);
  const [isUpload, setIsUpload] = useState(false);
  const [isCreateFolder, setIsCreateFolder] = useState(false);
  const [processFile, setProcessFile] = useState(null);
  const hiddenFileInput = useRef(null);

  const handleAddItem = (type) => {
    if (type === 'file') {
      hiddenFileInput.current.click();
    } else {
      setIsCreateFolder(true);
      setIsOpen(false);
    }
  };
  const handleUploadFile = (event) => {
    const file = event.target.files[0];
    const extension = file.name.split('.')[1];
    setIsUpload(true);
    setProcessFile(file);
    try {
      uploader(file, (downloadURL) => {
        uploadFile({
          variables: {
            name: file.name,
            extension,
            size: file.size,
            path: currentFolder?.path || '',
            download_url: downloadURL,
          },
          onCompleted: () => {
            setTimeout(() => {
              setIsUpload(false);
              setProcessFile(null);
              toast.success('Tải tệp lên thành công', {
                position: 'bottom-right',
              });
            }, 3000);
          },
          onError: (errors) => {
            console.error('error: ', errors);
            setIsUpload(false);
            setProcessFile(null);
            toast.error('Lỗi tải tệp lên', {
              position: 'bottom-right',
            });
          },
        });
      });
    } catch (error) {
      toast.error(`Lỗi ${error.code} : ${error.message}`, {
        position: 'bottom-right',
      });
    }
  };
  return (
    <React.Fragment>
      <div className='menu'>
        <HeadlessTippy
          visible={isOpen}
          interactive
          onClickOutside={() => setIsOpen(false)}
          placement='bottom-end'
          offset={[0, -50]}
          render={(attrs) => (
            <div className='wrapper' tabIndex={-1} {...attrs}>
              <input
                type='file'
                multiple={false}
                style={{ display: 'none' }}
                ref={hiddenFileInput}
                onChange={(e) => {
                  handleUploadFile(e);
                  setIsOpen(false);
                }}
              />
              {sidebarToolItem.map((item, index) => (
                <div className='menu_item' key={index} onClick={() => handleAddItem(item.type)}>
                  {item.icon}
                  <span>{item.displayName}</span>
                </div>
              ))}
            </div>
          )}
        >
          <button className='menu_button' onClick={() => setIsOpen(true)}>
            <FontAwesomeIcon icon={faPlus} className='menu_button_icon' />
            Thêm mới
          </button>
        </HeadlessTippy>
      </div>
      <CreateFolder visible={isCreateFolder} close={() => setIsCreateFolder(false)} />
      <ProcessNotify visible={isUpload} fileName={processFile?.name} percent={progress} />
    </React.Fragment>
  );
}

export default Menu;
