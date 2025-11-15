import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
  });


  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
    
      
      const res = await axios.post(`${apiUrl}/Signup`, formData,  { withCredentials: true }); 
      console.log("77777777777777");
      console.log("تم إنشاء الحساب:", res.data);
      alert("تم إنشاء الحساب بنجاح!");
      navigate("/Login")
    } catch (err) {
      console.error("خطأ في التسجيل:", err);
      alert("حدث خطأ أثناء إنشاء الحساب");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h3 className="text-2xl font-semibold mb-6 text-center text-red">إنشاء حساب</h3>

        <div  className="space-y-4">
          <div>
            <label className="block text-sm font-medium">الاسم الكامل</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red"
              placeholder="أدخل اسمك الكامل"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">البريد الإلكتروني(اختياري)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red"
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
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red"
              placeholder="********"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">رقم الهاتف </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red"
              placeholder="010xxxxxxxx"
              required
            />
          </div>

          <button
           onClick={()=>handleSubmit()}
            className="w-full py-2 rounded-md text-white font-semibold bg-red hover:bg-red focus:outline-none focus:ring-2 focus:ring-red"
          >
            تسجيل
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          لديك حساب؟{" "}
          <Link to={"/Login"} className="text-red font-medium underline">
            سجل الدخول
          </Link>
        </div>
      </div>
    </div>
  );
}
