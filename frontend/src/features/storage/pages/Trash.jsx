import { useQuery } from '@apollo/client';
import { CircleLoading, Helmet } from 'components/common';
import { TRASH_MENU } from 'constants';
import { useAuth } from 'contexts/AuthContext';
import { useInteractive } from 'hooks/useInteractive';
import React, { useLayoutEffect, useState } from 'react';
import { File, Folder, Grid, Section, TopBar } from '../components';
import { GET_MY_TRASH } from '../graphql/query';

const Trash = () => {
  const { user } = useAuth();
  const { loading: interactLoading, restoreItem, permanentDeleteItem } = useInteractive();
  const [folders, setFolders] = useState([]);
  const { loading, error, data, refetch } = useQuery(GET_MY_TRASH, {
    variables: {
      owner_id: user.id,
      layer: folders[folders.length - 1] ? folders[folders.length - 1].layer + 1 : 1,
      path: folders[folders.length - 1] ? folders[folders.length - 1].path : '',
    },
  });

  useLayoutEffect(() => {
    refetch({ layer: 1, path: '' });
  }, [refetch]);

  if (error) {
    console.error(error);
    return <center>Something went wrong!</center>;
  }

  const handleRefetchFolder = (folder) => {
    const current = { id: folder.id, name: folder.name, path: folder.path, layer: folder.layer };
    setFolders([...folders, current]);
    refetch({ layer: folder.layer + 1, path: folder.path });
  };

  const handleContextMenu = (file, action) => {
    console.log(file);
    switch (action) {
      case 'restore':
        restoreItem(file);
        break;
      case 'hard_delete':
        permanentDeleteItem(file);
        break;
      default:
        break;
    }
  };

  return (
    <Helmet title='Thùng rác'>
      {interactLoading && <CircleLoading />}
      <div className='drive'>
        <TopBar title='Thùng rác' folders={folders} setFolders={setFolders} />
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
                      menuItems={TRASH_MENU}
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
                    <File key={item.id} data={item} menuItems={TRASH_MENU} onMenuHandler={handleContextMenu} />
                  ))}
                </Grid>
              </Section>
            )}
          </div>
        )}
      </div>
    </Helmet>
  );
};

export default Trash;
