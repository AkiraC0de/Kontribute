import { createContext, useState, useCallback } from "react"
import SnackbarNotification from "./SnackbarNotification";

export const SnackbarNotificationContext = createContext();

const SnackbarNotificationWrapper = ({children}) => {
  const [notifications, setNotifications] = useState([{id: "test", message: "yow"}]);

  const showNotification = useCallback((message, type = "info", duration = 3000) => {
    const id = Date.now();
    
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove after the duration expires
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, duration);
  }, []);

  return (
    <SnackbarNotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="absolute top-0 left-0 bg-amber-200 p-2">
        {notifications.map(notif => (<SnackbarNotification key={notif.id} type={notif.type} message={notif.message}/>))}
      </div>
    </SnackbarNotificationContext.Provider>
  )
}
export default SnackbarNotificationWrapper