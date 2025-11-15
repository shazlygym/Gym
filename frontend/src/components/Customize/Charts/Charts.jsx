import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import { FaArrowLeft } from "react-icons/fa";

const apiUrl = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

const Charts = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);



  const navigate = useNavigate()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${apiUrl}/dashboardStats`);
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p>جاري تحميل...</p>;
  if (!stats) return <p>لا توجد بيانات.</p>;

  const {
    totalUsers,
    totalVisits,
    neverVisitedCount,
    maxVisitsUser,
    avgVisitsPerUser,
    attendanceStats,
    expiredUsers,
    activeUsers,
  } = stats;

  const minAttendance = Math.min(...attendanceStats.map(d => d.attendees));
  const maxAttendance = Math.max(...attendanceStats.map(d => d.attendees));
  const minTime = attendanceStats.find(d => d.attendees === minAttendance)?.hour;
  const maxTime = attendanceStats.find(d => d.attendees === maxAttendance)?.hour;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold mb-6">📊 الاحصائيات</h1>
      <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 bg-white hover:bg-red-50 text-red px-4 py-2 rounded-lg shadow-md transition"
    >
      <FaArrowLeft className="text-red text-lg" />
      <span className="font-semibold">رجوع</span>
    </button>
      </div>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3>إجمالي المستخدمين</h3>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3>إجمالي الزيارات</h3>
          <p className="text-2xl font-bold">{totalVisits}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3>لم يزوروا أبداً</h3>
          <p className="text-2xl font-bold">{neverVisitedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3>معدل الزيارات لكل مستخدم</h3>
          <p className="text-2xl font-bold">{avgVisitsPerUser}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3>أكثر زائر واحد</h3>
          <p className="text-xl">{maxVisitsUser?.name || "-"}</p>
          <p>({maxVisitsUser?.visits || 0} زيارة)</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3>المستخدمون النشطون</h3>
          <p className="text-2xl font-bold">{activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3>الاشتراكات المنتهية</h3>
          <p className="text-2xl font-bold">{expiredUsers}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl mb-4">📈 عدد الحضور حسب الساعة</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={attendanceStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="attendees" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-gray-700">
          أقل حضور: {minAttendance} في الساعة {minTime} <br />
          أكثر حضور: {maxAttendance} في الساعة {maxTime}
        </div>
      </div>
    </div>
  );
};

export default Charts;
