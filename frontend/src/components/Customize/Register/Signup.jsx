import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaSpinner,
} from "react-icons/fa";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

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
      "https://youtube.com/shorts/4yTQjZvp3Nk?si=WMtAiGW534D6kpMO",
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
      "https://youtube.com/shorts/d5YiFNoiCa0?si=7J9Bl_iIOO71hB5F",
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
      "https://youtube.com/shorts/ayaK3qYn9ZQ?si=SZI8ztYkGIRIBzHl",
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
      "https://youtube.com/shorts/dkGwcfo9zto?si=yTUdBI5BvsnldpP8",
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
      "https://youtube.com/shorts/TgUfw7liSAo?si=4061IHotY_GL22Fp",
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
      "https://youtube.com/shorts/Q89qOqfvhrY?si=BKY0v7E9k2v31AGU",
    ],
  },
  {
    id: 7,
    name: "Pull 1",
    videos: [
      "https://youtube.com/shorts/5s6KGLTMgoI?si=HT-jKJbinK-M8X2F",
      "https://youtube.com/shorts/Xx5qJpzEtxw?si=vUDNobmRQAFGHNdc",
      "https://youtube.com/shorts/wE-3hvJS6to?si=M5Y4I2lXczIX6Gle",
      "https://youtube.com/shorts/Xc40ltTx1N8?si=7ROgG_b0zKIS_ZR9",
      "https://youtube.com/shorts/t6QJTiz35dc?si=TmwL4jF4Vpp4eoQ8",
      "https://youtube.com/shorts/FeERX9UwspY?si=MoN3e88lEwxuAxno",
      "https://youtube.com/shorts/uKFclgM1lrs?si=hFWGy_U8ZZU-pgyw",
      "https://youtube.com/shorts/fXFN8_1Bh6k?si=kDTzaWTdp6ro4U51",
    ],
  },
  {
    id: 8,
    name: "Pull 2",
    videos: [
      "https://youtube.com/shorts/uy0YkGtY7A8?si=JJ-OwXXKts9X7OuW",
      "https://youtube.com/shorts/wE-3hvJS6to?si=M5Y4I2lXczIX6Gle",
      "https://youtube.com/shorts/0RvXo3Pj5DA?si=I9yLu1H6s8wn926Z",
      "https://youtube.com/shorts/FCsKgCxlcHQ?si=TmxluVOQkCL3pOYP",
      "https://youtube.com/shorts/2A8Gtxnl4dI?si=aUemgkiWPVnqbW7b",
      "https://youtube.com/shorts/KEX6AwDtslM?si=TRW8UoPSSy8MFcVg",
      "https://youtube.com/shorts/TOngwsi_S9w?si=0a8fLrHwwBzlBlDN",
    ],
  },
  {
    id: 9,
    name: "Legs 1",
    videos: [
      "https://youtu.be/-eO_VydErV0?si=BjHOhb1Jx9TU5tEo",
      "https://youtu.be/m0FOpMEgero?si=nLeYp1bPZHDl1nx8",
      "https://youtube.com/shorts/LbxZYQVgxI4?si=jkCiVxwlZIdP2mkN",
      "https://youtube.com/shorts/86AQ-tEpYKQ?si=EgHZCugpbRXNuscU",
      "https://youtube.com/shorts/gdXIIVY8wIY?si=4n7uJMIK-ia8YSO9",
      "https://youtube.com/shorts/haHcBAd637E?si=vsGKH5YWzjrT3qcy",
      "https://youtube.com/shorts/dkGwcfo9zto?si=yTUdBI5BvsnldpP8",
    ],
  },
  {
    id: 10,
    name: "Legs 2",
    videos: [
      "https://youtube.com/shorts/pCLf-OeSMtQ?si=J0mrutqk3svN1tHa",
      "https://youtube.com/shorts/iQ92TuvBqRo?si=S-V_wwLEdWnGkhCF",
      "https://youtube.com/shorts/OrR2PgzH5W0?si=cKnSIud1iyFNRfRr",
      "https://youtube.com/shorts/ANKSmhT0dTk?si=HAj3MP4NYjkwjAKr",
      "https://youtube.com/shorts/4_QkvpYfxes?si=mdF9JPL_DF-TmsB5",
    ],
  },
  {
    id: 11,
    name: "Full Body 1",
    videos: [
      "https://youtu.be/5CECBjd7HLQ?si=_VRp8sYAuIe_VoB1",
      "https://youtu.be/FDay9wFe5uE?si=_0kZ1AWSYVoatxv1",
      "https://youtu.be/tZUYS7X50so?si=h0aeESOGmnRt_rMl",
      "https://youtube.com/shorts/5s6KGLTMgoI?si=-ijZXfILZBVPk_lz",
      "https://youtube.com/shorts/lMJUXEvcMkQ?si=ICbsnlv_6p0D909s",
      "https://youtube.com/shorts/vLJZZXB6cms?si=Qrtd4Oxbxbi3kVgC",
      "https://youtube.com/shorts/0y4tdUNPdlE?si=yZsJYdqjgIZtV8_k",
      "https://youtube.com/shorts/iQ92TuvBqRo?si=vE4seHrZ0QeEeC2e",
      "https://youtube.com/shorts/lGNeJsdqJwg?si=BKekNoBAoxG5uQ7d",
    ],
  },
  {
    id: 12,
    name: "Full Body 2",
    videos: [
      "https://youtu.be/5CECBjd7HLQ?si=_VRp8sYAuIe_VoB1",
      "https://youtu.be/A3RepyBbWVI?feature=shared",
      "https://youtu.be/tZUYS7X50so?si=h0aeESOGmnRt_rMl",
      "https://youtube.com/shorts/5s6KGLTMgoI?si=-ijZXfILZBVPk_lz",
      "https://youtube.com/shorts/lMJUXEvcMkQ?si=ICbsnlv_6p0D909s",
      "https://youtube.com/shorts/vLJZZXB6cms?si=Qrtd4Oxbxbi3kVgC",
      "https://youtube.com/shorts/0y4tdUNPdlE?si=yZsJYdqjgIZtV8_k",
      "https://youtube.com/shorts/30Pts0lXzuk?si=I-JLBsS6SxGJQA_L",
      "https://youtube.com/shorts/86AQ-tEpYKQ?si=4ZLSNGYKKPoEi0rL",
    ],
  },
];

