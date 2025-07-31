  import React, { createContext, useContext, useEffect, useState } from 'react';
  import { useNavigate } from "react-router-dom";
  import NotificationBox from "./components/notification/comp";
  import logo from './imgs/logo.png';
  import pkg from '../package.json';

  const AppContext = createContext();

  export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
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

    const addNotification = (message) => {
      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { id, message }]);
    };

    const removeNotification = (id) => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    };


    return (
      <AppContext.Provider value={{ navigate, setTitle, version, versionstate, name, logo, org, addNotification }}>
        {children}
        <NotificationBox
          notifications={notifications}
          onRemove={removeNotification}
        />
      </AppContext.Provider>
    );
  };

  export const useAppContext = () => useContext(AppContext);
