const SecondaryButton = ({type="button", className, onClick = function() {}, children, ...props}) => {
  return (
    <button
      className={`text-sm px-6 py-2 text-md border font-medium rounded-md hover:scale-105 transition-all duration-200 cursor-pointer ${className}`}
      type={type}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
export default SecondaryButton