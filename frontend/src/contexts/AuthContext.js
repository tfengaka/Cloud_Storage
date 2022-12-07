import { useLazyQuery, useMutation } from '@apollo/client';
import { authentication } from 'app/firebaseConfig';
import { SIGN_IN, SIGN_UP } from 'features/auth/graphql/mutation';
import { GET_USER_BY_ID } from 'features/auth/graphql/query';
import {
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import jwt_decode from 'jwt-decode';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
export const useAuth = () => {
  return useContext(authContext);
};
function useAuthProvider() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [getUserByID] = useLazyQuery(GET_USER_BY_ID);
  const [signIn] = useMutation(SIGN_IN);
  const [createAccount] = useMutation(SIGN_UP);

  const handleGetUserData = useRef(null);
  handleGetUserData.current = () => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const { sub } = jwt_decode(accessToken);
      getUserByID({
        variables: { ID: sub },
        onCompleted: ({ account_by_pk }) => {
          const userData = {
            id: sub,
            displayName: account_by_pk.fullName,
            email: account_by_pk.email,
            photoURL: account_by_pk.avatar_url,
          };
          setUser(userData);
        },
        onError: (error) => {
          localStorage.clear();
          console.error(error.message);
          toast.error('Lỗi lấy thông tin tài khoản!', {
            position: 'bottom-right',
          });
        },
      });
    }
  };
  useEffect(() => {
    setIsLoading(true);
    const unregisterAuthObserver = onAuthStateChanged(authentication, (credential) => {
      if (credential) {
        localStorage.clear();
        const data = credential.providerData[0];
        signIn({
          variables: {
            email: data.email,
            type: data.providerId.split('.')[0].toLowerCase().trim(),
          },
          onCompleted: ({ login: token }) => {
            const { access_token } = token;
            localStorage.setItem('access_token', access_token);
            handleGetUserData.current();
            setIsLoading(false);
          },
          onError: (errors) => {
            setIsLoading(false);
            console.error(errors.message);
            toast.error(String(errors.message), {
              position: 'bottom-right',
            });
          },
        });
        setIsLoading(false);
      } else {
        handleGetUserData.current();
        setIsLoading(false);
      }
    });

    return () => unregisterAuthObserver();
  }, [signIn]);
  const signInWithSocial = (platformID) => {
    setIsLoading(true);
    let provider = null;
    switch (platformID) {
      case 1:
        provider = new GoogleAuthProvider();
        break;
      case 2:
        provider = new FacebookAuthProvider();
        break;
      case 3:
        provider = new GithubAuthProvider();
        break;
      default:
        break;
    }

    signInWithPopup(authentication, provider)
      .then(({ providerId, user: userData, _tokenResponse }) => {
        signIn({
          variables: {
            email: _tokenResponse.email || user.email,
            fullName: userData.displayName,
            avatar: _tokenResponse.photoUrl,
            type: providerId.split('.')[0].toLowerCase().trim(),
          },
          onCompleted: ({ login: token }) => {
            const { access_token } = token;
            localStorage.setItem('access_token', access_token);
            handleGetUserData.current();
            setIsLoading(false);
            toast.success('Đăng nhập thành công', {
              position: 'bottom-right',
            });
          },
          onError: (errors) => {
            setIsLoading(false);
            console.error(errors.message);
            toast.error(String(errors.message), {
              position: 'bottom-right',
            });
          },
        });
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error.message);
        toast.error(String(error.message), {
          position: 'bottom-right',
        });
      });
  };
  const signInWithAccount = ({ email, password }) => {
    setIsLoading(true);
    signIn({
      variables: {
        email,
        password,
        type: 'default',
      },
      onCompleted: ({ login: token }) => {
        const { access_token } = token;
        localStorage.setItem('access_token', access_token);
        handleGetUserData.current();
        setIsLoading(false);
        toast.success('🚀 Đăng nhập thành công', {
          position: 'bottom-right',
        });
      },
      onError: (errors) => {
        setIsLoading(false);
        toast.error(String(errors.message), {
          position: 'bottom-right',
        });
      },
    });
  };
  const sign_out = () => {
    setIsLoading(true);
    setUser(null);
    localStorage.removeItem('access_token');
    signOut(authentication)
      .then(() => {
        toast.success('Đăng xuất thành công', {
          position: 'bottom-right',
        });
      })
      .catch((errors) => {
        console.error(errors.message);
        toast.error('Lỗi đăng xuất Firebase', {
          position: 'bottom-right',
        });
      });
    setIsLoading(false);
  };
  const signUp = ({ username, email, password }) => {
    setIsLoading(true);
    createAccount({
      variables: {
        email,
        password,
        fullName: username,
      },
      onCompleted: ({ createAccount: authData }) => {
        const { access_token } = authData;
        localStorage.setItem('access_token', access_token);
        handleGetUserData.current(access_token);
        setIsLoading(false);
        toast.success('🚀 Đăng ký thành công', {
          position: 'bottom-right',
        });
      },
      onError: (errors) => {
        setIsLoading(false);
        toast.error(String(errors.message), {
          position: 'bottom-right',
        });
      },
    });
  };
  return {
    user,
    isLoading,
    signInWithAccount,
    signInWithSocial,
    sign_out,
    signUp,
  };
}
