import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChartBar, FaWhatsapp, FaSpinner } from "react-icons/fa";
import notificationSound from "../../../tones/notification_sound.mp3";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 🆕 الصفحة الحالية
  const usersPerPage = 10; // 🆕 عدد المستخدمين في كل صفحة
  const [visitingId, setVisitingId] = useState(null); // 🆕 حالة التحميل لزر تسجيل الحضور
  const searchInputRef = useRef(null); // 🆕 مرجع حقل البحث

  // Modal State
  const [modalData, setModalData] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success", // success | error | warning
  });

  // WhatsApp Modal State
  const [whatsappModal, setWhatsappModal] = useState({
    isOpen: false,
    userId: null,
    userPhone: null,
  });

  const closeModal = () => setModalData({ ...modalData, isOpen: false });
  const closeWhatsappModal = () => setWhatsappModal({ isOpen: false, userId: null, userPhone: null });

  const navigate = useNavigate();

  // Build WhatsApp link from a raw phone number (digits only)
  const buildWhatsAppLink = (rawNumber, message = "") => {
    // Keep only digits
    let num = String(rawNumber || "").replace(/[^\d]/g, "");

    if (!num) return "https://wa.me/"; // fallback

    // Handle numbers starting with 00 (international prefix)
    if (num.startsWith("00")) {
      num = num.slice(2);
    }

    const DEFAULT_COUNTRY_CODE = "20"; // Egypt

    // If already includes country code (e.g., 20...), keep as is
    let whatsappLink = "";
    if (num.startsWith(DEFAULT_COUNTRY_CODE)) {
      whatsappLink = `https://wa.me/${num}`;
    } else {
      // Remove leading 0 from local numbers (e.g., 011..., 012..., etc.)
      if (num.startsWith("0")) {
        num = num.slice(1);
      }
      // Prefix default country code
      whatsappLink = `https://wa.me/${DEFAULT_COUNTRY_CODE}${num}`;
    }

    // Add message if provided
    if (message) {
      whatsappLink += `?text=${encodeURIComponent(message)}`;
    }

    return whatsappLink;
  };

  // Handle opening WhatsApp modal
  const handleWhatsAppClick = (userId, userPhone) => {
    setWhatsappModal({ isOpen: true, userId, userPhone });
  };

  // Handle sending WhatsApp message with selected template
  const handleSendWhatsAppMessage = (message) => {
    if (whatsappModal.userPhone) {
      const link = buildWhatsAppLink(whatsappModal.userPhone, message);
      window.open(link, "_blank");
      closeWhatsappModal();
    }
  };

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

  // Play notification sound when success modal appears
  useEffect(() => {
    if (modalData.isOpen && modalData.type === "success") {
      const audio = new Audio(notificationSound);
      audio.play().catch((err) => console.log("Unable to play sound:", err));
    }
  }, [modalData.isOpen, modalData.type]);

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
        // 🔹 تركيز على حقل البحث بعد التحميل
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 100);
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

    setVisitingId(id);
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

      // 🔹 إعادة تحميل الصفحة بعد 1.5 ثانية من النجاح
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error(err);
      setModalData({
        isOpen: true,
        title: "خطأ",
        message: "حدث خطأ أثناء تسجيل الزيارة",
        type: "error",
      });
    } finally {
      setVisitingId(null);
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
  }).sort((a, b) => {
    // 🔹 فرز المستخدمين: المنتهي اشتراكهم أولاً
    const today = new Date();
    
    // حساب حالة المستخدم الأول (a)
    const renewalDateA = a.renewalDate ? new Date(a.renewalDate) : null;
    const diffTimeA = today - renewalDateA;
    const diffDaysA = Math.floor(diffTimeA / (1000 * 60 * 60 * 24));
    const isExpiredA = diffDaysA >= 30;
    
    // حساب حالة المستخدم الثاني (b)
    const renewalDateB = b.renewalDate ? new Date(b.renewalDate) : null;
    const diffTimeB = today - renewalDateB;
    const diffDaysB = Math.floor(diffTimeB / (1000 * 60 * 60 * 24));
    const isExpiredB = diffDaysB >= 30;
    
    // وضع المنتهي اشتراكهم أولاً
    if (isExpiredA && !isExpiredB) return -1;
    if (!isExpiredA && isExpiredB) return 1;
    return 0;
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
            ref={searchInputRef}
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
  disabled={status === "منتهي" || visitingId === user._id}
  className={`px-4 py-2 rounded-md text-sm transition ${
    status === "منتهي"
      ? "bg-gray-400 cursor-not-allowed text-white"
      : "bg-green hover:bg-green text-white"
  } ${visitingId === user._id ? "opacity-70 cursor-wait" : ""}`}
>
  {visitingId === user._id ? (
    <span className="flex items-center gap-2">
      <FaSpinner className="animate-spin" />
      جاري التسجيل...
    </span>
  ) : (
    "تسجيل الحضور"
  )}
</button>

  {user.mobileNumber && (
    <button
      onClick={() => handleWhatsAppClick(user._id, user.mobileNumber)}
      className="bg-green hover:bg-green text-white px-4 py-2 rounded-md text-sm flex items-center gap-2"
    >
      <FaWhatsapp className="text-white" />
      واتساب
    </button>
  )}
{/* 
  <button
    onClick={() => handleSendEmail(user._id)}
    className="bg-blue hover:bg-blue text-white px-4 py-2 rounded-md text-sm"
  >
    ارسال ايميل 
  </button> */}
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
              disabled={isExpired || visitingId === user._id}
              className={`px-4 py-2 rounded-md text-sm w-full transition ${
                isExpired
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-green hover:bg-green text-white"
              } ${visitingId === user._id ? "opacity-70 cursor-wait" : ""}`}
          >
            {visitingId === user._id ? (
              <span className="flex items-center justify-center gap-2 w-full">
                <FaSpinner className="animate-spin" />
                جاري التسجيل...
              </span>
            ) : (
              "تسجيل الحضور"
            )}
          </button>

            {user.mobileNumber && (
              <button
                onClick={() => handleWhatsAppClick(user._id, user.mobileNumber)}
                className="bg-green hover:bg-green-500 text-white px-4 py-2 rounded-md text-sm w-full flex items-center justify-center gap-2"
              >
                <FaWhatsapp className="text-white" />
                واتساب
              </button>
            )}

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

    {/* WhatsApp Message Selection Modal */}
    {whatsappModal.isOpen && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        onClick={closeWhatsappModal}
      >
        <div
          className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 p-6 text-center transform transition-all scale-100 max-h-screen overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800">اختر رسالة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => handleSendWhatsAppMessage("مرحبا بك في ايجل جيم.")}
              className="bg-blue hover:bg-blue text-white px-4 py-3 rounded-lg font-bold transition"
            >
              رسالة الترحيب 👋
              <p className="text-xs mt-2 font-normal">مرحبا بك في ايجل جيم.</p>
            </button>
            <button
              onClick={() => handleSendWhatsAppMessage("نتمنى أن تكون بخير، لم نرك منذ فترة. نحن ننتظر عودتك!")}
              className="bg-[#b68a35] hover:bg-[#b68a35] text-white px-4 py-3 rounded-lg font-bold transition"
            >
              رسالة الغياب 🤔
              <p className="text-xs mt-2 font-normal">لم نرك منذ فترة</p>
            </button>
            <button
              onClick={() => handleSendWhatsAppMessage("مرحبا، اشتراكك على وشك الانتهاء قريبا جدا. يرجى التجديد.")}
              className="bg-[#E54B1D] hover:bg-[#E54B1D] text-white px-4 py-3 rounded-lg font-bold transition"
            >
              انتهاء قريب ⏰
              <p className="text-xs mt-2 font-normal">الاشتراك على وشك الانتهاء</p>
            </button>
            <button
              onClick={() => handleSendWhatsAppMessage("مرحبا، تم انتهاء اشتراكك. يرجى التجديد لمتابعة التدريبات.")}
              className="bg-red hover:bg-red text-white px-4 py-3 rounded-lg font-bold transition"
            >
              انتهاء الاشتراك ❌
              <p className="text-xs mt-2 font-normal">انتهى الاشتراك</p>
            </button>
            <button
              onClick={() => handleSendWhatsAppMessage("شكرا لك على تجديد اشتراكك معنا! نتطلع لرؤيتك قريبا.")}
              className="bg-green hover:bg-green text-white px-4 py-3 rounded-lg font-bold transition"
            >
              تجديد الاشتراك ✅
              <p className="text-xs mt-2 font-normal">شكرا على التجديد</p>
            </button>
          </div>
          <button
            onClick={closeWhatsappModal}
            className="mt-6 px-6 py-2 text-gray-600 font-bold rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            إلغاء
          </button>
        </div>
      </div>
    )}
  </div>
  
  );
};

export default Dashboard;
