import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaChartBar, FaWhatsapp, FaSpinner, FaMoon, FaStarAndCrescent, FaStar } from "react-icons/fa";
import { GiLantern } from "react-icons/gi";
import notificationSound from "../../../tones/notification_sound.mp3";
import errorSound from "../../../tones/message_notification.mp3";
import "./Dashboard.css";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // 🆕 الصفحة الحالية
  const usersPerPage = 10; // 🆕 عدد المستخدمين في كل صفحة
  const [visitingId, setVisitingId] = useState(null); // 🆕 حالة التحميل لزر تسجيل الحضور
  const searchInputRef = useRef(null); // 🆕 مرجع حقل البحث
  const [subscriptionFilter, setSubscriptionFilter] = useState(null); // 🔹 فلتر حالة الاشتراك
  const [showRamadanBanner, setShowRamadanBanner] = useState(true);
  const [loggedUser, setLoggedUser] = useState(null); // 👤 المستخدم المسجل حالياً

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setLoggedUser(JSON.parse(user));
    }
  }, []);

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

  // Confirm Delete Modal State
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });

  const closeModal = () => setModalData({ ...modalData, isOpen: false });
  const closeWhatsappModal = () => setWhatsappModal({ isOpen: false, userId: null, userPhone: null });
  const closeConfirmDelete = () => setConfirmDelete({ isOpen: false, userId: null, userName: "" });

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
  }, [modalData.isOpen, closeModal]);

  // Play notification sound when success or error modal appears
  useEffect(() => {
    if (!modalData.isOpen) return;

    if (modalData.type === "success") {
      const audio = new Audio(notificationSound);
      audio.play().catch((err) => console.log("Unable to play success sound:", err));
    } else if (modalData.type === "error") {
      const audio = new Audio(errorSound);
      audio.play().catch((err) => console.log("Unable to play error sound:", err));
    }
  }, [modalData.isOpen, modalData.type]);

  // 🔹 جلب المستخدمين من الـ backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
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

  // 🗑 حذف المستخدم — فتح مودال التأكيد
  const handleDelete = (id, name) => {
    setConfirmDelete({ isOpen: true, userId: id, userName: name || "هذا العضو" });
  };

  // 🗑 تنفيذ الحذف الفعلي بعد التأكيد
  const executeDelete = async () => {
    const id = confirmDelete.userId;
    closeConfirmDelete();
    try {
      await axios.delete(`${apiUrl}/DeleteUser/${id}`);
      setUsers(users.filter((user) => user._id !== id));
      setModalData({
        isOpen: true,
        title: "تم الحذف",
        message: "تم حذف العضو بنجاح ✅",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setModalData({
        isOpen: true,
        title: "خطأ",
        message: "حدث خطأ أثناء الحذف، حاول مرة أخرى",
        type: "error",
      });
    }
  };


  const getSubscriptionStatus = (user) => {
    const renewalDate = user.renewalDate ? new Date(user.renewalDate) : null;
    const today = new Date();
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
    return status;
  };

  // 🔍 فلترة المستخدمين حسب الاسم
  const searchedUsers = users.filter((u) => {
    const lowerSearch = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(lowerSearch) ||
      String(u.seq).includes(lowerSearch)
    );
  });

  const subscriptionCounts = searchedUsers.reduce(
    (acc, user) => {
      const status = getSubscriptionStatus(user);
      acc.all += 1;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { all: 0 }
  );

  const filteredUsers = searchedUsers
    .filter((user) => {
      if (!subscriptionFilter) return true;
      const status = getSubscriptionStatus(user);
      return status === subscriptionFilter;
    })
    .sort((a, b) => {
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


  return (
    <>
      {/* ✨ حبال النور المائلة - fixed فوق كل شيء */}
      <div className="pointer-events-none fixed right-0 top-0 z-[9999] origin-top-right rotate-12">
        <div className="h-1.5 w-56 sm:w-80 md:w-[26rem] bg-gradient-to-l from-[#FACC6B] via-[#FDE68A] to-[#FACC6B] shadow-[0_0_20px_rgba(250,204,107,1)] rounded-full" />
        <div className="mt-1.5 flex justify-between px-2">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FACC6B] shadow-[0_0_12px_rgba(250,204,107,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FDE68A] shadow-[0_0_12px_rgba(253,230,138,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FACC6B] shadow-[0_0_12px_rgba(250,204,107,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FDE68A] shadow-[0_0_12px_rgba(253,230,138,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FACC6B] shadow-[0_0_12px_rgba(250,204,107,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FDE68A] shadow-[0_0_12px_rgba(253,230,138,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FACC6B] shadow-[0_0_12px_rgba(250,204,107,1)]" />
        </div>
      </div>

      <div className="pointer-events-none fixed left-0 top-0 z-[9999] origin-top-left -rotate-12">
        <div className="h-1.5 w-56 sm:w-80 md:w-[26rem] bg-gradient-to-r from-[#FACC6B] via-[#FDE68A] to-[#FACC6B] shadow-[0_0_20px_rgba(250,204,107,1)] rounded-full" />
        <div className="mt-1.5 flex justify-between px-2">
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FACC6B] shadow-[0_0_12px_rgba(250,204,107,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FDE68A] shadow-[0_0_12px_rgba(253,230,138,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FACC6B] shadow-[0_0_12px_rgba(250,204,107,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FDE68A] shadow-[0_0_12px_rgba(253,230,138,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FACC6B] shadow-[0_0_12px_rgba(250,204,107,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FDE68A] shadow-[0_0_12px_rgba(253,230,138,1)]" />
          <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#FACC6B] shadow-[0_0_12px_rgba(250,204,107,1)]" />
        </div>
      </div>

      {/* ✨ الفوانيس المعلقة - fixed فوق كل شيء */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[9998] flex justify-between px-4 sm:px-10">
        <div className="flex items-start gap-5 sm:gap-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-20 sm:h-24 bg-[#FACC6B]" />
            <GiLantern className="text-[#FACC6B] text-4xl sm:text-5xl md:text-6xl drop-shadow-[0_0_12px_rgba(250,204,107,0.9)] animate-float1" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-16 sm:h-20 bg-[#FACC6B]" />
            <FaMoon className="text-[#FDE68A] text-3xl sm:text-4xl md:text-5xl drop-shadow-[0_0_12px_rgba(253,230,138,0.9)] animate-float2" />
          </div>
          <div className="hidden sm:flex flex-col items-center gap-2">
            <div className="w-px h-24 bg-[#FACC6B]" />
            <GiLantern className="text-[#FACC6B] text-4xl sm:text-5xl md:text-6xl drop-shadow-[0_0_12px_rgba(250,204,107,0.9)] animate-float1" />
          </div>
        </div>

        <div className="flex items-start gap-5 sm:gap-8">
          <div className="hidden sm:flex flex-col items-center gap-2">
            <div className="w-px h-22 bg-[#FACC6B]" />
            <GiLantern className="text-[#FACC6B] text-4xl sm:text-5xl md:text-6xl drop-shadow-[0_0_12px_rgba(250,204,107,0.9)] animate-float2" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-18 sm:h-22 bg-[#FACC6B]" />
            <FaStarAndCrescent className="text-[#FDE68A] text-4xl sm:text-5xl md:text-6xl drop-shadow-[0_0_12px_rgba(253,230,138,0.9)] animate-float1" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-px h-20 sm:h-24 bg-[#FACC6B]" />
            <GiLantern className="text-[#FACC6B] text-4xl sm:text-5xl md:text-6xl drop-shadow-[0_0_12px_rgba(250,204,107,0.9)] animate-float2" />
          </div>
        </div>
      </div>

      <div className="db-page" dir="rtl">


        {showRamadanBanner && (
          <div
            className="mb-4 rounded-2xl text-white shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1a0000 0%, #5c0000 25%, #8b0000 50%, #5c0000 75%, #1a0000 100%)",
              boxShadow: "0 8px 32px rgba(139,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
              border: "1px solid rgba(220,38,38,0.3)"
            }}
          >
            {/* شريط زخرفي علوي */}
            <div
              style={{
                height: "3px",
                background: "linear-gradient(90deg, transparent, #FACC6B, #FDE68A, #FACC6B, transparent)",
                boxShadow: "0 0 10px rgba(250,204,107,0.8)"
              }}
            />

            <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* النص الرئيسي */}
              <div className="flex flex-col gap-1 text-right">
                <div className="flex items-center gap-2">
                  <FaStarAndCrescent
                    className="text-2xl"
                    style={{ color: "#FACC6B", filter: "drop-shadow(0 0 8px rgba(250,204,107,0.9))" }}
                  />
                  <span
                    className="text-2xl sm:text-3xl font-extrabold tracking-wide"
                    style={{
                      background: "linear-gradient(90deg, #FDE68A, #FACC6B, #FEF3C7, #FACC6B, #FDE68A)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      textShadow: "none"
                    }}
                  >
                    رمضان كريم 🌙
                  </span>
                </div>
                <p
                  className="text-sm sm:text-base"
                  style={{ color: "rgba(253,230,138,0.85)", textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}
                >
                  نتمنى لك شهراً مليئاً بالصحة والإنجاز والالتزام في الجيم 💪
                </p>
              </div>

              {/* الأيقونات وزر الإخفاء */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <GiLantern
                    className="text-4xl sm:text-5xl animate-float1"
                    style={{ color: "#FACC6B", filter: "drop-shadow(0 0 14px rgba(250,204,107,1))" }}
                  />
                  <FaMoon
                    className="text-3xl sm:text-4xl animate-float2"
                    style={{ color: "#FDE68A", filter: "drop-shadow(0 0 12px rgba(253,230,138,1))" }}
                  />
                  <FaStar
                    className="text-2xl sm:text-3xl animate-float1"
                    style={{ color: "#FEF3C7", filter: "drop-shadow(0 0 10px rgba(254,243,199,1))" }}
                  />
                  <GiLantern
                    className="text-4xl sm:text-5xl animate-float2"
                    style={{ color: "#FACC6B", filter: "drop-shadow(0 0 14px rgba(250,204,107,1))" }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowRamadanBanner(false)}
                  className="text-xs sm:text-sm px-4 py-1.5 rounded-full font-semibold transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, rgba(220,38,38,0.3), rgba(0,0,0,0.4))",
                    border: "1px solid rgba(250,204,107,0.5)",
                    color: "#FDE68A",
                  }}
                >
                  إخفاء ✕
                </button>
              </div>
            </div>

            {/* شريط زخرفي سفلي */}
            <div
              style={{
                height: "3px",
                background: "linear-gradient(90deg, transparent, #cc0000, #8b0000, #cc0000, transparent)",
                boxShadow: "0 0 10px rgba(139,0,0,0.6)"
              }}
            />
          </div>
        )}
        {/* ── Header ── */}
        <div className="db-header mb-3">
          <h1>لوحة التحكم</h1>
        </div>
        {/* ── Toolbar ── */}
        <div className="db-toolbar mb-3">

          {/* ROW 1: Filters (Conditional) + Search (Centered) + Action buttons */}

          {/* Filters - only for master admin */}
          <div className="db-toolbar-filters">
            {(loggedUser?.mobileNumber === "01124045247" && loggedUser?.seq === 0) && (
              <div className="flex flex-nowrap gap-2 items-center">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">تصفية:</span>
                <button
                  onClick={() => { setSubscriptionFilter(null); setCurrentPage(1); }}
                  className={`db-filter-btn ${subscriptionFilter === null ? "active-all" : "inactive-all"}`}
                >
                  الكل <span className="opacity-70">({subscriptionCounts.all || 0})</span>
                </button>
                <button
                  onClick={() => { setSubscriptionFilter("ساري"); setCurrentPage(1); }}
                  className={`db-filter-btn ${subscriptionFilter === "ساري" ? "active-active" : "inactive-active"}`}
                >
                  ✓ ساري <span className="opacity-70">({subscriptionCounts["ساري"] || 0})</span>
                </button>
                <button
                  onClick={() => { setSubscriptionFilter("قارب على الانتهاء"); setCurrentPage(1); }}
                  className={`db-filter-btn ${subscriptionFilter === "قارب على الانتهاء" ? "active-warn" : "inactive-warn"}`}
                >
                  ⚠ قارب <span className="opacity-70">({subscriptionCounts["قارب على الانتهاء"] || 0})</span>
                </button>
                <button
                  onClick={() => { setSubscriptionFilter("منتهي"); setCurrentPage(1); }}
                  className={`db-filter-btn ${subscriptionFilter === "منتهي" ? "active-expired" : "inactive-expired"}`}
                >
                  ✕ منتهي <span className="opacity-70">({subscriptionCounts["منتهي"] || 0})</span>
                </button>
              </div>
            )}
          </div>

          {/* Centered search bar */}
          <div className="db-toolbar-search">
            <div className="db-search-wrap">
              <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="ابحث بالاسم أو الرقم التعريفي…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => { setSearch(""); setCurrentPage(1); }}
                  className="db-search-clear"
                >
                  مسح ✕
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="db-toolbar-actions">
            <div className="flex items-center gap-2">
              <Link to="/Charts" className="db-action-btn">
                <FaChartBar />
                الإحصائيات
              </Link>
              <button onClick={() => navigate(-1)} className="db-action-btn">
                <FaArrowLeft />
                رجوع
              </button>
            </div>
          </div>

        </div>

        <div className="hidden md:block db-table-wrap">
          <table className="db-table">
            <thead>
              <tr>
                <th className="text-right">الاسم</th>
                <th className="text-right">الرقم التعريفي</th>
                <th className="text-right">الهاتف</th>
                <th className="text-right">تاريخ التسجيل</th>
                <th className="text-center">تاريخ التجديد</th>
                <th className="text-center">المدة</th>
                <th className="text-center">عدد الأيام</th>
                <th className="text-center">الأيام المستخدمة</th>
                <th className="text-center">آخر زيارة</th>
                <th className="text-center">انتهاء الاشتراك</th>
                <th className="text-center">قيمة الباقة</th>
                <th className="text-center">اسم الباقة</th>
                <th className="text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => {
                const status = getSubscriptionStatus(user);
                return (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td className="text-center">{user.seq}</td>
                    <td>{user.mobileNumber}</td>
                    <td>{new Date(user.joinDate).toLocaleDateString("ar-EG")}</td>
                    <td className="text-center">{new Date(user.renewalDate).toLocaleDateString("ar-EG")}</td>
                    <td className="text-center">{timeAgo(user.renewalDate)}</td>
                    <td className="text-center">{user.totalDays}</td>
                    <td className="text-center">{user.usedDays}</td>
                    <td className="text-center">
                      {Array.isArray(user.gymVisits) ? user.gymVisits.at(-1) : user.gymVisits ?? "-"}
                    </td>
                    <td className="text-center">
                      {status === "منتهي" ? (
                        <span className="badge badge-expired">منتهي</span>
                      ) : status === "قارب على الانتهاء" ? (
                        <span className="badge badge-warning">قارب على الانتهاء</span>
                      ) : (
                        <span className="badge badge-active">ساري</span>
                      )}
                    </td>


                    <td className="text-center">{user.packagePrice}</td>
                    <td className="text-center">{user.packageName}</td>
                    <td>
                      <div className="flex flex-wrap justify-center gap-1.5">
                        <Link to={`/EditMember/${user._id}`}>
                          <button className="tbl-btn tbl-btn-edit">تعديل</button>
                        </Link>
                        <button onClick={() => handleDelete(user._id, user.name)} className="tbl-btn tbl-btn-delete">حذف</button>
                        <button
                          onClick={() => handleAddVisit(user._id)}
                          disabled={status === "منتهي" || visitingId === user._id}
                          className={`tbl-btn ${status === "منتهي" ? "tbl-btn-disabled" : "tbl-btn-attend"} ${visitingId === user._id ? "opacity-70 cursor-wait" : ""}`}
                        >
                          {visitingId === user._id ? (
                            <span className="flex items-center gap-1"><FaSpinner className="animate-spin" /> جاري...</span>
                          ) : "تسجيل الحضور"}
                        </button>
                        {user.mobileNumber && (
                          <button
                            onClick={() => handleWhatsAppClick(user._id, user.mobileNumber)}
                            className="tbl-btn tbl-btn-wa"
                          >
                            <FaWhatsapp /> واتساب
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-3">
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
              <div key={user._id} className="db-card">
                <div className="card-name flex items-center justify-between">
                  <span>{user.name}</span>
                  {isExpired ? (
                    <span className="badge badge-expired">منتهي</span>
                  ) : isWarning ? (
                    <span className="badge badge-warning">قارب على الانتهاء</span>
                  ) : (
                    <span className="badge badge-active">ساري</span>
                  )}
                </div>
                <div className="card-row"><span>الرقم التعريفي</span><span>{user.seq}</span></div>
                <div className="card-row"><span>الهاتف</span><span>{user.mobileNumber}</span></div>
                <div className="card-row"><span>قيمة الباقة</span><span>{user.packagePrice} ج.م</span></div>
                <div className="card-row"><span>اسم الباقة</span><span>{user.packageName || user.videosName}</span></div>
                <div className="card-row"><span>تاريخ التسجيل</span><span>{new Date(user.joinDate).toLocaleDateString("ar-EG")}</span></div>
                <div className="card-row"><span>المدة</span><span>{timeAgo(user.joinDate)}</span></div>
                <div className="card-row"><span>الأيام</span><span>{user.usedDays} / {user.totalDays}</span></div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link className="flex-1" to={`/EditMember/${user._id}`}>
                    <button className="tbl-btn tbl-btn-edit w-full justify-center">تعديل</button>
                  </Link>
                  <button onClick={() => handleDelete(user._id, user.name)} className="tbl-btn tbl-btn-delete flex-1 justify-center">حذف</button>
                  <button
                    onClick={() => handleAddVisit(user._id)}
                    disabled={isExpired || visitingId === user._id}
                    className={`tbl-btn flex-1 justify-center ${isExpired ? "tbl-btn-disabled" : "tbl-btn-attend"}`}
                  >
                    {visitingId === user._id ? <><FaSpinner className="animate-spin" /> جاري...</> : "تسجيل الحضور"}
                  </button>
                  {user.mobileNumber && (
                    <button
                      onClick={() => handleWhatsAppClick(user._id, user.mobileNumber)}
                      className="tbl-btn tbl-btn-wa flex-1 justify-center"
                    >
                      <FaWhatsapp /> واتساب
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col items-center mt-6 gap-2">
            <p className="text-xs text-gray-400 font-semibold">
              عرض <span className="text-gray-600 font-bold">{currentUsers.length}</span> من <span className="text-gray-600 font-bold">{filteredUsers.length}</span> عضو
            </p>
            {totalPages > 1 && (
              <div className="db-pagination">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => paginate(index + 1)}
                    className={`db-page-btn ${currentPage === index + 1 ? "active" : ""}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
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
                className={`text-2xl font-bold mb-4 ${modalData.type === "error" ? "text-red" : "text-green"
                  }`}
              >
                {modalData.title}
              </h2>
              <p className="text-gray-700 text-lg mb-6">{modalData.message}</p>
              <button
                onClick={closeModal}
                className={`px-6 py-2 text-white font-bold rounded-lg shadow-md transition ${modalData.type === "error"
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

        {/* 🗑 Confirm Delete Modal */}
        {confirmDelete.isOpen && (
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={closeConfirmDelete}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl w-11/12 md:w-[400px] p-8 text-center transform transition-all scale-100 border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-20 h-20 bg-red/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-gray-800">تأكيد الحذف</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                هل أنت متأكد أنك تريد حذف <span className="font-bold text-red">&quot;{confirmDelete.userName}&quot;</span>؟
                <br />
                <span className="text-sm text-gray-400 mt-2 block">هذا الإجراء لا يمكن التراجع عنه.</span>
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={executeDelete}
                  className="w-full py-3.5 bg-red hover:bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red/30 transition-all active:scale-95"
                >
                  تأكيد الحذف النهائي
                </button>
                <button
                  onClick={closeConfirmDelete}
                  className="w-full py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all active:scale-95"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>{/* end db-page */}
    </>
  );
};

export default Dashboard;
