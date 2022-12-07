import { useQuery } from '@apollo/client';
import { faAngleRight, faFolder, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';

import { Dialog, Portal, UploadLoading } from 'components/common';
import { useInteractive } from 'hooks/useInteractive';
import { useAuth } from 'contexts/AuthContext';
import { GET_MY_FOLDER_TREE } from '../graphql/query';

function MovingModal({ visible, close, targetItem }) {
  const { user } = useAuth();
  const { moveItem } = useInteractive();
  const [item, setItem] = useState(null);
  const [targetFolders, setTargetFolders] = useState([]);

  const { loading, error, data, refetch } = useQuery(GET_MY_FOLDER_TREE, {
    variables: {
      owner_id: user.id,
      layer: targetFolders?.layer + 1 || 1,
      path: targetFolders?.path || '',
      item_id: targetItem?.id || '',
    },
  });

  useEffect(() => {
    setItem(targetItem);
  }, [targetItem]);

  if (error) {
    console.error(error);
    toast.error('Có lỗi xảy ra!');
    return <h1>Something went wrong!</h1>;
  }

  const handleNextLayer = (folder) => {
    setTargetFolders((prev) => [...prev, folder]);
    refetch({ layer: folder.layer + 1, path: folder.path });
  };

  const handleResetPath = () => {
    setTargetFolders([]);
    refetch({ layer: 1, path: '' });
  };
  const handleSelectedPath = (index) => {
    setTargetFolders(targetFolders.slice(0, index + 1));
    refetch({ layer: targetFolders[index].layer + 1, path: targetFolders[index].path });
  };

  return (
    <CSSTransition in={visible} timeout={300} classNames='zoom' unmountOnExit mountOnEnter>
      <Portal isOverlay>
        <Dialog
          title='Chuyển đến'
          onClose={() => close()}
          onClick={() => moveItem(item, targetFolders[targetFolders.length - 1].path, close)}
        >
          <div className='moving'>
            <div className='moving_target'>
              <div className='moving_target_path'>
                <span className='moving_target_path_item icon' onClick={() => handleResetPath()}>
                  <FontAwesomeIcon size='lg' icon={faHome} />
                </span>
                {targetFolders.length > 0 &&
                  targetFolders.map((folder, index) => (
                    <React.Fragment key={folder.id}>
                      <FontAwesomeIcon size='lg' icon={faAngleRight} />
                      <span className='moving_target_path_item' onClick={() => handleSelectedPath(index)}>
                        {folder.name}
                      </span>
                    </React.Fragment>
                  ))}
              </div>
            </div>
            <div className='moving_tree'>
              <h4 className='modal_title'>Cây thư mục:</h4>
              <div className='moving_folders'>
                {loading && <UploadLoading />}
                {!loading &&
                  data?.folders.length > 0 &&
                  data.folders.map((folder) => (
                    <div key={folder.id} className='moving_folders_item' onClick={() => handleNextLayer(folder)}>
                      <FontAwesomeIcon size='sm' icon={faFolder} />
                      <span>{folder.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Dialog>
      </Portal>
    </CSSTransition>
  );
}

export default MovingModal;
