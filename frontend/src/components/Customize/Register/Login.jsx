import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

export default function Login() {
  const [formData, setFormData] = useState({
    mobileNumber: "",
    password: "",
  });

  const navigate = useNavigate(); // 👈 للتنقل بعد تسجيل الدخول بنجاح

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
  

    try {
      // 🔗 استبدل الرابط بعنوان الـ backend تبعك
      const res = await axios.post(`${apiUrl}/login`, formData, {
        withCredentials: true, // 👈 ضروري لتفعيل الكوكيز
      });
      

      if (!res.data.error) {
        // ممكن تخزن التوكن أو بيانات المستخدم
        localStorage.setItem("user", JSON.stringify(res.data.user));
        // توجه المستخدم للصفحة الرئيسية مثلاً
        
        navigate(`/Profile/${formData.mobileNumber}`);
      } else {
        alert(res.data.message || "بيانات الدخول غير صحيحة");
      }
    } catch (err) {
      console.error("خطأ في تسجيل الدخول:", err);
      alert("حدث خطأ أثناء تسجيل الدخول");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold mb-6 text-center text-red">تسجيل الدخول</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium"> رقم الموبايل</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="name@example.com"
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
            onClick={()=>handleSubmit()}
            className="w-full py-2 rounded-md text-white font-semibold bg-red hover:bg-red focus:outline-none focus:ring-2 focus:ring-red"
          >
            دخول
          </button>
        </div>

      </div>
    </div>
  );
}
