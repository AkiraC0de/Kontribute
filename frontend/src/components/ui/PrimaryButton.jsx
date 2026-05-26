const PrimaryButton = ({type="button", className, onClick, children, ...props}) => {
  return (
    <button
      className={`bg-primary-light px-6 py-3 text-white text-md font-medium rounded-md hover:scale-105 transition-all duration-200 cursor-pointer ${className}`}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
export default PrimaryButton