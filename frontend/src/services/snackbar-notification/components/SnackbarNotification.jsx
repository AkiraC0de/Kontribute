const SnackbarNotification = ({type, message}) => {
  return (
    <div className="px-4 py-2 bg-white rounded-md w-80">
      <span className="font-medium ">{message}</span>
    </div>
  )
}
export default SnackbarNotification