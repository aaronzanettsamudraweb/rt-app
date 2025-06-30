import { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const API = "http://localhost:8000/api";

const Reports = () => {
  const today = new Date();
  const defaultMonth = today.getMonth() + 1;
  const defaultYear = today.getFullYear();

  const [filters, setFilters] = useState({
    month: defaultMonth,
    year: defaultYear,
  });

  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      const period = `${filters.year}-${String(filters.month).padStart(
        2,
        "0"
      )}`;
      const [resIncomes, resExpenses] = await Promise.all([
        axios.get(
          `${API}/payments?month=${filters.month}&year=${filters.year}`
        ),
        axios.get(
          `${API}/expenses?month=${filters.month}&year=${filters.year}`
        ),
      ]);

      setIncomes(resIncomes.data.filter((p) => p.status === "lunas"));
      setExpenses(resExpenses.data);
    } catch (err) {
      console.error("Gagal mengambil data laporan:", err);
      alert("Terjadi kesalahan saat mengambil laporan.");
    }
  };

  const totalIncome = incomes.reduce(
    (sum, p) => sum + (p.payment_item?.amount || 0),
    0
  );
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: parseInt(e.target.value) });
  };

  const chartData = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        label: "Nominal (Rp)",
        data: [totalIncome, totalExpense],
        backgroundColor: ["#4ade80", "#f87171"],
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Laporan Keuangan</h2>

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

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <p className="text-sm">Total Pemasukan</p>
          <p className="text-lg font-bold text-green-700">
            Rp {totalIncome.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <p className="text-sm">Total Pengeluaran</p>
          <p className="text-lg font-bold text-red-700">
            Rp {totalExpense.toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <p className="text-sm">Saldo</p>
          <p className="text-lg font-bold text-blue-700">
            Rp {balance.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-2">Grafik Keuangan</h3>
        <Bar data={chartData} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-2">Rincian Pemasukan</h4>
          <ul className="text-sm bg-white rounded shadow divide-y">
            {incomes.length === 0 ? (
              <li className="p-2 text-gray-400">Belum ada pemasukan</li>
            ) : (
              incomes.map((i) => (
                <li key={i.id} className="p-2 flex justify-between">
                  <span>
                    {i.user?.name} - {i.payment_item?.name}
                  </span>
                  <span>Rp {i.payment_item?.amount?.toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Rincian Pengeluaran</h4>
          <ul className="text-sm bg-white rounded shadow divide-y">
            {expenses.length === 0 ? (
              <li className="p-2 text-gray-400">Belum ada pengeluaran</li>
            ) : (
              expenses.map((e) => (
                <li key={e.id} className="p-2 flex justify-between">
                  <span>{e.description}</span>
                  <span>Rp {e.amount.toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
