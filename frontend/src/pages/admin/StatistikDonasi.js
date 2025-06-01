import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/admin";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const STATISTIC_URL = `${process.env.REACT_APP_BASE_URL}/statistik`;

const StatistikDonasi = () => {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [distribution, setDistribution] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [summaryRes, monthlyRes, distRes] = await Promise.all([
        axios.get(`${STATISTIC_URL}/summary`),
        axios.get(`${STATISTIC_URL}/monthly`),
        axios.get(`${STATISTIC_URL}/distribution`),
      ]);

      setSummary(summaryRes.data);
      setMonthly(monthlyRes.data);
      setDistribution(distRes.data);
    } catch (err) {
      console.error("Gagal ambil data statistik", err);
    }
  };

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];

  const monthlyData = {
    labels: monthLabels,
    datasets: [
      {
        label: "Jumlah Pohon Didonasikan",
        data: monthLabels.map((_, i) => {
          const found = monthly.find((m) => m._id === i + 1);
          return found ? found.total : 0;
        }),
        fill: false,
        backgroundColor: "#388e3c",
        borderColor: "#2e7d32",
        tension: 0.3,
      },
    ],
  };

  const distributionData = {
    labels: distribution.map((d) => d.location),
    datasets: [
      {
        label: "Jumlah Pohon",
        data: distribution.map((d) => d.total),
        backgroundColor: [
          "#66bb6a",
          "#43a047",
          "#81c784",
          "#388e3c",
          "#2e7d32",
        ],
      },
    ],
  };

  return (
    <AdminLayout>
      <section className="section">
        <div className="container">
          <h1 className="title is-4 has-text-success-dark">Statistik Donasi</h1>

          {/* Ringkasan */}
          {summary && (
            <div className="columns is-multiline mb-5">
              <div className="column is-3">
                <div className="box has-text-centered">
                  <p className="title is-4 has-text-success">
                    {summary.totalUsers}
                  </p>
                  <p className="subtitle is-6">Total Pengguna</p>
                </div>
              </div>
              <div className="column is-3">
                <div className="box has-text-centered">
                  <p className="title is-4 has-text-success">
                    {summary.totalDonations}
                  </p>
                  <p className="subtitle is-6">Total Donasi (Pohon)</p>
                </div>
              </div>
              <div className="column is-3">
                <div className="box has-text-centered">
                  <p className="title is-4 has-text-success">
                    {summary.totalLocations}
                  </p>
                  <p className="subtitle is-6">Area Penghijauan</p>
                </div>
              </div>
              <div className="column is-3">
                <div className="box has-text-centered">
                  <p className="title is-4 has-text-success">
                    {summary.totalReports}
                  </p>
                  <p className="subtitle is-6">Total Laporan</p>
                </div>
              </div>
            </div>
          )}

          {/* Grafik Garis */}
          <div className="box mb-5">
            <h2 className="subtitle is-5">Grafik Penanaman Pohon per Bulan</h2>
            <Line data={monthlyData} />
          </div>

          {/* Pie dan Bar */}
          <div className="columns">
            <div className="column">
              <div className="box">
                <h2 className="subtitle is-5">Distribusi Donasi (Pie)</h2>
                <Pie data={distributionData} />
              </div>
            </div>
            <div className="column">
              <div className="box">
                <h2 className="subtitle is-5">Distribusi Donasi (Bar)</h2>
                <Bar data={distributionData} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default StatistikDonasi;
