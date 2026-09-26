import { AiOutlineSearch } from "react-icons/ai";
import { KeyboardEvent, ChangeEvent } from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion

interface NavbarSearchProps {
  searching: boolean;
  setSearching: (searching: boolean) => void;
  isMobile: boolean;
  handleSearchValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
  searchValue?: string;
  handleSearchRedirect: () => void;
}

const NavbarSearch: React.FC<NavbarSearchProps> = ({
  searching,
  setSearching,
  isMobile,
  handleSearchValueChange,
  searchValue,
  handleSearchRedirect,
}) => {
  // Define animation variants
  const searchVariants = {
    expanded: { width: "100%", transition: { duration: 0.5 } },
    collapsed: { width: "28rem", transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={`rounded-full border-2 border-gray-200 text-gray-400 flex justify-between items-center gap-x-3 sm:px-3 sm:py-1 transition-all ease-in-out duration-500 ${isMobile ? "hidden" : ""}`}
      initial={searching ? "expanded" : "collapsed"}
      animate={searching ? "expanded" : "collapsed"}
      variants={searchVariants}
    >
      <div
        className={`outline-none border-none text-slate-600 bg-transparent w-full select-none cursor-pointer text-nowrap overflow-hidden text-ellipsis transition-all ease-in-out duration-500`}
        onClick={() => setSearching(true)}
        onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key === "Enter") setSearching(true);
        }}
        tabIndex={0}
      >
        {searching ? (
          <input
            autoFocus
            onChange={handleSearchValueChange}
            value={searchValue}
            className={`border-none w-full outline-none ${searching ? "inline-block" : "hidden"}`}
            type="text"
            placeholder="Search Product"
            onBlur={() => setSearching(false)}
            onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                setSearching(false);
                handleSearchRedirect();
              }
            }}
          />
        ) : (
          searchValue || "Search Product"
        )}
      </div>
      <div
        className="rounded-full hover:bg-gray-200 min-h-7 min-w-7 max-h-7 max-w-7 flex justify-center items-center cursor-pointer"
        onClick={handleSearchRedirect}
        onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
          if (e.key === "Enter") {
            handleSearchRedirect();
          }
        }}
        tabIndex={0}
      >
        <AiOutlineSearch size={18} />
      </div>
    </motion.div>
  );
};

export default NavbarSearch;
