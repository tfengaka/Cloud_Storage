import { faFolder } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HeadlessTippy from '@tippyjs/react/headless';
import React from 'react';

function Folder({ data, menuItems, onClick, onMenuHandler }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      <HeadlessTippy
        visible={isOpen}
        interactive
        onClickOutside={() => setIsOpen(false)}
        offset={[100, -25]}
        render={(attrs) => (
          <div className='contextMenu' {...attrs}>
            <div className='wrapper'>
              {menuItems.length > 0 &&
                menuItems.map((item, index) => (
                  <button
                    key={index}
                    className='contextMenu_item'
                    onClick={() => {
                      onMenuHandler(data, item.code);
                      setIsOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.text}</span>
                  </button>
                ))}
            </div>
          </div>
        )}
      >
        <div
          className={`folder ${isOpen ? 'active' : ''}`}
          onContextMenu={(event) => {
            event.preventDefault();
            setIsOpen(true);
          }}
          onClick={onClick}
        >
          <FontAwesomeIcon size='lg' icon={faFolder} />
          <div className='folder-name'>
            <span>{data?.name}</span>
          </div>
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Folder;
