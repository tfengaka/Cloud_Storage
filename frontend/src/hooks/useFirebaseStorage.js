import { storage } from 'app/firebaseConfig';
import { useAuth } from 'contexts/AuthContext';
import { getDownloadURL, ref, uploadBytesResumable, deleteObject } from 'firebase/storage';
import { useState } from 'react';
import { toast } from 'react-toastify';
export default function useFirebaseStorage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);

  const uploader = (file, callback) => {
    const storageRef = ref(storage, `${user.email}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, file.type);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progressPercent = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressPercent);
        switch (snapshot.state) {
          case 'paused':
            toast.info('Upload is paused');
            break;
          case 'running':
            break;
          default:
            console.log('Nothing at all');
            break;
        }
      },
      (error) => {
        throw error;
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          callback(downloadUrl);
        });
      }
    );
  };

  const deleteFile = (file, callback) => {
    const storageRef = ref(storage, `${user.email}/${file.name}`);
    deleteObject(storageRef)
      .then(() => {
        callback();
      })
      .catch((error) => {
        throw error;
      });
  };

  return {
    progress,
    uploader,
    deleteFile,
  };
}
