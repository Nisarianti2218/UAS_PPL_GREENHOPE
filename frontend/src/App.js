import "./App.css";
import Login from "./pages/auth/Login"; // ← Login jangan dari folder /user
import Home from "./pages/user/Home";
import LokasiDonasi from "./pages/user/LokasiDonasi";
import DetailLokasi from "./pages/user/DetailLokasi";
import FormDonasi from "./pages/user/FormDonasi";
import KonfirmasiPembayaran from "./pages/user/KonfirmasiPembayaran";
import DashboardAdmin from "./pages/admin/DashboardAdmin"; // ← halaman admin
import BuktiPembayaran from "./pages/admin/BuktiPembayaran";
import DonasiAdmin from "./pages/admin/DonasiAdmin";
import LaporanAdmin from "./pages/admin/LaporanAdmin";
import LokasiAdmin from "./pages/admin/LokasiAdmin";
import StatistikDonasi from "./pages/admin/StatistikDonasi";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router basename="/">
        <Routes>
          {/* Login halaman umum */}
          <Route path="/login" element={<Login />} />

          {/* Routing untuk user */}
          <Route path="/" element={<Home />} />
          <Route path="/donasi" element={<LokasiDonasi />} />
          <Route path="/lokasi/:lokasiID" element={<DetailLokasi />} />
          <Route path="/formdonasi/:lokasiID" element={<FormDonasi />} />
          <Route
            path="/KonfirmasiPembayaran/:donationID"
            element={<KonfirmasiPembayaran />}
          />

          {/* Routing untuk admin */}
          <Route path="/admin">
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="donasi" element={<DonasiAdmin />} />
            <Route path="bukti-pembayaran" element={<BuktiPembayaran />} />
            <Route path="laporan" element={<LaporanAdmin />} />
            <Route path="lokasi" element={<LokasiAdmin />} />
            <Route path="statistik-donasi" element={<StatistikDonasi />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
