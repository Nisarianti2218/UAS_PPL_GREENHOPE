import React from "react";
import AdminLayout from "../layouts/admin";
import { useNavigate } from "react-router-dom";
import {
  FaHandHoldingUsd,
  FaMapMarkerAlt,
  FaChartBar,
  FaCamera,
  FaFileInvoiceDollar,
} from "react-icons/fa";

const DashboardCard = ({ icon, title, description, onClick }) => (
  <div className="column is-4-desktop is-6-tablet mb-5">
    <div
      className="box has-text-centered p-5 has-background-white"
      style={{ cursor: "pointer", borderRadius: "8px" }}
      onClick={onClick}
    >
      <span
        className="icon is-large has-text-success mb-3"
        style={{ fontSize: "2rem" }}
      >
        {icon}
      </span>
      <h2 className="title is-5 has-text-black">{title}</h2>
      <p className="has-text-grey">{description}</p>
    </div>
  </div>
);

const DashboardAdmin = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <section className="section">
        <div className="container">
          <h1 className="title has-text-success-dark">Beranda</h1>
          <div className="columns is-multiline mt-4">
            <DashboardCard
              icon={<FaHandHoldingUsd />}
              title="Kelola Donasi"
              description="Menampilkan daftar donasi yang masuk"
              onClick={() => navigate("/admin/donasi")}
            />
            <DashboardCard
              icon={<FaMapMarkerAlt />}
              title="Kelola Lokasi Penghijauan"
              description="Tambah/edit/hapus lokasi penghijauan"
              onClick={() => navigate("/admin/lokasi")}
            />
            <DashboardCard
              icon={<FaCamera />}
              title="Update Laporan Penghijauan"
              description="Upload Foto Perkembangan Penghijauan"
              onClick={() => navigate("/admin/laporan")}
            />
            <DashboardCard
              icon={<FaFileInvoiceDollar />}
              title="Update Bukti Pembayaran"
              description="Verifikasi Bukti Pembayaran"
              onClick={() => navigate("/admin/verifikasi")}
            />
            <DashboardCard
              icon={<FaChartBar />}
              title="Statistik Donasi"
              description="Melihat Total Donasi Terkumpul"
              onClick={() => navigate("/admin/statistik")}
            />
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default DashboardAdmin;
