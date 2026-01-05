import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChartBar } from "react-icons/fa";
import { FaPersonRifle } from "react-icons/fa6";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 🆕 الصفحة الحالية
  const usersPerPage = 10; // 🆕 عدد المستخدمين في كل صفحة

  const navigate = useNavigate();

  // 🔹 جلب المستخدمين من الـ backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${apiUrl}/getAllUsers`);
        setUsers(res.data);
      } catch (err) {
        console.error("خطأ أثناء جلب المستخدمين:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);


  // 🟢 تسجيل حضور المستخدم
  const handleAddVisit = async (id) => {
    const user = users.find((u) => u._id === id);

    if (user.usedDays >= user.totalDays) {
      alert("❌ انتهى اشتراك هذا المستخدم في الجيم!");
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/addGymVisit/${id}`);
      alert(res.data.message);

      const updatedUsers = users.map((u) =>
        u._id === id ? { ...u, usedDays: u.usedDays + 1 } : u
      );
      setUsers(updatedUsers);
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تسجيل الزيارة");
    }
  };

  // 🗑 حذف المستخدم
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) return;

    try {
      await axios.delete(`${apiUrl}/DeleteUser/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };


  // 🔍 فلترة المستخدمين حسب الاسم
  const filteredUsers = users.filter((u) => {
    const lowerSearch = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(lowerSearch) ||
      String(u.seq).includes(lowerSearch) // 👈 إضافة البحث بالرقم التسلسلي
    );
  });
  

  // 🧮 حساب المستخدمين المعروضين حسب الصفحة الحالية
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // 📄 عدد الصفحات الكلي
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // 🧭 تغيير الصفحة
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">جارِ تحميل البيانات...</p>
      </div>
    );

    const handleSendEmail = async (id) => {
      try {
  
        // ✅ إرسال الطلب إلى السيرفر باستخدام الـ userId فقط
        const response = await axios.post(`${apiUrl}/sendEmail/${id}`);
  
        alert(response.data.message || "تم إرسال التذكير بنجاح ✅");
      } catch (error) {
        console.error("❌ خطأ أثناء إرسال البريد:", error);
        alert(error.response?.data?.message || "حدث خطأ أثناء إرسال البريد الإلكتروني");
      } 
    };
  return (
    <div className="p-4 bg-gray-100 min-h-screen" dir="rtl">
    <h1 className="text-3xl font-bold mb-6 text-gray-600">لوحة التحكم</h1>
  
    {/* 🔍 مربع البحث */}
    <div className="mb-4 flex justify-start">
      <input
        type="text"
        placeholder="ابحث عن مستخدم..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="p-2 border rounded-md w-full md:w-64 outline-none"
      />
    </div>
  
    {/* رابط إحصائيات */}
    <Link to="/Charts">
      <div className="flex items-center px-4 py-2 mb-4 bg-white shadow-md rounded-lg hover:bg-red-50 transition w-fit">
        <FaChartBar className="text-red text-2xl" />
        <h1 className="mx-3 font-semibold">إحصائيات</h1>
      </div>
    </Link>

       <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 my-4 bg-white hover:bg-red-50 text-red px-4 py-2 rounded-lg shadow-md transition"
          >
            <FaArrowLeft className="text-red text-lg " />
            <span className="font-semibold">رجوع</span>
          </button>

   
  
    {/* جدول المستخدمين للشاشات الكبيرة */}
    <div className="hidden md:block overflow-x-auto bg-white shadow-lg rounded-lg">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-red text-white">
            <th className="px-1 py-3 text-right">الاسم</th>
         
            <th className="px-1 py-3 text-right">الرقم التعريفي</th>
            <th className="px-1 py-3 text-right">الرقم</th>
            <th className="px-1 py-3 text-right">تاريخ التسجيل</th>
            <th className="px-1 py-3 text-center">عدد الأيام</th>
            <th className="px-1 py-3 text-center">الأيام المستخدمة</th>
            <th className="px-1 py-3 text-center">  اخر زيارة</th>
            <th className="px-1 py-3 text-center"> انتهاء الاشتراك</th>
            <th className="px-1 py-3 text-center"> اسم الباقة</th>
            <th className="px-1 py-3 text-center"> قيمة الباقة  </th>
            <th className="px-1 py-3 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50 transition">
              <td className="px-1 py-3">{user.name}</td>
         
              <td className="px-1 py-3 break-words">{user.seq}</td>
              <td className="px-1 py-3">{user.mobileNumber}</td>
              <td className="px-1 py-3">
                {new Date(user.joinDate).toLocaleDateString("ar-EG")}
              </td>
              <td className=" px-1 py-3 text-center">{user.totalDays}</td>
              <td className="px-1 py-3 text-center">{user.usedDays}</td>
           
              <td className="p-4 text-center">
  {Array.isArray(user.gymVisits)
    ? user.gymVisits.at(-1)
    : user.gymVisits ?? "-"}
</td>

<td className="px-1 py-3">
  {(() => {
    const joinDate = new Date(user.joinDate);
    const today = new Date();

    const diffTime = today - joinDate; // الفرق بالميلي ثانية
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 30 ? "مرّ 30 يوم" : "لم يمر 30 يوم";
  })()}
</td>

<td className="px-1 py-3 text-center">{user.packageName}</td>
              <td className="px-1 py-3 text-center">{user.videosName}</td>
              <td className="px-1 py-3 flex flex-wrap justify-center gap-2">
                <Link to={`/EditMember/${user._id}`}>
                  <button className="bg-blue hover:bg-blue text-white px-4 py-2 rounded-md text-sm">
                    تعديل
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="bg-red hover:bg-red text-white px-4 py-2 rounded-md text-sm"
                >
                  حذف
                </button>
                <button
                  onClick={() => handleAddVisit(user._id)}
                  className="bg-green hover:bg-green text-white px-4 py-2 rounded-md text-sm"
                >
                  تسجيل حضور
                </button>
                <button
              onClick={() => handleSendEmail(user._id)}
              className="bg-blue hover:bg-blue text-white px-4 py-2 rounded-md text-sm "
            >
               ارسال ايميل 
            </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  
    {/* بطاقات المستخدمين للشاشات الصغيرة */}
    <div className="md:hidden space-y-4">
      {currentUsers.map((user) => (
        <div key={user._id} className="bg-white shadow-md rounded-lg p-4">
          <p className="font-semibold text-gray-700">الاسم: {user.name}</p>
          <p className="text-gray-600">الرقم التعريفي: {user.seq}</p>
          <p className="text-gray-600">الرقم: {user.mobileNumber}</p>
          <p className="text-gray-600">قيمة الباقة: {user.packageName}</p>
          <p className="text-gray-600">اسم الباقة: {user.videosName}</p>
          <p className="text-gray-600">انتهاء الاشتراك:
            
          <span className="px-1 py-3">
  {(() => {
    const joinDate = new Date(user.joinDate);
    const today = new Date();

    const diffTime = today - joinDate; // الفرق بالميلي ثانية
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    return diffDays >= 30 ? "مرّ 30 يوم" : "لم يمر 30 يوم";
  })()}
</span>

            
            
            
             </p>
          <p className="text-gray-600">
            تاريخ التسجيل: {new Date(user.joinDate).toLocaleDateString("ar-EG")}
          </p>
          <p className="text-gray-600">
            عدد الأيام: {user.totalDays} | الأيام المستخدمة: {user.usedDays}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Link className="w-full" to={`/EditMember/${user._id}`}>
              <button className="bg-blue hover:bg-blue text-white px-4 py-2 rounded-md text-sm w-full">
                تعديل
              </button>
            </Link>
            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red hover:bg-red text-white px-4 py-2 rounded-md text-sm w-full"
            >
              حذف
            </button>
           
            <button
              onClick={() => handleAddVisit(user._id)}
              className="bg-green hover:bg-green text-white px-4 py-2 rounded-md text-sm w-full"
            >
              تسجيل الحضور
            </button>
            <button
              onClick={() => handleSendEmail(user._id)}
              className="bg-blue hover:bg-blue text-white px-4 py-2 rounded-md text-sm w-full"
            >
               ارسال ايميل 
            </button>

            
          </div>
        </div>
      ))}
    </div>
  
    {/* أزرار التصفح */}
    {totalPages > 1 && (
      <div className="flex justify-center mt-6 gap-2 flex-wrap">
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`px-3 py-1 rounded-md border ${
              currentPage === index + 1
                ? "bg-red text-white"
                : "bg-white text-gray-600"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    )}
  </div>
  
  );
};

export default Dashboard;
