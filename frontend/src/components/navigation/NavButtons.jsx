import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaRegUser, FaChartBar, FaPlus, FaArrowRightFromBracket } from "react-icons/fa6";
import axios from "axios";
import { useParams } from "react-router-dom";

function NavButtons({ onToggleNav, onToggleSidebar }) {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/Login");
  }

  const btnStyles = `hover:text-red text-white transition-colors duration-300 focus`;

  return (
    <div className="flex items-center justify-between gap-7">
      <button className={`3xl:hidden ${btnStyles}`} onClick={onToggleNav}>
        <FaBars className="h-6 w-6" />
      </button>

      

      <Link to={user ? `/Profile/${user.mobileNumber}` : "/Login"} className={btnStyles}>
        <FaRegUser className="h-6 w-6" />
      </Link>

      {user && (
        <button className={btnStyles} onClick={handleLogout} title="خروج">
          <FaArrowRightFromBracket className="h-6 w-6" />
        </button>
      )}

      {/* <button className={btnStyles} onClick={onToggleSidebar}>
        <FaChartBar className="h-6 w-6" />
      </button> */}

      {/* <div className="focus hidden rounded-sm border-2 border-solid border-gray-350 p-1.5 lg:block">
        <Link
          to="/contact"
          className="mr-2 flex items-center justify-between gap-2 text-sm font-bold uppercase text-white outline-none"
        >
          <FaPlus className="h-8 w-8 rounded-sm bg-red p-2 text-white transition-transform duration-1000 hover:rotate-[360deg]" />
          تواصل معنا
        </Link>
      </div> */}
    </div>
  );
}

export default NavButtons;
