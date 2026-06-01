import CirclePagination from "../../../components/common/CirclePagination"
import Details from "../../../components/main-view/account/setUp/Details"
import Welcome from "../../../components/main-view/account/setUp/Welcome"
import { useSearchParams } from "react-router"
import { motion } from "motion/react"
import Username from "../../../components/main-view/account/setUp/Username"

const pages = [
  Welcome,
  Details,
  Username
]

const SetUp = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const totalPages = pages.length;

  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const setCurrentPage = (newPage) => {
    setSearchParams({ page: newPage });
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      console.log("Setup complete!");
    }
  };

  return (
    <div className="flex justify-center flex-col items-center min-h-screen p-5 relative overflow-hidden">
      
      <div className="relative flex items-center justify-center h-180 w-full max-w-120 overflow-visible">
        {pages.map((PageComponent, index) => {
          // Convert 0-based map index to match your 1-based currentPage variable
          const pageNumber = index + 1;
          const position = pageNumber - currentPage;
          const isActive = position === 0;

          // Carousel animation logic
          const cardVariants = {
            animate: {
              x: position * 200, 
              scale: isActive ? 1 : 0.85,
              zIndex: isActive ? 10 : 1,
              opacity: Math.abs(position) > 1 ? 0 : isActive ? 1 : 0.8,
              filter: isActive ? "blur(0px)" : "blur(6px)",
              // Prevents background cards from capturing mouse events/clicks
              pointerEvents: isActive ? "auto" : "none",
            },
          };

          return (
            <motion.div
              key={pageNumber}
              variants={cardVariants}
              animate="animate"
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="absolute top-0 left-0 w-full h-full bg-white shadow-custom p-6 py-8 rounded-xl flex flex-col box-border"
            >
              <PageComponent next={handleNextPage} />
            </motion.div>
          );
        })}
      </div>

      <CirclePagination
        currentPage={currentPage}
        totalPages={totalPages}
        className="mt-6 z-20" 
      />

      {/* Grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:4rem_4rem] mask-[radial-gradient(ellipse_70%_70%_at_50%_50%,#000_40%,transparent_100%)]"></div>      
    </div>
  )
}

export default SetUp;