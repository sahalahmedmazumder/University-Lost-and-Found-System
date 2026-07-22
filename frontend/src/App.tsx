import { Route, Routes } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import AdminDashboard from "./pages/AdminDashboard";
import BrowseItems from "./pages/BrowseItems";
import Home from "./pages/Home";
import ItemDetails from "./pages/ItemDetails";
import Login from "./pages/Login";
import MyReports from "./pages/MyReports";
import Register from "./pages/Register";
import ReportFound from "./pages/ReportFound";
import ReportLost from "./pages/ReportLost";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report-lost" element={<ReportLost />} />
        <Route path="/report-found" element={<ReportFound />} />
        <Route path="/browse-items" element={<BrowseItems />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
