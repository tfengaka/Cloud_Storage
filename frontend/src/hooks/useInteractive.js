import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { toast } from 'react-toastify';

import {
  MOVE_FILE,
  PERMANENTLY_DELETE_FILE,
  REMOVE_SHARED_FILE,
  RENAME_FILE,
  RESTORE_FILE,
  SHARE_FILE,
  SOFT_DELETE_FILE,
  UPLOAD_FILE,
} from 'features/storage/graphql/mutation';
import { GET_MY_SHARED, GET_MY_STORE, GET_MY_TRASH } from 'features/storage/graphql/query';
import useFirebaseStorage from './useFirebaseStorage';

export function useInteractive() {
  const { deleteFile } = useFirebaseStorage();
  const [createDir] = useMutation(UPLOAD_FILE, { refetchQueries: [GET_MY_STORE] });
  const [rename] = useMutation(RENAME_FILE, { refetchQueries: [GET_MY_STORE, GET_MY_SHARED] });
  const [shareFile] = useMutation(SHARE_FILE, { refetchQueries: [GET_MY_SHARED] });
  const [removeshare] = useMutation(REMOVE_SHARED_FILE, { refetchQueries: [GET_MY_SHARED] });
  const [softDelete] = useMutation(SOFT_DELETE_FILE, { refetchQueries: [GET_MY_STORE, GET_MY_SHARED, GET_MY_TRASH] });
  const [moveFile] = useMutation(MOVE_FILE, { refetchQueries: [GET_MY_STORE, GET_MY_SHARED] });
  const [restore] = useMutation(RESTORE_FILE, { refetchQueries: [GET_MY_STORE, GET_MY_TRASH] });
  const [permanentDelete] = useMutation(PERMANENTLY_DELETE_FILE, { refetchQueries: [GET_MY_TRASH] });
  const [isLoading, setIsLoading] = useState(false);

  const createFolder = (folderName, path, onFinished) => {
    setIsLoading(true);
    createDir({
      variables: {
        name: folderName,
        extension: 'folder',
        size: 0,
        path: path || '',
        download_url: '',
      },
      onCompleted: () => {
        toast.success('Thành công', {
          position: 'bottom-right',
        });
        onFinished();
        setIsLoading(false);
      },
      onError: (errors) => {
        console.error('error: ', errors);
        setIsLoading(false);
        toast.error(`Thư mục đã tồn tại`, {
          position: 'bottom-right',
        });
      },
    });
  };

  const renameFile = (item, newValue, onFinished) => {
    setIsLoading(true);
    rename({
      variables: {
        id: item.id,
        newData: newValue,
      },
      onCompleted: () => {
        toast.success('Thành công', {
          position: 'bottom-right',
        });
        setIsLoading(false);
        onFinished();
      },
      onError: (errors) => {
        console.error('error: ', errors);
        setIsLoading(false);
        toast.error(`Lỗi: ${errors.message}`, {
          position: 'bottom-right',
        });
      },
    });
  };

  const shareWithUser = (emails, path, onFinished) => {
    setIsLoading(true);
    shareFile({
      variables: {
        emails: emails,
        path: path,
      },
      onCompleted: () => {
        toast.success('Thành công', {
          position: 'bottom-right',
        });
        setIsLoading(false);
        onFinished();
      },
      onError: (errors) => {
        console.error('error: ', errors);
        setIsLoading(false);
        toast.error(`Lỗi: ${errors.message}`, {
          position: 'bottom-right',
        });
      },
    });
  };

  const softDeleteItem = (item) => {
    setIsLoading(true);
    softDelete({
      variables: {
        id: item.id,
      },
      onCompleted: ({ deleted_item }) => {
        toast.success(`Đã xóa ${deleted_item.name}`, {
          position: 'bottom-right',
        });
        setIsLoading(false);
      },
      onError: (errors) => {
        console.error('error: ', errors);
        setIsLoading(false);
        toast.error(`Lỗi: ${errors.message}`, {
          position: 'bottom-right',
        });
      },
    });
  };

  const moveItem = (file, to, onFinished) => {
    setIsLoading(true);
    moveFile({
      variables: {
        from: file.path,
        to: to,
      },
      onCompleted: () => {
        toast.success('Đã Chuyển đi', {
          position: 'bottom-right',
        });
        onFinished();
      },
      onError: (errors) => {
        console.error(errors);
        toast.error('Tên tệp đã tồn tại!', {
          position: 'bottom-right',
        });
      },
    });
  };

  const removeShareItem = (filePath) => {
    setIsLoading(true);
    removeshare({
      variables: {
        path: filePath,
      },
      onCompleted: () => {
        toast.success('Xóa thành công', {
          position: 'bottom-right',
        });
        setIsLoading(false);
      },
      onError: (errors) => {
        console.error('error: ', errors);
        setIsLoading(false);
        toast.error(`Lỗi: ${errors.message}`, {
          position: 'bottom-right',
        });
      },
    });
  };

  const restoreItem = (item) => {
    setIsLoading(true);
    restore({
      variables: {
        file_id: item.id,
      },
      onCompleted: () => {
        toast.success(`Đã khôi phục ${item.name}`, {
          position: 'bottom-right',
        });
        setIsLoading(false);
      },
      onError: (errors) => {
        console.error('error: ', errors);
        setIsLoading(false);
        toast.error(`Lỗi: ${errors.message}`, {
          position: 'bottom-right',
        });
      },
    });
  };

  const permanentDeleteItem = (item) => {
    setIsLoading(true);
    if (!!item.extension) {
      try {
        deleteFile(item, () => {
          permanentDelete({
            variables: { file_id: item.id },
            onCompleted: () => {
              toast.success(`Đã xóa ${item.name}`, {
                position: 'bottom-right',
              });
            },
            onError: (errors) => {
              console.error('error: ', errors);
              toast.error(`Lỗi: ${errors.message}`, {
                position: 'bottom-right',
              });
            },
          });
        });
        setIsLoading(false);
      } catch (error) {
        console.error('error: ', error);
        toast.error(`Lỗi Firebase: ${error.message}`, {
          position: 'bottom-right',
        });
      }
    } else {
      permanentDelete({
        variables: { file_id: item.id },
        onCompleted: () => {
          toast.success(`Đã xóa ${item.name}`, {
            position: 'bottom-right',
          });
        },
        onError: (errors) => {
          console.error('error: ', errors);
          toast.error(`Lỗi: ${errors.message}`, {
            position: 'bottom-right',
          });
        },
      });
    }
  };

  return {
    isLoading,
    createFolder,
    renameFile,
    shareWithUser,
    removeShareItem,
    moveItem,
    softDeleteItem,
    restoreItem,
    permanentDeleteItem,
  };
}
