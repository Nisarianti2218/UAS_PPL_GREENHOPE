import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/admin";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const BuktiPembayaran = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/donations`);
      setPayments(res.data);
    } catch (err) {
      console.error("Gagal mengambil data donasi:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_BASE_URL}/donations/${id}/status`, { status });
      fetchPayments(); // Refresh setelah update
    } catch (err) {
      console.error("Gagal update status:", err);
    }
  };
  return (
    <AdminLayout>
      <section className="section">
        <div className="container">
          <h1 className="title is-4 has-text-success-dark">Bukti Pembayaran</h1>

          <div className="table-container">
            <table className="table is-bordered is-fullwidth is-striped">
              <thead>
                <tr>
                  <th>Nama Donatur</th>
                  <th>Jumlah Pohon</th>
                  <th>Lokasi</th>
                  <th>Bukti</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((donation) => (
                  <tr key={donation._id}>
                    <td>{donation.donorName || "-"}</td>
                    <td>{donation.amount}</td>
                    <td>{donation.location?.name || "-"}</td>
                    <td>
                      <a
                        href={`${process.env.REACT_APP_MEDIA_URL}/${donation.paymentProof}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button is-small is-info"
                      >
                        Lihat Bukti
                      </a>
                    </td>
                    <td>
                      {donation.status === "pending" && (
                        <span className="tag is-warning">Pending</span>
                      )}
                      {donation.status === "accepted" && (
                        <span className="tag is-success">Diterima</span>
                      )}
                      {donation.status === "rejected" && (
                        <span className="tag is-danger">Ditolak</span>
                      )}
                    </td>
                    <td>
                      {donation.status === "pending" && (
                        <>
                          <button
                            className="button is-small is-success mr-2"
                            onClick={() =>
                              updateStatus(donation._id, "accepted")
                            }
                          >
                            ✔️ Terima
                          </button>
                          <button
                            className="button is-small is-danger"
                            onClick={() =>
                              updateStatus(donation._id, "rejected")
                            }
                          >
                            ❌ Tolak
                          </button>
                        </>
                      )}
                      {donation.status === "accepted" && <span>✅</span>}
                      {donation.status === "rejected" && (
                        <span className="has-text-grey-light">
                          Menunggu Unggah Ulang
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="has-text-centered">
                      Tidak ada data donasi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
};

export default BuktiPembayaran;
