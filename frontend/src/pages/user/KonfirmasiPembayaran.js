import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/user/KonfirmasiPembayaran.css";
import logo from "../../assets/logo.png";
import bsiLogo from "../../assets/bsi.png";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

export default function KonfirmasiPembayaran() {
  const navigate = useNavigate();
  const { donationID } = useParams();

  const [donation, setDonation] = useState(null);
  const [formData, setFormData] = useState({
    paymentProof: null,
  });

  useEffect(() => {
    fetchDonation(donationID);
  }, [donationID]);

  const fetchDonation = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/donations/${id}`);
      //   console.log("Donation Data:", res.data);
      setDonation(res.data);
    } catch (err) {
      console.error("Gagal mengambil data lokasi", err);
    }
  };

  const handleConfirm = async (id) => {
    try {
      const form = new FormData();
      form.append("paymentProof", formData.paymentProof);

      await axios
        .post(`${API_BASE_URL}/donations/${id}/upload-proof`, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          // Arahkan kembali ke halaman Home
          navigate("/");
        })
        .catch((err) => {
          console.error("Gagal mengunggah laporan", err);
          throw err;
        });

      setFormData({ paymentProof: null });
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };

  //   console.log("Donation Data:", donation);
  const total = donation ? donation.amount * 10000 : 0;
  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <img src={logo} alt="GreenHope Logo" className="greenhope-logo" />

        <p>
          Terima kasih{" "}
          <strong>{donation?.donor?.name || "Donatur Anonim"}</strong>
        </p>
        <p>atas Donasi yang akan anda berikan pada program:</p>
        <h2 className="program-name">GreenHope!</h2>

        <div className="bank-info">
          <img src={bsiLogo} alt="BSI" className="bank-logo" />
          <div className="bank-text">
            <b>7267986382</b>
            <br />
            Yayasan GreenHope Nasional
          </div>
        </div>

        <div className="tree-info">
          <img src="/icons/tree.png" alt="Tree Icon" className="tree-icon" />
          <div className="tree-text">
            {donation?.amount} Pohon <br />
            Total pembayaran:{" "}
            <strong>Rp {total.toLocaleString("id-ID")}</strong>
          </div>
        </div>

        <p className="transfer-note">
          Harap transfer sesuai nominal di atas agar dapat terkonfirmasi
          otomatis dan kebaikan ini dapat kami laksanakan.
        </p>

        <div className="upload-box">
          <label>Upload bukti pembayaran:</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={(e) =>
              setFormData({ ...formData, paymentProof: e.target.files[0] })
            }
          />
        </div>

        <button
          className="confirm-button"
          onClick={() => handleConfirm(donation?._id)}
          disabled={!donation}
        >
          Konfirmasi Pembayaran
        </button>
      </div>
    </div>
  );
}
