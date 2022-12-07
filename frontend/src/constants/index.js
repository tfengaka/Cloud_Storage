import { faArrowRight, faDownload, faLink, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft } from '../../node_modules/@fortawesome/free-solid-svg-icons/index';

const SHARE_ITEM = {
  code: 'share',
  icon: <FontAwesomeIcon size='sm' icon={faLink} />,
  text: 'Chia Sẻ',
};
const MOVE_ITEM = {
  code: 'move',
  icon: <FontAwesomeIcon size='sm' icon={faArrowRight} />,
  text: 'Di Chuyển Tới',
};
const RENAME_ITEM = {
  code: 'rename',
  icon: <FontAwesomeIcon size='sm' icon={faPen} />,
  text: 'Đổi Tên',
};
const DOWNLOAD_ITEM = {
  code: 'download',
  icon: <FontAwesomeIcon size='sm' icon={faDownload} />,
  text: 'Tải Xuống',
};
const DELETE_ITEM = {
  code: 'delete',
  icon: <FontAwesomeIcon size='sm' icon={faTrash} />,
  text: 'Xóa',
};
const RESTORE_ITEM = {
  code: 'restore',
  icon: <FontAwesomeIcon size='sm' icon={faClockRotateLeft} />,
  text: 'Khôi Phục',
};
const PERMANENTLY_DELETED = {
  code: 'hard_delete',
  icon: <FontAwesomeIcon size='sm' icon={faTrash} />,
  text: 'Xóa Vĩnh Viễn',
};

export const MY_DRIVE_FOLDER_MENU = [MOVE_ITEM, SHARE_ITEM, RENAME_ITEM, DELETE_ITEM];
export const MY_DRIVE_FILE_MENU = [MOVE_ITEM, SHARE_ITEM, RENAME_ITEM, DOWNLOAD_ITEM, DELETE_ITEM];
export const SHARED_DRIVE_FOLDER_MENU = [SHARE_ITEM, DELETE_ITEM];
export const SHARED_DRIVE_FILE_MENU = [SHARE_ITEM, DOWNLOAD_ITEM, DELETE_ITEM];
export const TRASH_MENU = [RESTORE_ITEM, PERMANENTLY_DELETED];
