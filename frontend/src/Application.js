import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import pkg from '../package.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const name = useState(
    pkg.name
  );
  const version = useState(
    pkg.version
  );

  const versionstate = useState(
    pkg.versionstate
  );

  useEffect(() => {
    document.title = `${title} | React`;
  }, [title]);

  return (
    <AppContext.Provider value={{ navigate, setTitle, version, versionstate, name }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
