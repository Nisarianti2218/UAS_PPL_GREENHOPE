import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/user/FormDonasi.css";
import bg2 from "../../assets/bg2.png";
import logo from "../../assets/logo.png";
import axios from "axios";
const DONATION_URL = `${process.env.REACT_APP_BASE_URL}/donations`;

export default function FormDonasi() {
  const { lokasiID } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const donorName = form.nama.value.trim() || "Donatur Anonim";
    const donorEmail = form.kontak.value.trim();
    const amount = form.jumlah.value.trim();
    const metode = form.metode.value.trim();

    if (!donorEmail || !amount || !metode) {
      alert("Mohon lengkapi semua field wajib.");
      return;
    }

    const data = new FormData();
    data.append("donorName", donorName);
    data.append("donorEmail", donorEmail);
    data.append("locationId", lokasiID);
    data.append("amount", amount);
    data.append("donationDate", new Date().toISOString());

    await axios
      .post(DONATION_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        // Reset form setelah berhasil submit
        const donasiID = response.data.donation._id;
        form.reset();
        data.delete("donorName");
        data.delete("donorEmail");
        data.delete("locationId");
        data.delete("amount");
        data.delete("donationDate");
        // Kirim data ke halaman konfirmasi
        navigate(`/KonfirmasiPembayaran/${donasiID}`);
      })
      .catch((error) => {
        console.error("Gagal menambah donasi", error);
        alert("Gagal menambah donasi: " + error.response.data.message);
      });
  };

  return (
    <div className="form-page" style={{ backgroundImage: `url(${bg2})` }}>
      <div className="form-wrapper">
        <div className="form-header">
          <img src={logo} alt="Logo" className="form-logo" />
          <h1 className="form-title">Formulir Donasi</h1>
        </div>

        <form id="donationForm" onSubmit={handleSubmit}>
          <label>Nama Lengkap (Opsional bisa anonim)</label>
          <input type="text" name="nama" />

          <label>Email/Nomor HP (untuk konfirmasi donasi)</label>
          <input type="text" name="kontak" required />

          <label>Jumlah Pohon yang ingin Didonasikan</label>
          <input type="number" name="jumlah" required min="1" />

          <label>Metode Pembayaran</label>
          <select name="metode" required>
            <option value="">-- Pilih --</option>
            <option value="transfer">Transfer Bank</option>
            <option value="ewallet">E-Wallet</option>
            <option value="qris">QRIS</option>
            <option value="cash">Tunai</option>
          </select>

          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