/* ──────────────────────────────────────────
   Modal
────────────────────────────────────────── */
function Modal({ isOpen, type, title, message, onClose }) {
  if (!isOpen) return null;

  const cfg = {
    success: { icon: <FaCheckCircle className="text-4xl text-green" />, btnCls: "bg-green hover:bg-green text-white" },
    error:   { icon: <FaTimesCircle  className="text-4xl text-red"   />, btnCls: "bg-red   hover:bg-red   text-white" },
    info:    { icon: <FaInfoCircle   className="text-4xl text-blue"  />, btnCls: "bg-blue  hover:bg-blue  text-white" },
  };
  const { icon, btnCls } = cfg[type] || cfg.info;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center mb-3">{icon}</div>
        <h3 className="text-xl font-bold text-gray-600 mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-5 leading-relaxed">{message}</p>
        <button
          onClick={onClose}
          className={`${btnCls} px-8 py-2 rounded-lg font-semibold transition`}
        >
          حسناً
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Reusable field wrapper
────────────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-400 text-right">{label}</label>
      {children}
    </div>
  );
}

/* shared input className */
const inputCls =
  "w-full rounded-lg border border-gray-100 bg-white px-3 py-2.5 text-right text-gray-600 text-sm placeholder-gray-200 outline-none focus:ring-2 focus:ring-red focus:border-transparent transition";

const selectCls =
  "w-full rounded-lg border border-gray-100 bg-white px-3 py-2.5 text-right text-gray-600 text-sm outline-none focus:ring-2 focus:ring-red focus:border-transparent transition";

