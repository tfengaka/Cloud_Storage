import HeadlessTippy from '@tippyjs/react/headless';
import { CSSTransition } from 'react-transition-group';
import React from 'react';
import ReactPlayer from 'react-player';

import Icons from 'components/Icons';
import { Portal } from 'components/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'm4v'];
const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'aac', 'wma', 'm4a'];

function File({ data, menuItems, onMenuHandler }) {
  const [isShowMenu, setShowMenu] = React.useState(false);
  const [isOpen, setOpen] = React.useState(false);
  return (
    <div>
      <HeadlessTippy
        visible={isShowMenu}
        interactive
        onClickOutside={() => setShowMenu(false)}
        offset={[125, -150]}
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
                      setShowMenu(false);
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
          className={`file ${isShowMenu ? 'active' : ''}`}
          onContextMenu={(event) => {
            event.preventDefault();
            setShowMenu(true);
          }}
          onDoubleClick={() => setOpen(true)}
        >
          <div className='file_cover'>
            {!!IMAGE_EXTENSIONS.includes(data?.extension) ? (
              <img src={data?.url} alt='preview' />
            ) : (
              Icons[data?.extension] || Icons.blank
            )}
          </div>
          <div className='file_info'>
            <div className='file_info_name'>
              {data.name}
            </div>
          </div>
        </div>
      </HeadlessTippy>
      {isOpen && <FileViewer visible={true} file={data} onClose={() => setOpen(false)} />}
    </div>
  );
}

const FileViewer = ({ visible, file, onClose }) => {
  return (
    <CSSTransition in={visible} timeout={300} classNames='zoom' unmountOnExit mountOnEnter>
      <Portal isOverlay opacity={0.8}>
        <button className='btn_close' onClick={onClose}>
          <FontAwesomeIcon icon={faX} />
        </button>
        <div className='modal'>
          <div className='viewer'>
            {!!IMAGE_EXTENSIONS.includes(file?.extension) && <img src={file?.url} alt='preview' />}
            {!!AUDIO_EXTENSIONS.includes(file?.extension) && (
              <ReactPlayer
                playing
                url={file?.url}
                controls
                volume={0.3}
                stopOnUnmount
                config={{
                  file: {
                    forceAudio: true,
                  },
                }}
              />
            )}
            {!!VIDEO_EXTENSIONS.includes(file?.extension) && (
              <ReactPlayer playing url={file?.url} width='100%' height='100%' controls volume={0.3} stopOnUnmount />
            )}
          </div>
        </div>
      </Portal>
    </CSSTransition>
  );
};

export default File;
