import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoHome, IoLogOut } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { LogOut, reset } from "../features/authSlice";
import {
  FaHandHoldingUsd,
  FaMapMarkerAlt,
  FaChartBar,
  FaCamera,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };

  return (
    <div className="sidebar">
      <aside className="menu pl-4 has-shadow ">
        <div className="flex justify-center py-4">
          {/* <NavLink to={"/dashboard"} className="navbar-item">
            🌿 GreenHope
          </NavLink> */}
        </div>

        {/* <p className="menu-label">General</p> */}
        <ul className="menu-list py-1">
          <li className="py-2">
            <NavLink to="/admin/dashboard" className="menu-item">
              <div className="flex items-center gap-2">
                <IoHome /> Beranda
              </div>
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink to="/admin/donasi" className="menu-item">
              <div className="flex items-center gap-2">
                <FaHandHoldingUsd /> Donasi
              </div>
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink to="/admin/lokasi" className="menu-item">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt /> Lokasi
              </div>
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink to="/admin/laporan" className="menu-item">
              <div className="flex items-center gap-2">
                <FaCamera /> Laporan
              </div>
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink to="/admin/bukti-pembayaran" className="menu-item">
              <div className="flex items-center gap-2">
                <FaFileInvoiceDollar /> Bukti Pembayaran
              </div>
            </NavLink>
          </li>
          <li className="py-2">
            <NavLink to="/admin/statistik-donasi" className="menu-item">
              <div className="flex items-center gap-2">
                <FaChartBar /> Statistik Donasi
              </div>
            </NavLink>
          </li>
        </ul>

        {/* <p className="menu-label">Settings</p> */}
        <ul className="menu-list">
          <li>
            <button
              onClick={logout}
              className="button is-white is-fullwidth menu-item"
            >
              <div className="flex items-center gap-2">
                <IoLogOut /> Log Out
              </div>
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
