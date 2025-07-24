import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import logo from './imgs/logo.png';
import pkg from '../package.json';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const name = useState(
    pkg.name
  );
  const org = useState(
    pkg.org
  );
  const version = useState(
    pkg.version
  );
  
  const versionstate = useState(
    pkg.versionstate
  );

  useEffect(() => {
    document.title = `${title} | Платформа репликации НСИ`;
  }, [title]);

  return (
    <AppContext.Provider value={{ navigate, setTitle, version, versionstate, name, logo, org }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
