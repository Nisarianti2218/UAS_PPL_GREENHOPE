import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import "../../styles/admin/style.css"; // Pastikan path ini sesuai dengan struktur folder Anda
import "bulma/css/bulma.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const AdminLayout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError, user } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/login");
    }
    if (user && user.role !== "admin") {
      navigate("/forbiden");
    }
  }, [isError, user, navigate]);

  return (
    <React.Fragment>
      {/* <div className="flex flex-col h-full"> */}
      <Navbar />
      <div
        className="columns mt-6"
        style={{ minHeight: "100vh", backgroundColor: "#2e7d32" }}
      >
        <div className="column is-2" style={{ backgroundColor: "#2e7d32" }}>
          <Sidebar />
        </div>
        <div className="column has-background-light">
          <main>{children}</main>
        </div>
      </div>
      {/* </div> */}
    </React.Fragment>
  );
};

export default AdminLayout;
