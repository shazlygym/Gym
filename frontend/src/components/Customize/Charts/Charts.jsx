import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import {
  FaArrowLeft, FaUsers, FaEye, FaUserCheck, FaUserTimes, FaUserSlash, FaChartBar, FaStar
} from "react-icons/fa";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const COLORS = ["#376DB8", "#50C878", "#f59e0b", "#ff0336", "#8b5cf6", "#ec4899", "#06b6d4"];

const Charts = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${apiUrl}/dashboardStats`);
        setStats(res.data);
        console.log("stats", res.data);

      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-center p-10">جاري التحميل...</p>;
  if (!stats) return <p className="text-center p-10">لا توجد بيانات.</p>;



  return (

    <div className="p-8 bg-gray-50 min-h-screen font-cairo" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-600 flex items-center gap-3">
            <span className="p-2 bg-blue text-white rounded-lg shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#fff">
                <g clipPath="url(#clip0_4418_7634)">
                  <path d="M17.79 22.7402H6.21C3.47 22.7402 1.25 20.5102 1.25 17.7702V10.3602C1.25 9.00021 2.09 7.29021 3.17 6.45021L8.56 2.25021C10.18 0.990208 12.77 0.930208 14.45 2.11021L20.63 6.44021C21.82 7.27021 22.75 9.05021 22.75 10.5002V17.7802C22.75 20.5102 20.53 22.7402 17.79 22.7402ZM9.48 3.43021L4.09 7.63021C3.38 8.19021 2.75 9.46021 2.75 10.3602V17.7702C2.75 19.6802 4.3 21.2402 6.21 21.2402H17.79C19.7 21.2402 21.25 19.6902 21.25 17.7802V10.5002C21.25 9.54021 20.56 8.21021 19.77 7.67021L13.59 3.34021C12.45 2.54021 10.57 2.58021 9.48 3.43021Z" fill="white" style={{ fill: 'var(--fillg)' }} />
                  <path d="M7.49994 17.2495C7.30994 17.2495 7.11994 17.1795 6.96994 17.0295C6.67994 16.7395 6.67994 16.2595 6.96994 15.9695L10.1699 12.7695C10.3299 12.6095 10.5399 12.5295 10.7699 12.5495C10.9899 12.5695 11.1899 12.6895 11.3199 12.8795L12.4099 14.5195L15.9599 10.9695C16.2499 10.6795 16.7299 10.6795 17.0199 10.9695C17.3099 11.2595 17.3099 11.7395 17.0199 12.0295L12.8199 16.2295C12.6599 16.3895 12.4499 16.4695 12.2199 16.4495C11.9999 16.4295 11.7999 16.3095 11.6699 16.1195L10.5799 14.4795L8.02994 17.0295C7.87994 17.1795 7.68994 17.2495 7.49994 17.2495Z" fill="white" style={{ fill: 'var(--fillg)' }} />
                  <path d="M16.5 14.25C16.09 14.25 15.75 13.91 15.75 13.5V12.25H14.5C14.09 12.25 13.75 11.91 13.75 11.5C13.75 11.09 14.09 10.75 14.5 10.75H16.5C16.91 10.75 17.25 11.09 17.25 11.5V13.5C17.25 13.91 16.91 14.25 16.5 14.25Z" fill="white" style={{ fill: 'var(--fillg)' }} />
                </g>
                <defs>
                  <clipPath id="clip0_4418_7634">
                    <rect width="24" height="24" fill="white" />
                  </clipPath>
                </defs>
              </svg></span>
            إحصائيات النظام
          </h1>
          <p className="text-gray-500 mt-1 mr-12">نظرة شاملة على أداء النادي والمشتركين</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-white border-2 border-gray-100 px-6 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:bg-gray-50 transition-all flex items-center gap-2 font-bold text-gray-700"
        >
          <FaArrowLeft className="text-sm" /> رجوع
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        <StatCard
          title="إجمالي المستخدمين"
          value={stats.totalUsers}
          icon={FaUsers}
          gradient="from-blue to-blue"
          shadow="shadow-blue/30"
        />
        <StatCard
          title="إجمالي الزيارات"
          value={stats.totalVisits}
          icon={FaEye}
          gradient="from-green to-green"
          shadow="shadow-rose-400/30"
        />
        <StatCard
          title="نشطين الآن"
          value={stats.activeUsers}
          icon={FaUserCheck}
          isPulse={true}
          gradient="from-green to-emerald-600"
          shadow="shadow-green/30"
        />
        <StatCard
          title="اشتراكات منتهية"
          value={stats.expiredUsers}
          icon={FaUserTimes}
          gradient="from-red to-orange-600"
          shadow="shadow-red/30"
        />
        <StatCard
          title="لم يزوروا أبداً"
          value={stats.neverVisitedCount}
          icon={FaUserSlash}
          gradient="from-gray-500 to-gray-700"
          shadow="shadow-gray-400/30"
        />
        <StatCard
          title="معدل الزيارة/فرد"
          value={stats.avgVisitsPerUser}
          icon={FaChartBar}
          gradient="from-red to-black"
          shadow="shadow-cyan-400/30"
        />

        <div className="bg-gradient-to-br from-blue to-indigo-900 p-8 rounded-3xl shadow-2xl text-white col-span-1 md:col-span-2 relative overflow-hidden group border border-white/10">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-amber-400 p-2 rounded-lg text-blue-900 shadow-lg">
                  <FaStar size={18} />
                </div>
                <h3 className="text-blue-100 text-sm font-bold tracking-wide uppercase">
                  أكثر زائر تفاعلاً
                </h3>
              </div>
              <p className="text-3xl font-black mt-2 leading-tight">{stats.maxVisitsUser?.name}</p>
            </div>
            <div className="mt-8 flex items-end justify-between">
              <div className="flex flex-col">
                <span className="text-5xl font-black leading-none">{stats.maxVisitsUser?.visits}</span>
                <span className="text-sm font-medium text-blue-200 mt-1 mr-1">زيارة مسجلة</span>
              </div>
              <div className="bg-white/15 p-4 rounded-2xl backdrop-blur-xl border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <FaUserCheck className="text-3xl" />
              </div>
            </div>
          </div>
          {/* Enhanced decorative elements */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/15 transition-all duration-700"></div>
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-blue-400/20 rounded-full blur-[60px]"></div>
        </div>
      </div>

      {/* الرسوم البيانية للباقات */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* مخطط عدد المشتركين */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">عدد المشتركين لكل باقة</h2>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <FaUsers />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.packageStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="packageName" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="count" fill="#376DB8" name="عدد المشتركين" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* مخطط الدخل المالي */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">توزيع الدخل المالي</h2>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
              <FaChartBar />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.packageStats}
                dataKey="totalPrice"
                nameKey="packageName"
                cx="50%" cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
              >
                {stats.packageStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} جنيه`, 'الدخل']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* مخطط الحضور (الساعات) */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800">توزيع الحضور حسب الساعة</h2>
            <p className="text-sm text-gray-500 mt-1">الأوقات الأكثر ازدحاماً خلال اليوم</p>
          </div>
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <FaEye size={20} />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={stats.attendanceStats}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              cursor={{ fill: '#fff1f2' }}
            />
            <Bar dataKey="attendees" fill="#ff0336" name="حضور" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, isPulse = false, gradient, shadow = "shadow-gray-200/50" }) => (
  <div className={`bg-gradient-to-br ${gradient} p-6 rounded-3xl shadow-xl ${shadow} hover:shadow-2xl transition-all duration-500 flex items-center justify-between group relative overflow-hidden border border-white/10`}>
    <div className="relative z-10 text-white">
      <h3 className="text-xs font-bold text-white/80 mb-2 truncate uppercase tracking-wider">{title}</h3>
      <div className="flex items-center gap-3">
        <p className="text-4xl font-black tracking-tight">{value}</p>
        {isPulse && (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white shadow-sm"></span>
          </span>
        )}
      </div>
    </div>
    {Icon && (
      <div className="relative z-10 p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white shadow-inner group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6">
        <Icon size={26} />
      </div>
    )}
    {/* Subtle patterns for extra flair */}
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
  </div>
);

export default Charts;