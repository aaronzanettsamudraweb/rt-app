import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8000/api";

const Dashboard = () => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [stats, setStats] = useState({
    houses: 0,
    residents: 0,
    income: 0,
    expense: 0,
    balance: 0,
  });

  const fetchStats = async () => {
    try {
      const [resHouses, resResidents, resPayments, resExpenses] = await Promise.all([
        axios.get(`${API}/houses`),
        axios.get(`${API}/users`),
        axios.get(`${API}/payments?month=${currentMonth}&year=${currentYear}`),
        axios.get(`${API}/expenses?month=${currentMonth}&year=${currentYear}`),
      ]);

      const income = resPayments.data
        .filter((p) => p.status === "lunas")
        .reduce((sum, p) => sum + (p.payment_item?.amount || 0), 0);

      const expense = resExpenses.data.reduce((sum, e) => sum + e.amount, 0);
      const balance = income - expense;

      setStats({
        houses: resHouses.data.length,
        residents: resResidents.data.length,
        income,
        expense,
        balance,
      });
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
      alert("Gagal mengambil data. Silakan coba lagi.");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dashboard RT</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Jumlah Rumah</p>
          <p className="text-2xl font-bold">{stats.houses}</p>
        </div>
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Jumlah Penghuni</p>
          <p className="text-2xl font-bold">{stats.residents}</p>
        </div>
        <div className="bg-green-100 rounded shadow p-4">
          <p className="text-sm text-green-700">Pemasukan Bulan Ini</p>
          <p className="text-lg font-bold text-green-700">
            Rp {stats.income.toLocaleString()}
          </p>
        </div>
        <div className="bg-red-100 rounded shadow p-4">
          <p className="text-sm text-red-700">Pengeluaran Bulan Ini</p>
          <p className="text-lg font-bold text-red-700">
            Rp {stats.expense.toLocaleString()}
          </p>
        </div>
        <div className="bg-blue-100 rounded shadow p-4">
          <p className="text-sm text-blue-700">Saldo Bulan Ini</p>
          <p className="text-lg font-bold text-blue-700">
            Rp {stats.balance.toLocaleString()}
          </p>
        </div>
      </div>

      <footer className="text-center text-xs text-gray-400 mt-8">
        &copy; {new Date().getFullYear()} RT App Developed by Aaron Zanett Samudra. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Dashboard;
