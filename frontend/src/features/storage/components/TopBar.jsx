import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

function TopBar({ title, folders, setFolders }) {
  const handleOlderFolder = (index) => {
    setFolders((prev) => prev.slice(0, index + 1));
  };

  return (
    <div className='drive_header'>
      <div className='drive_header_path'>
        <span className='drive_header_path-item' onClick={() => setFolders([])}>
          {title}
        </span>
        {folders &&
          folders.length > 0 &&
          folders.map((folder, index) => (
            <React.Fragment key={folder.id}>
              <FontAwesomeIcon icon={faAngleRight} className='icon' />
              <span className='drive_header_path-item' onClick={() => handleOlderFolder(index)}>
                {folder.name}
              </span>
            </React.Fragment>
          ))}
      </div>
    </div>
  );
}
export default TopBar;
