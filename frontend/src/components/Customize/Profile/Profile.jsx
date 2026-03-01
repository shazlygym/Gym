import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaDumbbell,
  FaCheckCircle,
  FaUserPlus,
  FaExclamationTriangle,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import { FaGaugeHigh } from "react-icons/fa6";
import "./Profile.css";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Profile = () => {
  const { mobileNumber } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${apiUrl}/GetDataProfile/${mobileNumber}`);
        setUser(res.data);
      } catch (err) {
        console.error("حدث خطأ أثناء جلب البيانات:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [mobileNumber]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg font-medium">جارِ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <FaTimesCircle className="text-red-600 text-5xl mx-auto mb-4" />
          <p className="text-red-600 text-xl font-bold">لم يتم العثور على المستخدم</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">العودة للرئيسية</Link>
        </div>
      </div>
    );
  }

  const progress = (user.usedDays / user.totalDays) * 100;
  const remainingDays = user.totalDays - user.usedDays;

  const renewalDate = new Date(user.renewalDate || user.joinDate);
  const today = new Date();
  const diffTime = today - renewalDate;
  const daysSinceRenewal = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const daysLeftInMonth = 30 - daysSinceRenewal;

  const isExpiredByDate = daysSinceRenewal >= 30;
  const isExpiredByUsage = remainingDays <= 0;
  const isExpired = isExpiredByDate || isExpiredByUsage;

  const isWarningByDate = !isExpired && daysLeftInMonth <= 5;
  const isWarningByUsage = !isExpired && remainingDays <= 3;
  const isWarning = isWarningByDate || isWarningByUsage;

  const status = isExpired ? "منتهي" : "نشط";

  return (
    <div className="profile-page" dir="rtl">
      <h1 className="profile-title">الملف الشخصي</h1>

      <div className="max-w-[1400px] mx-auto px-4">
        {/* Alerts Section */}
        {isExpired && (
          <div className="alert-container">
            <div className="subscription-alert alert-expired">
              <div className="alert-icon-wrap">
                <FaTimesCircle />
              </div>
              <div className="alert-content">
                <span className="alert-title">تنبيه: اشتراكك منتهي!</span>
                <span className="alert-desc">يرجى تجديد الاشتراك للاستمرار في الاستفادة من الخدمات.</span>
              </div>
            </div>
          </div>
        )}

        {isWarning && (
          <div className="alert-container">
            <div className="subscription-alert alert-warning">
              <div className="alert-icon-wrap">
                <FaExclamationTriangle />
              </div>
              <div className="alert-content">
                <span className="alert-title">تنبيه: اشتراكك على وشك الانتهاء!</span>
                <span className="alert-desc">
                  {isWarningByDate
                    ? `متبقي ${daysLeftInMonth} أيام على انتهاء الشهر.`
                    : `متبقي ${remainingDays} زيارات فقط.`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Horizontal Bar */}
        <div className="stats-horizontal mb-8">
          <div className="stat-card">
            <div className="stat-icon-wrap"><FaCalendarAlt /></div>
            <div className="stat-info">
              <h3>الأيام المتبقية</h3>
              <div className="value">{remainingDays} يوم</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon-wrap"><FaDumbbell /></div>
            <div className="stat-info">
              <h3>نسبة الإنجاز</h3>
              <div className="value">{Math.round(progress)}%</div>
            </div>
          </div>

          <div className={`stat-card ${status === "نشط" ? "active" : "expired"}`}>
            <div className="stat-icon-wrap"><FaCheckCircle /></div>
            <div className="stat-info">
              <h3>حالة الاشتراك</h3>
              <div className="value">{status}</div>
            </div>
          </div>
        </div>

        <div className="w-full">
          {/* Main Data Card */}
          <div className="data-card">
            <h2>
              <FaUser className="text-red-600" />
              بيانات العضو
            </h2>

            {user.admin && (
              <div className="admin-actions">
                <Link to="/Dashboard" className="admin-btn admin-btn-dashboard">
                  <FaGaugeHigh />
                  لوحة التحكم
                </Link>
                <Link to="/SignUp" className="admin-btn admin-btn-signup">
                  <FaUserPlus />
                  التسجيل
                </Link>
              </div>
            )}

            <div className="info-grid">
              <div className="info-item">
                <div className="info-item-icon"><FaCheckCircle /></div>
                <div className="info-item-content">
                  <span className="info-item-label">الاسم</span>
                  <span className="info-item-value">{user.name}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon"><FaPhone /></div>
                <div className="info-item-content">
                  <span className="info-item-label">رقم الهاتف</span>
                  <span className="info-item-value">{user.mobileNumber}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon"><FaEnvelope /></div>
                <div className="info-item-content">
                  <span className="info-item-label">البريد الإلكتروني</span>
                  <span className="info-item-value">{user.email || "غير متوفر"}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon"><FaCalendarAlt /></div>
                <div className="info-item-content">
                  <span className="info-item-label">تاريخ التسجيل</span>
                  <span className="info-item-value">{new Date(user.joinDate).toLocaleDateString("ar-EG")}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon"><FaCalendarAlt /></div>
                <div className="info-item-content">
                  <span className="info-item-label">تاريخ التجديد</span>
                  <span className="info-item-value">{new Date(user.renewalDate).toLocaleDateString("ar-EG")}</span>
                </div>
              </div>

              <div className="info-item">
                <div className="info-item-icon"><FaDumbbell /></div>
                <div className="info-item-content">
                  <span className="info-item-label">إجمالي الأيام</span>
                  <span className="info-item-value">{user.totalDays} يوم</span>
                </div>
              </div>
            </div>

            {/* Progress Bar Section */}
            <div className="progress-section">
              <div className="progress-header">
                <span className="progress-label">استهلاك الأيام</span>
                <span className="progress-percent">{Math.round(progress)}%</span>
              </div>
              <div className="modern-progress-bar">
                <div 
                  className="modern-progress-fill" 
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
              <p className="progress-footer">
                مستهلك {user.usedDays} من أصل {user.totalDays} يوم
              </p>
            </div>
          </div>
        </div>

        {/* Videos Section */}
        <div className="videos-container">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <FaDumbbell className="text-red-600" />
            فيديوهات التمارين لليوم
          </h2>

          {user.videos && user.videos.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {user.videos.map((videoUrl, index) => {
                let videoId = "";
                if (videoUrl.includes("watch?v=")) videoId = videoUrl.split("watch?v=")[1].split("&")[0];
                else if (videoUrl.includes("youtu.be/")) videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
                else if (videoUrl.includes("shorts/")) videoId = videoUrl.split("shorts/")[1].split("?")[0];

                return (
                  <div key={index} className="video-card">
                    <iframe
                      className="w-full h-72 md:h-80"
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`تمرين ${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-400 text-lg">لا توجد فيديوهات تمارين مخصصة لليوم</p>
            </div>
          )}

          {user.comment && (
            <div className="comment-box">
              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaEnvelope className="text-red-600 text-lg" />
                ملاحظات المدرب
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {user.comment}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
