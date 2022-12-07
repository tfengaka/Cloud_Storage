import { useQuery } from '@apollo/client';
import React, { useLayoutEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { CircleLoading, Helmet } from 'components/common';
import { SHARED_DRIVE_FILE_MENU, SHARED_DRIVE_FOLDER_MENU } from 'constants';
import { useAuth } from 'contexts/AuthContext';
import { File, Folder, Grid, Section, TopBar } from 'features/storage/components';
import { useInteractive } from 'hooks/useInteractive';
import { download } from 'utils';
import { GET_MY_SHARED } from '../graphql/query';
import { ShareModal } from '../modules';

const SharedWithMe = () => {
  const { user } = useAuth();
  const { removeShareItem } = useInteractive();
  const [folders, setFolders] = useState([]);
  const [target, setTarget] = useState(null);
  const [isSharing, setSharing] = useState(false);
  const { loading, error, data, refetch } = useQuery(GET_MY_SHARED, {
    variables: {
      user_id: user.id,
      layer: folders[folders.length - 1] ? folders[folders.length - 1].layer + 1 : 1,
      path: folders[folders.length - 1] ? folders[folders.length - 1].path : '',
    },
  });

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
    console.log(file, action);
    setTarget(file);
    switch (action) {
      case 'share':
        setSharing(true);
        break;
      case 'download':
        download(file.url, file.name);
        break;
      case 'delete':
        removeShareItem(file.path);
        break;
      default:
        break;
    }
  };

  return (
    <Helmet title='Được chia sẻ với tôi'>
      <div className='drive'>
        <TopBar title='Được chia sẻ với tôi' folders={folders} setFolders={setFolders} />
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
                      menuItems={SHARED_DRIVE_FOLDER_MENU}
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
                    <File
                      key={item.id}
                      data={item}
                      menuItems={SHARED_DRIVE_FILE_MENU}
                      onMenuHandler={handleContextMenu}
                    />
                  ))}
                </Grid>
              </Section>
            )}
          </div>
        )}
      </div>
      <ShareModal visible={isSharing} targetItem={target} close={() => setSharing(false)} />
    </Helmet>
  );
};

export default SharedWithMe;
