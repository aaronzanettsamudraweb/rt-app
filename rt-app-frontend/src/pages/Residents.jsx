import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api/house-residents";

const Residents = () => {
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [houses, setHouses] = useState([]);
  const [form, setForm] = useState({
    user_id: "",
    house_id: "",
    start_date: "",
  });
  const [filters, setFilters] = useState({
    house_id: "",
    sort_order: "desc", // default: terbaru dulu
  });

  const fetchData = async () => {
    const res = await axios.get(API);
    setData(res.data);
  };

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/users");
    setUsers(res.data);
  };

  const fetchHouses = async () => {
    const res = await axios.get("http://localhost:8000/api/houses");
    setHouses(res.data);
  };

  useEffect(() => {
    fetchData();
    fetchUsers();
    fetchHouses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API, form);
    setForm({ user_id: "", house_id: "", start_date: "" });
    fetchData();
  };

  const handleDelete = async (id) => {
    if (confirm("Hapus riwayat penghuni ini?")) {
      await axios.delete(`${API}/${id}`);
      fetchData();
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredData = data
    .filter((r) => {
      if (filters.house_id && r.house_id != filters.house_id) return false;
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.start_date);
      const dateB = new Date(b.start_date);
      return filters.sort_order === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Penempatan Penghuni</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid gap-3"
      >
        <select
          name="user_id"
          value={form.user_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Pilih Penghuni</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
        <select
          name="house_id"
          value={form.house_id}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Pilih Rumah</option>
          {houses.map((h) => (
            <option key={h.id} value={h.id}>
              {h.house_number}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Riwayat
        </button>
      </form>

      {/* 🔍 FILTER */}
      <div className="bg-white p-4 rounded shadow mb-4 flex gap-4 items-center flex-wrap">
        <div>
          <label className="text-sm">Filter Rumah:</label>
          <select
            name="house_id"
            value={filters.house_id}
            onChange={handleFilterChange}
            className="border p-2 rounded ml-2"
          >
            <option value="">Semua</option>
            {houses.map((h) => (
              <option key={h.id} value={h.id}>
                {h.house_number}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm">Urutkan Tanggal:</label>
          <select
            name="sort_order"
            value={filters.sort_order}
            onChange={handleFilterChange}
            className="border p-2 rounded ml-2"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>

      {/* TABEL RIWAYAT */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-md font-semibold mb-3">Riwayat Penempatan</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Rumah</th>
              <th className="text-left py-2">Penghuni</th>
              <th className="text-left py-2">Mulai Tinggal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="py-2">{r.house?.house_number}</td>
                <td className="py-2">{r.user?.name}</td>
                <td className="py-2">{r.start_date}</td>
                <td className="py-2 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center text-gray-400 py-3">
                  Tidak ada data ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Residents;
