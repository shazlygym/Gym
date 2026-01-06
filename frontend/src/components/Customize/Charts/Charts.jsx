import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";
import { FaArrowLeft } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

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

  if (loading) return <p className="text-center p-10">جاري التحميل...</p>;
  if (!stats) return <p className="text-center p-10">لا توجد بيانات.</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">📊 إحصائيات النظام</h1>
        <button onClick={() => navigate(-1)} className="bg-white border px-4 py-2 rounded shadow-sm hover:bg-gray-50 flex items-center gap-2">
          <FaArrowLeft /> رجوع
        </button>
      </div>

      {/* الكروت الأساسية (التي كانت موجودة سابقاً) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="إجمالي المستخدمين" value={stats.totalUsers} />
        <StatCard title="إجمالي الزيارات" value={stats.totalVisits} />
        <StatCard title="نشطين الآن" value={stats.activeUsers} color="text-green-600" />
        <StatCard title="اشتراكات منتهية" value={stats.expiredUsers} color="text-red-600" />
        <StatCard title="لم يزوروا أبداً" value={stats.neverVisitedCount} />
        <StatCard title="معدل الزيارة/فرد" value={stats.avgVisitsPerUser} />
        <div className="bg-white p-4 rounded shadow-sm border-t-4 border-blue-500 col-span-1 md:col-span-2">
          <h3 className="text-sm text-gray-500">أكثر زائر تفاعلاً</h3>
          <p className="text-lg font-bold">{stats.maxVisitsUser?.name} ({stats.maxVisitsUser?.visits} زيارة)</p>
        </div>
      </div>

      {/* الرسوم البيانية للباقات */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* مخطط عدد المشتركين */}
        <div className="bg-white p-5 rounded shadow-sm">
          <h2 className="text-lg font-bold mb-4">عدد المشتركين لكل باقة</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.packageStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="packageName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" name="عدد المشتركين" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* مخطط الدخل المالي */}
        <div className="bg-white p-5 rounded shadow-sm">
          <h2 className="text-lg font-bold mb-4">توزيع الدخل المالي ($)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.packageStats}
                dataKey="totalPrice"
                nameKey="packageName"
                cx="50%" cy="50%" outerRadius={80}
              >
                {stats.packageStats.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} جنيه`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* مخطط الحضور (الساعات) */}
      <div className="bg-white p-5 rounded shadow-sm">
        <h2 className="text-lg font-bold mb-4">توزيع الحضور حسب الساعة</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.attendanceStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendees" fill="#f87171" name="حضور" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color = "text-gray-800" }) => (
  <div className="bg-white p-4 rounded shadow-sm border">
    <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

export default Charts;