/* ──────────────────────────────────────────
   Signup Page
────────────────────────────────────────── */
export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    seq: "",
    videosName: "",
    packageName: "",
    packagePrice: "",
    videos: [],
  });
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [showPassword, setShowPassword]           = useState(false);
  const [isLoading, setIsLoading]                 = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: "info", title: "", message: "" });

  const navigate = useNavigate();

  const showModal  = (type, title, message) => setModal({ isOpen: true, type, title, message });
  const closeModal = () => setModal((m) => ({ ...m, isOpen: false }));

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${apiUrl}/Signup`, formData, { withCredentials: true });
      showModal("success", "تم بنجاح! ✅", "تم إنشاء الحساب بنجاح.");
      setTimeout(() => navigate("/Dashboard"), 1800);
    } catch (err) {
      console.error(err);
      showModal("error", "حدث خطأ ❌", err?.response?.data?.message || "حدث خطأ أثناء إنشاء الحساب.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPackage = () => {
    if (!selectedPackageId) {
      showModal("info", "تنبيه", "يرجى اختيار باقة الفيديوهات أولاً.");
      return;
    }
    const pkg = videoPackages.find((p) => p.id === selectedPackageId);
    if (!pkg) return;
    const updatedVideos = Array.from(new Set([...(formData.videos || []), ...pkg.videos]));
    setFormData({ ...formData, videos: updatedVideos, videosName: pkg.name });
    showModal("success", "تمت الإضافة ✅", `تم إضافة باقة: ${pkg.name} (${pkg.videos.length} فيديو)`);
  };

  return (
    <>
      <Modal {...modal} onClose={closeModal} />

      <div dir="rtl" className="min-h-screen bg-gray-50 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">

          {/* ── Header strip ── */}
          <div className="bg-red px-8 py-5 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">إنشاء حساب</h1>
            <p className="text-sm text-white opacity-80">أضف عضوًا جديدًا في الجيم</p>
          </div>

          {/* ── Form body ── */}
          <div className="p-8">

            {/* Row 1: الاسم + الرقم التعريفي */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="الاسم الكامل">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="أدخل الاسم الكامل"
                  className={inputCls}
                />
              </Field>
              <Field label="الرقم التعريفي">
                <input
                  type="number"
                  name="seq"
                  value={formData.seq}
                  onChange={handleChange}
                  placeholder="أدخل الرقم التعريفي"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Row 2: اسم الباقة + قيمة الباقة */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="اسم الباقة">
                <select
                  name="packageName"
                  value={formData.packageName}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="" disabled>اختر اسم الباقة</option>
                  <option value="الاولى">الأولى</option>
                  <option value="الثانية ">الثانية</option>
                  <option value="الثالثة">الثالثة</option>
                </select>
              </Field>
              <Field label="قيمة الباقة">
                <input
                  type="number"
                  name="packagePrice"
                  value={formData.packagePrice}
                  onChange={handleChange}
                  placeholder="أدخل قيمة الباقة"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-50 my-5" />

            {/* باقة الفيديوهات */}
            <div className="mb-4">
              <p className="text-sm font-bold text-gray-600 mb-2">اختر باقة فيديوهات</p>
              <div className="flex gap-3">
                <select
                  value={selectedPackageId || ""}
                  onChange={(e) => setSelectedPackageId(Number(e.target.value))}
                  className={selectCls + " flex-1"}
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
                  className="flex-shrink-0 bg-blue hover:bg-blue text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition hover:opacity-90"
                >
                  إضافة الباقة
                </button>
              </div>
              {formData.videosName && (
                <p className="text-xs text-green font-semibold mt-1.5">
                  ✅ تم إضافة: {formData.videosName} — {formData.videos.length} فيديو
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-50 my-5" />

            {/* Row 3: الأيام + رقم الهاتف */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Field label="الأيام المسجلة">
                <input
                  type="number"
                  name="totalDays"
                  onChange={handleChange}
                  placeholder="مثال: 26"
                  className={inputCls}
                />
              </Field>
              <Field label="رقم الهاتف">
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="010xxxxxxxx"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Row 4: كلمة المرور + البريد */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Field label="كلمة المرور">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className={inputCls + " pl-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-200 hover:text-red transition"
                    title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </Field>
              <Field label="البريد الإلكتروني (اختياري)">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-red hover:bg-red text-white font-bold text-base transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <FaSpinner className="animate-spin" />
                  جارٍ الإنشاء...
                </span>
              ) : (
                "تسجيل"
              )}
            </button>

            {/* Login Link */}
            <p className="mt-4 text-center text-sm text-gray-300">
              لديك حساب بالفعل؟{" "}
              <Link to="/Login" className="text-red font-semibold underline underline-offset-2 hover:opacity-80 transition">
                سجّل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
