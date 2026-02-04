import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChartBar } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 🆕 الصفحة الحالية
  const usersPerPage = 10; // 🆕 عدد المستخدمين في كل صفحة

  // Modal State
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success", // success | error | warning
  });

  const closeModal = () => setModalData({ ...modalData, isOpen: false });

  const navigate = useNavigate();

  useEffect(() => {
    if (!modalData.isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Enter" || event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalData.isOpen]);

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
      setModalData({
        isOpen: true,
        title: "تنبيه",
        message: "❌ انتهى اشتراك هذا المستخدم في الجيم!",
        type: "error",
      });
      return;
    }

    try {
      const res = await axios.post(`${apiUrl}/addGymVisit/${id}`);
      setModalData({
        isOpen: true,
        title: "نجاح",
        message: res.data.message || "تم تسجيل الحضور بنجاح ✅",
        type: "success",
      });

      const updatedUsers = users.map((u) =>
        u._id === id ? { ...u, usedDays: u.usedDays + 1 } : u
      );
      setUsers(updatedUsers);
    } catch (err) {
      console.error(err);
      setModalData({
        isOpen: true,
        title: "خطأ",
        message: "حدث خطأ أثناء تسجيل الزيارة",
        type: "error",
      });
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
  
        setModalData({
          isOpen: true,
          title: "نجاح",
          message: response.data.message || "تم إرسال التذكير بنجاح ✅",
          type: "success",
        });
      } catch (error) {
        console.error("❌ خطأ أثناء إرسال البريد:", error);
        setModalData({
          isOpen: true,
          title: "خطأ",
          message: error.response?.data?.message || "حدث خطأ أثناء إرسال البريد الإلكتروني",
          type: "error",
        });
      } 
    };


    function timeAgo(dateString) {
      const now = new Date();
      const past = new Date(dateString);
    
      const diffInMs = now - past;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
      if (diffInDays < 1) return "اليوم";
      if (diffInDays < 30) return `منذ ${diffInDays} يوم`;
    
      const months = Math.floor(diffInDays / 30);
      if (months < 12) return `منذ ${months} شهر`;
    
      const years = Math.floor(months / 12);
      return `منذ ${years} سنة`;
    }


    const renewalDate = users.renewalDate ? new Date(users.renewalDate) : null;
    const today = new Date();
    
    let status = "ساري";
    
    if (renewalDate) {
      const diffTime = today - renewalDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const daysLeft = 30 - diffDays;
    
      if (diffDays >= 30) {
        status = "منتهي";
      } else if (daysLeft === 7) {
        status = "قارب على الانتهاء";
      }

      console.log("renewal:", users.renewalDate);
console.log("days passed:", diffDays);

    }
    
    

  return (
    <div className="p-4 bg-gray-100 min-h-screen" dir="rtl">
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <h1 className="text-3xl font-bold text-gray-600">لوحة التحكم</h1>
<div className="flex w-full items-center gap-2 rounded-lg border bg-white p-2 shadow-sm sm:w-80">
          <input
            type="text"
            placeholder="ابحث عن المستخدم .."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-transparent px-2 outline-none"
          />
          <button
            type="button"
           onClick={() => {
              setSearch("");
              setCurrentPage(1);
            }}
            disabled={!search}
            className="rounded-md bg-red px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            حذف
          </button>
          <button
            type="button"
            disabled={!search}
            className="rounded-md border px-3 py-1 text-sm font-semibold text-gray-600 transition hover:bg-green hover:text-white hover:border-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            بحث
          </button>
        </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        {}
        

        <div className="flex items-center gap-2">
          {}
          <Link
            to="/Charts"
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-md transition hover:bg-red-50"
          >
            <FaChartBar className="text-red text-xl" />
            <span className="font-semibold">الاحصائيات</span>
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-red shadow-md transition hover:bg-red-50"
          >
            <FaArrowLeft className="text-red text-lg" />
            <span className="font-semibold">رجوع</span>
          </button>
        </div>
      </div>
    </div>

<div className="hidden md:block overflow-x-auto bg-white shadow-lg rounded-lg">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-red text-white">
            <th className="px-1 py-3 text-right">الاسم</th>
         
            <th className="px-1 py-3 text-right">الرقم التعريفي</th>
            <th className="px-1 py-3 text-right">الهاتف</th>
            <th className="px-1 py-3 text-right">تاريخ التسجيل</th>
            <th className="px-1 py-3 text-center">تاريخ التجديد </th>
            <th className="px-1 py-3 text-right"> المدة</th>
            <th className="px-1 py-3 text-center">عدد الأيام</th>
            <th className="px-1 py-3 text-center">الأيام المستخدمة</th>
            <th className="px-1 py-3 text-center">  اخر زيارة</th>
            <th className="px-1 py-3 text-center"> انتهاء الاشتراك</th>
            <th className="px-1 py-3 text-center"> قيمة الباقة  </th>
            <th className="px-1 py-3 text-center"> اسم الباقة</th>
            <th className="px-1 py-3 text-center">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => {
             const joinDate = new Date(user.joinDate);
             const today = new Date();
             const diffTime = today - joinDate;
             const daysSinceJoin = Math.floor(diffTime / (1000 * 60 * 60 * 24));
             const daysLeftInMonth = 30 - daysSinceJoin;
             const remainingDays = user.totalDays - user.usedDays;
     
             const isExpiredByDate = daysSinceJoin >= 30;
             const isExpiredByUsage = remainingDays <= 0;
             const isExpired = isExpiredByDate || isExpiredByUsage;
     
             const isWarningByDate = !isExpired && daysLeftInMonth === 7;
             const isWarningByUsage = !isExpired && remainingDays <= 3;
             const isWarning = isWarningByDate || isWarningByUsage;


             const renewalDate = user.renewalDate ? new Date(user.renewalDate) : null;
           
             let status = "ساري";
           
             if (renewalDate) {
               const diffTime = today - renewalDate;
               const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
               const daysLeft = 30 - diffDays;
           
               if (diffDays >= 30) {
                 status = "منتهي";
               } else if (daysLeft <= 5) {
                 status = "قارب على الانتهاء";
               }
             
              }
            return (
            <tr key={user._id} className="border-b hover:bg-gray-50 transition">
              <td className="px-1 py-3">{user.name}</td>
         
              <td className="px-1 py-3 break-words">{user.seq}</td>
              <td className="px-1 py-3">{user.mobileNumber}</td>
              <td className="px-1 py-3">
                {new Date(user.joinDate).toLocaleDateString("ar-EG")}
              </td>
              <td className="px-1 py-3 text-center">

{new Date(user.renewalDate).toLocaleDateString("ar-EG")}
</td>
              <td className="px-1 py-3 text-center">
  {timeAgo(user.renewalDate)}
</td>


              <td className=" px-1 py-3 text-center">{user.totalDays}</td>
              <td className="px-1 py-3 text-center">{user.usedDays}</td>
              <td className="p-4 text-center">
  {Array.isArray(user.gymVisits)
    ? user.gymVisits.at(-1)
    : user.gymVisits ?? "-"}
</td>
           
            
           
              <td className="px-1 py-3 text-center">
  {status === "منتهي" ? (
    <span className="text-white bg-red px-2 py-1 rounded-md font-bold">
      منتهي
    </span>
  ) : status === "قارب على الانتهاء" ? (
    <span className="bg-black text-white px-2 py-1 rounded-md font-bold">
      قارب على الانتهاء
    </span>
  ) : (
    <span className="bg-green text-white px-2 py-1 rounded-md font-bold">
      ساري
    </span>
  )}
</td>


<td className="px-1 py-3 text-center">{user.packagePrice}</td>
              <td className="px-1 py-3 text-center">{user.packageName}</td>
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
  disabled={status=="منتهي"}
  className={`px-4 py-2 rounded-md text-sm transition ${
    status=="منتهي"
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-green hover:bg-green text-white"
  }`}
>
  تسجيل الحضور
</button>

                <button
                  onClick={() => handleSendEmail(user._id)}
                  className="bg-blue hover:bg-blue text-white px-4 py-2 rounded-md text-sm"
                >
                   ارسال ايميل 
                </button>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  
    <div className="md:hidden space-y-4">
      {currentUsers.map((user) => {
        const joinDate = new Date(user.renewalDate);
        const today = new Date();
        const diffTime = today - joinDate;
        const daysSinceJoin = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const daysLeftInMonth = 30 - daysSinceJoin;
        const remainingDays = user.totalDays - user.usedDays;

        const isExpiredByDate = daysSinceJoin >= 30;
        const isExpiredByUsage = remainingDays <= 0;
        const isExpired = isExpiredByDate || isExpiredByUsage;

        const isWarningByDate = !isExpired && daysLeftInMonth === 7;
        const isWarningByUsage = !isExpired && remainingDays <= 3;
        const isWarning = isWarningByDate || isWarningByUsage;

        return (
        <div key={user._id} className="bg-white shadow-md rounded-lg p-4">
          <p className="font-semibold text-gray-700">الاسم: {user.name}</p>
          <p className="text-gray-600">الرقم التعريفي: {user.seq}</p>
          <p className="text-gray-600">الهاتف: {user.mobileNumber}</p>
          <p className="text-gray-600">قيمة الباقة: {user.packagePrice}</p>
          <p className="text-gray-600">اسم الباقة: {user.videosName}</p>
          <p className="text-gray-600">انتهاء الاشتراك:
            
          <span className="px-1 py-3">
            {isExpired ? (
              <span className="text-white bg-red px-2 py-1 rounded-md font-bold">منتهي</span>
            ) : isWarning ? (
              <span className="bg-black text-white px-2 py-1 rounded-md font-bold">قارب على الانتهاء</span>
            ) : (
              <span className="bg-green text-white px-2 py-1 rounded-md font-bold">ساري</span>
            )}
          </span>

            
            
            
             </p>
          <p className="text-gray-600">
            تاريخ التسجيل: {new Date(user.joinDate).toLocaleDateString("ar-EG")}
          </p>

          <p className="text-gray-600">
             المدة:   {timeAgo(user.joinDate)}

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
              disabled={isExpired}
              className={`px-4 py-2 rounded-md text-sm w-full transition ${
                isExpired
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green hover:bg-green text-white"
              }`}
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
            );
          })}
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

    {/* Custom Modal */}
    {modalData.isOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={closeModal}
      >
        <div
          className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/3 p-6 text-center transform transition-all scale-100"
          onClick={(e) => e.stopPropagation()}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              modalData.type === "error" ? "text-red" : "text-green"
            }`}
          >
            {modalData.title}
          </h2>
          <p className="text-gray-700 text-lg mb-6">{modalData.message}</p>
          <button
            onClick={closeModal}
            className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition ${
              modalData.type === "error"
                ? "bg-red hover:bg-red"
                : "bg-green hover:bg-green"
            }`}
          >
            حسناً
          </button>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default Dashboard;
