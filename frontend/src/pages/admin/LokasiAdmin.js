import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/admin";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const LOCATION_URL = `${process.env.REACT_APP_BASE_URL}/locations`;

const LokasiAdmin = () => {
  const [locations, setLocations] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
    status: "aktif",
    image: null,
  });

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

  const handleOpenModal = (location = null) => {
    if (location) {
      setIsEdit(true);
      setSelectedLocation(location._id);
      setFormData({
        name: location.name,
        address: location.address,
        description: location.description,
        status: location.status,
        image: null,
      });
    } else {
      setIsEdit(false);
      setSelectedLocation(null);
      setFormData({
        name: "",
        address: "",
        description: "",
        status: "aktif",
        image: null,
      });
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) form.append(key, formData[key]);
      });

      const url = isEdit
        ? `${LOCATION_URL}/${selectedLocation}`
        : `${LOCATION_URL}`;

      const method = isEdit ? "put" : "post";

      await axios[method](url, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setModalOpen(false);
      fetchLocations();
    } catch (err) {
      console.error("Gagal menyimpan lokasi", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus lokasi ini?")) return;
    try {
      await axios.delete(`${LOCATION_URL}/${id}`);
      fetchLocations();
    } catch (err) {
      console.error("Gagal menghapus lokasi", err);
    }
  };
  return (
    <AdminLayout>
      <section className="section">
        <div className="container">
          <h1 className="title is-4 has-text-success-dark">
            Kelola Lokasi Penghijauan
          </h1>
          <button
            className="button is-primary mb-4"
            onClick={() => handleOpenModal()}
          >
            <FaPlus /> &nbsp; Tambah Lokasi
          </button>

          <div className="columns is-multiline">
            {locations.map((loc) => (
              <div className="column is-4" key={loc._id}>
                <div className="box">
                  {loc.image && (
                    <figure className="image is-4by3 mb-2">
                      <img
                        src={`${process.env.REACT_APP_MEDIA_URL}/${loc.image}`}
                        alt={loc.name}
                      />
                    </figure>
                  )}
                  <h2 className="title is-5 has-text-left">
                    {loc.name}{" "}
                    <span className="has-text-grey has-text-left">
                      ({loc.address})
                    </span>
                  </h2>
                  <p className="has-text-left">{loc.description}</p>
                  <p className="mt-2">
                    <span
                      className={`tag is-${
                        loc.status === "aktif" ? "success" : "warning"
                      }`}
                    >
                      {loc.status}
                    </span>
                  </p>
                  <div className="buttons mt-3">
                    <button
                      className="button is-info is-small"
                      onClick={() => handleOpenModal(loc)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="button is-danger is-small"
                      onClick={() => handleDelete(loc._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {locations.length === 0 && (
              <p className="has-text-grey">Belum ada lokasi penghijauan.</p>
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <div className="modal is-active">
          <div
            className="modal-background"
            onClick={() => setModalOpen(false)}
          ></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">
                {isEdit ? "Edit Lokasi" : "Tambah Lokasi"}
              </p>
              <button
                className="delete"
                onClick={() => setModalOpen(false)}
              ></button>
            </header>
            <section className="modal-card-body">
              <div className="field">
                <label className="label has-text-left">Nama Lokasi</label>
                <input
                  className="input"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label className="label has-text-left">Alamat / Wilayah</label>
                <input
                  className="input"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
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
                />
              </div>
              <div className="field">
                <label className="label has-text-left">Status</label>
                <div className="select is-fullwidth">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label className="label has-text-left">Gambar Lokasi</label>
                <input
                  className="input"
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.files[0] })
                  }
                />
              </div>
            </section>
            <footer className="modal-card-foot">
              <button className="button is-success" onClick={handleSubmit}>
                Simpan
              </button>
              <button className="button" onClick={() => setModalOpen(false)}>
                Batal
              </button>
            </footer>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default LokasiAdmin;
