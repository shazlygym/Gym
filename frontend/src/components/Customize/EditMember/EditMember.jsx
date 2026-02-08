import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaCalendarCheck,
  FaComment,
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";



const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

// ✅ تعريف الباقات
const videoPackages = [
  {
    id: 1,
    name: " Upper 1",
    videos: [
      "https://youtube.com/shorts/txiZ40nSUzc?si=R9f6yPFfQS0Mt-MG",
      "https://youtube.com/shorts/kYw-bfn4sZw?si=r4ZYSlLykE2kbMm1",
      "https://youtube.com/shorts/paWyD9m6oM0?si=SfA2Ip4THKsfmIQ_",
      "https://youtube.com/shorts/BiNs8wz4UyE?si=jPMQculhBO5BkoHH",
      "https://youtube.com/shorts/BRsWKIKlysQ?si=hdbzRtjx1185rHBS",
      "https://youtube.com/shorts/6v4nrRVySj0?si=MYoGNdDCP_AFz3Se",
      "https://youtube.com/shorts/4yTQjZvp3Nk?si=WMtAiGW534D6kpMO"
    ],
  },
  {
    id: 2,
    name: " Lower 1",
    videos: [
      "https://youtu.be/rYgNArpwE7E?si=t9yJLAhv8Mi0uPAO",
      "https://youtube.com/shorts/iQ92TuvBqRo?si=z2EyTAcMFRMv4n6P",
      "https://youtube.com/shorts/AvRH0zEzFqo?si=Ptwv3o9ioj10reyF",
      "https://youtu.be/AweC3UaM14o?si=481htBKquwRJgO1p",
      "https://youtube.com/shorts/NRFz01Fhwtw?si=W02RLpQGU6uauJUc",
      "https://youtube.com/shorts/d5YiFNoiCa0?si=7J9Bl_iIOO71hB5F"
   
    ],
  },
  {
    id: 3,
    name: " Upper 2",
    videos: [
      "https://youtube.com/shorts/AUJtWOQRHPI?si=N7sRtMn3DJG-Lygl",
      "https://youtu.be/O5viuEPDXKY?si=1Z8BdGdLp8UMcXuJ",
      "https://youtube.com/shorts/bNmvKpJSWKM?si=6ER6E7flEeckocNE",
      "https://youtube.com/shorts/nLXQRr0-iG8?si=ZCKn5cXIgzerfPVj",
      "https://youtube.com/shorts/t6QJTiz35dc?si=MWJN2tPb335Be-Cb",
      "https://youtu.be/OuG1smZTsQQ?si=W6pjRFjWhXvRx90h",
      "https://youtube.com/shorts/NG-tstEu6bg?si=4opV3SbAxPy5qXlR",
      "https://youtube.com/shorts/oZ1MbUl-_-w?si=Gx6wF3KMYUgjCsIa",
      "https://youtube.com/shorts/ayaK3qYn9ZQ?si=SZI8ztYkGIRIBzHl"
    
    ],
  },
  {
    id: 4,
    name: " Lower 2",
    videos: [
      "https://youtu.be/-eO_VydErV0?si=BjHOhb1Jx9TU5tEo",
      "https://youtu.be/m0FOpMEgero?si=nLeYp1bPZHDl1nx8",
      "https://youtube.com/shorts/LbxZYQVgxI4?si=jkCiVxwlZIdP2mkN",
      "https://youtube.com/shorts/86AQ-tEpYKQ?si=EgHZCugpbRXNuscU",
      "https://youtube.com/shorts/gdXIIVY8wIY?si=4n7uJMIK-ia8YSO9",
      "https://youtube.com/shorts/haHcBAd637E?si=vsGKH5YWzjrT3qcy",
      "https://youtube.com/shorts/dkGwcfo9zto?si=yTUdBI5BvsnldpP8"
    
    ],
  },
  {
    id: 5,
    name: "Push 1",
    videos: [
      "https://youtube.com/shorts/uL5DspcDr4k?si=6ifVhWdqyQBBdOb4",
      "https://youtube.com/shorts/lqp8tDZL8ao?si=_pmhRbJgyJrCOFjm",
      "https://youtube.com/shorts/06xdMa4rsgU?si=UnvNT2ODwbPR4W-Y",
      "https://youtube.com/shorts/pjIrjwBjvu4?si=wpFxEZtSjzhZ3gsp",
      "https://youtube.com/shorts/bwM7IhfVOzM?si=Po3lndF1QUrRcbsr",
      "https://youtube.com/shorts/TgUfw7liSAo?si=4061IHotY_GL22Fp"
    
    ],
  },
  {
    id: 6,
    name: "Push 2",
    videos: [
      "https://youtube.com/shorts/Q1S9ybWYMjE?si=DLmSfi8w8DW1eTcg",
      "https://youtu.be/FDay9wFe5uE?si=WovLHgPVR1q7J1x7",
      "https://youtube.com/shorts/lMJUXEvcMkQ?si=-yEipOvKzQe-kUop",
      "https://youtube.com/shorts/k6tzKisR3NY?si=cleNxmKlj5oP6Vip",
      "https://youtube.com/shorts/w5a5sErWIEw?si=38U6tn-JB9yBD2g6",
      "https://youtube.com/shorts/Q89qOqfvhrY?si=BKY0v7E9k2v31AGU"
    
    ],
  },
  {
    id: 7,
    name: "Pull 1",
    videos: [
      // 1- lat pulldown
      "https://youtube.com/shorts/5s6KGLTMgoI?si=HT-jKJbinK-M8X2F",
  
      // 2- wide grip seated row
      "https://youtube.com/shorts/Xx5qJpzEtxw?si=vUDNobmRQAFGHNdc",
  
      // 3- t bar row
      "https://youtube.com/shorts/wE-3hvJS6to?si=M5Y4I2lXczIX6Gle",
  
      // 4- single arm lat row
      "https://youtube.com/shorts/Xc40ltTx1N8?si=7ROgG_b0zKIS_ZR9",
  
      // 5- shrugs
      "https://youtube.com/shorts/t6QJTiz35dc?si=TmwL4jF4Vpp4eoQ8",
  
      // 6- rear delt cable
      "https://youtube.com/shorts/FeERX9UwspY?si=MoN3e88lEwxuAxno",
  
      // 7- biceps face away
      "https://youtube.com/shorts/uKFclgM1lrs?si=hFWGy_U8ZZU-pgyw",
  
      // 8- incline dumbbell curl
      "https://youtube.com/shorts/fXFN8_1Bh6k?si=kDTzaWTdp6ro4U51"
    ],
  },
  {
    id: 8,
    name: "Pull 2",
    videos: [
      // 1- close grip lat pulldown
      "https://youtube.com/shorts/uy0YkGtY7A8?si=JJ-OwXXKts9X7OuW",
  
      // 3- t bar row
      "https://youtube.com/shorts/wE-3hvJS6to?si=M5Y4I2lXczIX6Gle",
  
      // 4- single arm lat pulldown
      "https://youtube.com/shorts/0RvXo3Pj5DA?si=I9yLu1H6s8wn926Z",
  
      // 5- shrugs
      "https://youtube.com/shorts/FCsKgCxlcHQ?si=TmxluVOQkCL3pOYP",
  
      // 6- rear flay machine
      "https://youtube.com/shorts/2A8Gtxnl4dI?si=aUemgkiWPVnqbW7b",
  
      // 7- biceps curl
      "https://youtube.com/shorts/KEX6AwDtslM?si=TRW8UoPSSy8MFcVg",
  
      // 8- dumbbell curl
      "https://youtube.com/shorts/TOngwsi_S9w?si=0a8fLrHwwBzlBlDN"
    ],
  },
  {
    id: 9,
    name: "Legs 1",
    videos: [
      // 1- squat
      "https://youtu.be/-eO_VydErV0?si=BjHOhb1Jx9TU5tEo",
  
      // 2- leg extension
      "https://youtu.be/m0FOpMEgero?si=nLeYp1bPZHDl1nx8",
  
      // 3- lunges
      "https://youtube.com/shorts/LbxZYQVgxI4?si=jkCiVxwlZIdP2mkN",
  
      // 4- hamstring
      "https://youtube.com/shorts/86AQ-tEpYKQ?si=EgHZCugpbRXNuscU",
  
      // 5- adductors
      "https://youtube.com/shorts/gdXIIVY8wIY?si=4n7uJMIK-ia8YSO9",
  
      // 6- calf
      "https://youtube.com/shorts/haHcBAd637E?si=vsGKH5YWzjrT3qcy",
  
      // 7- cable crunch
      "https://youtube.com/shorts/dkGwcfo9zto?si=yTUdBI5BvsnldpP8"
    ],
  },
  {
    id: 10,
    name: "Legs 2",
    videos: [
      // 1- leg press
      "https://youtube.com/shorts/pCLf-OeSMtQ?si=J0mrutqk3svN1tHa",
  
      // 2- leg extension
      "https://youtube.com/shorts/iQ92TuvBqRo?si=S-V_wwLEdWnGkhCF",
  
      // 3- lunges
      "https://youtube.com/shorts/OrR2PgzH5W0?si=cKnSIud1iyFNRfRr",
  
      // 4- hamstring
      "https://youtube.com/shorts/ANKSmhT0dTk?si=HAj3MP4NYjkwjAKr",
  
      // 5- calf
      "https://youtube.com/shorts/4_QkvpYfxes?si=mdF9JPL_DF-TmsB5"
    ],
  },

  {
    id: 11,
    name: "Full Body 1",
    videos: [
      // 1- dumbbell incline
      "https://youtu.be/5CECBjd7HLQ?si=_VRp8sYAuIe_VoB1",
  
      // 2- fly machine
      "https://youtu.be/FDay9wFe5uE?si=_0kZ1AWSYVoatxv1",
  
      // 3- chest supported row
      "https://youtu.be/tZUYS7X50so?si=h0aeESOGmnRt_rMl",
  
      // 4- single arm lat row
      "https://youtube.com/shorts/5s6KGLTMgoI?si=-ijZXfILZBVPk_lz",
  
      // 5- lateral raises
      "https://youtube.com/shorts/lMJUXEvcMkQ?si=ICbsnlv_6p0D909s",
  
      // 6- tricep push down
      "https://youtube.com/shorts/vLJZZXB6cms?si=Qrtd4Oxbxbi3kVgC",
  
      // 7- preacher curl machine
      "https://youtube.com/shorts/0y4tdUNPdlE?si=yZsJYdqjgIZtV8_k",
  
      // 8- leg extension
      "https://youtube.com/shorts/iQ92TuvBqRo?si=vE4seHrZ0QeEeC2e",
  
      // 9- hamstring
      "https://youtube.com/shorts/lGNeJsdqJwg?si=BKekNoBAoxG5uQ7d"
    ],
  },

  {
    id: 12,
    name: "Full Body 2",
    videos: [
      // 1- dumbbell incline
      "https://youtu.be/5CECBjd7HLQ?si=_VRp8sYAuIe_VoB1",
  
      // 2- cable chest press
      "https://youtu.be/A3RepyBbWVI?feature=shared",
  
      // 3- chest supported row
      "https://youtu.be/tZUYS7X50so?si=h0aeESOGmnRt_rMl",
  
      // 4- single arm lat row
      "https://youtube.com/shorts/5s6KGLTMgoI?si=-ijZXfILZBVPk_lz",
  
      // 5- lateral raises
      "https://youtube.com/shorts/lMJUXEvcMkQ?si=ICbsnlv_6p0D909s",
  
      // 6- tricep push down
      "https://youtube.com/shorts/vLJZZXB6cms?si=Qrtd4Oxbxbi3kVgC",
  
      // 7- preacher curl machine
      "https://youtube.com/shorts/0y4tdUNPdlE?si=yZsJYdqjgIZtV8_k",
  
      // 8- leg press
      "https://youtube.com/shorts/30Pts0lXzuk?si=I-JLBsS6SxGJQA_L",
  
      // 9- ham dumbbell
      "https://youtube.com/shorts/86AQ-tEpYKQ?si=4ZLSNGYKKPoEi0rL"
    ],
  },
  
  
  {
    id: 13,
    name: "Full Body 3",
    videos: [
    
    ],
  },

  
    
  
];

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPackageId, setSelectedPackageId] = useState(null);


  // Modal state
  const [modalData, setModalData] = useState({
    isOpen: false,
    type: "info", // info | success | warning | error
    title: "",
    message: "",
    onConfirm: null,
  });

  const openModal = ({ type = "info", title = "", message = "", onConfirm = null }) => {
    setModalData({ isOpen: true, type, title, message, onConfirm });
  };

  const closeModal = () => {
    setModalData((prev) => ({ ...prev, isOpen: false }));
  };

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
        openModal({ type: "error", title: "خطأ", message: "حدث خطأ أثناء تحميل البيانات" });
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
    if (!selectedPackageId) {
      openModal({ type: "warning", title: "تنبيه", message: "اختر الباقة أولاً" });
      return;
    }

    const pkg = videoPackages.find((p) => p.id === selectedPackageId);
    if (!pkg) return;

    const updatedVideos = Array.from(new Set([...(member.videos || []), ...pkg.videos]));

    setMember({
      ...member,
      videos: updatedVideos,
    });

    openModal({ type: "success", title: "تمت الإضافة", message: `تم إضافة باقة الفيديوهات: ${pkg.name}` });
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
      openModal({
        type: "success",
        title: "تم الحفظ",
        message: "تم تحديث بيانات العضو بنجاح!",
        onConfirm: () => navigate("/Dashboard"),
      });
    } catch (err) {
      console.error(err);
      openModal({ type: "error", title: "خطأ", message: "حدث خطأ أثناء حفظ البيانات" });
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-lg">جاري التحميل...</div>;
  if (!member)
    return <div className="text-center mt-20 text-lg">لم يتم العثور على العضو</div>;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex justify-center items-center p-6" dir="rtl">
        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-5xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6 text-black border-md border-2 border-black hover:text-white hover:bg-black rounded-md p-2 transition font-bold"
          >
            <span>رجوع</span>
            <FaArrowLeft />
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">تعديل بيانات العضو</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* البيانات الشخصية */}
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaUser className="text-red-500" />
                <h2 className="text-lg font-bold text-gray-800">البيانات الشخصية</h2>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-4 gap-4">
                <div className="border rounded-xl px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">الرقم التعريفي</label>
                  <input type="number" name="seq" value={member.seq || ""} onChange={handleChange} placeholder="الرقم التعريفي" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                </div>
                <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200">
                  <FaUser className="text-red-500 ml-3" />
                  <input type="text" name="name" value={member.name || ""} onChange={handleChange} placeholder="الاسم" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                </div>
                <div className="flex items-center justify-between border rounded-xl px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200 md:col-span-2">
                  <span className="text-sm font-medium text-gray-700">مدير</span>
                  <input type="checkbox" name="admin" checked={member.admin || false} onChange={handleChange} className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* معلومات التواصل */}
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaEnvelope className="text-red-500" />
                <h2 className="text-lg font-bold text-gray-800">معلومات التواصل</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200">
                  <FaEnvelope className="text-red-500 ml-3" />
                  <input type="email" name="email" value={member.email || ""} onChange={handleChange} placeholder="البريد الالكتروني" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                </div>
                <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200">
                  <FaPhone className="text-red-500 ml-3" />
                  <input type="text" name="mobileNumber" value={member.mobileNumber || ""} onChange={handleChange} placeholder="رقم الموبايل" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                </div>
              </div>
            </div>

            {/* المواعيد */}
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaCalendarAlt className="text-red-500" />
                <h2 className="text-lg font-bold text-gray-800">المواعيد</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التسجيل</label>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-red-500 ml-3" />
                    <input type="date" name="joinDate" value={member.joinDate ? member.joinDate.substring(0, 10) : ""} onChange={handleChange} className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                  </div>
                </div>
                <div className="border rounded-xl px-4 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-red-500 transition">
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ التجديد</label>
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-red-500 ml-3" />
                    <input type="date" name="renewalDate" value={member.renewalDate ? member.renewalDate.substring(0, 10) : ""} onChange={handleChange} className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* الأيام */}
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaCalendarCheck className="text-red-500" />
                <h2 className="text-lg font-bold text-gray-800">الأيام</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200">
                  <FaCalendarCheck className="text-red-500 ml-3" />
                  <input type="number" name="totalDays" value={member.totalDays || ""} onChange={handleChange} placeholder="الايام المسجلة" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                </div>
                <div className="flex items-center border rounded-xl px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200">
                  <FaCalendarCheck className="text-red-500 ml-3" />
                  <input type="number" name="usedDays" value={member.usedDays || ""} onChange={handleChange} placeholder="الايام المستخدمة" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                </div>
              </div>
            </div>

            {/* الملاحظات */}
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaComment className="text-red-500" />
                <h2 className="text-lg font-bold text-gray-800">ملاحظات</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-xl px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">تعليق</label>
                  <input type="text" name="comment" value={member.comment || ""} onChange={handleChange} placeholder="تعليق" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                </div>
              </div>
            </div>

            {/* تفاصيل الباقة */}
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaUser className="text-red-500" />
                <h2 className="text-lg font-bold text-gray-800">تفاصيل الباقة</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">اسم الباقة</label>
                  <select name="packageName" value={member.packageName} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 hover:border-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-colors duration-200" required>
                    <option value="" disabled>اختر اسم الباقة</option>
                    <option value="الاولى">الاولى</option>
                    <option value="الثانية ">الثانية </option>
                    <option value="الثالثة">الثالثة </option>
                  </select>
                </div>
                <div className="border rounded-xl px-4 py-2 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 focus-within:bg-white focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-500 transition-colors duration-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">قيمة الباقة</label>
                  <div className="flex items-center">
                    <FaUser className="text-red-500 ml-3" />
                    <input type="number" name="packagePrice" value={member.packagePrice || ""} onChange={handleChange} placeholder=" قيمة الباقة" className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-400 hover:text-gray-900 focus:text-gray-900 transition-colors duration-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* باقات الفيديو */}
            <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <FaComment className="text-red-500" />
                <h2 className="text-lg font-bold text-gray-800">باقات الفيديو</h2>
              </div>
              <div>
                <select value={selectedPackageId || ""} onChange={(e) => setSelectedPackageId(Number(e.target.value))} className="border rounded-xl px-3 py-2 mb-2 w-full hover:border-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500 transition-colors duration-200">
                  <option value="">-- اختر باقة --</option>
                  {videoPackages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.videos.length} فيديو)
                    </option>
                  ))}
                </select>
                <button type="button" onClick={handleAddPackage} className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">إضافة الباقة</button>
              </div>
            </div>

            {/* الفيديوهات الحالية */}
            {member.videos && member.videos.length > 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white/80 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <FaComment className="text-red-500" />
                  <h2 className="text-lg font-bold text-gray-800">الفيديوهات المضافة</h2>
                </div>
                <ul className="space-y-2 mb-2">
                  {member.videos.map((video, index) => (
                    <li key={index} className="flex justify-between items-center bg-white p-2 rounded-lg shadow-sm">
                      <a href={video} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline truncate w-4/5">{video}</a>
                      <button type="button" onClick={() => handleRemoveVideo(index)} className="text-red-500 hover:text-red-700 font-semibold">حذف</button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-500">لا توجد فيديوهات حالياً</p>
            )}

            <button type="submit" className="w-full bg-red hover:bg-red-600 text-white py-3 rounded-2xl font-semibold text-lg transition">حفظ التغيرات</button>
          </form>
        </div>
      </div>

      {modalData.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-11/12 max-w-md rounded-2xl shadow-xl p-6">
            <div className="flex items-start gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                modalData.type === "success"
                  ? "bg-green-100 text-green-600"
                  : modalData.type === "error"
                  ? "bg-red-100 text-red-600"
                  : modalData.type === "warning"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-blue-100 text-blue-600"
              }`}>
                {modalData.type === "success" && <FaCheckCircle className="text-2xl" />}
                {modalData.type === "error" && <FaTimes className="text-2xl" />}
                {modalData.type === "warning" && <FaExclamationTriangle className="text-2xl" />}
                {modalData.type === "info" && <FaComment className="text-2xl" />}
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{modalData.title}</h2>
                <p className="text-gray-600">{modalData.message}</p>
              </div>

              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
                aria-label="إغلاق"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  if (typeof modalData.onConfirm === "function") {
                    modalData.onConfirm();
                  }
                  closeModal();
                }}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
              >
                حسناً
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditMember;
