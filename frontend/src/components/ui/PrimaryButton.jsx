const PrimaryButton = ({type="button", className, onClick, children, ...props}) => {
  return (
    <button
      className={`text-sm bg-button px-6 py-2 text-button-text text-md font-medium rounded-md hover:scale-105 transition-all duration-200 cursor-pointer ${className}`}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
export default PrimaryButton