import { motion } from "motion/react"; 

const CirclePagination = ({
  currentPage = 1,
  setCurrentPage,
  totalPages = 3,
  className = "",
  circleSize = "10px",
}) => {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {Array.from({ length: totalPages }, (_, i) => {
        const pageNumber = i + 1;
        const isActive = currentPage === pageNumber;

        return (
          <div
            key={pageNumber}
            className="relative flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            style={{ width: circleSize, height: circleSize }}
          >
            {/* Background Circle Track */}
            <div className="absolute inset-0 bg-gray-300 rounded-full transition-colors duration-200 hover:bg-gray-600" />

            {/* Active Highlight Circle */}
            {isActive && (
              <motion.div
                layoutId="activeCircle"
                className="absolute inset-0 bg-primary rounded-full"
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CirclePagination;