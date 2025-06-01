import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/admin";
import axios from "axios";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";

const DONATION_URL = `${process.env.REACT_APP_BASE_URL}/donations`;
const LOCATION_URL = `${process.env.REACT_APP_BASE_URL}/locations`;

const DonasiAdmin = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
    fetchLocations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`${DONATION_URL}`);
      setDonations(res.data);
    } catch (err) {
      console.error("Gagal mengambil data donasi", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${DONATION_URL}/${id}/status`, {
        status,
      });
      fetchDonations(); // refresh data
    } catch (err) {
      console.error("Gagal memperbarui status", err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios
        .get(LOCATION_URL)
        .then((response) => setLocations(response.data))
        .catch((error) => {
          console.error("Gagal mengambil lokasi", error);
        });
      if (!res || res.length === 0) {
        console.warn("Tidak ada lokasi ditemukan");
        return;
      }
    } catch (err) {
      console.error("Gagal ambil lokasi", err);
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    locationId: "",
    amount: "",
    donationDate: "",
    paymentProof: null,
  });

  const [locations, setLocations] = useState([]);

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });

      await axios
        .post(DONATION_URL, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          setIsModalOpen(false);
          setFormData({
            donorName: "",
            donorEmail: "",
            locationId: "",
            amount: "",
            donationDate: "",
            paymentProof: null,
          });
          fetchDonations(); // refresh data
        })
        .then(() => {
          alert("Donasi berhasil ditambahkan!");
        })
        .catch((error) => {
          console.error("Gagal menambah donasi", error);
          alert("Gagal menambah donasi: " + error.response.data.message);
        });
    } catch (err) {
      console.error("Gagal menambah donasi", err);
    }
  };

  return (
    <AdminLayout>
      <section className="section">
        <div className="container">
          <h1 className="title is-4 has-text-success-dark">Kelola Donasi</h1>
          <div className="mb-4">
            <button
              className="button is-primary mb-4 "
              onClick={() => setIsModalOpen(true)}
            >
              + Tambah Donasi
            </button>
          </div>

          {isModalOpen && (
            <div className="modal is-active">
              <div
                className="modal-background"
                onClick={() => setIsModalOpen(false)}
              ></div>
              <div className="modal-card">
                <header className="modal-card-head">
                  <p className="modal-card-title">Tambah Donasi</p>
                  <button
                    className="delete"
                    onClick={() => setIsModalOpen(false)}
                  ></button>
                </header>
                <section className="modal-card-body">
                  <div className="field">
                    <label className="label has-text-left">Nama Donatur</label>
                    <div className="control">
                      <input
                        className="input"
                        type="text"
                        value={formData.donorName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            donorName: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label has-text-left">Email Donatur</label>
                    <div className="control">
                      <input
                        className="input"
                        type="email"
                        value={formData.donorEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            donorEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label has-text-left">
                      Lokasi Penghijauan
                    </label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={formData.locationId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              locationId: e.target.value,
                            })
                          }
                        >
                          <option value="">-- Pilih Lokasi --</option>
                          {locations.map((loc) => (
                            <option key={loc._id} value={loc._id}>
                              {loc.name} ({loc.address})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="field">
                    <label className="label has-text-left">Jumlah Pohon</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        min="1"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label has-text-left">
                      Tanggal Donasi
                    </label>
                    <div className="control">
                      <input
                        className="input"
                        type="date"
                        value={formData.donationDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            donationDate: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="field">
                    <label className="label has-text-left">
                      Bukti Pembayaran (opsional)
                    </label>
                    <div className="control">
                      <input
                        className="input"
                        type="file"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            paymentProof: e.target.files[0],
                          })
                        }
                      />
                    </div>
                  </div>
                </section>
                <footer className="modal-card-foot">
                  <button className="button is-success" onClick={handleSubmit}>
                    Simpan
                  </button>
                  <button
                    className="button"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Batal
                  </button>
                </footer>
              </div>
            </div>
          )}

          <div className="table-container mt-4">
            <table className="table is-fullwidth is-striped is-hoverable">
              <thead>
                <tr>
                  <th>Nama Donatur</th>
                  <th>Jumlah Pohon</th>
                  <th>Lokasi</th>
                  <th>Bukti Pembayaran</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr className="has-text-left" key={donation._id}>
                    <td>{donation.donor?.name || "-"}</td>
                    <td>{donation.amount.toLocaleString()}</td>
                    <td>{donation.location?.name || "-"}</td>
                    <td>
                      {donation.paymentProof ? (
                        <a
                          href={`${process.env.REACT_APP_MEDIA_URL}/${donation.paymentProof}`}
                          target="_blank"
                          rel="noreferrer"
                          className="button is-small is-info is-light"
                        >
                          <FaEye /> &nbsp;Lihat
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {donation.status === "pending" && (
                        <span className="tag is-warning is-light">Pending</span>
                      )}
                      {donation.status === "accepted" && (
                        <span className="tag is-success is-light">
                          Diterima
                        </span>
                      )}
                      {donation.status === "rejected" && (
                        <span className="tag is-danger is-light">Ditolak</span>
                      )}
                    </td>
                    <td>
                      {donation.status === "pending" && (
                        <div className="buttons are-small">
                          <button
                            className="button is-success"
                            onClick={() =>
                              updateStatus(donation._id, "accepted")
                            }
                          >
                            <FaCheck />
                          </button>
                          <button
                            className="button is-danger"
                            onClick={() =>
                              updateStatus(donation._id, "rejected")
                            }
                          >
                            <FaTimes />
                          </button>
                        </div>
                      )}
                      {donation.status === "accepted" && (
                        <span className="icon has-text-success">
                          <FaCheck />
                        </span>
                      )}
                      {donation.status === "rejected" && (
                        <span className="icon has-text-danger">
                          <FaTimes />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {donations.length === 0 && (
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

export default DonasiAdmin;
