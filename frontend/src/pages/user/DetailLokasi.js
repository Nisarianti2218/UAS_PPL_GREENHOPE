import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import lokasiList from "../../data/lokasiList";
import "../../styles/user/DetailLokasi.css";

import update1 from "../../assets/update1.png";
import update2 from "../../assets/update2.png";

import axios from "axios";

import lokasi1 from "../../assets/lokasi1.png";

const LOCATION_URL = `${process.env.REACT_APP_BASE_URL}/locations`;
const LAPORAN_URL = `${process.env.REACT_APP_BASE_URL}/reports`;

export default function DetailLokasi() {
  const { lokasiID } = useParams();
  console.log("ID Lokasi:", lokasiID);
  const navigate = useNavigate();

  const [lokasi, setLokasi] = useState(null);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchLocations(lokasiID);
    fetchReports(lokasiID);
  }, [lokasiID]);
  const fetchLocations = async (lokasiID) => {
    try {
      const res = await axios.get(`${LOCATION_URL}/${lokasiID}`);
      setLokasi(res.data);
    } catch (err) {
      console.error("Gagal mengambil data lokasi", err);
    }
  };

  const fetchReports = async (locationId) => {
    try {
      const res = await axios.get(`${LAPORAN_URL}/location/${locationId}`);
      setReports(res.data);
    } catch (err) {
      console.error("Gagal ambil laporan", err);
    }
  };

  if (!lokasi) {
    return (
      <div className="detail-container">
        <button onClick={() => navigate(-1)} className="back-button">
          ← Kembali
        </button>
        <p>Data lokasi tidak ditemukan.</p>
      </div>
    );
  }

  // Fungsi untuk navigasi ke halaman FormDonasi dengan nama lokasi
  const handleDonasi = () => {
    navigate(`/formdonasi/${lokasiID}`);
  };

  return (
    <div>
      {/* Sticky Header */}
      <div className="sticky-header">
        <div className="header-content" onClick={() => navigate(-1)}>
          <span className="back-arrow">←</span>
          <span className="header-title">
            Detail Lokasi {lokasi.name}{" "}
            <span className="text-gray-500">({lokasi.address})</span>
          </span>
        </div>
      </div>

      {/* Gambar Fullwidth */}
      <div className="fullwidth-image-wrapper">
        <img
          src={
            lokasi.image
              ? `${process.env.REACT_APP_MEDIA_URL}/${lokasi.image}`
              : lokasi1
          }
          alt={lokasi.name}
          className="detail-img"
        />
      </div>

      {/* Konten Detail */}
      <div className="detail-container">
        <button className="donasi-btn" onClick={handleDonasi}>
          Donasi Sekarang
        </button>

        <h2 className="section-title">
          Deskripsi Lokasi & Kebutuhan Penghijauan
        </h2>
        <div className="info-grid">
          <div className="info-box">
            <img src="/icons/dunia.png" alt="Alasan" className="icon" />
            <h4>Alasan Penghijauan</h4>
            <p>
              {lokasi.alasan ||
                "Meningkatkan kualitas udara serta menyediakan ruang terbuka hijau."}
            </p>
          </div>
          <div className="info-box">
            <img src="/icons/tree.png" alt="Jenis Pohon" className="icon" />
            <h4>Jenis Pohon</h4>
            <p>
              {lokasi.jenisPohon ||
                "Trembesi, mangga, dan tanaman peneduh lainnya."}
            </p>
          </div>
          <div className="info-box">
            <img src="/icons/target.png" alt="Target" className="icon" />
            <h4>Target Penghijauan</h4>
            <p>{lokasi.target || "Target penghijauan sekitar 10.000 pohon."}</p>
          </div>
        </div>

        <h2 className="section-title">Statistik Donasi & Progress</h2>
        <div className="stat-grid">
          <div className="stat-box">
            <img src="/icons/people.png" alt="Donatur" className="icon-sm" />
            <p className="stat-value">250</p>
            <p className="stat-label">Donatur</p>
          </div>
          <div className="stat-box">
            <img src="/icons/tree.png" alt="Total Pohon" className="icon-sm" />
            <p className="stat-value">1.200</p>
            <p className="stat-label">Total Pohon Ditanam</p>
          </div>
          <div className="stat-box">
            <img src="/icons/graphic.png" alt="Progress" className="icon-sm" />
            <p className="stat-value">40%</p>
            <p className="stat-label">Progress</p>
          </div>
        </div>

        <h2 className="section-title">Update Proyek</h2>
        <div className="update-grid">
          {reports.length === 0 ? (
            <p className="has-text-grey">Belum ada laporan untuk lokasi ini.</p>
          ) : (
            <div className="columns is-multiline">
              {reports.map((report) => (
                <div className="column is-12" key={report._id}>
                  <div className="box">
                    <p className="has-text-grey is-size-7 mb-2">
                      {new Date(report.reportDate).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <div className="columns is-mobile">
                      <div className="column">
                        <figure className="image is-4by3">
                          <img
                            src={`${process.env.REACT_APP_MEDIA_URL}/${report.photoBefore}`}
                            alt="Sebelum"
                          />
                        </figure>
                        <p className="is-size-7 has-text-centered mt-1">
                          Sebelum
                        </p>
                      </div>
                      <div className="column">
                        <figure className="image is-4by3">
                          <img
                            src={`${process.env.REACT_APP_MEDIA_URL}/${report.photoAfter}`}
                            alt="Sesudah"
                          />
                        </figure>
                        <p className="is-size-7 has-text-centered mt-1">
                          Sesudah
                        </p>
                      </div>
                    </div>
                    <p className="mt-2">{report.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
