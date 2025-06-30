import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Residents from "./pages/Residents";
import Houses from "./pages/Houses";
import Payments from "./pages/Payments";
import Expenses from "./pages/Expenses";
import Reports from "./pages/Reports";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-60 min-h-screen">
          <Navbar />
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/residents" element={<Residents />} />
              <Route path="/houses" element={<Houses />} />
              <Route path="/payments" element={<Payments />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
