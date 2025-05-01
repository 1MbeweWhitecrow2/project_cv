import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ContactForm from "./components/ContactForm";
import Charts from "./components/Charts";
import StockScaatterPlot3D from "./components/StockScatterPlot3D";
import Skills from "./components/Skills";
import CertificatesAndCoursesHover from "./components/CertificatesAndCoursesHover";
import MyWayToProgramming from "./components/MyWayToProgramming";
import CreatePortfolio from "./components/CreatePortfolio";
import AboutProject from "./components/AboutProject";
import Code from "./components/Code";
import AccountActivation from "./components/AccountActivation"; 

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 p-4 text-white flex flex-col md:flex-row justify-between items-center">
      <div className="flex flex-wrap justify-center md:justify-start mb-4 md:mb-0">
        <Link to="/AboutProject" className="mr-4 mb-2 md:mb-0">About Project</Link>
        <Link to="/contact" className="mr-4 mb-2 md:mb-0">Contact</Link>
        <Link to="/charts" className="mr-4 mb-2 md:mb-0">Charts</Link>
        <Link to="/CreatePortfolio" className="mr-4 mb-2 md:mb-0">Create Portfolio</Link>
        <Link to="/stockscatterplot3d" className="mr-4 mb-2 md:mb-0">Stock Scatter Plot 3D</Link>
        <Link to="/skills" className="mr-4 mb-2 md:mb-0">Skills</Link>
        <Link to="/CertificatesAndCoursesHover" className="mr-4 mb-2 md:mb-0">Certificates and Courses</Link>
        <Link to="/Code" className="mr-4 mb-2 md:mb-0">Code</Link>
        <Link to="/MyWayToProgramming" className="mr-4 mb-2 md:mb-0">My Way To Programming</Link>
      </div>
      <div>
        {user ? (
          <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link to="/register" className="bg-gray-700 px-4 py-2 rounded">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <p className="text-center mt-10 text-red-600 text-xl">Access for registered users only</p>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container mx-auto px-4 md:px-8 lg:px-16 mt-10">
          <Routes>
            <Route path="/" element={<AboutProject />} />
            <Route path="/AboutProject" element={<AboutProject />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/CertificatesAndCoursesHover" element={<CertificatesAndCoursesHover />} />
            <Route path="/MyWayToProgramming" element={<MyWayToProgramming />} />

            {/* 👇 DODANA TRASA DO AKTYWACJI */}
            <Route path="/activate/:token" element={<AccountActivation />} />

            {/* 🔐 Protected Routes */}
            <Route path="/contact" element={<ProtectedRoute><ContactForm /></ProtectedRoute>} />
            <Route path="/CreatePortfolio" element={<ProtectedRoute><CreatePortfolio /></ProtectedRoute>} />
            <Route path="/stockscatterplot3d" element={<ProtectedRoute><StockScaatterPlot3D /></ProtectedRoute>} />
            <Route path="/Code" element={<ProtectedRoute><Code /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;



