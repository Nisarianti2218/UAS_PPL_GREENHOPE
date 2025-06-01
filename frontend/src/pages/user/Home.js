import React, { useState, useEffect } from "react";
import "../../styles/user/Home.css";
import fotoDonatur from "../../assets/foto.png";
import { Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const STATISTIC_URL = `${process.env.REACT_APP_BASE_URL}/statistik`;

function Home() {
  const [komentar, setKomentar] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${STATISTIC_URL}/donor-count`);
      setData(response.data);
      console.log("Data statistik:", response.data);
    } catch (error) {
      console.error("Gagal mengambil data statistik:", error);
    }
  };

  const handleKirim = () => {
    if (komentar.trim() !== "") {
      alert(`Komentar dikirim: ${komentar}`);
      setKomentar("");
    }
  };

  const handleDonasi = () => {
    navigate("/donasi");
  };

  return (
    <div className="home">
      <div className="headerContainer">
        <div className="headerContent">
          <h1>GreenHope</h1>
          <h2>Platform Donasi Pohon untuk Penghijauan Daerah</h2>
          <p>
            Bantu menghijaukan daerah yang membutuhkan dengan donasi pohon.
            Pilih lokasi, tentukan jumlah pohon, dan kami akan lakukan sisanya.
          </p>
          <button className="donateButton" onClick={handleDonasi}>
            Donasi Sekarang
          </button>
        </div>
      </div>

      <section className="reasonsSection">
        <h2>Alasan Berdonasi di GreenHope</h2>
        <div className="reasonsContainer">
          <div className="reasonCard">
            <img src="/icons/pohon.png" alt="Tree Icon" />
            <h3>Dampak Nyata</h3>
            <p>
              Pohon yang Anda donasikan langsung ditanam di lokasi yang
              membutuhkan.
            </p>
          </div>
          <div className="reasonCard">
            <img src="/icons/search.png" alt="Search Icon" />
            <h3>Transparan dan Terpercaya</h3>
            <p>
              Kami menyediakan laporan berkala dan foto perkembangan
              penghijauan.
            </p>
          </div>
          <div className="reasonCard">
            <img src="/icons/uang.png" alt="Money Icon" />
            <h3>Mudah & Terjangkau</h3>
            <p>
              Donasi mulai dari Rp 10.000 per pohon, proses mudah tanpa
              kerumitan.
            </p>
          </div>
          <div className="reasonCard">
            <img src="/icons/dunia.png" alt="Earth Icon" />
            <h3>Bantu Lingkungan & Iklim</h3>
            <p>
              Pohon membantu menyerap CO₂ dan memperbaiki ekosistem yang rusak.
            </p>
          </div>
        </div>
      </section>

      <section className="alurSection">
        <h2>Alur Donasi</h2>
        <div className="alurContainer">
          <div className="alurItem">
            <span className="circle">1</span>
            <h3>Pilih Lokasi</h3>
            <p>Pilih lokasi yang telah dikurasi untuk penghijauan</p>
          </div>
          <div className="alurItem">
            <span className="circle">2</span>
            <h3>Isi Formulir</h3>
            <p>Lengkapi formulir donasi dan lakukan pembayaran</p>
          </div>
          <div className="alurItem">
            <span className="circle">3</span>
            <h3>Konfirmasi</h3>
            <p>Konfirmasi Pembayaran dan Donasi</p>
          </div>
        </div>
      </section>

      <section className="statistikSection">
        <h2>Statistik Penghijauan</h2>
        <div className="statistikContainer">
          <div className="statItem">
            <img src="/icons/tree.png" alt="Tree Icon" />
            <h3>{data.totalTreesAccepted?.toLocaleString("id-ID") || "0"}</h3>
            <p>Total Pohon Diterima</p>
          </div>
          <div className="statItem">
            <img src="/icons/location.png" alt="Location Icon" />
            <h3>{data.totalActiveLocations?.toLocaleString("id-ID") || "0"}</h3>
            <p>Lokasi Penghijauan</p>
          </div>
          <div className="statItem">
            <img src="/icons/people.png" alt="People Icon" />
            <h3>{data.totalDonors?.toLocaleString("id-ID") || "0"}</h3>
            <p>Donatur</p>
          </div>
        </div>
      </section>

      <section className="testimoniSection">
        <h2>Testimoni Donatur & Komunitas</h2>
        <div className="testimoniContainer">
          <img
            src={fotoDonatur}
            alt="Foto Donatur"
            className="testimoniImage"
          />
          <blockquote>
            “Saya bangga dapat berkontribusi untuk penghijauan dan melihat
            dampak positifnya bagi lingkungan.”
          </blockquote>
        </div>

        <div className="komentarFormHorizontal">
          <input
            type="text"
            value={komentar}
            onChange={(e) => setKomentar(e.target.value)}
            placeholder="Tambahkan Komentar..."
          />
          <button onClick={handleKirim}>
            <Send size={20} color="#000000" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;
