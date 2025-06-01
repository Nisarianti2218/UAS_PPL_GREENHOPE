import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/user/LokasiDonasi.css";
import axios from "axios";

import lokasi1 from "../../assets/lokasi1.png";
import coverImg from "../../assets/bg2.png";

const LOCATION_URL = `${process.env.REACT_APP_BASE_URL}/locations`;

export default function LokasiDonasi() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);
  const fetchLocations = async () => {
    try {
      const res = await axios.get(LOCATION_URL);
      setLocations(res.data);
    } catch (err) {
      console.error("Gagal mengambil data lokasi", err);
    }
  };

  const handleCardClick = (lokasiID) => {
    navigate(`/lokasi/${lokasiID}`);
  };

  return (
    <div className="lokasi-container">
      {/* Header */}
      <div className="cover" style={{ backgroundImage: `url(${coverImg})` }}>
        <div className="back-button" onClick={() => navigate("/")}>
          ←
        </div>
        <div className="cover-content">
          <h1 className="cover-title">
            Bantu <span style={{ color: "#4ade80" }}>Hijaukan</span> Bumi,
          </h1>
          <h2 className="cover-subtitle">Satu Pohon Sekaligus!</h2>
        </div>
      </div>

      {/* Title tetap di atas */}
      <div className="lokasi-heading-wrapper">
        <h3 className="lokasi-heading">Pilih Lokasi Penghijauan:</h3>
      </div>

      {/* Scrollable content */}
      <div className="scrollable-list">
        {locations.map((loc) => (
          <div
            key={loc._id}
            className="lokasi-card"
            onClick={() => handleCardClick(loc._id)}
          >
            <img
              src={
                loc.image
                  ? `${process.env.REACT_APP_MEDIA_URL}/${loc.image}`
                  : lokasi1
              }
              alt={loc.name}
              className="lokasi-img"
            />

            <div>
              <h4 className="text-md font-semibold">
                {loc.name}{" "}
                <span className="text-gray-500">({loc.address})</span>
              </h4>
              <p className="text-sm text-gray-700 mt-1">{loc.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
