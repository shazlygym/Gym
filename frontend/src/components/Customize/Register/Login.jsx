import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

export default function Login() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // حالة التحميل
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true); // بدء التحميل

    try {
      const res = await axios.post(`${apiUrl}/login`, formData, {
        withCredentials: true,
      });

      if (!res.data.error) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate(`/Profile/${formData.mobileNumber}`);
      } else {
        alert(res.data.message || "بيانات الدخول غير صحيحة");
      }
    } catch (err) {
      console.error("خطأ في تسجيل الدخول:", err);
      alert("حدث خطأ أثناء تسجيل الدخول");
    }

    setLoading(false); // انتهاء التحميل
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold mb-6 text-center text-red">
          تسجيل الدخول
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">رقم الموبايل</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="0790000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">كلمة المرور</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red"
              placeholder="********"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-2 rounded-md text-white font-semibold 
            ${loading ? "bg-gray-400" : "bg-red hover:bg-red"} 
            focus:outline-none focus:ring-2 focus:ring-red`}
          >
            {loading ? "جاري الدخول..." : "دخول"}
          </button>
        </div>
      </div>
    </div>
  );
}
