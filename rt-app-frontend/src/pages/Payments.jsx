import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api";

const Payments = () => {
  const today = new Date();
  const defaultMonth = today.getMonth() + 1;
  const defaultYear = today.getFullYear();

  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);

  const [filters, setFilters] = useState({
    month: defaultMonth,
    year: defaultYear,
  });

  const [form, setForm] = useState({
    user_id: "",
    payment_name: "",
    payment_amount: "",
    month: defaultMonth,
    year: defaultYear,
    status: true,
  });

  const fetchAll = async () => {
    try {
      const [resUsers, resPayments] = await Promise.all([
        axios.get(`${API}/users`),
        axios.get(`${API}/payments`),
      ]);

      setUsers(resUsers.data);
      setPayments(resPayments.data);
    } catch (err) {
      console.error("Gagal fetch data:", err);
      alert("Terjadi kesalahan saat mengambil data.");
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: parseInt(e.target.value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.user_id || !form.payment_name || !form.payment_amount) {
      alert("Mohon lengkapi semua kolom.");
      return;
    }

    const period = `${form.year}-${String(form.month).padStart(2, "0")}-01`;

    try {
      // Simpan payment_item terlebih dahulu (jika diperlukan)
      const paymentItemRes = await axios.post(`${API}/payment-items`, {
        name: form.payment_name,
        amount: parseInt(form.payment_amount),
      });

      const payment_item_id = paymentItemRes.data.id;

      // Simpan pembayaran
      await axios.post(`${API}/payments`, {
        user_id: parseInt(form.user_id),
        payment_item_id,
        period,
        status: form.status ? "lunas" : "belum",
      });

      setForm({
        user_id: "",
        payment_name: "",
        payment_amount: "",
        month: defaultMonth,
        year: defaultYear,
        status: true,
      });

      fetchAll();
    } catch (err) {
      console.error("Gagal menyimpan pembayaran:", err);
      alert("Gagal menyimpan. Pastikan input benar dan tidak duplikat.");
    }
  };

  const filteredPayments = payments.filter((p) => {
    const date = new Date(p.period);
    return (
      date.getFullYear() === filters.year &&
      date.getMonth() + 1 === filters.month
    );
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pembayaran Iuran Bulanan</h2>

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

      {/* Form Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 grid gap-3"
      >
        <div className="grid grid-cols-2 gap-4">
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

          <input
            type="text"
            name="payment_name"
            value={form.payment_name}
            onChange={handleChange}
            className="border p-2 rounded"
            placeholder="Nama Iuran (contoh: Kebersihan)"
            required
          />
        </div>

        <input
          type="number"
          name="payment_amount"
          value={form.payment_amount}
          onChange={handleChange}
          className="border p-2 rounded"
          placeholder="Nominal Iuran (contoh: 100000)"
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

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            name="status"
            checked={form.status}
            onChange={handleChange}
          />
          Lunas
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Simpan Pembayaran
        </button>
      </form>

      {/* Tabel Pembayaran */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-3">
          Daftar Pembayaran Bulan {filters.month} Tahun {filters.year}
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Penghuni</th>
              <th className="text-left py-2">Iuran</th>
              <th className="text-left py-2">Nominal</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-400">
                  Belum ada pembayaran untuk bulan ini.
                </td>
              </tr>
            )}
            {filteredPayments.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="py-2">{p.user?.name}</td>
                <td className="py-2">{p.payment_item?.name}</td>
                <td className="py-2">
                  Rp {p.payment_item?.amount?.toLocaleString()}
                </td>
                <td
                  className={`py-2 font-semibold ${
                    p.status === "lunas" ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {p.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
