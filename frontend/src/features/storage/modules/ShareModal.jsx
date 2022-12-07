import { useLazyQuery } from '@apollo/client';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CSSTransition } from 'react-transition-group';

import { Dialog, Portal } from 'components/common';
import { useAuth } from 'contexts/AuthContext';
import { GET_USER_BY_EMAIL } from 'features/auth/graphql/query';
import { useInteractive } from 'hooks/useInteractive';

function ShareModal({ visible, close, targetItem }) {
  const { user } = useAuth();
  const { shareWithUser } = useInteractive();
  const [getUserByEmail] = useLazyQuery(GET_USER_BY_EMAIL);

  const [targetFile, setTargetFile] = useState(null);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [addedUsers, setAddedUsers] = useState([]);

  useEffect(() => {
    setTargetFile(targetItem);
  }, [targetItem]);

  const handleAddUser = (userEmail) => {
    if (userEmail === '') {
      setErrorMessage('Vui lòng nhập email!');
      return;
    }
    if (!userEmail.includes('@')) {
      setErrorMessage('Email không hợp lệ!');
      return;
    }
    getUserByEmail({
      variables: { email: userEmail, actor_id: user.id },
      onCompleted: ({ user }) => {
        if (user[0]) {
          if (user[0].id !== targetFile.owner.id) {
            setAddedUsers([...addedUsers, user[0]]);
            setEmail('');
          } else {
            setErrorMessage('Không thể chia sẻ với chủ sở hữu!');
          }
        } else {
          setErrorMessage('Không tìm thấy người dùng nào!');
        }
      },
      onError: (error) => {
        console.error(error.message);
        toast.error('Có lỗi xảy ra!');
      },
    });
  };

  const handleRemoveUser = (user) => {
    setAddedUsers(addedUsers.filter((u) => u.id !== user.id));
  };

  return (
    <CSSTransition in={visible} timeout={300} classNames='zoom' unmountOnExit>
      <Portal isOverlay>
        <Dialog
          title='Chia sẻ'
          onClose={() => {
            close();
            setErrorMessage('');
            setAddedUsers([]);
          }}
          onClick={() =>
            shareWithUser(
              addedUsers.map((u) => u.email),
              targetFile.path,
              close
            )
          }
        >
          <div className='share'>
            <div className='share_input'>
              <input
                type='text'
                value={email}
                placeholder='Email Người nhận'
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={() => handleAddUser(email)}>Thêm</button>
            </div>
            {errorMessage && <label className='errors-message'>{errorMessage}</label>}
            <div className='share_container'>
              <h4 className='modal_title'>Danh sách người nhận:</h4>
              <div className='share_list'>
                {addedUsers.length > 0 &&
                  addedUsers.map((user) => (
                    <SharedUser key={user.id} data={user} onRemove={() => handleRemoveUser(user)} />
                  ))}
              </div>
            </div>
          </div>
        </Dialog>
      </Portal>
    </CSSTransition>
  );
}

const SharedUser = ({ data, onRemove }) => {
  return (
    <div className='share_list_item'>
      <label>{`${data?.fullName} (${data?.email})`}</label>
      <button onClick={onRemove}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
};

export default ShareModal;
