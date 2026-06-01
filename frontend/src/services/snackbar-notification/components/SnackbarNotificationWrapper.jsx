import { createContext, useState, useCallback } from "react"
import SnackbarNotification from "./SnackbarNotification";
import { AnimatePresence } from "motion/react"

export const SnackbarNotificationContext = createContext();

const SnackbarNotificationWrapper = ({children}) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = "INFO", duration = 3000) => {
    const id = Date.now() + type;
    
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove after the duration expires
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    }, duration);
  }, []);

  const closeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, [notifications])

  return (
    <SnackbarNotificationContext.Provider value={{ showNotification }}>
      {children}
      
      <div className="fixed bottom-0 z-200 right-0 p-2  lg:p-4 flex flex-col gap-3 overflow-hidden">
        <AnimatePresence>
          {notifications.map(notif => (<SnackbarNotification key={notif.id} id={notif.id}close={closeNotification} type={notif.type} message={notif.message}/>))}
        </AnimatePresence>
      </div>
      
    </SnackbarNotificationContext.Provider>
  )
}
export default SnackbarNotificationWrapper