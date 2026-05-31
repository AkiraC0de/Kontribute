import CirclePagination from "../../../components/common/CirclePagination"
import Welcome from "../../../components/main-view/account/setUp/Welcome"
import PrimaryButton from "../../../components/ui/PrimaryButton"
import { useState } from "react"

const SetUp = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  const handleNextPage = () => {
    if(currentPage < totalPages) setCurrentPage(prev => prev + 1);
  }

  return (
    <div className="flex justify-center p-5 min-h-screen">
      <div className="flex flex-col shadow-custom p-5 rounded-xl w-full max-w-120">
        <div className="flex-1 flex items-center">
          {<Welcome next={handleNextPage}/>}
        </div>
        <CirclePagination
          currentPage={currentPage}
          totalPages={totalPages}
          className="mt-4"
        />
      </div>
    </div>
  )
}
export default SetUp