import CirclePagination from "../../../components/common/CirclePagination"
import Details from "../../../components/main-view/account/setUp/Details"
import Welcome from "../../../components/main-view/account/setUp/Welcome"
import PrimaryButton from "../../../components/ui/PrimaryButton"
import { useSearchParams } from "react-router"

const pages = [
  Welcome,
  Details
]

const SetUp = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = pages.length;

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const ActivePage = pages[currentPage - 1];

  const setCurrentPage = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center p-5 min-h-screen">
      <div className="flex flex-col shadow-custom p-5 rounded-xl w-full max-w-120">
        <div className="flex-1 flex flex-col items-center">
          {ActivePage ? <ActivePage next={handleNextPage}/> : <div>Page not found</div>}
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