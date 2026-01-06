import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";


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
  
  

  
    
  
];

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    seq: "",
    videosName: "",
    packageName:"",
    packagePrice:"",
    videos: []          // ✅ مهم
  });
  
    const [member, setMember] = useState({});

  const [selectedPackageId, setSelectedPackageId] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/Signup`,
        formData,
        { withCredentials: true }
      );
  
      alert("تم إنشاء الحساب بنجاح!");
      navigate("/Dashboard");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إنشاء الحساب");
    }
  };
  
  
  const handleAddPackage = () => {
    if (!selectedPackageId) {
      alert("اختر الباقة أولاً");
      return;
    }
  
    const pkg = videoPackages.find(p => p.id === selectedPackageId);
    if (!pkg) return;
  
    const updatedVideos = Array.from(
      new Set([...(formData.videos || []), ...pkg.videos])
    );
  
    setFormData({
      ...formData,
      videos: updatedVideos,
      videosName: pkg.name   // ✅ تخزين اسم آخر باقة
    });
  
    alert(`تم إضافة باقة الفيديوهات: ${pkg.name}`);
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
            <label className="block text-sm font-medium">الرقم التعريفي</label>
            <input
              type="number"
              name="seq"
              value={formData.seq}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red"
              placeholder="أدخل الرقم التعريفي"
              required
            />
          </div>


          <div>
  <label className="block text-sm font-medium">اسم الباقة</label>
  <select
    name="packageName"
    value={formData.packageName}
    onChange={handleChange}
    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red"
    required
  >
    <option value="" disabled>
      اختر اسم الباقة
    </option>
    <option value="الاولى">الاولى</option>
    <option value="الثانية ">الثانية </option>
    <option value="الثالثة">الثالثة </option>
  </select>
</div>



<div>
            <label className="block text-sm font-medium"> قيمة الباقة</label>
            <input
              type="number"
              name="packagePrice"
              value={formData.packagePrice}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red"
              placeholder="أدخل  قيمة الباقة"
              required
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


             {/* عدد الأيام المسجلة */}
                    <div className="flex items-center border rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-red-500 transition">
                    
                      <input
                        type="number"
                        name="totalDays"
                        onChange={handleChange}
                        placeholder="الايام المسجلة"
                        className="w-full bg-transparent outline-none text-gray-700"
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
