const SecondaryButton = ({type="button", className, onClick = function() {}, children}) => {
  return (
    <button
      className={`px-6 py-2 text-md border font-medium rounded-md hover:scale-105 transition-all duration-200 cursor-pointer ${className}`}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
export default SecondaryButton