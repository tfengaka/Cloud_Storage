import { faCloud, faTrash, faUserGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';
import Menu from './Menu';

const sideBarLink = [
  {
    displayName: 'Cloud của tôi',
    icon: <FontAwesomeIcon size='lg' icon={faCloud} />,
    link: '/drive/my-drive',
  },
  {
    displayName: 'Được chia sẻ với tôi',
    icon: <FontAwesomeIcon size='lg' icon={faUserGroup} />,
    link: '/drive/shared-with-me',
  },
  {
    displayName: 'Thùng rác',
    icon: <FontAwesomeIcon size='lg' icon={faTrash} />,
    link: '/drive/trash',
  },
];

function SideBar() {
  return (
    <div className='sidebar'>
      <Menu />
      <div className='sidebar_link'>
        {sideBarLink.map((item, index) => (
          <React.Fragment key={index}>
            <NavLink to={item.link} className={({ isActive }) => `sidebar_link-item ${isActive ? 'active' : ''}`}>
              {item.icon}
              <span>{item.displayName}</span>
            </NavLink>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
