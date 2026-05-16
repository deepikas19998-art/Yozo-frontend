import { createContext, useEffect, useState } from "react";

export const SavedContext = createContext();

const SavedProvider = ({ children }) => {

  const [savedVideos, setSavedVideos] = useState([]);

  useEffect(() => {

    const stored =
      JSON.parse(localStorage.getItem("savedVideos")) || [];

    setSavedVideos(stored);

  }, []);

  return (
    <SavedContext.Provider
      value={{
        savedVideos,
        setSavedVideos,
      }}
    >
      {children}
    </SavedContext.Provider>
  );
};

export default SavedProvider;