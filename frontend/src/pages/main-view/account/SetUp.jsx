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
    <div className="flex justify-center items-center min-h-screen p-5">
      <div className="flex flex-col bg-white shadow-custom p-5 h-180 rounded-xl w-full max-w-120">
        <div className="flex-1 flex flex-col items-center">
          {ActivePage ? <ActivePage next={handleNextPage}/> : <div>Page not found</div>}
        </div>
        <CirclePagination
          currentPage={currentPage}
          totalPages={totalPages}
          className="mt-4"
        />
      </div>
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-ful bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>      
    </div>
  )
}
export default SetUp