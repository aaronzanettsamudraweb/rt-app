import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const navItem =
    "block px-4 py-2 rounded hover:bg-blue-100 transition text-sm";

  return (
    <div className="w-60 h-screen bg-white shadow-md fixed left-0 top-0 pt-6">
      <div className="text-center font-bold text-lg mb-6">🏠 RT Admin</div>
      <nav className="flex flex-col gap-1 px-2">
        <NavLink to="/" className={navItem}>
          Dashboard
        </NavLink>
        <NavLink to="/users" className={navItem}>
          Penghuni
        </NavLink>
        <NavLink to="/houses" className={navItem}>
          Rumah
        </NavLink>
        <NavLink to="/residents" className={navItem}>
          Riwayat Penghuni
        </NavLink>
        <NavLink to="/payments" className={navItem}>
          Pembayaran
        </NavLink>
        <NavLink to="/expenses" className={navItem}>
          Pengeluaran
        </NavLink>
        <NavLink to="/reports" className={navItem}>
          Laporan
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
