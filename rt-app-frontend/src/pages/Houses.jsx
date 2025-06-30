import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api/houses";

const Houses = () => {
  const [houses, setHouses] = useState([]);
  const [form, setForm] = useState({
    house_number: "",
    is_occupied: false,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchHouses = async () => {
    const res = await axios.get(API);
    setHouses(res.data);
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setForm({ ...form, [name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
    } else {
      await axios.post(API, form);
    }
    setForm({ house_number: "", is_occupied: false });
    setEditingId(null);
    fetchHouses();
  };

  const handleEdit = (house) => {
    setForm({
      house_number: house.house_number,
      is_occupied: house.is_occupied,
    });
    setEditingId(house.id);
  };

  const handleCancelEdit = () => {
    setForm({ house_number: "", is_occupied: false });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus rumah ini?")) {
      await axios.delete(`${API}/${id}`);
      fetchHouses();
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Data Rumah</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid gap-3"
      >
        <input
          name="house_number"
          value={form.house_number}
          onChange={handleChange}
          placeholder="Nomor Rumah (cth: A-1)"
          className="border p-2 rounded"
          required
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_occupied"
            checked={form.is_occupied}
            onChange={handleChange}
          />
          Dihuni
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingId ? "Update Rumah" : "Tambah Rumah"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {houses.map((house) => (
          <div key={house.id} className="bg-white shadow p-4 rounded">
            <div className="text-lg font-bold">🏠 {house.house_number}</div>
            <div className="text-sm text-gray-600">
              Status:{" "}
              <span
                className={
                  house.is_occupied ? "text-green-600" : "text-red-500"
                }
              >
                {house.is_occupied ? "Dihuni" : "Kosong"}
              </span>
            </div>

            {/* Penghuni saat ini */}
            {house.residents && house.residents.length > 0 && (
              <div className="mt-3 text-sm">
                <div className="font-semibold">Penghuni Saat Ini:</div>
                <ul className="list-disc ml-5">
                  {house.residents
                    .filter((r) => r.end_date === null)
                    .map((r) => (
                      <li key={r.id}>
                        {r.user?.name || "Tidak diketahui"} — sejak{" "}
                        {r.start_date}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(house)}
                className="bg-yellow-400 px-3 py-1 rounded text-white"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(house.id)}
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

export default Houses;
