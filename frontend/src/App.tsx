import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import BrowseItems from "./pages/BrowseItems";
import MyReports from "./pages/MyReports";
import ReportFound from "./pages/ReportFound";
import ReportLost from "./pages/ReportLost";

import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                {/* PUBLIC ROUTES */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* USER ROUTES */}

                <Route
                    path="/browse-items"
                    element={<BrowseItems />}
                />

                <Route
                    path="/report-lost"
                    element={<ReportLost />}
                />

                <Route
                    path="/report-found"
                    element={<ReportFound />}
                />

                <Route
                    path="/my-reports"
                    element={<MyReports />}
                />

                {/* ADMIN ROUTE */}

                <Route
                    path="/admin/dashboard"
                    element={<AdminDashboard />}
                />
            </Routes>
        </>
    );
}

export default App;