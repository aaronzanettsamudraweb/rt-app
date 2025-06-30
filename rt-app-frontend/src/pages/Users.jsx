import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api/users";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    status: "tetap",
    phone: "",
    marital_status: "menikah",
    ktp_photo: null,
  });

  const [editingId, setEditingId] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now()); // untuk reset file input

  const fetchUsers = async () => {
    const res = await axios.get(API);
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "ktp_photo") {
      setForm({ ...form, ktp_photo: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => {
      if (val !== null) formData.append(key, val);
    });

    try {
      if (editingId) {
        await axios.post(`${API}/${editingId}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setForm({
        name: "",
        status: "tetap",
        phone: "",
        marital_status: "menikah",
        ktp_photo: null,
      });
      setFileInputKey(Date.now()); // reset file input
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      console.error("Gagal simpan data:", err);
    }
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      status: user.status,
      phone: user.phone,
      marital_status: user.marital_status,
      ktp_photo: null,
    });
    setEditingId(user.id);
    setFileInputKey(Date.now()); // reset file input
  };

  const handleCancel = () => {
    setForm({
      name: "",
      status: "tetap",
      phone: "",
      marital_status: "menikah",
      ktp_photo: null,
    });
    setFileInputKey(Date.now());
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus penghuni ini?")) {
      await axios.delete(`${API}/${id}`);
      fetchUsers();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Daftar Penghuni</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid gap-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            className="border p-2 rounded"
            required
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Nomor Telepon"
            className="border p-2 rounded"
            required
          />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="tetap">Tetap</option>
            <option value="kontrak">Kontrak</option>
          </select>
          <select
            name="marital_status"
            value={form.marital_status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="menikah">Menikah</option>
            <option value="belum">Belum Menikah</option>
          </select>
        </div>
        <input
          key={fileInputKey} // agar ter-reset otomatis
          type="file"
          name="ktp_photo"
          accept="image/*"
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Penghuni" : "Tambah Penghuni"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow p-4 rounded flex flex-col gap-2"
          >
            {user.ktp_photo && (
              <img
                src={`http://localhost:8000/storage/${user.ktp_photo}`}
                alt="KTP"
                className="h-32 object-contain border rounded"
              />
            )}
            <div>
              <strong>{user.name}</strong> ({user.status})
            </div>
            <div>📞 {user.phone}</div>
            <div>💍 {user.marital_status}</div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-yellow-400 px-3 py-1 rounded text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 px-3 py-1 rounded text-white"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
