import React, { useEffect } from "react";
import "./style.css";

const NotificationBox = ({ notifications, onRemove }) => {
  return (
    <div className="notification-box">
      {notifications.map(({ id, message }) => (
        <Notification key={id} message={message} onClose={() => onRemove(id)} />
      ))}
    </div>
  );
};

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="notification">
      <div className="text">
        <i className="fa fa-info-circle" aria-hidden="true"></i>
        <span>{message}</span>
      </div>
      <div className="progress"></div>
    </div>
  );
};

export default NotificationBox;
