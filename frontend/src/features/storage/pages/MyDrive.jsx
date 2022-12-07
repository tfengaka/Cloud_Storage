import { useQuery } from '@apollo/client';
import React, { useLayoutEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CircleLoading, Helmet } from 'components/common';
import { MY_DRIVE_FILE_MENU, MY_DRIVE_FOLDER_MENU } from 'constants';
import { useAuth } from 'contexts/AuthContext';
import { useMyFolder } from 'contexts/FolderContext';
import { File, Folder, Grid, Section, TopBar } from 'features/storage/components';
import { useInteractive } from 'hooks/useInteractive';
import { download } from 'utils';
import { GET_MY_STORE } from '../graphql/query';
import { MovingModal, RenameModal, ShareModal } from '../modules';

const MyDrive = () => {
  const { user } = useAuth();
  const { softDeleteItem } = useInteractive();
  const { currentFolder, folders, setFolders } = useMyFolder();
  const { loading, error, data, refetch } = useQuery(GET_MY_STORE, {
    variables: { owner_id: user.id, layer: currentFolder?.layer + 1 || 1, path: currentFolder?.path || '' },
  });
  const [isRename, setIsRename] = useState(false);
  const [isSharing, setSharing] = useState(false);
  const [isMoving, setMoving] = useState(false);
  const [target, setTarget] = useState(null);

  useLayoutEffect(() => {
    refetch({ layer: 1, path: '' });
  }, [refetch]);

  if (error) {
    console.error(error);
    toast.error('Có lỗi xảy ra!');
    return <h1>Something went wrong!</h1>;
  }

  const handleRefetchFolder = (folder) => {
    const current = { id: folder.id, name: folder.name, path: folder.path, layer: folder.layer };
    setFolders([...folders, current]);
    refetch({ layer: folder.layer + 1, path: folder.path });
  };

  const handleContextMenu = (file, action) => {
    setTarget(file);
    switch (action) {
      case 'rename':
        setIsRename(true);
        break;
      case 'share':
        setSharing(true);
        break;
      case 'move':
        setMoving(true);
        break;
      case 'download':
        download(file.url, file.name);
        break;
      case 'delete':
        softDeleteItem(file);
        break;
      default:
        break;
    }
  };

  return (
    <Helmet title='Kho Của Tôi'>
      <div className='drive'>
        <TopBar title='Kho Của Tôi' folders={folders} setFolders={setFolders} />
        {loading ? (
          <CircleLoading />
        ) : (
          <div className='drive_content'>
            {data?.folders.length > 0 && (
              <Section title='Thư mục'>
                <Grid col={6} mdCol={3} gap={16}>
                  {data?.folders.map((item) => (
                    <Folder
                      key={item.id}
                      data={item}
                      menuItems={MY_DRIVE_FOLDER_MENU}
                      onMenuHandler={handleContextMenu}
                      onClick={() => handleRefetchFolder(item)}
                    />
                  ))}
                </Grid>
              </Section>
            )}
            {data?.files.length > 0 && (
              <Section title='Tệp tin'>
                <Grid col={6} mdCol={3} gap={16}>
                  {data?.files.map((item) => (
                    <File key={item.id} data={item} menuItems={MY_DRIVE_FILE_MENU} onMenuHandler={handleContextMenu} />
                  ))}
                </Grid>
              </Section>
            )}
          </div>
        )}
      </div>
      <MovingModal visible={isMoving} targetItem={target} close={() => setMoving(false)} />
      <RenameModal visible={isRename} targetItem={target} close={() => setIsRename(false)} />
      <ShareModal visible={isSharing} targetItem={target} close={() => setSharing(false)} />
    </Helmet>
  );
};

export default MyDrive;
