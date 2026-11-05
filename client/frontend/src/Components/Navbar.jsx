import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import logo from "../assets/logo.png"
import { FiLogOut, FiMenu, FiX } from "react-icons/fi"
import toast from 'react-hot-toast'
import axios from 'axios'
import { ServerUrl } from '../App'

function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const [menuOpen, setmenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true })
      setUser(null)
      toast.success("logout successfully")
      navigate("/login")
    } catch (err) {
      toast.error("logout failed")
      console.log(err)
    }
  }

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        <div onClick={() => navigate("/")} className="flex items-center gap-2.5 cursor-pointer">
          <img src={logo} alt="logo" className="h-9 w-auto object-contain" />
          <h1 className="font-bold text-xl text-gray-700 leading-none">
            AV <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-emerald-500">AI</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        {user && (
          <div className="hidden md:flex items-center gap-3.5">
            <button 
              onClick={() => navigate("/builder")} 
              className="px-4 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:opacity-95 shadow-sm hover:shadow transition-all duration-200"
            >
              Builder
            </button>

            <button 
              onClick={() => navigate("/billing")} 
              className="px-4 py-2 text-sm font-medium text-white rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:opacity-95 shadow-sm hover:shadow transition-all duration-200"
            >
              Billing
            </button>

            <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white border border-orange-200 shadow-sm">
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm flex-shrink-0">
                <span>{user?.name?.charAt(0).toUpperCase()}</span>
              </div>

              <div className="text-left">
                <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>

              <button 
                onClick={handleLogout} 
                className="p-2 text-gray-500 hover:text-red-500 transition-colors duration-200 cursor-pointer ml-1"
                title="Logout"
              > 
                <FiLogOut size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Hamburger Toggle */}
        {user && (
          <button 
            onClick={() => setmenuOpen(!menuOpen)}
            className="md:hidden text-gray-600 hover:text-purple-500 transition-colors p-1"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FiX size={22}/> : <FiMenu size={22}/>}
          </button>
        )}
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && user && (
        <div className="md:hidden px-4 pt-3 pb-5 border-t border-orange-100 bg-white/95 backdrop-blur-xl flex flex-col gap-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50/50 border border-orange-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center text-white font-semibold text-base shadow-sm flex-shrink-0">
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <button 
              onClick={() => { navigate("/builder"); setmenuOpen(false); }} 
              className="w-full py-2.5 px-4 text-center text-sm font-medium text-white rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 hover:opacity-95 shadow-sm transition-all duration-200"
            >
              Builder
            </button>

            <button 
              onClick={() => { navigate("/billing"); setmenuOpen(false); }} 
              className="w-full py-2.5 px-4 text-center text-sm font-medium text-white rounded-xl bg-gradient-to-r from-purple-500 to-emerald-500 hover:opacity-95 shadow-sm transition-all duration-200"
            >
              Billing
            </button>

            <button 
              onClick={() => { handleLogout(); setmenuOpen(false); }} 
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 text-sm font-medium text-red-600 rounded-xl bg-red-50 hover:bg-red-100 transition-colors duration-200"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Navbar