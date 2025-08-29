import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; 
import { LuLogOut } from "react-icons/lu";

const Header = () => {
  const { authUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full h-15 flex items-center backdrop-blur-lg bg-white/5 border-b border-white/20 shadow-lg px-4">
      <div className="w-full flex items-center justify-between px-6 py-3">
        
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/favicon.svg"
            alt="QuickChat logo" 
            className="w-8 h-8"
          />
          <span className="text-2xl font-extrabold text-violet-400 bg-clip-text tracking-wide">
            QuickChat 
          </span>
        </Link>
        

        {authUser && (
          <div className="flex items-center gap-4">
            <Link 
              to="/profile" 
              className="flex items-center gap-2 px-4 py-1 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              <img 
                src={authUser.profilePic || "/default-avatar.png"} 
                alt="profile" 
                className="w-11 h-11 rounded-full border border-gray-500"
              />
              {/* <span className="hidden sm:inline text-white font-medium">{authUser.fullName}</span> */}
            </Link>

            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 text-white hover:text-red-400 transition-all duration-300"
            >
              <LuLogOut size={18} />
              <span className="hidden sm:inline font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
