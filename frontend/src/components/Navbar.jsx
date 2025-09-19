import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center border-b border-[#b0cece]">
      <Link to="/" className="font-bold text-xl text-[#0c2543] hover:text-[#0e6994] transition">
        AES Platform
      </Link>
      
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            <span className="text-[#0e6994] font-medium">Welcome, {user.name}</span>
            <button 
              onClick={logout} 
              className="px-4 py-2 bg-[#e18891] text-white rounded-lg hover:bg-[#d44719] transition font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="px-4 py-2 bg-[#0e6994] text-white rounded-lg hover:bg-[#0c2543] transition font-medium"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}