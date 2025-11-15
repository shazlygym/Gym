import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCalendarCheck,
  FaComment,
} from "react-icons/fa";
import axios from "axios";



const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

// ✅ تعريف الباقات
const videoPackages = [
  {
    id: 1,
    name: "باقة المبتدئين",
    videos: [
      "https://www.youtube.com/watch?v=EyHI7-x-_Ok",
      "https://www.youtube.com/watch?v=EyHI7-x-_Ok",
      "https://www.youtube.com/watch?v=KA0VjR4jq_8",
      "https://www.youtube.com/watch?v=ZH2HvfpQFEU"
    ],
  },
  {
    id: 2,
    name: "باقة المتقدمين",
    videos: [
      "https://www.youtube.com/watch?v=ZH2HvfpQFEU",
      "https://www.youtube.com/watch?v=ZH2HvfpQFEU"
   
    ],
  },
  {
    id: 3,
    name: "باقة كاملة",
    videos: [
      "https://www.youtube.com/watch?v=ZH2HvfpQFEU",
      "https://www.youtube.com/watch?v=ZH2HvfpQFEU"
    
    ],
  },
];

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState(null);

  // جلب بيانات العضو من الـ backend
  useEffect(() => {
    axios
      .get(`${apiUrl}/GetUser/${id}`)
      .then((res) => {
        setMember(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("حدث خطأ أثناء تحميل البيانات");
        setLoading(false);
      });
  }, [id]);

  // تحديث الحقول
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setMember({
      ...member,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ إضافة باقة فيديوهات
  const handleAddPackage = () => {
    if (!selectedPackageId) return alert("اختر الباقة أولاً");

    const pkg = videoPackages.find((p) => p.id === selectedPackageId);
    console.log("test");
   
    
    if (!pkg) return;
    console.log("test2");
    const updatedVideos = Array.from(new Set([...(member.videos || []), ...pkg.videos]));
    console.log("test3");
    setMember({
      ...member,
      videos: updatedVideos,
    });

    alert(`تم إضافة باقة الفيديوهات: ${pkg.name}`);
  };

  // ✅ حذف فيديو
  const handleRemoveVideo = (index) => {
    const updatedVideos = member.videos.filter((_, i) => i !== index);
    setMember({ ...member, videos: updatedVideos });
  };

  // حفظ التعديلات
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${apiUrl}/EditUser/${id}`, member);
      alert("تم تحديث بيانات العضو بنجاح!");
      navigate("/Dashboard");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ البيانات");
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-lg">جاري التحميل...</div>;
  if (!member)
    return <div className="text-center mt-20 text-lg">لم يتم العثور على العضو</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          تعديل بيانات العضو
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الاسم */}
          <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
            <FaUser className="text-red-500 ml-3" />
            <input
              type="text"
              name="name"
              value={member.name || ""}
              onChange={handleChange}
              placeholder="الاسم"
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* المدير */}
          <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
            <FaUser className="text-red-500 ml-3" />
            <input
              type="checkbox"
              name="admin"
              checked={member.admin || false}
              onChange={handleChange}
              className=" bg-transparent outline-none text-gray-700 w-5 h-5"
            />
          </div>

          {/* البريد الالكتروني */}
          <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
            <FaEnvelope className="text-red-500 ml-3" />
            <input
              type="email"
              name="email"
              value={member.email || ""}
              onChange={handleChange}
              placeholder="البريد الالكتروني"
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* رقم الهاتف */}
          <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
            <FaPhone className="text-red-500 ml-3" />
            <input
              type="text"
              name="mobileNumber"
              value={member.mobileNumber || ""}
              onChange={handleChange}
              placeholder="رقم الموبايل"
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* تاريخ التسجيل */}
          <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
            <FaCalendarAlt className="text-red-500 ml-3" />
            <input
              type="date"
              name="joinDate"
              value={member.joinDate ? member.joinDate.substring(0, 10) : ""}
              onChange={handleChange}
              placeholder="تاريخ التسجيل"
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* عدد الأيام المسجلة */}
          <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
            <FaCalendarCheck className="text-red-500 ml-3" />
            <input
              type="number"
              name="totalDays"
              value={member.totalDays || ""}
              onChange={handleChange}
              placeholder="الايام المسجلة"
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* الأيام المستخدمة */}
          <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
            <FaCalendarCheck className="text-red-500 ml-3" />
            <input
              type="number"
              name="usedDays"
              value={member.usedDays || ""}
              onChange={handleChange}
              placeholder="الايام المستخدمة"
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* التعليق */}
          <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
            <FaComment className="text-red-500 ml-3" />
            <input
              type="text"
              name="comment"
              value={member.comment || ""}
              onChange={handleChange}
              placeholder="تعليق"
              className="w-full bg-transparent outline-none text-gray-700"
            />
          </div>

          {/* اختيار باقة الفيديوهات */}
          <div className="my-4">
            <h3 className="text-lg font-semibold mb-2">اختر باقة فيديوهات</h3>
            <select
              value={selectedPackageId || ""}
              onChange={(e) => setSelectedPackageId(Number(e.target.value))}
              className="border rounded-xl px-3 py-2 mb-2 w-full"
            >
              <option value="">-- اختر باقة --</option>
              {videoPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name} ({pkg.videos.length} فيديو)
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddPackage}
              className="bg-blue text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
            >
              إضافة الباقة
            </button>
          </div>

          {/* عرض الفيديوهات الحالية */}
          {member.videos && member.videos.length > 0 ? (
            <ul className="space-y-2 mb-4">
              {member.videos.map((video, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm"
                >
                  <a
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline truncate w-4/5"
                  >
                    {video}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mb-3">لا توجد فيديوهات حالياً</p>
          )}

          <button
            type="submit"
            className="w-full bg-red hover:bg-red-600 text-white py-3 rounded-2xl font-semibold text-lg transition"
          >
            حفظ التغيرات
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMember;
