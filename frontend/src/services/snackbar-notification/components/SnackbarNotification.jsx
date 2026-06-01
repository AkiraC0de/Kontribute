import { Check, X, Info, AlertCircle, AlertTriangle } from "lucide-react"
import {motion} from "motion/react"

const NOTIFICATION_TYPES = {
  SUCCESS: {
    icon: Check,
    bgColor: "bg-green-500",
  },
  FAILED: {
    icon: AlertTriangle,
    bgColor: "bg-red-500",
  },
  WARNING: {
    icon: AlertCircle,
    bgColor: "bg-amber-500",
  },
  INFO: {
    icon: Info,
    bgColor: "bg-sky-500",
  },
}

const Icon = ({ type }) => {
  const config = NOTIFICATION_TYPES[type] || NOTIFICATION_TYPES.INFO
  const LucideIcon = config.icon

  return (
    <div className={`${config.bgColor} rounded-full p-2 flex items-center justify-center snap-icon`}>
      <LucideIcon color="white" stroke="white" strokeWidth={3} size={20} />
    </div>
  )
}

const SnackbarNotification = ({id, type, message, close}) => {
  console.log(type)
  return (
    <motion.div 
      key={id}
      initial={{ x: "100%", opacity: 0 }}  
      animate={{ x: 0, opacity: 1 }}       
      exit={{ x: "100%", opacity: 0 }}     
      transition={{ duration: 0.5 }}
      className="p-2 bg-white shadow-custom-sm rounded-xl w-75 lg:w-80 flex items-center">
      <div className="flex-1 flex gap-2 items-center">
        <Icon type={type}/>
        <p className="font-medium text-xs lg:text-sm flex-1 line-clamp-1 text-black">{message}</p>
      </div>
      <button onClick={() => close(id)} className="w-10 p-2 rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer">
        <X color="black"/>
      </button>
    </motion.div>
  )
}



export default SnackbarNotification