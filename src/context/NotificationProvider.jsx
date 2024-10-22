import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);

  return (
    <NotificationContext.Provider value={{message, setMessage, open, setOpen}}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  return useContext(NotificationContext);
};