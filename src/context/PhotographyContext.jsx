/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

const PhotographyContext = createContext();

export const PhotographyProvider = ({ children }) => {
  const [method, setMethod] = useState(null);
  const [photoCount, setPhotoCount] = useState(6);
  const [photos, setPhotos] = useState([]);
  const [frame, setFrame] = useState(null);
  const [framePhotosMapping, setFramePhotosMapping] = useState({});
  const [deletedPhotos, setDeletedPhotos] = useState([]);
  const [retakenPhotos, setRetakenPhotos] = useState([]);

  const addDeletedPhoto = (photoData) => {
    setDeletedPhotos(prev => [...prev, photoData]);
  };

  const addRetakenPhoto = (photoData) => {
    setRetakenPhotos(prev => [...prev, photoData]);
  };

  const resetAll = () => {
    setMethod(null);
    setPhotoCount(6);
    setPhotos([]);
    setFrame(null);
    setFramePhotosMapping({});
    setDeletedPhotos([]);
    setRetakenPhotos([]);
  };

  return (
    <PhotographyContext.Provider value={{
      method, setMethod,
      photoCount, setPhotoCount,
      photos, setPhotos,
      frame, setFrame,
      framePhotosMapping, setFramePhotosMapping,
      deletedPhotos, addDeletedPhoto,
      retakenPhotos, addRetakenPhoto,
      resetAll
    }}>
      {children}
    </PhotographyContext.Provider>
  );
};

export const usePhotography = () => {
  const context = useContext(PhotographyContext);
  if (!context) {
    throw new Error('usePhotography must be used within PhotographyProvider');
  }
  return context;
};
