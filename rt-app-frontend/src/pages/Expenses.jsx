import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api";

const Expenses = () => {
  const today = new Date();
  const defaultMonth = today.getMonth() + 1;
  const defaultYear = today.getFullYear();

  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    month: defaultMonth,
    year: defaultYear,
  });

  const [filters, setFilters] = useState({
    month: defaultMonth,
    year: defaultYear,
  });

  const fetchExpenses = async () => {
    try {
      const res = await axios.get(`${API}/expenses`);
      setExpenses(res.data);
    } catch (err) {
      console.error("Gagal mengambil data pengeluaran:", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: parseInt(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.description || !form.amount) {
      alert("Deskripsi dan jumlah harus diisi.");
      return;
    }

    const date = `${form.year}-${String(form.month).padStart(2, "0")}-01`;

    try {
      await axios.post(`${API}/expenses`, {
        description: form.description,
        amount: parseInt(form.amount),
        date,
      });

      setForm({ description: "", amount: "", month: defaultMonth, year: defaultYear });
      fetchExpenses();
    } catch (err) {
      console.error("Gagal menyimpan pengeluaran:", err);
      alert("Gagal menyimpan pengeluaran.");
    }
  };

  const filteredExpenses = expenses.filter((exp) => {
    const d = new Date(exp.date);
    return d.getMonth() + 1 === filters.month && d.getFullYear() === filters.year;
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pengeluaran Bulanan</h2>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        <select
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Bulan {i + 1}
            </option>
          ))}
        </select>
        <select
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          {[defaultYear - 1, defaultYear, defaultYear + 1].map((y) => (
            <option key={y} value={y}>
              Tahun {y}
            </option>
          ))}
        </select>
      </div>

      {/* Form Pengeluaran */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 grid gap-3">
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Deskripsi Pengeluaran"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Jumlah (Rp)"
          className="border p-2 rounded"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            name="month"
            value={form.month}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                Bulan {i + 1}
              </option>
            ))}
          </select>
          <select
            name="year"
            value={form.year}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            {[defaultYear - 1, defaultYear, defaultYear + 1].map((y) => (
              <option key={y} value={y}>
                Tahun {y}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          Simpan Pengeluaran
        </button>
      </form>

      {/* Tabel Pengeluaran */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-3">
          Daftar Pengeluaran Bulan {filters.month} Tahun {filters.year}
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Deskripsi</th>
              <th className="text-left py-2">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.length === 0 && (
              <tr>
                <td colSpan="2" className="text-center py-4 text-gray-400">
                  Tidak ada pengeluaran bulan ini.
                </td>
              </tr>
            )}
            {filteredExpenses.map((e) => (
              <tr key={e.id} className="border-b">
                <td className="py-2">{e.description}</td>
                <td className="py-2">Rp {e.amount?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Expenses;