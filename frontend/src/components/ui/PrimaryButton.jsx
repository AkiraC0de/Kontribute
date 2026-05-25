const PrimaryButton = ({type="button", onClick = function() {}, children}) => {
  return (
    <button
      className="bg-main-light px-6 py-2 text-white text-md font-bold rounded-md hover:scale-105 transition-all duration-200 cursor-pointer"
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
export default PrimaryButton