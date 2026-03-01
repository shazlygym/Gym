import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area
} from "recharts";
import {
  FaArrowLeft, FaUsers, FaEye, FaUserCheck, FaUserTimes, FaUserSlash, FaChartBar, FaStar, FaClock, FaCalendarDay, FaChartLine
} from "react-icons/fa";
import "./Charts.css";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const COLORS = ["#376DB8", "#10b981", "#f59e0b", "#ff0336", "#8b5cf6", "#ec4899", "#06b6d4"];
const ATTENDANCE_COLORS = [
  "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", 
  "#ec4899", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"
];

const Charts = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${apiUrl}/dashboardStats`);
        setStats(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 font-bold">جاري تحليل البيانات...</p>
      </div>
    </div>
  );

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600 font-bold">
      لا توجد بيانات متاحة حالياً.
    </div>
  );

  return (
    <div className="charts-page font-cairo" dir="rtl">
      {/* Header */}
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 flex items-center gap-4">
            <span className="p-3 bg-red text-white rounded-2xl shadow-xl shadow-red/20">
              <FaChartBar size={28} />
            </span>
            تحليلات الأداء
          </h1>
          <p className="text-slate-500 mt-2 font-medium">نظرة استراتيجية شاملة على نشاط النادي والمشتركين</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="bg-white border border-slate-200 px-8 py-3 rounded-2xl shadow-sm hover:shadow-xl hover:translate-y-[-2px] transition-all flex items-center gap-3 font-bold text-slate-700"
        >
          <FaArrowLeft className="text-sm" /> رجوع للمنصة
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="إجمالي الأعضاء"
            value={stats.totalUsers || 0}
            icon={FaUsers}
            themeClass="theme-red"
          />
          <StatCard
            title="إجمالي الزيارات"
            value={stats.totalVisits || 0}
            icon={FaEye}
            themeClass="theme-blue"
          />
          <StatCard
            title="نشطين الآن"
            value={stats.activeUsers || 0}
            icon={FaUserCheck}
            themeClass="theme-green"
            isPulse={true}
          />
          <StatCard
            title="اشتراكات منتهية"
            value={stats.expiredUsers || 0}
            icon={FaUserTimes}
            themeClass="theme-orange"
          />
          <StatCard
            title="غياب تام"
            value={stats.neverVisitedCount || 0}
            icon={FaUserSlash}
            themeClass="theme-slate"
          />
          <StatCard
            title="معدل الزيارات"
            value={stats.avgVisitsPerUser || 0}
            icon={FaChartBar}
            themeClass="theme-purple"
          />

          {/* Featured Card */}
          <div className="featured-card col-span-1 md:col-span-2 group">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-400 p-2.5 rounded-xl text-slate-900 shadow-lg shadow-amber-400/20">
                  <FaStar size={20} />
                </div>
                <h3 className="text-slate-300 text-sm font-bold tracking-widest uppercase">
                  العضو الأكثر نشاطاً
                </h3>
              </div>
              
              <div className="space-y-2">
                <p className="text-4xl font-black text-white leading-tight group-hover:translate-x-[-10px] transition-transform duration-500">
                  {stats.maxVisitsUser?.name || "-"}
                </p>
                <div className="flex items-end gap-6 mt-6">
                  <div className="flex flex-col">
                    <span className="text-6xl font-black text-white">{stats.maxVisitsUser?.visits || 0}</span>
                    <span className="text-slate-400 font-bold mt-1">زيارة إجمالية</span>
                  </div>
                  <div className="bg-white/10 p-5 rounded-2xl backdrop-blur-xl border border-white/10 shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 mb-2">
                    <FaUserCheck className="text-white text-4xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Package Distribution Bar Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h2 className="chart-title">توزيع الأعضاء على الباقات</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">تصنيف المشتركين حسب نوع الباقة</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <FaUsers size={20} />
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.packageStats || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="packageName" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
                    dy={15} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }} 
                  />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="custom-tooltip">
                            <p className="tooltip-label">{label}</p>
                            <p className="tooltip-value">{`${payload[0].value} عضو`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="rgb(255, 3, 54)" 
                    radius={[8, 8, 0, 0]} 
                    barSize={45} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Pie Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h2 className="chart-title">تحليل العوائد المالية</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">نسبة المساهمة المالية لكل باقة</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <FaChartBar size={20} />
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.packageStats || []}
                    dataKey="totalPrice"
                    nameKey="packageName"
                    cx="50%" cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={8}
                  >
                    {(stats.packageStats || []).map((_, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="custom-tooltip">
                            <p className="tooltip-label">{payload[0].name}</p>
                            <p className="tooltip-value">{`${payload[0].value.toLocaleString()} جنيه`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle" 
                    formatter={(value) => <span className="text-slate-600 font-bold text-sm">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hourly Attendance Bar Chart */}
        <div className="chart-container mb-8">
          <div className="chart-header">
            <div>
              <h2 className="chart-title">توزيع الحضور حسب الساعة</h2>
              <p className="text-sm text-slate-500 font-medium mt-1">تحديد ساعات الذروة لتنظيم التدريب</p>
            </div>
            <div className="w-14 h-14 bg-red/10 text-red rounded-2xl flex items-center justify-center shadow-sm">
              <FaClock size={24} />
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.attendanceStats || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="hour" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 13, fontWeight: 700 }} 
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="custom-tooltip">
                          <p className="tooltip-label">{`الساعة ${label}`}</p>
                          <p className="tooltip-value">{`${payload[0].value} حاضر`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="attendees" radius={[10, 10, 0, 0]} barSize={50}>
                  {(stats.attendanceStats || []).map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={ATTENDANCE_COLORS[index % ATTENDANCE_COLORS.length]} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Weekly Visits Area Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h2 className="chart-title">نشاط الزيارات الأسبوعي</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">توزيع الزيارات على مدار أيام الأسبوع</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                <FaCalendarDay size={20} />
              </div>
            </div>
            <div className="h-[320px] w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weeklyStats && stats.weeklyStats.length > 0 ? stats.weeklyStats : [{day: 'لا يوجد', visits: 0}]}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} domain={[0, 'auto']} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="custom-tooltip">
                            <p className="tooltip-label">{label}</p>
                            <p className="tooltip-value">{`${payload[0].value} زيارة`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="visits" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth Line Chart */}
          <div className="chart-container">
            <div className="chart-header">
              <div>
                <h2 className="chart-title">نمو قاعدة المشتركين</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">معدل تسجيل الأعضاء الجدد شهرياً</p>
              </div>
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
                <FaChartLine size={20} />
              </div>
            </div>
            <div className="h-[320px] w-full min-h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.growthStats && stats.growthStats.length > 0 ? stats.growthStats : [{month: 'لا يوجد', users: 0}]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} domain={[0, 'auto']} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="custom-tooltip">
                            <p className="tooltip-label">{label}</p>
                            <p className="tooltip-value">{`${payload[0].value} عضو جديد`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line type="stepAfter" dataKey="users" stroke="rgb(255, 3, 54)" strokeWidth={4} dot={{ r: 6, fill: 'rgb(255, 3, 54)', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, isPulse = false, themeClass }) => (
  <div className={`kpi-card ${themeClass}`}>
    <div className="flex flex-col">
      <h3 className="kpi-title">{title}</h3>
      <div className="flex items-center gap-3">
        {isPulse && <span className="pulse-indicator"></span>}
        <p className="kpi-value">{value}</p>
      </div>
    </div>
    <div className="stat-icon">
      <Icon />
    </div>
  </div>
);

export default Charts;
