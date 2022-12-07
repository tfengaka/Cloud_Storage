import { createContext, useContext, useState } from 'react';

const FolderContext = createContext();
export function useMyFolder() {
  return useContext(FolderContext);
}
export function FolderProvider({ children }) {
  const value = useFolderProvider();
  return <FolderContext.Provider value={value}>{children}</FolderContext.Provider>;
}

function useFolderProvider() {
  const [folders, setFolders] = useState([]);

  const resetPath = () => setFolders([]);
  const currentFolder = folders ? folders[folders.length - 1] : null;
  return {
    folders,
    currentFolder,
    resetPath,
    setFolders,
  };
}
