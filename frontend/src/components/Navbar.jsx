import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-xl text-blue-600">AES Platform</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span className="text-gray-700">Hi, {user.name}</span>
            <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          </>
        ) : (
          <Link to="/login" className="px-3 py-1 bg-blue-500 text-white rounded">Login</Link>
        )}
      </div>
    </nav>
  );
}
