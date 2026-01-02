import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaDumbbell,
  FaCheckCircle,
  FaUserPlus,
} from "react-icons/fa";
import { FaGaugeHigh } from "react-icons/fa6";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Profile = () => {
  const { mobileNumber } = useParams(); // استخراج الإيميل من الـ URL
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">جارِ تحميل البيانات...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-lg">لم يتم العثور على المستخدم</p>
      </div>
    );
  }

  const progress = (user.usedDays / user.totalDays) * 100;
  const remainingDays = user.totalDays - user.usedDays;
  const status = remainingDays > 0 ? "نشط" : "منتهي";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-3xl font-bold text-center text-red mb-10">
        الملف الشخصي
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* كارد البيانات */}
        <div className="md:col-span-2 bg-white shadow-2xl rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-600 mb-6 border-b pb-3">
            بيانات العضو
          </h2>

          {/* أزرار المسؤول */}
          {user.admin && (
            <div className="flex gap-6 mt-6 mb-8">
              <Link to="/Dashboard">
                <div className="flex items-center px-4 py-2 bg-white shadow-md rounded-lg hover:bg-red-50 transition">
                  <FaGaugeHigh className="text-red text-2xl" />
                  <h1 className="mx-3 font-semibold">لوحة التحكم</h1>
                </div>
              </Link>

              <Link to="/SignUp">
                <div className="flex items-center px-4 py-2 bg-white shadow-md rounded-lg hover:bg-red-50 transition">
                  <FaUserPlus className="text-red text-2xl" />
                  <h1 className="mx-3 font-semibold">التسجيل</h1>
                </div>
              </Link>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
            <p className="flex items-center gap-2">
              <FaCheckCircle className="text-red" />
              <span className="font-semibold">الاسم:</span> {user.name}
            </p>
            <p className="flex items-center gap-2">
              <FaPhone className="text-red" />
              <span className="font-semibold">الرقم:</span> {user.mobileNumber}
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="text-red" />
              <span className="font-semibold">الإيميل:</span> {user.email}
            </p>
            <p className="flex items-center gap-2">
              <FaCalendarAlt className="text-red" />
              <span className="font-semibold">تاريخ التسجيل:</span>{" "}
              {new Date(user.joinDate).toLocaleDateString("ar-EG")}
            </p>
            <p className="flex items-center gap-2">
              <FaDumbbell className="text-red" />
              <span className="font-semibold">عدد الأيام المسجلة:</span>{" "}
              {user.totalDays}
            </p>
            <p className="flex items-center gap-2">
              <FaDumbbell className="text-red" />
              <span className="font-semibold">الأيام المستهلكة:</span>{" "}
              {user.usedDays}
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <p className="text-sm font-medium text-gray-600 mb-2">
              استهلاك الأيام
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-red h-3 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {user.usedDays} / {user.totalDays} يوم
            </p>
          </div>
        </div>

        {/* إحصائيات سريعة */}
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">الأيام المتبقية</h3>
            <p className="text-2xl font-bold text-red">{remainingDays} يوم</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">نسبة الإنجاز</h3>
            <p className="text-2xl font-bold text-red">{Math.round(progress)}%</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700">الحالة</h3>
            <p
              className={`text-2xl font-bold ${
                status === "نشط" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status}
            </p>
          </div>
        </div>
      </div>

      {/* قسم الفيديوهات */}
      <div className="max-w-6xl mx-auto mt-12 bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-600 mb-6 border-b pb-3 text-center">
          فيديوهات التمارين لليوم
        </h2>

        {user.videos && user.videos.length > 0 ? (
  <div className="grid md:grid-cols-2 gap-6">
    {user.videos.map((videoUrl, index) => {
      let videoId = "";

      // رابط عادي watch?v=
      if (videoUrl.includes("watch?v=")) {
        videoId = videoUrl.split("watch?v=")[1].split("&")[0];
      }

      // رابط youtu.be
      else if (videoUrl.includes("youtu.be/")) {
        videoId = videoUrl.split("youtu.be/")[1].split("?")[0];
      }

      // رابط shorts
      else if (videoUrl.includes("shorts/")) {
        videoId = videoUrl.split("shorts/")[1].split("?")[0];
      }

      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

      return (
        <div key={index} className="rounded-lg overflow-hidden shadow-md">
          <iframe
            className="w-full h-64"
            src={embedUrl}
            title={`تمرين ${index + 1}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    })}
  </div>
) : (
  <p className="text-center text-gray-500 text-lg">لا توجد فيديوهات حالياً</p>
)}


        {/* شرح الفيديوهات (comment) */}
        {user.comment && (
          <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-3 text-center">
             تعليق
            </h3>
            <p className="text-gray-600 leading-relaxed text-center whitespace-pre-line">
              {user.comment}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
