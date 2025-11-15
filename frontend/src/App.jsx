import { Route, Routes } from "react-router-dom";
import NavBar from "./components/navigation/Navbar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Schedule from "./Pages/Schedule";
import Pricing from "./Pages/Pricing";
import Classes from "./Pages/Classes";
import Footer from "./components/footer/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Signup from "./components/Customize/Register/Signup";
import Login from "./components/Customize/Register/Login";
import Profile from "./components/Customize/Profile/Profile";
import Dashboard from "./components/Customize/Dashboard/Dashboard";
import EditMember from "./components/Customize/EditMember/EditMember";
import Charts from "./components/Customize/Charts/Charts";
import Protiens from "./components/Customize/Protiens/Protiens";
import "./index.css";
import { Navigate } from "react-router-dom";


// ✅ مكون لحماية الصفحات المخصصة للأدمن فقط
const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.admin) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};


function App() {
  return (
    <div dir="rtl">
      <NavBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="classes" element={<Classes />} />
        <Route path="Signup" element={<Signup />} />
        <Route path="Login" element={<Login />} />
        <Route path="/Profile/:mobileNumber" element={<Profile />} />

        {/* ✅ حماية صفحة Dashboard */}
        <Route
          path="Dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/EditMember/:id" element={<EditMember />} />
        <Route path="Charts" element={<Charts />} />
        <Route path="Protiens" element={<Protiens />} />
      </Routes>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
