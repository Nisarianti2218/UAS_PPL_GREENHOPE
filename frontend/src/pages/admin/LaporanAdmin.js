import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/admin";
import axios from "axios";

const LAPORAN_URL = `${process.env.REACT_APP_BASE_URL}/reports`;
const LOCATIONS_URL = `${process.env.REACT_APP_BASE_URL}/locations`;

const LaporanAdmin = () => {
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [formData, setFormData] = useState({
    photoBefore: null,
    photoAfter: null,
    description: "",
  });
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedLocation) fetchReports(selectedLocation);
  }, [selectedLocation]);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(LOCATIONS_URL);
      setLocations(res.data);
      if (res.data.length > 0) {
        setSelectedLocation(res.data[0]._id); // auto pilih pertama
      }
    } catch (err) {
      console.error("Gagal ambil lokasi", err);
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

  const handleUpload = async () => {
    try {
      const form = new FormData();
      form.append("locationId", selectedLocation);
      form.append("photoBefore", formData.photoBefore);
      form.append("photoAfter", formData.photoAfter);
      form.append("description", formData.description);

      await axios
        .post(LAPORAN_URL, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .catch((err) => {
          console.error("Gagal mengunggah laporan", err);
          throw err;
        });

      setFormData({ photoBefore: null, photoAfter: null, description: "" });
      fetchReports(selectedLocation);
    } catch (err) {
      console.error("Gagal unggah laporan", err);
    }
  };
  return (
    <AdminLayout>
      <section className="section">
        <div className="container">
          <h1 className="title is-4 has-text-success-dark">
            Update Laporan Penghijauan
          </h1>

          {/* Form Upload */}
          <div className="box mb-5">
            <div className="field">
              <label className="label has-text-left">Pilih Lokasi</label>
              <div className="control">
                <div className="select is-fullwidth">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
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
              <label className="label has-text-left">Foto Sebelum</label>
              <input
                className="input"
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, photoBefore: e.target.files[0] })
                }
              />
            </div>

            <div className="field">
              <label className="label has-text-left">Foto Sesudah</label>
              <input
                className="input"
                type="file"
                onChange={(e) =>
                  setFormData({ ...formData, photoAfter: e.target.files[0] })
                }
              />
            </div>

            <div className="field">
              <label className="label has-text-left">Deskripsi</label>
              <textarea
                className="textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
            </div>

            <button className="button is-success" onClick={handleUpload}>
              Upload Laporan
            </button>
          </div>

          {/* Riwayat Update */}
          <h2 className="title is-5 mb-3">Riwayat Update</h2>
          {reports.length === 0 ? (
            <p className="has-text-grey">Belum ada laporan untuk lokasi ini.</p>
          ) : (
            <div className="columns is-multiline">
              {reports.map((report) => (
                <div className="column is-6" key={report._id}>
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
      </section>
    </AdminLayout>
  );
};

export default LaporanAdmin;
